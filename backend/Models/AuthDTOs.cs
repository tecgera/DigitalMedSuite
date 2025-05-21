using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class LoginRequest
    {
        public string Nombre_Usuario { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Nombre_Usuario { get; set; } = string.Empty;
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public string? Correo { get; set; }
        public string Rol { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Nombre_Usuario { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public string Rol { get; set; } = string.Empty;
    }

    public class PasswordRecoveryRequest
    {
        public string Correo { get; set; } = string.Empty;
    }

    public class ResetPasswordRequest
    {
        public string Token { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}