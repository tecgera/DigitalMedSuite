using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Paciente
    {
        [Key]
        public int ID_Paciente { get; set; }

        [StringLength(20)]
        public string? Nombre { get; set; }

        [StringLength(20)]
        public string? Apellido_Paterno { get; set; }

        [StringLength(20)]
        public string? Apellido_Materno { get; set; }

        public DateTime? Fecha_Nacimiento { get; set; }

        // Datos de dirección
        [StringLength(30)]
        public string? Calle { get; set; }

        public int? Codigo_Postal { get; set; }

        public int? Num_Calle { get; set; }

        // Datos de contacto
        [StringLength(50)]
        [EmailAddress]
        public string? Correo_Electronico { get; set; }

        [StringLength(20)]
        public string? Telefono { get; set; }

        // Datos médicos
        public float? Altura { get; set; }
        public float? Peso { get; set; }

        public int? ID_Tipo { get; set; }
        [ForeignKey("ID_Tipo")]
        public TipoSangre? TipoSangre { get; set; }

        public int? ID_Alergias { get; set; }
        [ForeignKey("ID_Alergias")]
        public Alergia? Alergia { get; set; }

        public int? ID_Operaciones { get; set; }
        [ForeignKey("ID_Operaciones")]
        public Operacion? Operacion { get; set; }

        public int? ID_Padecimientos { get; set; }
        [ForeignKey("ID_Padecimientos")]
        public Padecimiento? Padecimiento { get; set; }

        public int? ID_Genero { get; set; }
        [ForeignKey("ID_Genero")]
        public Genero? Genero { get; set; }

        public DateTime Fecha_Registro { get; set; } = DateTime.Now;

        public int? ID_Estatus { get; set; }
        [ForeignKey("ID_Estatus")]
        public EstatusPaciente? EstatusPaciente { get; set; }

        [StringLength(15)]
        public string? CURP { get; set; }

        public ICollection<Cita> Citas { get; set; } = new List<Cita>();
    }
}