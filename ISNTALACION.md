## Pasos de Instalacion ##

Descargue  la Version 9.0 de ASP.NET en (https://dotnet.microsoft.com/en-us/download) e instalela

Abrira el archivo appsettings.json en el backend y cambiara el DefaultConnection por el nombre de su Servidor/Instancia

Ejemplo:

"DefaultConnection": "Server=AQUI_EL_NOMBRE_DE_SU_SERVIDOR;Database=DigitalMedSuiteDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"

Habra la terminal y coloquese en la carpeta backend

Ejemplo:
cd backend

y despues corrra el backend

dotnet run 

y listo
