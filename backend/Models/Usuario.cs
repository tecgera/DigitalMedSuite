using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Usuario
    {
        [Key]
        public int ID_Usuario { get; set; }

        [Required(ErrorMessage = "El nombre de usuario es obligatorio")]
        [StringLength(20)]
        public string Nombre_Usuario { get; set; } = null!;

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        [StringLength(30)]
        public string ContrasenaHash { get; set; } = null!;

        [Required]
        public int ID_Rol { get; set; }
        
        [ForeignKey("ID_Rol")]
        public Rol? Rol { get; set; }

        [StringLength(20)]
        public string? Nombre { get; set; }

        [StringLength(20)]
        public string? Apellido_Paterno { get; set; }

        [StringLength(20)]
        public string? Apellido_Materno { get; set; }

        [StringLength(20)]
        [EmailAddress]
        public string? Correo { get; set; }

        [StringLength(20)]
        public string? Telefono { get; set; }

        public int? ID_Estatus { get; set; }
        
        [ForeignKey("ID_Estatus")]
        public EstatusUsuario? EstatusUsuario { get; set; }

        public DateTime Fecha_Creacion { get; set; } = DateTime.Now;
    }
}