using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Medico
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "Los apellidos son obligatorios")]
        [StringLength(100)]
        public string Apellidos { get; set; } = string.Empty;

        [Required(ErrorMessage = "La especialidad es obligatoria")]
        [StringLength(100)]
        public string Especialidad { get; set; } = string.Empty;

        [StringLength(15)]
        public string Telefono { get; set; } = string.Empty;

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress(ErrorMessage = "El formato del email no es válido")]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [StringLength(50)]
        public string NumeroLicencia { get; set; } = string.Empty;

        // Horario disponible (podría ser una relación a otra tabla en un sistema más complejo)
        public string HorarioDisponible { get; set; } = string.Empty;

        // Fecha de registro
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
    }
}