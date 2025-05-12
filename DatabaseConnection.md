## Gerardo Connections ##
Laptop = "DefaultConnection": "Server=ROGSTRIXG15\\SQLEXPRESS;Database=DigitalMedSuiteDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"

PCMAL = "DefaultConnection": "Server=PCMAL\\SQLEXPRESS;Database=DigitalMedSuiteDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"

## Carlos Connections ##
## Ronny Connections ##
## Robert Connections ##


Crear Usuario en DB 

USE DigitalMedSuiteDB;
INSERT INTO Usuarios (
    Username, Email, PasswordHash, Rol, PacienteId, MedicoId, FechaCreacion, UltimoAcceso
) VALUES (
    'Panfilo',
    'panfilo@admin.com',
    'panfilo123', -- Asegúrate de usar un hash real en producción
    'medico',
    NULL,
    2, -- Suponiendo que este es el ID del médico en otra tabla llamada Medicos
    SYSDATETIME(),
    NULL
);

Comando por si ocupan migrar la Base de datos:
dotnet ef database update