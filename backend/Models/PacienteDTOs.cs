using System;

namespace backend.Models
{
    public class PacienteDTO
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
        public string? TipoSangre { get; set; }
        public int? ID_Alergias { get; set; }
        public string? Alergia { get; set; }
        public int? ID_Operaciones { get; set; }
        public string? Operacion { get; set; }
        public int? ID_Padecimientos { get; set; }
        public string? Padecimiento { get; set; }
        public int? ID_Genero { get; set; }
        public string? Genero { get; set; }
        public string? CURP { get; set; }
        public DateTime Fecha_Registro { get; set; }
        public int? ID_Estatus { get; set; }
        public string? Estatus { get; set; }
    }

    public class CreatePacienteDTO
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
        public string? CURP { get; set; }
    }

    public class UpdatePacienteDTO
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
        public string? CURP { get; set; }
        public int? ID_Estatus { get; set; }
    }
}
