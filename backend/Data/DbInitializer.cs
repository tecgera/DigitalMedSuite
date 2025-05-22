using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // Make sure the database is created
            context.Database.EnsureCreated();

            // Seed Roles if empty
            if (!context.Roles.Any())
            {
                var roles = new List<Rol>
                {
                    new Rol { Nombre_Rol = "Administrador" },
                    new Rol { Nombre_Rol = "Doctor" },
                    new Rol { Nombre_Rol = "Recepcionista" },
                    new Rol { Nombre_Rol = "Enfermera" }
                };

                context.Roles.AddRange(roles);
                context.SaveChanges();
            }

            // Seed EstatusUsuarios if empty
            if (!context.EstatusUsuarios.Any())
            {
                var estatusUsuarios = new List<EstatusUsuario>
                {
                    new EstatusUsuario { Nombre_Estatus = "Activo" },
                    new EstatusUsuario { Nombre_Estatus = "Inactivo" },
                    new EstatusUsuario { Nombre_Estatus = "Suspendido" }
                };

                context.EstatusUsuarios.AddRange(estatusUsuarios);
                context.SaveChanges();
            }

            // Seed EstatusMedicos if empty
            if (!context.EstatusMedicos.Any())
            {
                var estatusMedicos = new List<EstatusMedico>
                {
                    new EstatusMedico { Nombre_Estatus = "Activo" },
                    new EstatusMedico { Nombre_Estatus = "Inactivo" },
                    new EstatusMedico { Nombre_Estatus = "Suspendido" },
                    new EstatusMedico { Nombre_Estatus = "Vacaciones" }
                };

                context.EstatusMedicos.AddRange(estatusMedicos);
                context.SaveChanges();
            }

            // Seed EstatusPacientes if empty
            if (!context.EstatusPacientes.Any())
            {
                var estatusPacientes = new List<EstatusPaciente>
                {
                    new EstatusPaciente { Nombre_Estatus = "Activo" },
                    new EstatusPaciente { Nombre_Estatus = "Inactivo" },
                    new EstatusPaciente { Nombre_Estatus = "Hospitalizado" }
                };

                context.EstatusPacientes.AddRange(estatusPacientes);
                context.SaveChanges();
            }

            // Seed EstatusConsultorios if empty
            if (!context.EstatusConsultorios.Any())
            {
                var estatusConsultorios = new List<EstatusConsultorio>
                {
                    new EstatusConsultorio { Nombre_Estatus = "Disponible" },
                    new EstatusConsultorio { Nombre_Estatus = "Ocupado" },
                    new EstatusConsultorio { Nombre_Estatus = "En Mantenimiento" }
                };

                context.EstatusConsultorios.AddRange(estatusConsultorios);
                context.SaveChanges();
            }

            // Seed EstatusCitas if empty
            if (!context.EstatusCitas.Any())
            {
                var estatusCitas = new List<EstatusCita>
                {
                    new EstatusCita { Nombre_Estatus = "Programada" },
                    new EstatusCita { Nombre_Estatus = "Confirmada" },
                    new EstatusCita { Nombre_Estatus = "Cancelada" },
                    new EstatusCita { Nombre_Estatus = "Completada" },
                    new EstatusCita { Nombre_Estatus = "No Asistió" }
                };

                context.EstatusCitas.AddRange(estatusCitas);
                context.SaveChanges();
            }

            // Seed Especialidades if empty
            if (!context.Especialidades.Any())
            {
                var especialidades = new List<Especialidad>
                {
                    new Especialidad { Nombre_Especialidad = "Medicina General", Descripcion = "Atención médica primaria y preventiva" },
                    new Especialidad { Nombre_Especialidad = "Cardiología", Descripcion = "Especialidad en problemas del corazón" },
                    new Especialidad { Nombre_Especialidad = "Pediatría", Descripcion = "Atención médica para niños" },
                    new Especialidad { Nombre_Especialidad = "Dermatología", Descripcion = "Especialidad en problemas de la piel" },
                    new Especialidad { Nombre_Especialidad = "Oftalmología", Descripcion = "Especialidad en problemas de los ojos" },
                    new Especialidad { Nombre_Especialidad = "Ginecología", Descripcion = "Atención médica para mujeres" }
                };

                context.Especialidades.AddRange(especialidades);
                context.SaveChanges();
            }

            // Seed Generos if empty
            if (!context.Generos.Any())
            {
                var generos = new List<Genero>
                {
                    new Genero { Genero_Nombre = "Masculino" },
                    new Genero { Genero_Nombre = "Femenino" },
                    new Genero { Genero_Nombre = "Otro" }
                };

                context.Generos.AddRange(generos);
                context.SaveChanges();
            }

            // Seed TipoSangre if empty
            if (!context.TiposSangre.Any())
            {
                var tiposSangre = new List<TipoSangre>
                {
                    new TipoSangre { Tipo_Sangre = "A+" },
                    new TipoSangre { Tipo_Sangre = "A-" },
                    new TipoSangre { Tipo_Sangre = "B+" },
                    new TipoSangre { Tipo_Sangre = "B-" },
                    new TipoSangre { Tipo_Sangre = "AB+" },
                    new TipoSangre { Tipo_Sangre = "AB-" },
                    new TipoSangre { Tipo_Sangre = "O+" },
                    new TipoSangre { Tipo_Sangre = "O-" }
                };

                context.TiposSangre.AddRange(tiposSangre);
                context.SaveChanges();
            }

            // Seed Alergias if empty
            if (!context.Alergias.Any())
            {
                var alergias = new List<Alergia>
                {
                    new Alergia { Nombre_Alergia = "Ninguna" },
                    new Alergia { Nombre_Alergia = "Penicilina" },
                    new Alergia { Nombre_Alergia = "Látex" },
                    new Alergia { Nombre_Alergia = "Polen" },
                    new Alergia { Nombre_Alergia = "Mariscos" },
                    new Alergia { Nombre_Alergia = "Lactosa" },
                    new Alergia { Nombre_Alergia = "Gluten" },
                    new Alergia { Nombre_Alergia = "Otras" }
                };

                context.Alergias.AddRange(alergias);
                context.SaveChanges();
            }

            // Seed Operaciones if empty
            if (!context.Operaciones.Any())
            {
                var operaciones = new List<Operacion>
                {
                    new Operacion { Nombre_Operacion = "Ninguna", Descripcion = "Sin operaciones previas" },
                    new Operacion { Nombre_Operacion = "Apendicitis", Descripcion = "Extracción de apéndice" },
                    new Operacion { Nombre_Operacion = "Cesárea", Descripcion = "Intervención para el parto" },
                    new Operacion { Nombre_Operacion = "Amigdalitis", Descripcion = "Extracción de amígdalas" },
                    new Operacion { Nombre_Operacion = "Otras", Descripcion = "Otras operaciones no listadas" }
                };

                context.Operaciones.AddRange(operaciones);
                context.SaveChanges();
            }

            // Seed Padecimientos if empty
            if (!context.Padecimientos.Any())
            {
                var padecimientos = new List<Padecimiento>
                {
                    new Padecimiento { Nombre_Padecimiento = "Ninguno" },
                    new Padecimiento { Nombre_Padecimiento = "Diabetes" },
                    new Padecimiento { Nombre_Padecimiento = "Hipertensión" },
                    new Padecimiento { Nombre_Padecimiento = "Asma" },
                    new Padecimiento { Nombre_Padecimiento = "Artritis" },
                    new Padecimiento { Nombre_Padecimiento = "Otros" }
                };

                context.Padecimientos.AddRange(padecimientos);
                context.SaveChanges();
            }

            // Seed Tablas if empty
            if (!context.Tablas.Any())
            {
                var tablas = new List<Tabla>
                {
                    new Tabla { Nombre_Tabla = "Usuarios" },
                    new Tabla { Nombre_Tabla = "Medicos" },
                    new Tabla { Nombre_Tabla = "Pacientes" },
                    new Tabla { Nombre_Tabla = "CitasMedicas" },
                    new Tabla { Nombre_Tabla = "Consultorios" }
                };

                context.Tablas.AddRange(tablas);
                context.SaveChanges();
            }

            // Seed TiposDeMovimientos if empty
            if (!context.TiposDeMovimientos.Any())
            {
                var tiposMovimientos = new List<TipoMovimiento>
                {
                    new TipoMovimiento { Descripcion_Movimiento = "Inserción" },
                    new TipoMovimiento { Descripcion_Movimiento = "Actualización" },
                    new TipoMovimiento { Descripcion_Movimiento = "Eliminación" }
                };

                context.TiposDeMovimientos.AddRange(tiposMovimientos);
                context.SaveChanges();
            }

            // Seed Admin User if no users exist
            if (!context.Usuarios.Any())
            {
                var adminUser = new Usuario
                {
                    Nombre_Usuario = "admin",
                    ContrasenaHash = "Admin123", // In a real app, this should be hashed
                    ID_Rol = 1, // Assuming 1 is Admin role                    Nombre = "Administrador",
                    Apellido_Paterno = "Sistema",
                    Apellido_Materno = "",
                    Correo = "admin@medsuite.com",
                    Telefono = "1234567890",
                    ID_Estatus = 1, // Assuming 1 is Active status
                    Fecha_Creacion = DateTime.Now
                };

                context.Usuarios.Add(adminUser);
                context.SaveChanges();
            }

            // Seed a sample consultorio if none exist
            if (!context.Consultorios.Any())
            {
                var consultorio = new Consultorio
                {
                    Nombre_Consultorio = "Consultorio 101",
                    ID_Estatus = 1 // Assuming 1 is Available status
                };

                context.Consultorios.Add(consultorio);
                context.SaveChanges();
            }
        }
    }
}
