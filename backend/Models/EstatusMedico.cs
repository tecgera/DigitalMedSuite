using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class EstatusMedico
    {
        [Key]
        public int ID_Estatus { get; set; }

        [Required]
        [StringLength(15)]
        public string Nombre_Estatus { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        public ICollection<Medico> Medicos { get; set; } = new List<Medico>();
    }
}
