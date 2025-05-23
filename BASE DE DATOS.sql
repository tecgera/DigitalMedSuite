
CREATE DATABASE DigitalMedSuite;
GO

USE DigitalMedSuite;
GO

-- Creacion del login para los usuarios
CREATE LOGIN AdminDigitalMedSuite
WITH PASSWORD = '12345678'
USE DigitalMedSuite
--Creacion del rol y asignacion de permisos
CREATE ROLE Administrador

GRANT CONTROL ON DATABASE::DigitalMedSuite TO Administrador

-- Tabla de Roles
CREATE TABLE Roles (
    ID_Rol INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Rol VARCHAR(20) NOT NULL
);

INSERT INTO Roles(Nombre_Rol) VALUES ('Administrador')

-- Tabla de estatus de los usuarios
CREATE TABLE Estatus_Usuarios(
	ID_Estatus INT PRIMARY KEY IDENTITY(1,1),
	Nombre_Estatus VARCHAR(15)
)

INSERT INTO Estatus_Usuarios(Nombre_Estatus) VALUES 
('Activo'),
('Inactivo'),
('Despedido')

-- Tabla de Usuarios
CREATE TABLE Usuarios (
    ID_Usuario INT PRIMARY KEY  ,
    Nombre_Usuario VARCHAR(20) NOT NULL,
    ContrasenaHash VARCHAR(30) NOT NULL,
    ID_Rol INT NOT NULL,
    Nombre VARCHAR(20),
    Apellido_Paterno VARCHAR(20),
	Apellido_Materno VARCHAR(20),
    Correo VARCHAR(20),
    Telefono VARCHAR(20),
	ID_Estatus INT,
    Fecha_Creacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ID_Rol) REFERENCES Roles(ID_Rol),
	FOREIGN KEY (ID_Estatus) REFERENCES Estatus_Usuarios(ID_Estatus)
);

-- Tabla de Especialidades
CREATE TABLE Especialidades (
    ID_Especialidad INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Especialidad VARCHAR(50) NOT NULL,
    Descripcion TEXT
);

INSERT INTO Especialidades (Nombre_Especialidad, Descripcion) VALUES
('Cardiología', 'Rama de la medicina que se encarga del estudio, diagnóstico y tratamiento de las enfermedades del corazón y del sistema circulatorio.'),
('Pediatría', 'Especialidad médica dedicada a la atención de bebés, niños y adolescentes, incluyendo el seguimiento del desarrollo físico y emocional.');

-- Tabla de estatus de los doctores
CREATE TABLE Estatus_Medicos(
	ID_Estatus INT PRIMARY KEY IDENTITY(1,1),
	Nombre_Estatus VARCHAR(15)
)

INSERT INTO Estatus_Medicos(Nombre_Estatus) VALUES 
('Activo'),
('Inactivo'),
('Despedido')

-- Tabla de Doctores
CREATE TABLE Medicos (
    ID_Medico INT PRIMARY KEY ,
    Nombre VARCHAR(20),
    Apellido_Paterno VARCHAR(20),
    Apellido_Materno VARCHAR(20),
    Correo VARCHAR(35),
    Telefono VARCHAR(20),
    ID_Especialidad INT,
    Estado VARCHAR(20),
    Fecha_Creacion DATETIME DEFAULT GETDATE(),
	ID_Estatus INT,
	FOREIGN KEY (ID_Estatus) REFERENCES Estatus_Medicos(ID_Estatus),
    FOREIGN KEY (ID_Especialidad) REFERENCES Especialidades(ID_Especialidad)
);

--Tabla Alergias
CREATE TABLE Alergias (
    ID_Alergias INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Alergia VARCHAR(20) NOT NULL
);

INSERT INTO Alergias (Nombre_Alergia) VALUES
('Polen'),
('Ácaros del polvo'),
('Lácteos'),
('Gluten'),
('Penicilina'),
('Picaduras de abeja'),
('Frutos secos'),
('Mariscos'),
('Látex'),
('Pelo de gato');

--Tabla Operaciones
CREATE TABLE Operaciones (
    ID_Operaciones INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Operacion VARCHAR(20) NOT NULL,
	Descripcion varchar(70)
);

INSERT INTO Operaciones (Nombre_Operacion, Descripcion) VALUES
('Apendicectomía', 'Extirpación quirúrgica del apéndice.'),
('Cesárea', 'Intervención para extraer al bebé mediante una incisión en el abdomen.'),
('Colecistectomía', 'Extracción de la vesícula biliar.'),
('Herniorrafia', 'Reparación quirúrgica de una hernia.'),
('Angioplastia', 'Procedimiento para desobstruir arterias coronarias.'),
('Amigdalectomía', 'Extracción de las amígdalas.'),
('Bypass gástrico', 'Cirugía para tratar la obesidad mediante reducción estomacal.'),
('Craneotomía', 'Apertura quirúrgica del cráneo para acceder al cerebro.'),
('Laparoscopía', 'Cirugía mínimamente invasiva del abdomen.'),
('Artroscopía', 'Intervención dentro de una articulación usando una cámara.');

--Tabla Padecimientos
CREATE TABLE Padeciminetos (
    ID_Padecimientos INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Padecimiento VARCHAR(20) NOT NULL
);

INSERT INTO Padeciminetos (Nombre_Padecimiento) VALUES
('Diabetes'),
('Hipertensión'),
('Asma'),
('Artritis'),
('Epilepsia'),
('Migraña'),
('Gastritis'),
('Anemia'),
('Bronquitis'),
('Colesterol alto');

--Tabla Generos
CREATE TABLE Generos(
    ID_Generos INT PRIMARY KEY IDENTITY(1,1),
    Genero VARCHAR(20) NOT NULL
);

INSERT INTO Generos(Genero) VALUES
('Hombre'),
('Mujer'),
('No especificado') 

--Tabla Tipo Sangre
CREATE TABLE TipoSangre (
    ID_Tipo INT PRIMARY KEY IDENTITY(1,1),
    Tipo_Sangre VARCHAR(3) NOT NULL
);

INSERT INTO TipoSangre(Tipo_Sangre) VALUES
('A+'),
('A-'),
('B+'),
('B-'),
('AB+'),
('AB-'),
('O+'),
('O-')

-- Tabla de los estatus para los pacientes
CREATE TABLE Estatus_Pacientes(
	ID_Estatus INT PRIMARY KEY IDENTITY(1,1),
	Nombre_Estatus VARCHAR(15)
)

INSERT INTO Estatus_Pacientes(Nombre_Estatus) VALUES
('Activo'),
('Inactivo'),
('Baja')

-- Tabla de Pacientes
CREATE TABLE Pacientes (
    ID_Paciente INT PRIMARY KEY,
    Nombre VARCHAR(20),
    Apellido_Paterno VARCHAR(20),
    Apellido_Materno VARCHAR(20),
    Fecha_Nacimiento DATE,
	--Datos de direccion
	Calle VARCHAR(30),
	Codigo_Postal INT,
	Num_Calle INT,
	--Datos de contacto
	Correo_Electronico VARCHAR(50),
    Telefono VARCHAR(20),
	--Datos medicos
    Altura FLOAT,
    Peso FLOAT,
    ID_Tipo int,
    ID_Alergias INT ,
    ID_Operaciones INT ,
	ID_Padecimientos INT ,
	ID_Genero INT ,
	--Varios
    Fecha_Registro DATETIME DEFAULT GETDATE(),
	ID_Estatus INT,
	CURP varchar(15),

	foreign key (ID_Alergias) references Alergias(ID_Alergias),
	foreign key (ID_Operaciones) references Operaciones(ID_Operaciones),
	foreign key (ID_Padecimientos) references Padeciminetos(ID_Padecimientos),
	foreign key (ID_Genero) references Generos(ID_Generos),
	foreign key (ID_Tipo) references TipoSangre(ID_Tipo),
	FOREIGN KEY (ID_Estatus) REFERENCES Estatus_Pacientes(ID_Estatus)
);

--Tabla de estatus de los consultorios
CREATE TABLE Estatus_Consultorios(
	ID_Estatus INT PRIMARY KEY IDENTITY(1,1),
	Nombre_Estatus VARCHAR(15)
)

INSERT INTO Estatus_Consultorios(Nombre_Estatus) VALUES
('Funcionamiento'),
('Mantenimiento'),
('Clausurado')

-- Tabla de Consultorios
CREATE TABLE Consultorios (
    ID_Consultorio INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Consultorio VARCHAR(100),
    ID_Estatus INT,
	FOREIGN KEY(ID_Estatus) REFERENCES Estatus_Consultorios(ID_Estatus)
);
-- Tabla de estatus para las citas
CREATE TABLE Estatus_Citas(
	ID_Estatus INT PRIMARY KEY IDENTITY(1,1),
	Nombre_Estatus VARCHAR(15)
)

INSERT INTO Estatus_Citas(Nombre_Estatus) VALUES
('Pendiente'),
('Modificada'),
('Cancelada'),
('No Honrada')

-- Tabla de Citas Médicas
CREATE TABLE CitasMedicas (
    ID_Cita INT PRIMARY KEY IDENTITY(1,1),
    ID_Paciente INT NOT NULL,
    ID_Medico INT NOT NULL,
    Fecha_Cita DATE NOT NULL,
	Hora_Cita TIME NOT NULL,
    ID_Consultorio INT NOT NULL,
    ID_Estatus INT,
    Fecha_Creacion DATETIME DEFAULT GETDATE(),
	Ultima_Actualizacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ID_Paciente) REFERENCES Pacientes(ID_Paciente),
    FOREIGN KEY (ID_Medico) REFERENCES Medicos(ID_Medico),
    FOREIGN KEY (ID_Consultorio) REFERENCES Consultorios(ID_Consultorio),
	FOREIGN KEY (ID_Estatus) REFERENCES Estatus_Citas(ID_Estatus)
);

--Tabla de tablas
CREATE TABLE Tablas(
	ID_Tabla INT PRIMARY KEY IDENTITY(1,1),
	Nombre_Tabla VARCHAR(15)
)

INSERT INTO Tablas(Nombre_Tabla) VALUES
('Consultorios'),
('Usuarios'),
('Pacientes'),
('Medicos'),
('Citas'),
('Especialidades'),
('Alergias'),
('Operaciones'),
('Roles')

-- Tabla de Tipos de movimientos para la bitacora
CREATE TABLE TiposDeMovimientos(
	ID_TipoDeMovimiento INT PRIMARY KEY IDENTITY(1,1),
	Descripcion_Movimiento VARCHAR(20) NOT NULL
)

INSERT INTO TiposDeMovimientos(Descripcion_Movimiento) VALUES
('Inserto'),
('Modifico'),
('Elimino')

-- Tabla de Bitácora
CREATE TABLE Bitacora (
    ID_Bitacora INT PRIMARY KEY IDENTITY(1,1),
    -- Tabla_Afectada
	ID_Tabla INT,
	ID_Registro INT,
    ID_TipoDeMovimiento INT,
    -- ModificadoPor
	Usuario VARCHAR(100),
    Fecha_Modificacion DATETIME DEFAULT GETDATE(),
	FOREIGN KEY(ID_Tabla) REFERENCES Tablas(ID_Tabla),
	FOREIGN KEY(ID_TipoDeMovimiento) REFERENCES TiposDeMovimientos(ID_TipoDeMovimiento)
);
--===================== Triggers sobre el usuario ================================--
CREATE TRIGGER TRG_Insertar_Usuario
ON Usuarios
AFTER INSERT
AS
	DECLARE @Nombre_Usuario VARCHAR(30) = (SELECT Nombre_Usuario FROM INSERTED)
	DECLARE @Query NVARCHAR(MAX)
BEGIN
	SET @Query = 'CREATE USER ['+@Nombre_Usuario+'] FOR LOGIN AdminDigitalMedSuit'	
	EXEC sp_executesql @Query
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(2, (SELECT ID_Usuario FROM INSERTED), 1,USER_NAME())
END

CREATE TRIGGER TRG_ModificarUsuario
ON Usuarios
AFTER UPDATE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(2, (SELECT ID_Usuario FROM INSERTED), 2,USER_NAME())
END

-- Trigger que borra el usuario de la base de datos  
CREATE TRIGGER TRG_BorrarUsuarios
ON Usuarios
AFTER DELETE
AS
	DECLARE @Nombre_Usuario VARCHAR(30) = (SELECT Nombre_Usuario FROM DELETED)
	DECLARE @Query NVARCHAR(MAX)
BEGIN
	SET @Query = 'DROP USER ['+@Nombre_Usuario+']'
	EXEC sp_executesql @Query

	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(2, (SELECT ID_Usuario FROM INSERTED), 2,USER_NAME())
END

--=============================== Triggers sobre consultorios ===========================--
CREATE TRIGGER TGR_Insertar_Consultorios
ON Consultorios
AFTER INSERT
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(1, (SELECT ID_Consultorio FROM INSERTED), 1,USER_NAME())
END;

DROP TRIGGER TGR_Insertar_Consultorios

CREATE TRIGGER TRG_Modificar_Consultorios
ON Consultorios
AFTER UPDATE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(1, (SELECT ID_Consultorio FROM INSERTED), 2,USER_NAME())
END

CREATE TRIGGER TRG_Eliminar_Consultorios
ON Consultorios
AFTER DELETE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(1, (SELECT ID_Consultorio FROM INSERTED), 3,USER_NAME())
END
--============================ Triggers Pacientes =========================--------------
CREATE TRIGGER TRG_Insertar_Paciente
ON Pacientes
AFTER INSERT
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(3, (SELECT ID_Paciente FROM INSERTED), 1,USER_NAME())
END

CREATE TRIGGER TRG_Modificar_Paciente
ON Pacientes
AFTER UPDATE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(3, (SELECT ID_Paciente FROM INSERTED), 2,USER_NAME())
END

CREATE TRIGGER TRG_Eliminar_Paciente
ON Pacientes
AFTER DELETE
AS
BEGIN
INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(3, (SELECT ID_Paciente FROM DELETED), 3,USER_NAME())
END

--======================Triggers Medicos =============================--
CREATE TRIGGER TRG_Insertar_Medico
ON Medicos
AFTER INSERT
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(4, (SELECT ID_Medico FROM INSERTED), 1,USER_NAME())
END

CREATE TRIGGER TRG_Modificar_Medico
ON Medicos
AFTER UPDATE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(4, (SELECT ID_Medico FROM INSERTED), 2,USER_NAME())
END

CREATE TRIGGER TRG_Eliminar_Medico
ON Medicos
AFTER DELETE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(4, (SELECT ID_Medico FROM DELETED), 3,USER_NAME())
END

--============================= Triggers CitasMedicas ==========================--
CREATE TRIGGER TRG_Insertar_CitaMedica
ON CitasMedicas
AFTER INSERT
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(5, (SELECT ID_Cita FROM INSERTED), 1,USER_NAME())
END

CREATE TRIGGER TRG_Modificar_CitaMedica
ON CitasMedicas
AFTER UPDATE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(5, (SELECT ID_Cita FROM INSERTED), 2,USER_NAME())
END

CREATE TRIGGER TRG_Eliminar_CitaMedica
ON CitasMedicas
AFTER DELETE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(5, (SELECT ID_Cita FROM DELETED), 3,USER_NAME())
END

--========================= Especialidades ===============================--
CREATE TRIGGER TRG_Insertar_Especialidad
ON Especialidades
AFTER INSERT
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(6, (SELECT ID_Especialidad FROM INSERTED), 1,USER_NAME())
END

CREATE TRIGGER TRG_Modificar_Especialidad
On Especialidades
AFTER UPDATE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(6, (SELECT ID_Especialidad FROM INSERTED), 2,USER_NAME())
END

CREATE TRIGGER TRG_Eliminar_Especialidad
ON Especialidades
AFTER DELETE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(6, (SELECT ID_Especialidad FROM DELETED), 3,USER_NAME())
END

--====================== Alergias =========================--
CREATE TRIGGER TRG_Inseertar_Alergias
ON Alergias
AFTER INSERT
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(7, (SELECT ID_Alergias FROM INSERTED), 1,USER_NAME())
END

CREATE TRIGGER TRG_Modificar_Alergias
ON Alergias
AFTER UPDATE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(7, (SELECT ID_Alergias FROM INSERTED), 2,USER_NAME())
END

CREATE TRIGGER TRG_Eliminar_Alergias
ON Alergias
AFTER DELETE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(7, (SELECT ID_Alergias FROM DELETED), 3,USER_NAME())
END

--======================= Operaciones ===========================--
CREATE TRIGGER TRG_Insertar_Operacioes
ON Operaciones
AFTER INSERT
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(8, (SELECT ID_Operaciones FROM INSERTED), 1,USER_NAME())
END

CREATE TRIGGER TRG_Modificar_Operaciones
ON Operaciones
AFTER UPDATE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(8, (SELECT ID_Operaciones FROM INSERTED), 2,USER_NAME())
END

CREATE TRIGGER TRG_Eliminar_Operaciones
ON Operaciones
AFTER DELETE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(8, (SELECT ID_Operaciones FROM DELETED), 3,USER_NAME())
END

--============================= Roles ================================--
CREATE TRIGGER TRG_Insertar_Rol
ON Roles
AFTER INSERT
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(9, (SELECT ID_Rol FROM INSERTED), 1,USER_NAME())
END

CREATE TRIGGER TRG_Modificar_Rol
ON Roles
AFTER UPDATE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(9, (SELECT ID_Rol FROM INSERTED), 2,USER_NAME())
END

CREATE TRIGGER TRG_Eliminar_Rol
ON Roles
AFTER DELETE
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(9, (SELECT ID_Rol FROM DELETED), 3,USER_NAME())
END

