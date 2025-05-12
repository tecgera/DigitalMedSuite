using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre de usuario es obligatorio")]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress(ErrorMessage = "El formato del email no es válido")]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        [StringLength(255)] // Almacenaremos el hash de la contraseña
        public string PasswordHash { get; set; } = string.Empty;

        // Para almacenar el rol: "Admin", "Medico", "Paciente", etc.
        [Required]
        [StringLength(20)]
        public string Rol { get; set; } = "Usuario";

        // Referencia opcional a un paciente (si el usuario es un paciente)
        public int? PacienteId { get; set; }
        
        // Referencia opcional a un médico (si el usuario es un médico)
        public int? MedicoId { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        
        public DateTime? UltimoAcceso { get; set; }
    }
}