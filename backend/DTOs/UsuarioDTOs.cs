namespace backend.DTOs
{
    // DTOs para Usuario
    public class UsuarioDTO
    {
        // Propiedades principales según la base de datos (estilo PascalCase con guión bajo)
        public int ID_Usuario { get; set; }
        public string Nombre_Usuario { get; set; } = null!;
        public int ID_Rol { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public int? ID_Estatus { get; set; }
        public string? nombreRol { get; set; }
        public string? nombreEstatus { get; set; }
        
        // Propiedades secundarias en camelCase para compatibilidad con JSON
        // Usamos JsonPropertyName para evitar colisiones
        [System.Text.Json.Serialization.JsonIgnore]
        public int idUsuario { get => ID_Usuario; set => ID_Usuario = value; }
        
        [System.Text.Json.Serialization.JsonIgnore]
        public string nombreUsuario { get => Nombre_Usuario; set => Nombre_Usuario = value; }
        
        [System.Text.Json.Serialization.JsonIgnore]
        public int idRol { get => ID_Rol; set => ID_Rol = value; }
        
        [System.Text.Json.Serialization.JsonIgnore]
        public string? nombre { get => Nombre; set => Nombre = value; }
        
        [System.Text.Json.Serialization.JsonIgnore]
        public string? apellidoPaterno { get => Apellido_Paterno; set => Apellido_Paterno = value; }
        
        [System.Text.Json.Serialization.JsonIgnore]
        public string? apellidoMaterno { get => Apellido_Materno; set => Apellido_Materno = value; }
        
        [System.Text.Json.Serialization.JsonIgnore]
        public string? correo { get => Correo; set => Correo = value; }
        
        [System.Text.Json.Serialization.JsonIgnore]
        public string? telefono { get => Telefono; set => Telefono = value; }
        
        [System.Text.Json.Serialization.JsonIgnore]
        public int? idEstatus { get => ID_Estatus; set => ID_Estatus = value; }
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
