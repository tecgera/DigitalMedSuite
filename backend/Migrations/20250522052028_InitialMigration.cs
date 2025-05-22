using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Alergias",
                columns: table => new
                {
                    ID_Alergias = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Alergia = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alergias", x => x.ID_Alergias);
                });

            migrationBuilder.CreateTable(
                name: "Especialidades",
                columns: table => new
                {
                    ID_Especialidad = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Especialidad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Especialidades", x => x.ID_Especialidad);
                });

            migrationBuilder.CreateTable(
                name: "Estatus_Citas",
                columns: table => new
                {
                    ID_Estatus = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Estatus = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estatus_Citas", x => x.ID_Estatus);
                });

            migrationBuilder.CreateTable(
                name: "Estatus_Consultorios",
                columns: table => new
                {
                    ID_Estatus = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Estatus = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estatus_Consultorios", x => x.ID_Estatus);
                });

            migrationBuilder.CreateTable(
                name: "Estatus_Medicos",
                columns: table => new
                {
                    ID_Estatus = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Estatus = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estatus_Medicos", x => x.ID_Estatus);
                });

            migrationBuilder.CreateTable(
                name: "Estatus_Pacientes",
                columns: table => new
                {
                    ID_Estatus = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Estatus = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estatus_Pacientes", x => x.ID_Estatus);
                });

            migrationBuilder.CreateTable(
                name: "Estatus_Usuarios",
                columns: table => new
                {
                    ID_Estatus = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Estatus = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estatus_Usuarios", x => x.ID_Estatus);
                });

            migrationBuilder.CreateTable(
                name: "Generos",
                columns: table => new
                {
                    ID_Generos = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Genero_Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Generos", x => x.ID_Generos);
                });

            migrationBuilder.CreateTable(
                name: "Operaciones",
                columns: table => new
                {
                    ID_Operaciones = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Operacion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Operaciones", x => x.ID_Operaciones);
                });

            migrationBuilder.CreateTable(
                name: "Padeciminetos",
                columns: table => new
                {
                    ID_Padecimientos = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Padecimiento = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Padeciminetos", x => x.ID_Padecimientos);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    ID_Rol = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Rol = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.ID_Rol);
                });

            migrationBuilder.CreateTable(
                name: "Tablas",
                columns: table => new
                {
                    ID_Tabla = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Tabla = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tablas", x => x.ID_Tabla);
                });

            migrationBuilder.CreateTable(
                name: "TipoSangre",
                columns: table => new
                {
                    ID_Tipo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tipo_Sangre = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoSangre", x => x.ID_Tipo);
                });

            migrationBuilder.CreateTable(
                name: "TiposDeMovimientos",
                columns: table => new
                {
                    ID_TipoDeMovimiento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descripcion_Movimiento = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposDeMovimientos", x => x.ID_TipoDeMovimiento);
                });

            migrationBuilder.CreateTable(
                name: "Consultorios",
                columns: table => new
                {
                    ID_Consultorio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Consultorio = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ID_Estatus = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consultorios", x => x.ID_Consultorio);
                    table.ForeignKey(
                        name: "FK_Consultorios_Estatus_Consultorios_ID_Estatus",
                        column: x => x.ID_Estatus,
                        principalTable: "Estatus_Consultorios",
                        principalColumn: "ID_Estatus");
                });

            migrationBuilder.CreateTable(
                name: "Medicos",
                columns: table => new
                {
                    ID_Medico = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Apellido_Paterno = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Apellido_Materno = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Correo = table.Column<string>(type: "nvarchar(35)", maxLength: 35, nullable: true),
                    Telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ID_Especialidad = table.Column<int>(type: "int", nullable: true),
                    Estado = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Fecha_Creacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ID_Estatus = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medicos", x => x.ID_Medico);
                    table.ForeignKey(
                        name: "FK_Medicos_Especialidades_ID_Especialidad",
                        column: x => x.ID_Especialidad,
                        principalTable: "Especialidades",
                        principalColumn: "ID_Especialidad");
                    table.ForeignKey(
                        name: "FK_Medicos_Estatus_Medicos_ID_Estatus",
                        column: x => x.ID_Estatus,
                        principalTable: "Estatus_Medicos",
                        principalColumn: "ID_Estatus");
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    ID_Usuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Usuario = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ContrasenaHash = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    ID_Rol = table.Column<int>(type: "int", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Apellido_Paterno = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Apellido_Materno = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Correo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ID_Estatus = table.Column<int>(type: "int", nullable: true),
                    Fecha_Creacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.ID_Usuario);
                    table.ForeignKey(
                        name: "FK_Usuarios_Estatus_Usuarios_ID_Estatus",
                        column: x => x.ID_Estatus,
                        principalTable: "Estatus_Usuarios",
                        principalColumn: "ID_Estatus");
                    table.ForeignKey(
                        name: "FK_Usuarios_Roles_ID_Rol",
                        column: x => x.ID_Rol,
                        principalTable: "Roles",
                        principalColumn: "ID_Rol",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pacientes",
                columns: table => new
                {
                    ID_Paciente = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Apellido_Paterno = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Apellido_Materno = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Fecha_Nacimiento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Calle = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Codigo_Postal = table.Column<int>(type: "int", nullable: true),
                    Num_Calle = table.Column<int>(type: "int", nullable: true),
                    Correo_Electronico = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Telefono = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Altura = table.Column<float>(type: "real", nullable: true),
                    Peso = table.Column<float>(type: "real", nullable: true),
                    ID_Tipo = table.Column<int>(type: "int", nullable: true),
                    ID_Alergias = table.Column<int>(type: "int", nullable: true),
                    ID_Operaciones = table.Column<int>(type: "int", nullable: true),
                    ID_Padecimientos = table.Column<int>(type: "int", nullable: true),
                    ID_Genero = table.Column<int>(type: "int", nullable: true),
                    Fecha_Registro = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ID_Estatus = table.Column<int>(type: "int", nullable: true),
                    CURP = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pacientes", x => x.ID_Paciente);
                    table.ForeignKey(
                        name: "FK_Pacientes_Alergias_ID_Alergias",
                        column: x => x.ID_Alergias,
                        principalTable: "Alergias",
                        principalColumn: "ID_Alergias");
                    table.ForeignKey(
                        name: "FK_Pacientes_Estatus_Pacientes_ID_Estatus",
                        column: x => x.ID_Estatus,
                        principalTable: "Estatus_Pacientes",
                        principalColumn: "ID_Estatus");
                    table.ForeignKey(
                        name: "FK_Pacientes_Generos_ID_Genero",
                        column: x => x.ID_Genero,
                        principalTable: "Generos",
                        principalColumn: "ID_Generos");
                    table.ForeignKey(
                        name: "FK_Pacientes_Operaciones_ID_Operaciones",
                        column: x => x.ID_Operaciones,
                        principalTable: "Operaciones",
                        principalColumn: "ID_Operaciones");
                    table.ForeignKey(
                        name: "FK_Pacientes_Padeciminetos_ID_Padecimientos",
                        column: x => x.ID_Padecimientos,
                        principalTable: "Padeciminetos",
                        principalColumn: "ID_Padecimientos");
                    table.ForeignKey(
                        name: "FK_Pacientes_TipoSangre_ID_Tipo",
                        column: x => x.ID_Tipo,
                        principalTable: "TipoSangre",
                        principalColumn: "ID_Tipo");
                });

            migrationBuilder.CreateTable(
                name: "Bitacora",
                columns: table => new
                {
                    ID_Bitacora = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ID_Tabla = table.Column<int>(type: "int", nullable: true),
                    ID_Registro = table.Column<int>(type: "int", nullable: true),
                    ID_TipoDeMovimiento = table.Column<int>(type: "int", nullable: true),
                    Usuario = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Fecha_Modificacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bitacora", x => x.ID_Bitacora);
                    table.ForeignKey(
                        name: "FK_Bitacora_Tablas_ID_Tabla",
                        column: x => x.ID_Tabla,
                        principalTable: "Tablas",
                        principalColumn: "ID_Tabla");
                    table.ForeignKey(
                        name: "FK_Bitacora_TiposDeMovimientos_ID_TipoDeMovimiento",
                        column: x => x.ID_TipoDeMovimiento,
                        principalTable: "TiposDeMovimientos",
                        principalColumn: "ID_TipoDeMovimiento");
                });

            migrationBuilder.CreateTable(
                name: "CitasMedicas",
                columns: table => new
                {
                    ID_Cita = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ID_Paciente = table.Column<int>(type: "int", nullable: false),
                    ID_Medico = table.Column<int>(type: "int", nullable: false),
                    Fecha_Cita = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Hora_Cita = table.Column<TimeSpan>(type: "time", nullable: false),
                    ID_Consultorio = table.Column<int>(type: "int", nullable: false),
                    ID_Estatus = table.Column<int>(type: "int", nullable: true),
                    Fecha_Creacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Ultima_Actualizacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CitasMedicas", x => x.ID_Cita);
                    table.ForeignKey(
                        name: "FK_CitasMedicas_Consultorios_ID_Consultorio",
                        column: x => x.ID_Consultorio,
                        principalTable: "Consultorios",
                        principalColumn: "ID_Consultorio",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CitasMedicas_Estatus_Citas_ID_Estatus",
                        column: x => x.ID_Estatus,
                        principalTable: "Estatus_Citas",
                        principalColumn: "ID_Estatus");
                    table.ForeignKey(
                        name: "FK_CitasMedicas_Medicos_ID_Medico",
                        column: x => x.ID_Medico,
                        principalTable: "Medicos",
                        principalColumn: "ID_Medico",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CitasMedicas_Pacientes_ID_Paciente",
                        column: x => x.ID_Paciente,
                        principalTable: "Pacientes",
                        principalColumn: "ID_Paciente",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bitacora_ID_Tabla",
                table: "Bitacora",
                column: "ID_Tabla");

            migrationBuilder.CreateIndex(
                name: "IX_Bitacora_ID_TipoDeMovimiento",
                table: "Bitacora",
                column: "ID_TipoDeMovimiento");

            migrationBuilder.CreateIndex(
                name: "IX_CitasMedicas_ID_Consultorio",
                table: "CitasMedicas",
                column: "ID_Consultorio");

            migrationBuilder.CreateIndex(
                name: "IX_CitasMedicas_ID_Estatus",
                table: "CitasMedicas",
                column: "ID_Estatus");

            migrationBuilder.CreateIndex(
                name: "IX_CitasMedicas_ID_Medico",
                table: "CitasMedicas",
                column: "ID_Medico");

            migrationBuilder.CreateIndex(
                name: "IX_CitasMedicas_ID_Paciente",
                table: "CitasMedicas",
                column: "ID_Paciente");

            migrationBuilder.CreateIndex(
                name: "IX_Consultorios_ID_Estatus",
                table: "Consultorios",
                column: "ID_Estatus");

            migrationBuilder.CreateIndex(
                name: "IX_Medicos_ID_Especialidad",
                table: "Medicos",
                column: "ID_Especialidad");

            migrationBuilder.CreateIndex(
                name: "IX_Medicos_ID_Estatus",
                table: "Medicos",
                column: "ID_Estatus");

            migrationBuilder.CreateIndex(
                name: "IX_Pacientes_ID_Alergias",
                table: "Pacientes",
                column: "ID_Alergias");

            migrationBuilder.CreateIndex(
                name: "IX_Pacientes_ID_Estatus",
                table: "Pacientes",
                column: "ID_Estatus");

            migrationBuilder.CreateIndex(
                name: "IX_Pacientes_ID_Genero",
                table: "Pacientes",
                column: "ID_Genero");

            migrationBuilder.CreateIndex(
                name: "IX_Pacientes_ID_Operaciones",
                table: "Pacientes",
                column: "ID_Operaciones");

            migrationBuilder.CreateIndex(
                name: "IX_Pacientes_ID_Padecimientos",
                table: "Pacientes",
                column: "ID_Padecimientos");

            migrationBuilder.CreateIndex(
                name: "IX_Pacientes_ID_Tipo",
                table: "Pacientes",
                column: "ID_Tipo");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_ID_Estatus",
                table: "Usuarios",
                column: "ID_Estatus");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_ID_Rol",
                table: "Usuarios",
                column: "ID_Rol");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bitacora");

            migrationBuilder.DropTable(
                name: "CitasMedicas");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Tablas");

            migrationBuilder.DropTable(
                name: "TiposDeMovimientos");

            migrationBuilder.DropTable(
                name: "Consultorios");

            migrationBuilder.DropTable(
                name: "Estatus_Citas");

            migrationBuilder.DropTable(
                name: "Medicos");

            migrationBuilder.DropTable(
                name: "Pacientes");

            migrationBuilder.DropTable(
                name: "Estatus_Usuarios");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Estatus_Consultorios");

            migrationBuilder.DropTable(
                name: "Especialidades");

            migrationBuilder.DropTable(
                name: "Estatus_Medicos");

            migrationBuilder.DropTable(
                name: "Alergias");

            migrationBuilder.DropTable(
                name: "Estatus_Pacientes");

            migrationBuilder.DropTable(
                name: "Generos");

            migrationBuilder.DropTable(
                name: "Operaciones");

            migrationBuilder.DropTable(
                name: "Padeciminetos");

            migrationBuilder.DropTable(
                name: "TipoSangre");
        }
    }
}
