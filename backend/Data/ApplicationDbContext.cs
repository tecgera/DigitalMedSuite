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

        // DbSets principales
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<EstatusUsuario> EstatusUsuarios { get; set; }
        public DbSet<Medico> Medicos { get; set; }
        public DbSet<EstatusMedico> EstatusMedicos { get; set; }
        public DbSet<Especialidad> Especialidades { get; set; }
        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<EstatusPaciente> EstatusPacientes { get; set; }
        public DbSet<Cita> Citas { get; set; }
        public DbSet<EstatusCita> EstatusCitas { get; set; }
        public DbSet<Consultorio> Consultorios { get; set; }
        public DbSet<EstatusConsultorio> EstatusConsultorios { get; set; }
        public DbSet<TipoSangre> TiposSangre { get; set; }
        public DbSet<Alergia> Alergias { get; set; }
        public DbSet<Operacion> Operaciones { get; set; }
        public DbSet<Padecimiento> Padecimientos { get; set; }
        public DbSet<Genero> Generos { get; set; }
        public DbSet<PasswordRecoveryToken> PasswordRecoveryTokens { get; set; }

        // Configuración adicional del modelo (relaciones, índices, etc.)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de índices
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Nombre_Usuario)
                .IsUnique();

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Correo)
                .IsUnique()
                .HasFilter(null); // Permite valores nulos en el correo

            // Relaciones de Usuario
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Rol)
                .WithMany(r => r.Usuarios)
                .HasForeignKey(u => u.ID_Rol)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.EstatusUsuario)
                .WithMany(e => e.Usuarios)
                .HasForeignKey(u => u.ID_Estatus)
                .OnDelete(DeleteBehavior.Restrict);

            // Relaciones de Médico
            modelBuilder.Entity<Medico>()
                .HasOne(m => m.Especialidad)
                .WithMany(e => e.Medicos)
                .HasForeignKey(m => m.ID_Especialidad)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Medico>()
                .HasOne(m => m.EstatusMedico)
                .WithMany()
                .HasForeignKey(m => m.ID_Estatus)
                .OnDelete(DeleteBehavior.Restrict);

            // Relaciones de Paciente
            modelBuilder.Entity<Paciente>()
                .HasOne(p => p.TipoSangre)
                .WithMany(t => t.Pacientes)
                .HasForeignKey(p => p.ID_Tipo)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Paciente>()
                .HasOne(p => p.Alergia)
                .WithMany(a => a.Pacientes)
                .HasForeignKey(p => p.ID_Alergias)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Paciente>()
                .HasOne(p => p.Operacion)
                .WithMany(o => o.Pacientes)
                .HasForeignKey(p => p.ID_Operaciones)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Paciente>()
                .HasOne(p => p.Padecimiento)
                .WithMany(p => p.Pacientes)
                .HasForeignKey(p => p.ID_Padecimientos)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Paciente>()
                .HasOne(p => p.Genero)
                .WithMany(g => g.Pacientes)
                .HasForeignKey(p => p.ID_Genero)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Paciente>()
                .HasOne(p => p.EstatusPaciente)
                .WithMany(e => e.Pacientes)
                .HasForeignKey(p => p.ID_Estatus)
                .OnDelete(DeleteBehavior.Restrict);

            // Relaciones de Consultorio
            modelBuilder.Entity<Consultorio>()
                .HasOne(c => c.EstatusConsultorio)
                .WithMany(e => e.Consultorios)
                .HasForeignKey(c => c.ID_Estatus)
                .OnDelete(DeleteBehavior.Restrict);

            // Relaciones de Cita
            modelBuilder.Entity<Cita>()
                .HasOne(c => c.Paciente)
                .WithMany(p => p.Citas)
                .HasForeignKey(c => c.ID_Paciente)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Cita>()
                .HasOne(c => c.Medico)
                .WithMany(m => m.Citas)
                .HasForeignKey(c => c.ID_Medico)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Cita>()
                .HasOne(c => c.Consultorio)
                .WithMany(co => co.Citas)
                .HasForeignKey(c => c.ID_Consultorio)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Cita>()
                .HasOne(c => c.EstatusCita)
                .WithMany()
                .HasForeignKey(c => c.ID_Estatus)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}