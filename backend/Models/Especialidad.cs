using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Especialidad
    {
        [Key]
        public int ID_Especialidad { get; set; }

        [Required]
        [StringLength(50)]
        public string Nombre_Especialidad { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        public ICollection<Medico> Medicos { get; set; } = new List<Medico>();
    }
}
