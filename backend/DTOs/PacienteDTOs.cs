namespace backend.DTOs
{
    // DTOs para Paciente
    public class PacienteDTO
    {
        public int ID_Paciente { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public DateTime? Fecha_Nacimiento { get; set; }
        
        // Datos de dirección
        public string? Calle { get; set; }
        public int? Codigo_Postal { get; set; }
        public int? Num_Calle { get; set; }
        
        // Datos de contacto
        public string? Correo_Electronico { get; set; }
        public string? Telefono { get; set; }
        
        // Datos médicos
        public float? Altura { get; set; }
        public float? Peso { get; set; }
        public int? ID_Tipo { get; set; }
        public string? TipoSangreNombre { get; set; }
        public int? ID_Alergias { get; set; }
        public string? AlergiaNombre { get; set; }
        public int? ID_Operaciones { get; set; }
        public string? OperacionNombre { get; set; }
        public int? ID_Padecimientos { get; set; }
        public string? PadecimientoNombre { get; set; }
        public int? ID_Genero { get; set; }
        public string? GeneroNombre { get; set; }
        
        // Varios
        public DateTime Fecha_Registro { get; set; }
        public int? ID_Estatus { get; set; }
        public string? EstatusNombre { get; set; }
        public string? CURP { get; set; }
    }

    public class PacienteCrearDTO
    {
        public int ID_Paciente { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public DateTime? Fecha_Nacimiento { get; set; }
        public string? Calle { get; set; }
        public int? Codigo_Postal { get; set; }
        public int? Num_Calle { get; set; }
        public string? Correo_Electronico { get; set; }
        public string? Telefono { get; set; }
        public float? Altura { get; set; }
        public float? Peso { get; set; }
        public int? ID_Tipo { get; set; }
        public int? ID_Alergias { get; set; }
        public int? ID_Operaciones { get; set; }
        public int? ID_Padecimientos { get; set; }
        public int? ID_Genero { get; set; }
        public int? ID_Estatus { get; set; }
        public string? CURP { get; set; }
    }

    public class PacienteActualizarDTO
    {
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public DateTime? Fecha_Nacimiento { get; set; }
        public string? Calle { get; set; }
        public int? Codigo_Postal { get; set; }
        public int? Num_Calle { get; set; }
        public string? Correo_Electronico { get; set; }
        public string? Telefono { get; set; }
        public float? Altura { get; set; }
        public float? Peso { get; set; }
        public int? ID_Tipo { get; set; }
        public int? ID_Alergias { get; set; }
        public int? ID_Operaciones { get; set; }
        public int? ID_Padecimientos { get; set; }
        public int? ID_Genero { get; set; }
        public int? ID_Estatus { get; set; }
        public string? CURP { get; set; }
    }
}
