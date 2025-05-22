using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacientesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PacientesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Pacientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PacienteDTO>>> GetPacientes()
        {
            var pacientes = await _context.Pacientes
                .Include(p => p.TipoSangre)
                .Include(p => p.Alergia)
                .Include(p => p.Operacion)
                .Include(p => p.Padecimiento)
                .Include(p => p.Genero)
                .Include(p => p.Estatus)
                .Select(p => new PacienteDTO
                {
                    ID_Paciente = p.ID_Paciente,
                    Nombre = p.Nombre,
                    Apellido_Paterno = p.Apellido_Paterno,
                    Apellido_Materno = p.Apellido_Materno,
                    Fecha_Nacimiento = p.Fecha_Nacimiento,
                    Calle = p.Calle,
                    Codigo_Postal = p.Codigo_Postal,
                    Num_Calle = p.Num_Calle,
                    Correo_Electronico = p.Correo_Electronico,
                    Telefono = p.Telefono,
                    Altura = p.Altura,
                    Peso = p.Peso,
                    ID_Tipo = p.ID_Tipo,
                    TipoSangreNombre = p.TipoSangre != null ? p.TipoSangre.Tipo_Sangre : null,
                    ID_Alergias = p.ID_Alergias,
                    AlergiaNombre = p.Alergia != null ? p.Alergia.Nombre_Alergia : null,
                    ID_Operaciones = p.ID_Operaciones,
                    OperacionNombre = p.Operacion != null ? p.Operacion.Nombre_Operacion : null,
                    ID_Padecimientos = p.ID_Padecimientos,
                    PadecimientoNombre = p.Padecimiento != null ? p.Padecimiento.Nombre_Padecimiento : null,
                    ID_Genero = p.ID_Genero,
                    GeneroNombre = p.Genero != null ? p.Genero.Genero_Nombre : null,
                    Fecha_Registro = p.Fecha_Registro,
                    ID_Estatus = p.ID_Estatus,
                    EstatusNombre = p.Estatus != null ? p.Estatus.Nombre_Estatus : null,
                    CURP = p.CURP
                })
                .ToListAsync();

            return pacientes;
        }

        // GET: api/Pacientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PacienteDTO>> GetPaciente(int id)
        {
            var paciente = await _context.Pacientes
                .Include(p => p.TipoSangre)
                .Include(p => p.Alergia)
                .Include(p => p.Operacion)
                .Include(p => p.Padecimiento)
                .Include(p => p.Genero)
                .Include(p => p.Estatus)
                .FirstOrDefaultAsync(p => p.ID_Paciente == id);

            if (paciente == null)
            {
                return NotFound();
            }

            var pacienteDTO = new PacienteDTO
            {
                ID_Paciente = paciente.ID_Paciente,
                Nombre = paciente.Nombre,
                Apellido_Paterno = paciente.Apellido_Paterno,
                Apellido_Materno = paciente.Apellido_Materno,
                Fecha_Nacimiento = paciente.Fecha_Nacimiento,
                Calle = paciente.Calle,
                Codigo_Postal = paciente.Codigo_Postal,
                Num_Calle = paciente.Num_Calle,
                Correo_Electronico = paciente.Correo_Electronico,
                Telefono = paciente.Telefono,
                Altura = paciente.Altura,
                Peso = paciente.Peso,
                ID_Tipo = paciente.ID_Tipo,
                TipoSangreNombre = paciente.TipoSangre?.Tipo_Sangre,
                ID_Alergias = paciente.ID_Alergias,
                AlergiaNombre = paciente.Alergia?.Nombre_Alergia,
                ID_Operaciones = paciente.ID_Operaciones,
                OperacionNombre = paciente.Operacion?.Nombre_Operacion,
                ID_Padecimientos = paciente.ID_Padecimientos,
                PadecimientoNombre = paciente.Padecimiento?.Nombre_Padecimiento,
                ID_Genero = paciente.ID_Genero,
                GeneroNombre = paciente.Genero?.Genero_Nombre,
                Fecha_Registro = paciente.Fecha_Registro,
                ID_Estatus = paciente.ID_Estatus,
                EstatusNombre = paciente.Estatus?.Nombre_Estatus,
                CURP = paciente.CURP
            };

            return pacienteDTO;
        }

        // POST: api/Pacientes
        [HttpPost]
        public async Task<ActionResult<PacienteDTO>> CreatePaciente(PacienteCrearDTO pacienteDTO)
        {
            var paciente = new Paciente
            {
                ID_Paciente = pacienteDTO.ID_Paciente,
                Nombre = pacienteDTO.Nombre,
                Apellido_Paterno = pacienteDTO.Apellido_Paterno,
                Apellido_Materno = pacienteDTO.Apellido_Materno,
                Fecha_Nacimiento = pacienteDTO.Fecha_Nacimiento,
                Calle = pacienteDTO.Calle,
                Codigo_Postal = pacienteDTO.Codigo_Postal,
                Num_Calle = pacienteDTO.Num_Calle,
                Correo_Electronico = pacienteDTO.Correo_Electronico,
                Telefono = pacienteDTO.Telefono,
                Altura = pacienteDTO.Altura,
                Peso = pacienteDTO.Peso,
                ID_Tipo = pacienteDTO.ID_Tipo,
                ID_Alergias = pacienteDTO.ID_Alergias,
                ID_Operaciones = pacienteDTO.ID_Operaciones,
                ID_Padecimientos = pacienteDTO.ID_Padecimientos,
                ID_Genero = pacienteDTO.ID_Genero,
                ID_Estatus = pacienteDTO.ID_Estatus,
                CURP = pacienteDTO.CURP,
                Fecha_Registro = DateTime.Now
            };

            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPaciente", new { id = paciente.ID_Paciente }, await GetPaciente(paciente.ID_Paciente));
        }

        // PUT: api/Pacientes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePaciente(int id, PacienteActualizarDTO pacienteDTO)
        {
            var paciente = await _context.Pacientes.FindAsync(id);
            if (paciente == null)
            {
                return NotFound();
            }

            // Actualizar solo los campos que no son nulos
            if (pacienteDTO.Nombre != null)
                paciente.Nombre = pacienteDTO.Nombre;
            
            if (pacienteDTO.Apellido_Paterno != null)
                paciente.Apellido_Paterno = pacienteDTO.Apellido_Paterno;
            
            if (pacienteDTO.Apellido_Materno != null)
                paciente.Apellido_Materno = pacienteDTO.Apellido_Materno;
            
            if (pacienteDTO.Fecha_Nacimiento.HasValue)
                paciente.Fecha_Nacimiento = pacienteDTO.Fecha_Nacimiento;
            
            if (pacienteDTO.Calle != null)
                paciente.Calle = pacienteDTO.Calle;
            
            if (pacienteDTO.Codigo_Postal.HasValue)
                paciente.Codigo_Postal = pacienteDTO.Codigo_Postal;
            
            if (pacienteDTO.Num_Calle.HasValue)
                paciente.Num_Calle = pacienteDTO.Num_Calle;
            
            if (pacienteDTO.Correo_Electronico != null)
                paciente.Correo_Electronico = pacienteDTO.Correo_Electronico;
            
            if (pacienteDTO.Telefono != null)
                paciente.Telefono = pacienteDTO.Telefono;
            
            if (pacienteDTO.Altura.HasValue)
                paciente.Altura = pacienteDTO.Altura;
            
            if (pacienteDTO.Peso.HasValue)
                paciente.Peso = pacienteDTO.Peso;
            
            if (pacienteDTO.ID_Tipo.HasValue)
                paciente.ID_Tipo = pacienteDTO.ID_Tipo;
            
            if (pacienteDTO.ID_Alergias.HasValue)
                paciente.ID_Alergias = pacienteDTO.ID_Alergias;
            
            if (pacienteDTO.ID_Operaciones.HasValue)
                paciente.ID_Operaciones = pacienteDTO.ID_Operaciones;
            
            if (pacienteDTO.ID_Padecimientos.HasValue)
                paciente.ID_Padecimientos = pacienteDTO.ID_Padecimientos;
            
            if (pacienteDTO.ID_Genero.HasValue)
                paciente.ID_Genero = pacienteDTO.ID_Genero;
            
            if (pacienteDTO.ID_Estatus.HasValue)
                paciente.ID_Estatus = pacienteDTO.ID_Estatus;
            
            if (pacienteDTO.CURP != null)
                paciente.CURP = pacienteDTO.CURP;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PacienteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Pacientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaciente(int id)
        {
            var paciente = await _context.Pacientes.FindAsync(id);
            if (paciente == null)
            {
                return NotFound();
            }

            _context.Pacientes.Remove(paciente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PacienteExists(int id)
        {
            return _context.Pacientes.Any(e => e.ID_Paciente == id);
        }

        // GET: api/Pacientes/Buscar?nombre=Juan
        [HttpGet("Buscar")]
        public async Task<ActionResult<IEnumerable<PacienteDTO>>> BuscarPacientes([FromQuery] string? nombre, [FromQuery] string? apellido, [FromQuery] string? curp)
        {
            IQueryable<Paciente> query = _context.Pacientes
                .Include(p => p.TipoSangre)
                .Include(p => p.Alergia)
                .Include(p => p.Operacion)
                .Include(p => p.Padecimiento)
                .Include(p => p.Genero)
                .Include(p => p.Estatus);

            if (!string.IsNullOrEmpty(nombre))
            {
                query = query.Where(p => p.Nombre != null && p.Nombre.Contains(nombre));
            }

            if (!string.IsNullOrEmpty(apellido))
            {
                query = query.Where(p => 
                    (p.Apellido_Paterno != null && p.Apellido_Paterno.Contains(apellido)) || 
                    (p.Apellido_Materno != null && p.Apellido_Materno.Contains(apellido)));
            }

            if (!string.IsNullOrEmpty(curp))
            {
                query = query.Where(p => p.CURP != null && p.CURP.Contains(curp));
            }

            var pacientes = await query
                .Select(p => new PacienteDTO
                {
                    ID_Paciente = p.ID_Paciente,
                    Nombre = p.Nombre,
                    Apellido_Paterno = p.Apellido_Paterno,
                    Apellido_Materno = p.Apellido_Materno,
                    Fecha_Nacimiento = p.Fecha_Nacimiento,
                    Calle = p.Calle,
                    Codigo_Postal = p.Codigo_Postal,
                    Num_Calle = p.Num_Calle,
                    Correo_Electronico = p.Correo_Electronico,
                    Telefono = p.Telefono,
                    Altura = p.Altura,
                    Peso = p.Peso,
                    ID_Tipo = p.ID_Tipo,
                    TipoSangreNombre = p.TipoSangre != null ? p.TipoSangre.Tipo_Sangre : null,
                    ID_Alergias = p.ID_Alergias,
                    AlergiaNombre = p.Alergia != null ? p.Alergia.Nombre_Alergia : null,
                    ID_Operaciones = p.ID_Operaciones,
                    OperacionNombre = p.Operacion != null ? p.Operacion.Nombre_Operacion : null,
                    ID_Padecimientos = p.ID_Padecimientos,
                    PadecimientoNombre = p.Padecimiento != null ? p.Padecimiento.Nombre_Padecimiento : null,
                    ID_Genero = p.ID_Genero,
                    GeneroNombre = p.Genero != null ? p.Genero.Genero_Nombre : null,
                    Fecha_Registro = p.Fecha_Registro,
                    ID_Estatus = p.ID_Estatus,
                    EstatusNombre = p.Estatus != null ? p.Estatus.Nombre_Estatus : null,
                    CURP = p.CURP
                })
                .ToListAsync();

            return pacientes;
        }
    }
}
