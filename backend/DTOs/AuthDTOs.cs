namespace backend.DTOs
{
    public class LoginRequestDTO
    {
        public string Nombre_Usuario { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class RegisterRequestDTO
    {
        public string Nombre_Usuario { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public int ID_Rol { get; set; }
    }

    public class LoginResponseDTO
    {
        public int ID_Usuario { get; set; }
        public string Nombre_Usuario { get; set; } = null!;
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public string? Correo { get; set; }
        public int ID_Rol { get; set; }
        public string? Rol { get; set; }
        public string Token { get; set; } = null!;
    }
}
