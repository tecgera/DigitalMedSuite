using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Padecimiento
    {
        [Key]
        public int ID_Padecimientos { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Nombre_Padecimiento { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Descripcion { get; set; }

        public DateTime? Fecha_Diagnostico { get; set; }

        public ICollection<Paciente> Pacientes { get; set; } = new List<Paciente>();
    }
}
