using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    // Modelos para tablas de estatus/catálogos
    public class Rol
    {
        [Key]
        public int ID_Rol { get; set; }
        public string Nombre_Rol { get; set; } = null!;
    }

    public class EstatusUsuario
    {
        [Key]
        public int ID_Estatus { get; set; }
        public string Nombre_Estatus { get; set; } = null!;
    }

    public class EstatusMedico
    {
        [Key]
        public int ID_Estatus { get; set; }
        public string Nombre_Estatus { get; set; } = null!;
    }

    public class EstatusPaciente
    {
        [Key]
        public int ID_Estatus { get; set; }
        public string Nombre_Estatus { get; set; } = null!;
    }

    public class EstatusConsultorio
    {
        [Key]
        public int ID_Estatus { get; set; }
        public string Nombre_Estatus { get; set; } = null!;
    }

    public class EstatusCita
    {
        [Key]
        public int ID_Estatus { get; set; }
        public string Nombre_Estatus { get; set; } = null!;
    }

    public class Especialidad
    {
        [Key]
        public int ID_Especialidad { get; set; }
        public string Nombre_Especialidad { get; set; } = null!;
        public string? Descripcion { get; set; }
    }

    public class Alergia
    {
        [Key]
        public int ID_Alergias { get; set; }
        public string Nombre_Alergia { get; set; } = null!;
    }

    public class Operacion
    {
        [Key]
        public int ID_Operaciones { get; set; }
        public string Nombre_Operacion { get; set; } = null!;
        public string? Descripcion { get; set; }
    }

    public class Padecimiento
    {
        [Key]
        public int ID_Padecimientos { get; set; }
        public string Nombre_Padecimiento { get; set; } = null!;
    }

    public class Genero
    {
        [Key]
        public int ID_Generos { get; set; }
        public string Genero_Nombre { get; set; } = null!;
    }

    public class TipoSangre
    {
        [Key]
        public int ID_Tipo { get; set; }
        public string Tipo_Sangre { get; set; } = null!;
    }

    public class Tabla
    {
        [Key]
        public int ID_Tabla { get; set; }
        public string Nombre_Tabla { get; set; } = null!;
    }

    public class TipoMovimiento
    {
        [Key]
        public int ID_TipoDeMovimiento { get; set; }
        public string Descripcion_Movimiento { get; set; } = null!;
    }
}
