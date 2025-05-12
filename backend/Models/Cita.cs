using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Cita
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PacienteId { get; set; }

        [ForeignKey("PacienteId")]
        public Paciente? Paciente { get; set; }

        [Required]
        public int MedicoId { get; set; }

        [ForeignKey("MedicoId")]
        public Medico? Medico { get; set; }

        [Required(ErrorMessage = "La fecha y hora son obligatorias")]
        public DateTime FechaHora { get; set; }

        [StringLength(500)]
        public string Motivo { get; set; } = string.Empty;

        [StringLength(50)]
        public string Estado { get; set; } = "Programada"; // Programada, Completada, Cancelada, etc.

        public string Notas { get; set; } = string.Empty;

        // Fecha de registro
        public DateTime FechaRegistro { get; set; } = DateTime.Now;
    }
}