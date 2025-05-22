using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]  // Require authentication for all endpoints in this controller
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsuariosController(ApplicationDbContext context)
        {
            _context = context;
        }        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> GetUsuarios()
        {
            try
            {                var usuarios = await _context.Usuarios
                    .Select(u => new UsuarioDTO
                    {
                        ID_Usuario = u.ID_Usuario,
                        Nombre_Usuario = u.Nombre_Usuario,
                        ID_Rol = u.ID_Rol,
                        Nombre = u.Nombre,
                        Apellido_Paterno = u.Apellido_Paterno,
                        Apellido_Materno = u.Apellido_Materno,
                        Correo = u.Correo,
                        Telefono = u.Telefono,
                        ID_Estatus = u.ID_Estatus
                    })
                    .ToListAsync();

                // Cargar datos relacionados de forma segura
                foreach (var usuario in usuarios)
                {
                    var rol = await _context.Roles.FindAsync(usuario.ID_Rol);
                    usuario.nombreRol = rol?.Nombre_Rol;
                    
                    if (usuario.ID_Estatus.HasValue)
                    {
                        var estatus = await _context.EstatusUsuarios.FindAsync(usuario.ID_Estatus.Value);
                        usuario.nombreEstatus = estatus?.Nombre_Estatus;
                    }
                }

                return usuarios;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error al obtener usuarios", details = ex.Message });
            }
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioDTO>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .Include(u => u.Estatus)
                .FirstOrDefaultAsync(u => u.ID_Usuario == id);

            if (usuario == null)
            {
                return NotFound();
            }            var usuarioDTO = new UsuarioDTO
            {
                ID_Usuario = usuario.ID_Usuario,
                Nombre_Usuario = usuario.Nombre_Usuario,
                ID_Rol = usuario.ID_Rol,
                Nombre = usuario.Nombre,
                Apellido_Paterno = usuario.Apellido_Paterno,
                Apellido_Materno = usuario.Apellido_Materno,
                Correo = usuario.Correo,
                Telefono = usuario.Telefono,
                ID_Estatus = usuario.ID_Estatus,
                nombreRol = usuario.Rol?.Nombre_Rol,
                nombreEstatus = usuario.Estatus?.Nombre_Estatus
            };

            return usuarioDTO;
        }        // POST: api/Usuarios
        [HttpPost]
        public async Task<ActionResult<UsuarioDTO>> CreateUsuario(UsuarioCrearDTO usuarioDTO)
        {
            // Check if username already exists
            if (await _context.Usuarios.AnyAsync(u => u.Nombre_Usuario == usuarioDTO.Nombre_Usuario))
            {
                return BadRequest(new { message = "Este nombre de usuario ya está en uso" });
            }

            // Check if email already exists (if provided)
            if (!string.IsNullOrEmpty(usuarioDTO.Correo) && 
                await _context.Usuarios.AnyAsync(u => u.Correo == usuarioDTO.Correo))
            {
                return BadRequest(new { message = "Este correo electrónico ya está registrado" });
            }

            var usuario = new Usuario
            {
                Nombre_Usuario = usuarioDTO.Nombre_Usuario,
                ContrasenaHash = usuarioDTO.ContrasenaHash, // Considerar cifrar antes de guardar
                ID_Rol = usuarioDTO.ID_Rol,
                Nombre = usuarioDTO.Nombre,
                Apellido_Paterno = usuarioDTO.Apellido_Paterno,
                Apellido_Materno = usuarioDTO.Apellido_Materno,
                Correo = usuarioDTO.Correo,
                Telefono = usuarioDTO.Telefono,
                ID_Estatus = usuarioDTO.ID_Estatus ?? 1, // Estado activo por defecto
                Fecha_Creacion = DateTime.Now
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUsuario", new { id = usuario.ID_Usuario }, new UsuarioDTO
            {
                ID_Usuario = usuario.ID_Usuario,
                Nombre_Usuario = usuario.Nombre_Usuario,
                ID_Rol = usuario.ID_Rol,
                Nombre = usuario.Nombre,
                Apellido_Paterno = usuario.Apellido_Paterno,
                Apellido_Materno = usuario.Apellido_Materno,
                Correo = usuario.Correo,
                Telefono = usuario.Telefono,
                ID_Estatus = usuario.ID_Estatus
            });
        }

        // PUT: api/Usuarios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUsuario(int id, UsuarioActualizarDTO usuarioDTO)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            // Actualizar solo los campos que no son nulos
            if (usuarioDTO.Nombre_Usuario != null)
                usuario.Nombre_Usuario = usuarioDTO.Nombre_Usuario;
            
            if (usuarioDTO.ContrasenaHash != null)
                usuario.ContrasenaHash = usuarioDTO.ContrasenaHash;
            
            if (usuarioDTO.ID_Rol.HasValue)
                usuario.ID_Rol = usuarioDTO.ID_Rol.Value;
            
            if (usuarioDTO.Nombre != null)
                usuario.Nombre = usuarioDTO.Nombre;
            
            if (usuarioDTO.Apellido_Paterno != null)
                usuario.Apellido_Paterno = usuarioDTO.Apellido_Paterno;
            
            if (usuarioDTO.Apellido_Materno != null)
                usuario.Apellido_Materno = usuarioDTO.Apellido_Materno;
            
            if (usuarioDTO.Correo != null)
                usuario.Correo = usuarioDTO.Correo;
            
            if (usuarioDTO.Telefono != null)
                usuario.Telefono = usuarioDTO.Telefono;
            
            if (usuarioDTO.ID_Estatus.HasValue)
                usuario.ID_Estatus = usuarioDTO.ID_Estatus;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.ID_Usuario == id);
        }

        // POST: api/Usuarios/Login
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login(LoginDTO loginDTO)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.Nombre_Usuario == loginDTO.Nombre_Usuario);

            if (usuario == null || usuario.ContrasenaHash != loginDTO.Contrasena) // Implementar verificación segura de contraseñas
            {
                return Unauthorized(new { message = "Nombre de usuario o contraseña incorrectos" });
            }

            // Aquí se implementaría la generación del token JWT
            var token = "token_simulado"; // Implementar generación real de JWT

            return new AuthResponseDTO
            {
                ID_Usuario = usuario.ID_Usuario,
                Nombre_Usuario = usuario.Nombre_Usuario,
                Nombre = usuario.Nombre,
                Apellido_Paterno = usuario.Apellido_Paterno,
                Token = token,
                Rol = usuario.Rol?.Nombre_Rol ?? "Usuario"
            };
        }
    }
}
