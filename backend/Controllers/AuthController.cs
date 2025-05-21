using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Cryptography;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            // Verificar si el usuario ya existe
            if (await _context.Usuarios.AnyAsync(u => u.Nombre_Usuario == request.Nombre_Usuario))
            {
                return BadRequest("El nombre de usuario ya está en uso.");
            }

            if (!string.IsNullOrEmpty(request.Correo) && await _context.Usuarios.AnyAsync(u => u.Correo == request.Correo))
            {
                return BadRequest("El correo electrónico ya está registrado.");
            }

            // Buscar el rol correspondiente
            var rol = await _context.Roles.FirstOrDefaultAsync(r => r.Nombre_Rol == request.Rol);
            if (rol == null)
            {
                return BadRequest("El rol especificado no es válido.");
            }

            // Crear el hash de la contraseña
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
            string passwordHashString = Convert.ToBase64String(passwordHash);

            // Crear el nuevo usuario
            var usuario = new Usuario
            {
                Nombre_Usuario = request.Nombre_Usuario,
                ContrasenaHash = passwordHashString,
                ID_Rol = rol.ID_Rol,
                Nombre = request.Nombre,
                Apellido_Paterno = request.Apellido_Paterno,
                Apellido_Materno = request.Apellido_Materno,
                Correo = request.Correo,
                Telefono = request.Telefono,
                Fecha_Creacion = DateTime.Now
            };

            // Buscar el estatus "Activo" para el usuario
            var estatusActivo = await _context.EstatusUsuarios
                .FirstOrDefaultAsync(e => e.Nombre_Estatus == "Activo");
            if (estatusActivo != null)
            {
                usuario.ID_Estatus = estatusActivo.ID_Estatus;
            }

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            // Generar el token JWT
            string token = GenerateJwtToken(usuario);

            // Retornar la respuesta
            return new AuthResponse
            {
                Token = token,
                Nombre_Usuario = usuario.Nombre_Usuario,
                Nombre = usuario.Nombre,
                Apellido_Paterno = usuario.Apellido_Paterno,
                Apellido_Materno = usuario.Apellido_Materno,
                Correo = usuario.Correo,
                Rol = request.Rol
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.Nombre_Usuario == request.Nombre_Usuario);

            if (usuario == null)
            {
                return Unauthorized("Usuario o contraseña incorrectos.");
            }

            // Verificar la contraseña
            if (!VerifyPasswordHash(request.Password, Convert.FromBase64String(usuario.ContrasenaHash)))
            {
                return Unauthorized("Usuario o contraseña incorrectos.");
            }

            string token = GenerateJwtToken(usuario);

            return new AuthResponse
            {
                Token = token,
                Nombre_Usuario = usuario.Nombre_Usuario,
                Nombre = usuario.Nombre,
                Apellido_Paterno = usuario.Apellido_Paterno,
                Apellido_Materno = usuario.Apellido_Materno,
                Correo = usuario.Correo,
                Rol = usuario.Rol?.Nombre_Rol ?? "Usuario"
            };
        }

        private string GenerateJwtToken(Usuario user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Nombre_Usuario),
                new Claim(ClaimTypes.Role, user.Rol?.Nombre_Rol ?? "Usuario"),
                new Claim("ID_Usuario", user.ID_Usuario.ToString())
            };

            if (!string.IsNullOrEmpty(user.Correo))
            {
                claims.Add(new Claim(ClaimTypes.Email, user.Correo));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash)
        {
            using (var hmac = new HMACSHA512())
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(storedHash);
            }
        }
    }
}