namespace backend.DTOs
{
    // DTOs para CitaMedica
    public class CitaMedicaDTO
    {
        public int ID_Cita { get; set; }
        public int ID_Paciente { get; set; }
        public string? NombrePaciente { get; set; }
        public string? ApellidoPaciente { get; set; }
        public int ID_Medico { get; set; }
        public string? NombreMedico { get; set; }
        public string? ApellidoMedico { get; set; }
        public string? Especialidad { get; set; }
        public DateTime Fecha_Cita { get; set; }
        public TimeSpan Hora_Cita { get; set; }
        public int ID_Consultorio { get; set; }
        public string? NombreConsultorio { get; set; }
        public int? ID_Estatus { get; set; }
        public string? EstatusNombre { get; set; }
        public DateTime Fecha_Creacion { get; set; }
        public DateTime Ultima_Actualizacion { get; set; }
    }

    public class CitaMedicaCrearDTO
    {
        public int ID_Paciente { get; set; }
        public int ID_Medico { get; set; }
        public DateTime Fecha_Cita { get; set; }
        public TimeSpan Hora_Cita { get; set; }
        public int ID_Consultorio { get; set; }
        public int? ID_Estatus { get; set; }
    }

    public class CitaMedicaActualizarDTO
    {
        public int? ID_Paciente { get; set; }
        public int? ID_Medico { get; set; }
        public DateTime? Fecha_Cita { get; set; }
        public TimeSpan? Hora_Cita { get; set; }
        public int? ID_Consultorio { get; set; }
        public int? ID_Estatus { get; set; }
    }
}
