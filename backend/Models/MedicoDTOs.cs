using System;

namespace backend.Models
{
    public class MedicoDTO
    {
        public int ID_Medico { get; set; }
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public int? ID_Especialidad { get; set; }
        public string? Especialidad { get; set; }
        public string? Estado { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public int? ID_Estatus { get; set; }
        public string? Estatus { get; set; }
    }

    public class CreateMedicoDTO
    {
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public int? ID_Especialidad { get; set; }
        public string? Estado { get; set; }
    }

    public class UpdateMedicoDTO
    {
        public string? Nombre { get; set; }
        public string? Apellido_Paterno { get; set; }
        public string? Apellido_Materno { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public int? ID_Especialidad { get; set; }
        public string? Estado { get; set; }
        public int? ID_Estatus { get; set; }
    }
}
