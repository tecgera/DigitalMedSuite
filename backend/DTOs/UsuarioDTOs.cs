namespace backend.DTOs
{
    // DTOs para Usuario
    public class UsuarioDTO
    {
        public int ID_Usuario { get; set; }
        public string Nombre_Usuario { get; set; } = null!;
        public int ID_Rol { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public int? ID_Estatus { get; set; }
        public string? NombreRol { get; set; }
        public string? NombreEstatus { get; set; }
    }

    public class UsuarioCrearDTO
    {
        public string Nombre_Usuario { get; set; } = null!;
        public string ContrasenaHash { get; set; } = null!;
        public int ID_Rol { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public int? ID_Estatus { get; set; }
    }

    public class UsuarioActualizarDTO
    {
        public string? Nombre_Usuario { get; set; }
        public string? ContrasenaHash { get; set; }
        public int? ID_Rol { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public int? ID_Estatus { get; set; }
    }

    // DTOs para autenticación
    public class LoginDTO
    {
        public string Nombre_Usuario { get; set; } = null!;
        public string Contrasena { get; set; } = null!;
    }

    public class AuthResponseDTO
    {
        public int ID_Usuario { get; set; }
        public string Nombre_Usuario { get; set; } = null!;
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string Token { get; set; } = null!;
        public string Rol { get; set; } = null!;
    }
}
