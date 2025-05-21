using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Operacion
    {
        [Key]
        public int ID_Operaciones { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Nombre_Operacion { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Descripcion { get; set; }

        public DateTime? Fecha_Operacion { get; set; }

        public ICollection<Paciente> Pacientes { get; set; } = new List<Paciente>();
    }
}
