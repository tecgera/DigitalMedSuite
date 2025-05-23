using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class EventoBitacora
    {
        [Key]
        public int ID_Evento { get; set; }
        
        [Required]
        public DateTime FechaHora { get; set; } = DateTime.Now;
        
        [StringLength(100)]
        public string? Usuario { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Accion { get; set; } = null!;
        
        [Required]
        [StringLength(50)]
        public string Entidad { get; set; } = null!;
        
        [StringLength(500)]
        public string? Detalles { get; set; }
        
        public int? IdReferencia { get; set; }
        
        // Propiedades adicionales para búsqueda y filtrado
        
        // Una versión serializada de datos adicionales en JSON (opcional)
        public string? DatosAdicionales { get; set; }
    }
}
