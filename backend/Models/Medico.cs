using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Medico
    {
        [Key]
        public int ID_Medico { get; set; }

        [StringLength(20)]
        public string? Nombre { get; set; }

        [StringLength(20)]
        public string? Apellido_Paterno { get; set; }

        [StringLength(20)]
        public string? Apellido_Materno { get; set; }

        [StringLength(35)]
        [EmailAddress]
        public string? Correo { get; set; }

        [StringLength(20)]
        public string? Telefono { get; set; }

        public int? ID_Especialidad { get; set; }
        
        [ForeignKey("ID_Especialidad")]
        public Especialidad? Especialidad { get; set; }

        [StringLength(20)]
        public string? Estado { get; set; }

        public DateTime Fecha_Creacion { get; set; } = DateTime.Now;

        public int? ID_Estatus { get; set; }
        
        [ForeignKey("ID_Estatus")]
        public EstatusMedico? EstatusMedico { get; set; }

        public ICollection<Cita> Citas { get; set; } = new List<Cita>();
    }
}