using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Genero
    {
        [Key]
        public int ID_Generos { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Genero_Nombre { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        public ICollection<Paciente> Pacientes { get; set; } = new List<Paciente>();
    }
}
