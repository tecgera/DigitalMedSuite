namespace backend.DTOs
{
    // DTOs para Consultorio
    public class ConsultorioDTO
    {
        public int ID_Consultorio { get; set; }
        public string? Nombre_Consultorio { get; set; }
        public int? ID_Estatus { get; set; }
        public string? EstatusNombre { get; set; }
    }

    public class ConsultorioCrearDTO
    {
        public string? Nombre_Consultorio { get; set; }
        public int? ID_Estatus { get; set; }
    }

    public class ConsultorioActualizarDTO
    {
        public string? Nombre_Consultorio { get; set; }
        public int? ID_Estatus { get; set; }
    }
}
