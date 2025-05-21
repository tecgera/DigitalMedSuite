using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class EstatusConsultorio
    {
        [Key]
        public int ID_Estatus { get; set; }
        
        [Required]
        [StringLength(15)]
        public string Nombre_Estatus { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        public ICollection<Consultorio> Consultorios { get; set; } = new List<Consultorio>();
    }
}
