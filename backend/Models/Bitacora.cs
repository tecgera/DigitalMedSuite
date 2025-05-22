using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Bitacora
    {
        [Key]
        public int ID_Bitacora { get; set; }
        
        public int? ID_Tabla { get; set; }
        
        public int? ID_Registro { get; set; }
        
        public int? ID_TipoDeMovimiento { get; set; }
        
        [StringLength(100)]
        public string? Usuario { get; set; }
        
        public DateTime Fecha_Modificacion { get; set; } = DateTime.Now;
        
        [ForeignKey("ID_Tabla")]
        public Tabla? Tabla { get; set; }
        
        [ForeignKey("ID_TipoDeMovimiento")]
        public TipoMovimiento? TipoMovimiento { get; set; }
    }
}
