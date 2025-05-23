using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Entidades principales
        public DbSet<Usuario> Usuarios { get; set; } = null!;
        public DbSet<Medico> Medicos { get; set; } = null!;
        public DbSet<Paciente> Pacientes { get; set; } = null!;
        public DbSet<CitaMedica> CitasMedicas { get; set; } = null!;        public DbSet<Consultorio> Consultorios { get; set; } = null!;
        public DbSet<Bitacora> Bitacoras { get; set; } = null!;
        public DbSet<EventoBitacora> EventosBitacora { get; set; } = null!;

        // Entidades de catálogo
        public DbSet<Rol> Roles { get; set; } = null!;
        public DbSet<EstatusUsuario> EstatusUsuarios { get; set; } = null!;
        public DbSet<EstatusMedico> EstatusMedicos { get; set; } = null!;
        public DbSet<EstatusPaciente> EstatusPacientes { get; set; } = null!;
        public DbSet<EstatusConsultorio> EstatusConsultorios { get; set; } = null!;
        public DbSet<EstatusCita> EstatusCitas { get; set; } = null!;
        public DbSet<Especialidad> Especialidades { get; set; } = null!;
        public DbSet<Alergia> Alergias { get; set; } = null!;
        public DbSet<Operacion> Operaciones { get; set; } = null!;
        public DbSet<Padecimiento> Padecimientos { get; set; } = null!;
        public DbSet<Genero> Generos { get; set; } = null!;
        public DbSet<TipoSangre> TiposSangre { get; set; } = null!;
        public DbSet<Tabla> Tablas { get; set; } = null!;
        public DbSet<TipoMovimiento> TiposDeMovimientos { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de las tablas
            modelBuilder.Entity<Usuario>().ToTable("Usuarios");
            modelBuilder.Entity<Medico>().ToTable("Medicos");
            modelBuilder.Entity<Paciente>().ToTable("Pacientes");
            modelBuilder.Entity<CitaMedica>().ToTable("CitasMedicas");
            modelBuilder.Entity<Consultorio>().ToTable("Consultorios");
            modelBuilder.Entity<Bitacora>().ToTable("Bitacora");
            
            modelBuilder.Entity<Rol>().ToTable("Roles");
            modelBuilder.Entity<EstatusUsuario>().ToTable("Estatus_Usuarios");
            modelBuilder.Entity<EstatusMedico>().ToTable("Estatus_Medicos");
            modelBuilder.Entity<EstatusPaciente>().ToTable("Estatus_Pacientes");
            modelBuilder.Entity<EstatusConsultorio>().ToTable("Estatus_Consultorios");
            modelBuilder.Entity<EstatusCita>().ToTable("Estatus_Citas");
            modelBuilder.Entity<Especialidad>().ToTable("Especialidades");
            modelBuilder.Entity<Alergia>().ToTable("Alergias");
            modelBuilder.Entity<Operacion>().ToTable("Operaciones");
            modelBuilder.Entity<Padecimiento>().ToTable("Padeciminetos");
            modelBuilder.Entity<Genero>().ToTable("Generos");
            modelBuilder.Entity<TipoSangre>().ToTable("TipoSangre");
            modelBuilder.Entity<Tabla>().ToTable("Tablas");
            modelBuilder.Entity<TipoMovimiento>().ToTable("TiposDeMovimientos");

            // Configuración de relaciones y propiedades específicas si es necesario
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Rol)
                .WithMany()
                .HasForeignKey(u => u.ID_Rol);

            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Estatus)
                .WithMany()
                .HasForeignKey(u => u.ID_Estatus);

            modelBuilder.Entity<Medico>()
                .HasOne(m => m.Especialidad)
                .WithMany()
                .HasForeignKey(m => m.ID_Especialidad);

            modelBuilder.Entity<Medico>()
                .HasOne(m => m.Estatus)
                .WithMany()
                .HasForeignKey(m => m.ID_Estatus);

            modelBuilder.Entity<Paciente>()
                .HasOne(p => p.TipoSangre)
                .WithMany()
                .HasForeignKey(p => p.ID_Tipo);

            modelBuilder.Entity<Paciente>()
                .HasOne(p => p.Alergia)
                .WithMany()
                .HasForeignKey(p => p.ID_Alergias);

            modelBuilder.Entity<Paciente>()
                .HasOne(p => p.Operacion)
                .WithMany()
                .HasForeignKey(p => p.ID_Operaciones);

            modelBuilder.Entity<Paciente>()
                .HasOne(p => p.Padecimiento)
                .WithMany()
                .HasForeignKey(p => p.ID_Padecimientos);

            modelBuilder.Entity<Paciente>()
                .HasOne(p => p.Genero)
                .WithMany()
                .HasForeignKey(p => p.ID_Genero);

            modelBuilder.Entity<Paciente>()
                .HasOne(p => p.Estatus)
                .WithMany()
                .HasForeignKey(p => p.ID_Estatus);

            modelBuilder.Entity<CitaMedica>()
                .HasOne(c => c.Paciente)
                .WithMany()
                .HasForeignKey(c => c.ID_Paciente);

            modelBuilder.Entity<CitaMedica>()
                .HasOne(c => c.Medico)
                .WithMany()
                .HasForeignKey(c => c.ID_Medico);

            modelBuilder.Entity<CitaMedica>()
                .HasOne(c => c.Consultorio)
                .WithMany()
                .HasForeignKey(c => c.ID_Consultorio);

            modelBuilder.Entity<CitaMedica>()
                .HasOne(c => c.Estatus)
                .WithMany()
                .HasForeignKey(c => c.ID_Estatus);

            modelBuilder.Entity<Consultorio>()
                .HasOne(c => c.Estatus)
                .WithMany()
                .HasForeignKey(c => c.ID_Estatus);

            modelBuilder.Entity<Bitacora>()
                .HasOne(b => b.Tabla)
                .WithMany()
                .HasForeignKey(b => b.ID_Tabla);

            modelBuilder.Entity<Bitacora>()
                .HasOne(b => b.TipoMovimiento)
                .WithMany()
                .HasForeignKey(b => b.ID_TipoDeMovimiento);
        }
    }
}
