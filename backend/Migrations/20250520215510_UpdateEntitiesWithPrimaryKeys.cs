using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEntitiesWithPrimaryKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Medicos_MedicoId",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Pacientes_PacienteId",
                table: "Citas");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_Username",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Pacientes_Email",
                table: "Pacientes");

            migrationBuilder.DropIndex(
                name: "IX_Medicos_Email",
                table: "Medicos");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "MedicoId",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "UltimoAcceso",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Username",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Apellidos",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "Direccion",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "FechaNacimiento",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "HistoriaMedica",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "Apellidos",
                table: "Medicos");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Medicos");

            migrationBuilder.DropColumn(
                name: "Especialidad",
                table: "Medicos");

            migrationBuilder.DropColumn(
                name: "HorarioDisponible",
                table: "Medicos");

            migrationBuilder.DropColumn(
                name: "NumeroLicencia",
                table: "Medicos");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "Motivo",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "Notas",
                table: "Citas");

            migrationBuilder.RenameColumn(
                name: "Rol",
                table: "Usuarios",
                newName: "Nombre_Usuario");

            migrationBuilder.RenameColumn(
                name: "PacienteId",
                table: "Usuarios",
                newName: "ID_Estatus");

            migrationBuilder.RenameColumn(
                name: "FechaCreacion",
                table: "Usuarios",
                newName: "Fecha_Creacion");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Usuarios",
                newName: "ID_Usuario");

            migrationBuilder.RenameColumn(
                name: "FechaRegistro",
                table: "Pacientes",
                newName: "Fecha_Registro");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Pacientes",
                newName: "ID_Paciente");

            migrationBuilder.RenameColumn(
                name: "FechaRegistro",
                table: "Medicos",
                newName: "Fecha_Creacion");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Medicos",
                newName: "ID_Medico");

            migrationBuilder.RenameColumn(
                name: "PacienteId",
                table: "Citas",
                newName: "ID_Paciente");

            migrationBuilder.RenameColumn(
                name: "MedicoId",
                table: "Citas",
                newName: "ID_Medico");

            migrationBuilder.RenameColumn(
                name: "FechaRegistro",
                table: "Citas",
                newName: "Ultima_Actualizacion");

            migrationBuilder.RenameColumn(
                name: "FechaHora",
                table: "Citas",
                newName: "Fecha_Creacion");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Citas",
                newName: "ID_Cita");

            migrationBuilder.RenameIndex(
                name: "IX_Citas_PacienteId",
                table: "Citas",
                newName: "IX_Citas_ID_Paciente");

            migrationBuilder.RenameIndex(
                name: "IX_Citas_MedicoId",
                table: "Citas",
                newName: "IX_Citas_ID_Medico");

            migrationBuilder.AddColumn<string>(
                name: "Apellido_Materno",
                table: "Usuarios",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Apellido_Paterno",
                table: "Usuarios",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContrasenaHash",
                table: "Usuarios",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Correo",
                table: "Usuarios",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ID_Rol",
                table: "Usuarios",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Nombre",
                table: "Usuarios",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Telefono",
                table: "Usuarios",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Telefono",
                table: "Pacientes",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(15)",
                oldMaxLength: 15);

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Pacientes",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<float>(
                name: "Altura",
                table: "Pacientes",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Apellido_Materno",
                table: "Pacientes",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Apellido_Paterno",
                table: "Pacientes",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CURP",
                table: "Pacientes",
                type: "nvarchar(15)",
                maxLength: 15,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Calle",
                table: "Pacientes",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Codigo_Postal",
                table: "Pacientes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Correo_Electronico",
                table: "Pacientes",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Fecha_Nacimiento",
                table: "Pacientes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ID_Alergias",
                table: "Pacientes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ID_Estatus",
                table: "Pacientes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ID_Genero",
                table: "Pacientes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ID_Operaciones",
                table: "Pacientes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ID_Padecimientos",
                table: "Pacientes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ID_Tipo",
                table: "Pacientes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Num_Calle",
                table: "Pacientes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "Peso",
                table: "Pacientes",
                type: "real",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Telefono",
                table: "Medicos",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(15)",
                oldMaxLength: 15);

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Medicos",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "Apellido_Materno",
                table: "Medicos",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Apellido_Paterno",
                table: "Medicos",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Correo",
                table: "Medicos",
                type: "nvarchar(35)",
                maxLength: 35,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "Medicos",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EstatusMedicoID_Estatus",
                table: "Medicos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ID_Especialidad",
                table: "Medicos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ID_Estatus",
                table: "Medicos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EstatusCitaID_Estatus",
                table: "Citas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Fecha_Cita",
                table: "Citas",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "Hora_Cita",
                table: "Citas",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<int>(
                name: "ID_Consultorio",
                table: "Citas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ID_Estatus",
                table: "Citas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Alergias",
                columns: table => new
                {
                    ID_Alergias = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Alergia = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Fecha_Registro = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                    Nombre_Especialidad = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Especialidades", x => x.ID_Especialidad);
                });

            migrationBuilder.CreateTable(
                name: "EstatusCitas",
                columns: table => new
                {
                    ID_Estatus = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Estatus = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstatusCitas", x => x.ID_Estatus);
                });

            migrationBuilder.CreateTable(
                name: "EstatusConsultorios",
                columns: table => new
                {
                    ID_Estatus = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Estatus = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstatusConsultorios", x => x.ID_Estatus);
                });

            migrationBuilder.CreateTable(
                name: "EstatusMedicos",
                columns: table => new
                {
                    ID_Estatus = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Estatus = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstatusMedicos", x => x.ID_Estatus);
                });

            migrationBuilder.CreateTable(
                name: "EstatusPacientes",
                columns: table => new
                {
                    ID_Estatus = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Estatus = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstatusPacientes", x => x.ID_Estatus);
                });

            migrationBuilder.CreateTable(
                name: "EstatusUsuarios",
                columns: table => new
                {
                    ID_Estatus = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Estatus = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstatusUsuarios", x => x.ID_Estatus);
                });

            migrationBuilder.CreateTable(
                name: "Generos",
                columns: table => new
                {
                    ID_Generos = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Genero_Nombre = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
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
                    Nombre_Operacion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Fecha_Operacion = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Operaciones", x => x.ID_Operaciones);
                });

            migrationBuilder.CreateTable(
                name: "Padecimientos",
                columns: table => new
                {
                    ID_Padecimientos = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Padecimiento = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Fecha_Diagnostico = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Padecimientos", x => x.ID_Padecimientos);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    ID_Rol = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Rol = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.ID_Rol);
                });

            migrationBuilder.CreateTable(
                name: "TiposSangre",
                columns: table => new
                {
                    ID_Tipo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tipo_Sangre = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    Factor_RH = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposSangre", x => x.ID_Tipo);
                });

            migrationBuilder.CreateTable(
                name: "Consultorios",
                columns: table => new
                {
                    ID_Consultorio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre_Consultorio = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ID_Estatus = table.Column<int>(type: "int", nullable: false),
                    Fecha_Registro = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consultorios", x => x.ID_Consultorio);
                    table.ForeignKey(
                        name: "FK_Consultorios_EstatusConsultorios_ID_Estatus",
                        column: x => x.ID_Estatus,
                        principalTable: "EstatusConsultorios",
                        principalColumn: "ID_Estatus",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Correo",
                table: "Usuarios",
                column: "Correo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_ID_Estatus",
                table: "Usuarios",
                column: "ID_Estatus");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_ID_Rol",
                table: "Usuarios",
                column: "ID_Rol");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Nombre_Usuario",
                table: "Usuarios",
                column: "Nombre_Usuario",
                unique: true);

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
                name: "IX_Medicos_EstatusMedicoID_Estatus",
                table: "Medicos",
                column: "EstatusMedicoID_Estatus");

            migrationBuilder.CreateIndex(
                name: "IX_Medicos_ID_Especialidad",
                table: "Medicos",
                column: "ID_Especialidad");

            migrationBuilder.CreateIndex(
                name: "IX_Medicos_ID_Estatus",
                table: "Medicos",
                column: "ID_Estatus");

            migrationBuilder.CreateIndex(
                name: "IX_Citas_EstatusCitaID_Estatus",
                table: "Citas",
                column: "EstatusCitaID_Estatus");

            migrationBuilder.CreateIndex(
                name: "IX_Citas_ID_Consultorio",
                table: "Citas",
                column: "ID_Consultorio");

            migrationBuilder.CreateIndex(
                name: "IX_Citas_ID_Estatus",
                table: "Citas",
                column: "ID_Estatus");

            migrationBuilder.CreateIndex(
                name: "IX_Consultorios_ID_Estatus",
                table: "Consultorios",
                column: "ID_Estatus");

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Consultorios_ID_Consultorio",
                table: "Citas",
                column: "ID_Consultorio",
                principalTable: "Consultorios",
                principalColumn: "ID_Consultorio",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_EstatusCitas_EstatusCitaID_Estatus",
                table: "Citas",
                column: "EstatusCitaID_Estatus",
                principalTable: "EstatusCitas",
                principalColumn: "ID_Estatus");

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_EstatusCitas_ID_Estatus",
                table: "Citas",
                column: "ID_Estatus",
                principalTable: "EstatusCitas",
                principalColumn: "ID_Estatus",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Medicos_ID_Medico",
                table: "Citas",
                column: "ID_Medico",
                principalTable: "Medicos",
                principalColumn: "ID_Medico",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Pacientes_ID_Paciente",
                table: "Citas",
                column: "ID_Paciente",
                principalTable: "Pacientes",
                principalColumn: "ID_Paciente",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Medicos_Especialidades_ID_Especialidad",
                table: "Medicos",
                column: "ID_Especialidad",
                principalTable: "Especialidades",
                principalColumn: "ID_Especialidad",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Medicos_EstatusMedicos_EstatusMedicoID_Estatus",
                table: "Medicos",
                column: "EstatusMedicoID_Estatus",
                principalTable: "EstatusMedicos",
                principalColumn: "ID_Estatus");

            migrationBuilder.AddForeignKey(
                name: "FK_Medicos_EstatusMedicos_ID_Estatus",
                table: "Medicos",
                column: "ID_Estatus",
                principalTable: "EstatusMedicos",
                principalColumn: "ID_Estatus",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pacientes_Alergias_ID_Alergias",
                table: "Pacientes",
                column: "ID_Alergias",
                principalTable: "Alergias",
                principalColumn: "ID_Alergias",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pacientes_EstatusPacientes_ID_Estatus",
                table: "Pacientes",
                column: "ID_Estatus",
                principalTable: "EstatusPacientes",
                principalColumn: "ID_Estatus",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pacientes_Generos_ID_Genero",
                table: "Pacientes",
                column: "ID_Genero",
                principalTable: "Generos",
                principalColumn: "ID_Generos",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pacientes_Operaciones_ID_Operaciones",
                table: "Pacientes",
                column: "ID_Operaciones",
                principalTable: "Operaciones",
                principalColumn: "ID_Operaciones",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pacientes_Padecimientos_ID_Padecimientos",
                table: "Pacientes",
                column: "ID_Padecimientos",
                principalTable: "Padecimientos",
                principalColumn: "ID_Padecimientos",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pacientes_TiposSangre_ID_Tipo",
                table: "Pacientes",
                column: "ID_Tipo",
                principalTable: "TiposSangre",
                principalColumn: "ID_Tipo",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_EstatusUsuarios_ID_Estatus",
                table: "Usuarios",
                column: "ID_Estatus",
                principalTable: "EstatusUsuarios",
                principalColumn: "ID_Estatus",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Roles_ID_Rol",
                table: "Usuarios",
                column: "ID_Rol",
                principalTable: "Roles",
                principalColumn: "ID_Rol",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Consultorios_ID_Consultorio",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Citas_EstatusCitas_EstatusCitaID_Estatus",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Citas_EstatusCitas_ID_Estatus",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Medicos_ID_Medico",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Citas_Pacientes_ID_Paciente",
                table: "Citas");

            migrationBuilder.DropForeignKey(
                name: "FK_Medicos_Especialidades_ID_Especialidad",
                table: "Medicos");

            migrationBuilder.DropForeignKey(
                name: "FK_Medicos_EstatusMedicos_EstatusMedicoID_Estatus",
                table: "Medicos");

            migrationBuilder.DropForeignKey(
                name: "FK_Medicos_EstatusMedicos_ID_Estatus",
                table: "Medicos");

            migrationBuilder.DropForeignKey(
                name: "FK_Pacientes_Alergias_ID_Alergias",
                table: "Pacientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Pacientes_EstatusPacientes_ID_Estatus",
                table: "Pacientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Pacientes_Generos_ID_Genero",
                table: "Pacientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Pacientes_Operaciones_ID_Operaciones",
                table: "Pacientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Pacientes_Padecimientos_ID_Padecimientos",
                table: "Pacientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Pacientes_TiposSangre_ID_Tipo",
                table: "Pacientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_EstatusUsuarios_ID_Estatus",
                table: "Usuarios");

            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Roles_ID_Rol",
                table: "Usuarios");

            migrationBuilder.DropTable(
                name: "Alergias");

            migrationBuilder.DropTable(
                name: "Consultorios");

            migrationBuilder.DropTable(
                name: "Especialidades");

            migrationBuilder.DropTable(
                name: "EstatusCitas");

            migrationBuilder.DropTable(
                name: "EstatusMedicos");

            migrationBuilder.DropTable(
                name: "EstatusPacientes");

            migrationBuilder.DropTable(
                name: "EstatusUsuarios");

            migrationBuilder.DropTable(
                name: "Generos");

            migrationBuilder.DropTable(
                name: "Operaciones");

            migrationBuilder.DropTable(
                name: "Padecimientos");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "TiposSangre");

            migrationBuilder.DropTable(
                name: "EstatusConsultorios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_Correo",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_ID_Estatus",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_ID_Rol",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_Nombre_Usuario",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Pacientes_ID_Alergias",
                table: "Pacientes");

            migrationBuilder.DropIndex(
                name: "IX_Pacientes_ID_Estatus",
                table: "Pacientes");

            migrationBuilder.DropIndex(
                name: "IX_Pacientes_ID_Genero",
                table: "Pacientes");

            migrationBuilder.DropIndex(
                name: "IX_Pacientes_ID_Operaciones",
                table: "Pacientes");

            migrationBuilder.DropIndex(
                name: "IX_Pacientes_ID_Padecimientos",
                table: "Pacientes");

            migrationBuilder.DropIndex(
                name: "IX_Pacientes_ID_Tipo",
                table: "Pacientes");

            migrationBuilder.DropIndex(
                name: "IX_Medicos_EstatusMedicoID_Estatus",
                table: "Medicos");

            migrationBuilder.DropIndex(
                name: "IX_Medicos_ID_Especialidad",
                table: "Medicos");

            migrationBuilder.DropIndex(
                name: "IX_Medicos_ID_Estatus",
                table: "Medicos");

            migrationBuilder.DropIndex(
                name: "IX_Citas_EstatusCitaID_Estatus",
                table: "Citas");

            migrationBuilder.DropIndex(
                name: "IX_Citas_ID_Consultorio",
                table: "Citas");

            migrationBuilder.DropIndex(
                name: "IX_Citas_ID_Estatus",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "Apellido_Materno",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Apellido_Paterno",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "ContrasenaHash",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Correo",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "ID_Rol",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Nombre",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Telefono",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Altura",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "Apellido_Materno",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "Apellido_Paterno",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "CURP",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "Calle",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "Codigo_Postal",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "Correo_Electronico",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "Fecha_Nacimiento",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "ID_Alergias",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "ID_Estatus",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "ID_Genero",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "ID_Operaciones",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "ID_Padecimientos",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "ID_Tipo",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "Num_Calle",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "Peso",
                table: "Pacientes");

            migrationBuilder.DropColumn(
                name: "Apellido_Materno",
                table: "Medicos");

            migrationBuilder.DropColumn(
                name: "Apellido_Paterno",
                table: "Medicos");

            migrationBuilder.DropColumn(
                name: "Correo",
                table: "Medicos");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "Medicos");

            migrationBuilder.DropColumn(
                name: "EstatusMedicoID_Estatus",
                table: "Medicos");

            migrationBuilder.DropColumn(
                name: "ID_Especialidad",
                table: "Medicos");

            migrationBuilder.DropColumn(
                name: "ID_Estatus",
                table: "Medicos");

            migrationBuilder.DropColumn(
                name: "EstatusCitaID_Estatus",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "Fecha_Cita",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "Hora_Cita",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "ID_Consultorio",
                table: "Citas");

            migrationBuilder.DropColumn(
                name: "ID_Estatus",
                table: "Citas");

            migrationBuilder.RenameColumn(
                name: "Nombre_Usuario",
                table: "Usuarios",
                newName: "Rol");

            migrationBuilder.RenameColumn(
                name: "ID_Estatus",
                table: "Usuarios",
                newName: "PacienteId");

            migrationBuilder.RenameColumn(
                name: "Fecha_Creacion",
                table: "Usuarios",
                newName: "FechaCreacion");

            migrationBuilder.RenameColumn(
                name: "ID_Usuario",
                table: "Usuarios",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "Fecha_Registro",
                table: "Pacientes",
                newName: "FechaRegistro");

            migrationBuilder.RenameColumn(
                name: "ID_Paciente",
                table: "Pacientes",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "Fecha_Creacion",
                table: "Medicos",
                newName: "FechaRegistro");

            migrationBuilder.RenameColumn(
                name: "ID_Medico",
                table: "Medicos",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "Ultima_Actualizacion",
                table: "Citas",
                newName: "FechaRegistro");

            migrationBuilder.RenameColumn(
                name: "ID_Paciente",
                table: "Citas",
                newName: "PacienteId");

            migrationBuilder.RenameColumn(
                name: "ID_Medico",
                table: "Citas",
                newName: "MedicoId");

            migrationBuilder.RenameColumn(
                name: "Fecha_Creacion",
                table: "Citas",
                newName: "FechaHora");

            migrationBuilder.RenameColumn(
                name: "ID_Cita",
                table: "Citas",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Citas_ID_Paciente",
                table: "Citas",
                newName: "IX_Citas_PacienteId");

            migrationBuilder.RenameIndex(
                name: "IX_Citas_ID_Medico",
                table: "Citas",
                newName: "IX_Citas_MedicoId");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Usuarios",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MedicoId",
                table: "Usuarios",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Usuarios",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UltimoAcceso",
                table: "Usuarios",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Usuarios",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Telefono",
                table: "Pacientes",
                type: "nvarchar(15)",
                maxLength: 15,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Pacientes",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Apellidos",
                table: "Pacientes",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Direccion",
                table: "Pacientes",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Pacientes",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaNacimiento",
                table: "Pacientes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "HistoriaMedica",
                table: "Pacientes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Telefono",
                table: "Medicos",
                type: "nvarchar(15)",
                maxLength: 15,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Medicos",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Apellidos",
                table: "Medicos",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Medicos",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Especialidad",
                table: "Medicos",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HorarioDisponible",
                table: "Medicos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NumeroLicencia",
                table: "Medicos",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "Citas",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Motivo",
                table: "Citas",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Notas",
                table: "Citas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Username",
                table: "Usuarios",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Pacientes_Email",
                table: "Pacientes",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Medicos_Email",
                table: "Medicos",
                column: "Email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Medicos_MedicoId",
                table: "Citas",
                column: "MedicoId",
                principalTable: "Medicos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Citas_Pacientes_PacienteId",
                table: "Citas",
                column: "PacienteId",
                principalTable: "Pacientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
