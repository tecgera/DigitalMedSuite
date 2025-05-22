using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly AuthenticationService _authService;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _authService = new AuthenticationService(configuration);
        }        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login(LoginRequestDTO loginRequest)
        {
            try
            {
                // Validate request
                if (string.IsNullOrEmpty(loginRequest.Nombre_Usuario) || string.IsNullOrEmpty(loginRequest.Password))
                {
                    return BadRequest(new { message = "Nombre de usuario y contraseña son requeridos" });
                }

                Console.WriteLine($"Intento de login para: {loginRequest.Nombre_Usuario}");

                // Find user by username
                var usuario = await _context.Usuarios
                    .Include(u => u.Rol)
                    .Include(u => u.Estatus)
                    .FirstOrDefaultAsync(u => u.Nombre_Usuario == loginRequest.Nombre_Usuario);

                // Check if user exists
                if (usuario == null)
                {
                    Console.WriteLine($"Usuario no encontrado: {loginRequest.Nombre_Usuario}");
                    return NotFound(new { message = "Usuario no encontrado" });
                }

                Console.WriteLine($"Usuario encontrado: {usuario.Nombre_Usuario}, ID: {usuario.ID_Usuario}");

                // Check if user is active
                if (usuario.ID_Estatus != 1) // Assuming 1 = Active
                {
                    Console.WriteLine($"Usuario no activo: {usuario.Nombre_Usuario}");
                    return BadRequest(new { message = "Usuario no está activo" });
                }

                // Verify password (in a real app, you should use proper password hashing)
                // For now, we'll use direct comparison since the password is stored as clear text in your model
                if (usuario.ContrasenaHash != loginRequest.Password)
                {
                    Console.WriteLine($"Contraseña incorrecta para: {usuario.Nombre_Usuario}");
                    return Unauthorized(new { message = "Contraseña incorrecta" });
                }

                // Generate JWT token
                var token = GenerateJwtToken(usuario);
                
                if (string.IsNullOrEmpty(token))
                {
                    Console.WriteLine($"Error al generar el token para: {usuario.Nombre_Usuario}");
                    return StatusCode(500, new { message = "Error al generar el token de autenticación" });
                }

                // Create response object
                var response = new LoginResponseDTO
                {
                    ID_Usuario = usuario.ID_Usuario,
                    Nombre_Usuario = usuario.Nombre_Usuario,
                    Nombre = usuario.Nombre,
                    Apellido_Paterno = usuario.Apellido_Paterno,
                    Apellido_Materno = usuario.Apellido_Materno,
                    Correo = usuario.Correo,
                    ID_Rol = usuario.ID_Rol,
                    Rol = usuario.Rol?.Nombre_Rol,
                    Token = token
                };

                Console.WriteLine($"Login exitoso para: {usuario.Nombre_Usuario}");
                Console.WriteLine($"Token generado: {token}");
                
                // Return OK with response
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en el login: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
        
        [HttpPost("register")]
        public async Task<ActionResult<LoginResponseDTO>> Register(RegisterRequestDTO registerRequest)
        {
            // Validate request
            if (string.IsNullOrEmpty(registerRequest.Nombre_Usuario) || string.IsNullOrEmpty(registerRequest.Password))
            {
                return BadRequest(new { message = "Nombre de usuario y contraseña son requeridos" });
            }

            // Check if username already exists
            if (await _context.Usuarios.AnyAsync(u => u.Nombre_Usuario == registerRequest.Nombre_Usuario))
            {
                return BadRequest(new { message = "Este nombre de usuario ya está en uso" });
            }

            // Check if email already exists (if provided)
            if (!string.IsNullOrEmpty(registerRequest.Correo) && 
                await _context.Usuarios.AnyAsync(u => u.Correo == registerRequest.Correo))
            {
                return BadRequest(new { message = "Este correo electrónico ya está registrado" });
            }

            // Create new user
            var newUser = new Usuario
            {
                Nombre_Usuario = registerRequest.Nombre_Usuario,
                ContrasenaHash = registerRequest.Password, // In production, you should hash this password
                ID_Rol = registerRequest.ID_Rol,
                Nombre = registerRequest.Nombre,
                Apellido_Paterno = registerRequest.Apellido_Paterno,
                Apellido_Materno = registerRequest.Apellido_Materno,
                Correo = registerRequest.Correo,
                Telefono = registerRequest.Telefono,
                ID_Estatus = 1, // Active status
                Fecha_Creacion = DateTime.Now
            };

            _context.Usuarios.Add(newUser);
            await _context.SaveChangesAsync();

            // Add the Rol navigation property
            await _context.Entry(newUser).Reference(u => u.Rol).LoadAsync();

            // Generate JWT token
            var token = GenerateJwtToken(newUser);

            // Create response
            return Ok(new LoginResponseDTO
            {
                ID_Usuario = newUser.ID_Usuario,
                Nombre_Usuario = newUser.Nombre_Usuario,
                Nombre = newUser.Nombre,
                Apellido_Paterno = newUser.Apellido_Paterno,
                Apellido_Materno = newUser.Apellido_Materno,
                Correo = newUser.Correo,
                ID_Rol = newUser.ID_Rol,
                Rol = newUser.Rol?.Nombre_Rol,
                Token = token
            });
        }        private string GenerateJwtToken(Usuario user)
        {
            var token = _authService.GenerateJwtToken(user);
            Console.WriteLine($"Token generado para {user.Nombre_Usuario}: {token}");
            return token;
        }
    }
}
