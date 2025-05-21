
CREATE DATABASE DigitalMedSuite;
GO

USE DigitalMedSuite;
GO

-- Tabla de Roles
CREATE TABLE Roles (
    ID_Rol INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Rol VARCHAR(20) NOT NULL
);

-- Tabla de estatus de los usuarios
CREATE TABLE Estatus_Usuarios(
	ID_Estatus INT PRIMARY KEY IDENTITY(1,1),
	Nombre_Estatus VARCHAR(15)
)
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
-- Tabla de estatus de los doctores
CREATE TABLE Estatus_Medicos(
	ID_Estatus INT PRIMARY KEY IDENTITY(1,1),
	Nombre_Estatus VARCHAR(15)
)
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
--Tabla Operaciones
CREATE TABLE Operaciones (
    ID_Operaciones INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Operacion VARCHAR(20) NOT NULL,
	Descripcion varchar(70)
);
--Tabla Padecimientos
CREATE TABLE Padeciminetos (
    ID_Padecimientos INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Padecimiento VARCHAR(20) NOT NULL
);

--Tabla Generos
CREATE TABLE Generos(
    ID_Generos INT PRIMARY KEY IDENTITY(1,1),
    Genero VARCHAR(20) NOT NULL
);

--Tabla Tipo Sangre
CREATE TABLE TipoSangre (
    ID_Tipo INT PRIMARY KEY IDENTITY(1,1),
    Tipo_Sangre VARCHAR(20) NOT NULL
);
-- Tabla de los estatus para los pacientes
CREATE TABLE Estatus_Pacientes(
	ID_Estatus INT PRIMARY KEY IDENTITY(1,1),
	Nombre_Estatus VARCHAR(15)
)

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
-- Tabla de Tipos de movimientos para la bitacora
CREATE TABLE TiposDeMovimientos(
	ID_TipoDeMovimiento INT PRIMARY KEY IDENTITY(1,1),
	Descripcion_Movimiento VARCHAR(20) NOT NULL
)

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
-- Trigger que crea un usuario en la base de datos
CREATE TRIGGER TRG_Insertar_Usuario
ON Usuarios
AFTER INSERT
AS
	DECLARE @Nombre_Usuario VARCHAR(30) = (SELECT Nombre_Usuario FROM INSERTED)
	DECLARE @Query NVARCHAR(MAX)
BEGIN
	SET @Query = 'CREATE USER ['+@Nombre_Usuario+'] FOR LOGIN AdminDigitalMedSuit'	
	EXEC sp_executesql @Query
	SET @Query = 'ALTER ROLE Administrador ADD MEMBER ['+@Nombre_Usuario+']'
	EXEC sp_executesql @Query
END
DROP TRIGGER TRG_Insertar_Usuario
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
END

-- Trigger que crea un registro en la bitacora
CREATE TRIGGER TGR_Insertar_Consultorios
ON Consultorios
AFTER INSERT
AS
BEGIN
	INSERT INTO Bitacora(ID_Tabla,ID_Registro,ID_TipoDeMovimiento,Usuario) VALUES 
	(1, (SELECT ID_Consultorio FROM INSERTED), 1,USER_NAME())
	ALTER ROLE db_
END;

-- Creacion del login para los usuarios
CREATE LOGIN AdminDigitalMedSuite
WITH PASSWORD = '12345678'
USE DigitalMedSuite
--Creacion del rol y asignacion de permisos
CREATE ROLE Administrador

GRANT CONTROL ON DATABASE::DigitalMedSuite TO Administrador
-- Registros para probar triggers
INSERT INTO Estatus_Usuarios(Nombre_Estatus) VALUES ('Activo')

INSERT INTO Roles(Nombre_Rol) VALUES ('Administrador')

INSERT INTO Usuarios(ID_Usuario,Nombre_Usuario,ContrasenaHash,ID_Rol,Nombre,Apellido_Paterno,Apellido_Materno,Correo,Telefono,ID_Estatus)
VALUES (2,'DR.Gael','1234',1,'Gael','Guzman','Alarcon','g@gmail.com','664000000',1)

INSERT INTO Consultorios(Nombre_Consultorio,ID_Estatus) VALUES ('7',1)

