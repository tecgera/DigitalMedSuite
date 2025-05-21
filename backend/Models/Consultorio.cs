using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Consultorio
    {
        [Key]
        public int ID_Consultorio { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Nombre_Consultorio { get; set; } = string.Empty;

        [Required]
        public int ID_Estatus { get; set; }

        [ForeignKey("ID_Estatus")]
        public EstatusConsultorio? EstatusConsultorio { get; set; }

        public DateTime Fecha_Registro { get; set; } = DateTime.Now;

        public ICollection<Cita> Citas { get; set; } = new List<Cita>();
    }
}
