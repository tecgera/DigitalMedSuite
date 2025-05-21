using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Rol
    {
        [Key]
        public int ID_Rol { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Nombre_Rol { get; set; } = string.Empty;

        public string? Descripcion { get; set; }

        public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    }
}
