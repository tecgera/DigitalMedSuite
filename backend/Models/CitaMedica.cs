using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class CitaMedica
    {
        [Key]
        public int ID_Cita { get; set; }
        
        [Required]
        public int ID_Paciente { get; set; }
        
        [Required]
        public int ID_Medico { get; set; }
        
        [Required]
        public DateTime Fecha_Cita { get; set; }
        
        [Required]
        public TimeSpan Hora_Cita { get; set; }
        
        [Required]
        public int ID_Consultorio { get; set; }
        
        public int? ID_Estatus { get; set; }
        
        public DateTime Fecha_Creacion { get; set; } = DateTime.Now;
        
        public DateTime Ultima_Actualizacion { get; set; } = DateTime.Now;
        
        [ForeignKey("ID_Paciente")]
        public Paciente? Paciente { get; set; }
        
        [ForeignKey("ID_Medico")]
        public Medico? Medico { get; set; }
        
        [ForeignKey("ID_Consultorio")]
        public Consultorio? Consultorio { get; set; }
        
        [ForeignKey("ID_Estatus")]
        public EstatusCita? Estatus { get; set; }
    }
}
