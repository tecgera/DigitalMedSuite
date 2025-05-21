using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class TipoSangre
    {
        [Key]
        public int ID_Tipo { get; set; }
        
        [Required]
        [StringLength(5)]
        public string Tipo_Sangre { get; set; } = string.Empty;

        public string? Factor_RH { get; set; }

        public string? Descripcion { get; set; }

        public ICollection<Paciente> Pacientes { get; set; } = new List<Paciente>();
    }
}
