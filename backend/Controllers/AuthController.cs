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

        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class AuthResponse
        {
            public string Token { get; set; } = string.Empty;
            public string Username { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Rol { get; set; } = string.Empty;
        }

        public class RegisterRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public string Rol { get; set; } = string.Empty;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Verificar si el correo ya está registrado
                if (await _context.Usuarios.AnyAsync(u => u.Email == request.Email))
                    return BadRequest(new { message = "El correo electrónico ya está registrado" });

                // Verificar si el nombre de usuario ya está en uso
                if (await _context.Usuarios.AnyAsync(u => u.Username == request.Username))
                    return BadRequest(new { message = "El nombre de usuario ya está en uso" });

                // Crear hash de la contraseña
                string passwordHash = HashPassword(request.Password);

                // Crear nuevo usuario
                var usuario = new Usuario
                {
                    Username = request.Username,
                    Email = request.Email,
                    PasswordHash = passwordHash,
                    Rol = request.Rol,
                    FechaCreacion = DateTime.Now
                };

                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                // Generar token JWT
                var token = GenerateJwtToken(usuario);

                return Ok(new AuthResponse
                {
                    Token = token,
                    Username = usuario.Username,
                    Email = usuario.Email,
                    Rol = usuario.Rol
                });
            }
            catch (Exception ex)
            {
                // Registrar la excepción (idealmente usarías un logger)
                Console.WriteLine($"Error en registro: {ex.Message}");
                
                // Devolver un error amigable en formato JSON
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Buscar usuario por email
                var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (usuario == null)
                    return Unauthorized(new { message = "Credenciales inválidas" });

                Console.WriteLine($"Usuario encontrado: {usuario.Email}, Hash: {usuario.PasswordHash?.Substring(0, Math.Min(20, usuario.PasswordHash?.Length ?? 0))}...");
                
                // Verificar contraseña
                bool isPasswordValid = false;
                
                try
                {
                    // Verificar si la contraseña está hasheada
                    if (usuario.PasswordHash?.Length > 20 && usuario.PasswordHash.Contains("+") || usuario.PasswordHash.Contains("/"))
                    {
                        // Parece un hash en Base64, usar el método normal
                        isPasswordValid = VerifyHashedPassword(request.Password, usuario.PasswordHash);
                    }
                    else
                    {
                        // Comparar directamente (para contraseñas no hasheadas o migradas)
                        isPasswordValid = request.Password == usuario.PasswordHash;
                        
                        // Si la contraseña coincide pero no está hasheada, actualizarla
                        if (isPasswordValid)
                        {
                            usuario.PasswordHash = HashPassword(request.Password);
                            await _context.SaveChangesAsync();
                            Console.WriteLine("Contraseña actualizada con hash seguro");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error verificando contraseña: {ex.Message}");
                    
                    // Como fallback, intentar comparación directa
                    isPasswordValid = request.Password == usuario.PasswordHash;
                }

                if (!isPasswordValid)
                {
                    Console.WriteLine("Contraseña inválida");
                    return Unauthorized(new { message = "Credenciales inválidas" });
                }

                // Actualizar último acceso
                usuario.UltimoAcceso = DateTime.Now;
                await _context.SaveChangesAsync();

                // Generar token JWT
                var jwtToken = GenerateJwtToken(usuario);

                Console.WriteLine($"Login exitoso para {usuario.Email}, rol: {usuario.Rol}");

                return Ok(new AuthResponse
                {
                    Token = jwtToken,
                    Username = usuario.Username,
                    Email = usuario.Email,
                    Rol = usuario.Rol
                });
            }
            catch (Exception ex)
            {
                // Registrar la excepción (idealmente usarías un logger)
                Console.WriteLine($"Error en login: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                
                // Devolver un error amigable en formato JSON
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        private string GenerateJwtToken(Usuario usuario)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "DefaultSecretKeyWith32Characters!!");
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                    new Claim(ClaimTypes.Name, usuario.Username),
                    new Claim(ClaimTypes.Email, usuario.Email),
                    new Claim(ClaimTypes.Role, usuario.Rol)
                }),
                Expires = DateTime.UtcNow.AddDays(7), // Token válido por 7 días
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string HashPassword(string password)
        {
            // Generar un salt aleatorio
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // Derivar una clave de 256 bits a partir de la contraseña
            byte[] hash = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256).GetBytes(32);

            // Combinar el salt y el hash
            byte[] hashWithSalt = new byte[48];
            Array.Copy(salt, 0, hashWithSalt, 0, 16);
            Array.Copy(hash, 0, hashWithSalt, 16, 32);

            // Convertir a base64 para almacenamiento
            return Convert.ToBase64String(hashWithSalt);
        }

        private bool VerifyHashedPassword(string password, string storedHash)
        {
            try
            {
                // Convertir el hash almacenado de base64 a bytes
                byte[] hashWithSalt = Convert.FromBase64String(storedHash);

                // Verificar que el hash sea del tamaño esperado
                if (hashWithSalt.Length < 32)
                {
                    Console.WriteLine("El hash decodificado es más corto de lo esperado");
                    return false;
                }

                // Extraer el salt (primeros 16 bytes)
                byte[] salt = new byte[16];
                Array.Copy(hashWithSalt, 0, salt, 0, 16);

                // Calcular el hash de la contraseña proporcionada
                byte[] hash = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256).GetBytes(32);

                // Comparar los hashes
                for (int i = 0; i < 32; i++)
                {
                    if (hashWithSalt[i + 16] != hash[i])
                        return false;
                }
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al verificar hash de contraseña: {ex.Message}");
                return false;
            }
        }

        // Endpoint para diagnosticar problemas de login
        [HttpGet("diagnose/{email}")]
        public async Task<IActionResult> DiagnoseLogin(string email)
        {
            try
            {
                // Solo permitir en entorno de desarrollo
                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
                {
                    return StatusCode(403, new { message = "Esta función solo está disponible en entorno de desarrollo" });
                }

                // Buscar usuario por email
                var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
                
                if (usuario == null)
                {
                    return NotFound(new { 
                        message = "Usuario no encontrado", 
                        email = email,
                        suggestion = "Verifica que el correo electrónico sea correcto o registra un nuevo usuario"
                    });
                }

                // Devolver información diagnóstica sobre el usuario (SOLO en desarrollo)
                return Ok(new { 
                    message = "Usuario encontrado",
                    userId = usuario.Id,
                    username = usuario.Username,
                    email = usuario.Email,
                    rol = usuario.Rol,
                    hasPassword = !string.IsNullOrEmpty(usuario.PasswordHash),
                    passwordHashLength = usuario.PasswordHash?.Length ?? 0,
                    passwordHashPreview = usuario.PasswordHash?.Substring(0, Math.Min(20, usuario.PasswordHash?.Length ?? 0)) + "..."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al diagnosticar usuario", error = ex.Message });
            }
        }

        // Endpoint para restablecer contraseña de un usuario específico
        [HttpPost("reset-password/{email}")]
        public async Task<IActionResult> ResetPassword(string email, [FromBody] ResetPasswordModel model)
        {
            try
            {
                // Solo permitir en entorno de desarrollo
                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
                {
                    return StatusCode(403, new { message = "Esta función solo está disponible en entorno de desarrollo" });
                }

                if (string.IsNullOrEmpty(model.NewPassword))
                {
                    return BadRequest(new { message = "La nueva contraseña no puede estar vacía" });
                }

                // Buscar usuario por email
                var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
                
                if (usuario == null)
                {
                    return NotFound(new { message = "Usuario no encontrado" });
                }

                // Actualizar contraseña con hash
                usuario.PasswordHash = HashPassword(model.NewPassword);
                await _context.SaveChangesAsync();
                
                return Ok(new { 
                    message = "Contraseña restablecida correctamente",
                    email = email,
                    newPasswordPreview = model.NewPassword
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al restablecer contraseña", error = ex.Message });
            }
        }

        // Endpoint para listar todos los usuarios (solo en desarrollo)
        [HttpGet("list-users")]
        public async Task<IActionResult> ListUsers()
        {
            try
            {
                // Solo permitir en entorno de desarrollo
                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
                {
                    return StatusCode(403, new { message = "Esta función solo está disponible en entorno de desarrollo" });
                }

                // Obtener todos los usuarios
                var usuarios = await _context.Usuarios.Select(u => new 
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Rol = u.Rol,
                    FechaCreacion = u.FechaCreacion,
                    UltimoAcceso = u.UltimoAcceso
                }).ToListAsync();

                return Ok(new
                {
                    message = "Usuarios obtenidos correctamente",
                    count = usuarios.Count,
                    usuarios = usuarios
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener usuarios", error = ex.Message });
            }
        }

        // Endpoint para crear un usuario administrador predeterminado
        [HttpGet("setup-default-users")]
        public async Task<IActionResult> SetupDefaultUsers()
        {
            try
            {
                // Solo permitir en entorno de desarrollo
                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
                {
                    return StatusCode(403, new { message = "Esta función solo está disponible en entorno de desarrollo" });
                }

                var usersCreated = new List<object>();

                // Verificar si ya existe un usuario administrador
                var adminExists = await _context.Usuarios.AnyAsync(u => u.Rol == "Admin");
                if (!adminExists)
                {
                    // Crear usuario administrador
                    var adminUser = new Usuario
                    {
                        Username = "administrador",
                        Email = "admin@digitalmadsuite.com",
                        PasswordHash = HashPassword("admin123"),
                        Rol = "Admin",
                        FechaCreacion = DateTime.Now
                    };

                    _context.Usuarios.Add(adminUser);
                    usersCreated.Add(new { role = "Admin", email = adminUser.Email, password = "admin123" });
                }

                // Verificar si ya existe un usuario médico
                var medicoExists = await _context.Usuarios.AnyAsync(u => u.Rol == "Medico");
                if (!medicoExists)
                {
                    // Crear usuario médico
                    var medicoUser = new Usuario
                    {
                        Username = "doctortest",
                        Email = "medico@digitalmadsuite.com",
                        PasswordHash = HashPassword("medico123"),
                        Rol = "Medico",
                        FechaCreacion = DateTime.Now
                    };

                    _context.Usuarios.Add(medicoUser);
                    usersCreated.Add(new { role = "Medico", email = medicoUser.Email, password = "medico123" });
                }

                // Verificar si ya existe un usuario paciente
                var pacienteExists = await _context.Usuarios.AnyAsync(u => u.Rol == "Paciente");
                if (!pacienteExists)
                {
                    // Crear usuario paciente
                    var pacienteUser = new Usuario
                    {
                        Username = "pacientetest",
                        Email = "paciente@digitalmadsuite.com",
                        PasswordHash = HashPassword("paciente123"),
                        Rol = "Paciente",
                        FechaCreacion = DateTime.Now
                    };

                    _context.Usuarios.Add(pacienteUser);
                    usersCreated.Add(new { role = "Paciente", email = pacienteUser.Email, password = "paciente123" });
                }

                // Verificar si existe el usuario "gerardo@admin.com" y actualizarlo si es necesario
                var gerardoUser = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == "gerardo@admin.com");
                if (gerardoUser != null)
                {
                    // Actualizar contraseña y rol
                    gerardoUser.PasswordHash = HashPassword("admin");
                    gerardoUser.Rol = "Admin"; // Asegurarse de que tenga rol de administrador
                    usersCreated.Add(new { role = "Admin", email = gerardoUser.Email, password = "admin", status = "updated" });
                }
                else
                {
                    // Crear el usuario gerardo@admin.com
                    var newGerardoUser = new Usuario
                    {
                        Username = "gerardo",
                        Email = "gerardo@admin.com",
                        PasswordHash = HashPassword("admin"),
                        Rol = "Admin",
                        FechaCreacion = DateTime.Now
                    };

                    _context.Usuarios.Add(newGerardoUser);
                    usersCreated.Add(new { role = "Admin", email = newGerardoUser.Email, password = "admin", status = "created" });
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Usuarios predeterminados configurados correctamente",
                    usersCreated = usersCreated
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al configurar usuarios predeterminados", error = ex.Message });
            }
        }

        // Endpoint para solicitar recuperación de contraseña
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Buscar usuario por nombre de usuario y email
                var usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Username == request.Username && u.Email == request.Email);

                if (usuario == null)
                {
                    // Por seguridad, no indicamos si el usuario existe o no
                    return Ok(new { message = "Si los datos son correctos, se enviará un correo con instrucciones para recuperar tu contraseña." });
                }

                // Limpiar tokens antiguos no utilizados para el usuario
                var oldTokens = await _context.PasswordRecoveryTokens
                    .Where(t => t.UsuarioId == usuario.Id && !t.Used)
                    .ToListAsync();

                _context.PasswordRecoveryTokens.RemoveRange(oldTokens);

                // Generar nuevo token
                var tokenGuid = Guid.NewGuid();
                var expiracionHoras = _configuration.GetValue<int>("AppSettings:RecoveryTokenExpirationHours");
                if (expiracionHoras <= 0) expiracionHoras = 24; // Valor predeterminado: 24 horas

                var recoveryToken = new PasswordRecoveryToken
                {
                    Token = tokenGuid,
                    UsuarioId = usuario.Id,
                    ExpirationDate = DateTime.UtcNow.AddHours(expiracionHoras),
                    Used = false
                };

                _context.PasswordRecoveryTokens.Add(recoveryToken);
                await _context.SaveChangesAsync();

                // Obtener URL del frontend
                var frontendUrl = _configuration["AppSettings:FrontendUrl"];
                var resetUrl = $"{frontendUrl}/resetPassword.html";

                // Enviar correo con el token
                var emailService = HttpContext.RequestServices.GetRequiredService<backend.Services.IEmailService>();
                var emailResult = await emailService.SendPasswordResetEmailAsync(
                    usuario.Email,
                    usuario.Username,
                    tokenGuid.ToString(),
                    resetUrl
                );

                if (!emailResult)
                {
                    // Si hay error al enviar el correo, registrar y devolver mensaje de error
                    Console.WriteLine($"Error al enviar correo de recuperación a {usuario.Email}");
                    return StatusCode(500, new { message = "Error al enviar el correo de recuperación. Por favor, inténtalo más tarde." });
                }

                return Ok(new { message = "Se ha enviado un correo con instrucciones para recuperar tu contraseña." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en recuperación de contraseña: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        // Endpoint para restablecer contraseña con token
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Validar formato del token
                if (!Guid.TryParse(request.Token, out Guid tokenGuid))
                {
                    return BadRequest(new { message = "El formato del token no es válido." });
                }

                // Buscar el token en la base de datos
                var tokenEntity = await _context.PasswordRecoveryTokens
                    .Include(t => t.Usuario)
                    .FirstOrDefaultAsync(t => t.Token == tokenGuid && !t.Used);

                if (tokenEntity == null)
                {
                    return BadRequest(new { message = "El token no es válido o ya ha sido utilizado." });
                }

                // Verificar que el token no ha expirado
                if (tokenEntity.ExpirationDate < DateTime.UtcNow)
                {
                    return BadRequest(new { message = "El token ha expirado. Por favor, solicita un nuevo enlace de recuperación." });
                }

                // Actualizar la contraseña del usuario
                tokenEntity.Usuario.PasswordHash = HashPassword(request.NewPassword);
                
                // Marcar el token como utilizado
                tokenEntity.Used = true;
                tokenEntity.UsedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new ResetPasswordResponse
                {
                    Success = true,
                    Message = "Tu contraseña ha sido restablecida correctamente."
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en restablecimiento de contraseña: {ex.Message}");
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }

        // Endpoint para verificar token (para validar antes de mostrar el formulario de nueva contraseña)
        [HttpGet("verify-token/{token}")]
        public async Task<IActionResult> VerifyToken(string token)
        {
            try
            {
                // Validar formato del token
                if (!Guid.TryParse(token, out Guid tokenGuid))
                {
                    return BadRequest(new { valid = false, message = "El formato del token no es válido." });
                }

                // Buscar el token en la base de datos
                var tokenEntity = await _context.PasswordRecoveryTokens
                    .FirstOrDefaultAsync(t => t.Token == tokenGuid && !t.Used);

                if (tokenEntity == null)
                {
                    return Ok(new { valid = false, message = "El token no es válido o ya ha sido utilizado." });
                }

                // Verificar que el token no ha expirado
                if (tokenEntity.ExpirationDate < DateTime.UtcNow)
                {
                    return Ok(new { valid = false, message = "El token ha expirado. Por favor, solicita un nuevo enlace de recuperación." });
                }

                return Ok(new { valid = true, message = "Token válido. Puedes proceder a establecer una nueva contraseña." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al verificar token: {ex.Message}");
                return StatusCode(500, new { valid = false, message = "Error interno del servidor", error = ex.Message });
            }
        }
    }

    public class ResetPasswordModel
    {
        public string NewPassword { get; set; } = string.Empty;
    }
}