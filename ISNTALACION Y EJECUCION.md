## Pasos de Instalacion ##

Descargue  la Version 9.0 de ASP.NET en (https://dotnet.microsoft.com/en-us/download) e instalela

Abrira el archivo appsettings.json en el backend y cambiara el DefaultConnection por el nombre de su Servidor/Instancia de SQL SERVER

Ejemplo:

"DefaultConnection": "Server=AQUI_EL_NOMBRE_DE_SU_SERVIDOR;Database=DigitalMedSuiteDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"

Ejecute start.bat y listo

Nota: La base de datos se migrara automaticamente al SQL SERVER al ejecutar start.bat
