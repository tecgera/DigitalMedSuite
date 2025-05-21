using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Alergia
    {
        [Key]
        public int ID_Alergias { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Nombre_Alergia { get; set; } = string.Empty;

        [StringLength(200)]
        public string? Descripcion { get; set; }

        public DateTime Fecha_Registro { get; set; } = DateTime.Now;

        public ICollection<Paciente> Pacientes { get; set; } = new List<Paciente>();
    }
}
