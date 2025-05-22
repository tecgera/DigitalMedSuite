using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Consultorio
    {
        [Key]
        public int ID_Consultorio { get; set; }
        
        [StringLength(100)]
        public string? Nombre_Consultorio { get; set; }
        
        public int? ID_Estatus { get; set; }
        
        [ForeignKey("ID_Estatus")]
        public EstatusConsultorio? Estatus { get; set; }
    }
}
