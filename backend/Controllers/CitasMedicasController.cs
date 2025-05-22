using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitasMedicasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CitasMedicasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CitasMedicas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CitaMedicaDTO>>> GetCitasMedicas()
        {
            var citas = await _context.CitasMedicas
                .Include(c => c.Paciente)
                .Include(c => c.Medico)
                .ThenInclude(m => m!.Especialidad)
                .Include(c => c.Consultorio)
                .Include(c => c.Estatus)
                .Select(c => new CitaMedicaDTO
                {
                    ID_Cita = c.ID_Cita,
                    ID_Paciente = c.ID_Paciente,
                    NombrePaciente = c.Paciente != null ? c.Paciente.Nombre : null,
                    ApellidoPaciente = c.Paciente != null ? c.Paciente.Apellido_Paterno : null,
                    ID_Medico = c.ID_Medico,
                    NombreMedico = c.Medico != null ? c.Medico.Nombre : null,
                    ApellidoMedico = c.Medico != null ? c.Medico.Apellido_Paterno : null,
                    Especialidad = c.Medico != null && c.Medico.Especialidad != null ? c.Medico.Especialidad.Nombre_Especialidad : null,
                    Fecha_Cita = c.Fecha_Cita,
                    Hora_Cita = c.Hora_Cita,
                    ID_Consultorio = c.ID_Consultorio,
                    NombreConsultorio = c.Consultorio != null ? c.Consultorio.Nombre_Consultorio : null,
                    ID_Estatus = c.ID_Estatus,
                    EstatusNombre = c.Estatus != null ? c.Estatus.Nombre_Estatus : null,
                    Fecha_Creacion = c.Fecha_Creacion,
                    Ultima_Actualizacion = c.Ultima_Actualizacion
                })
                .ToListAsync();

            return citas;
        }

        // GET: api/CitasMedicas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CitaMedicaDTO>> GetCitaMedica(int id)
        {
            var cita = await _context.CitasMedicas
                .Include(c => c.Paciente)
                .Include(c => c.Medico)
                .ThenInclude(m => m!.Especialidad)
                .Include(c => c.Consultorio)
                .Include(c => c.Estatus)
                .FirstOrDefaultAsync(c => c.ID_Cita == id);

            if (cita == null)
            {
                return NotFound();
            }

            var citaDTO = new CitaMedicaDTO
            {
                ID_Cita = cita.ID_Cita,
                ID_Paciente = cita.ID_Paciente,
                NombrePaciente = cita.Paciente?.Nombre,
                ApellidoPaciente = cita.Paciente?.Apellido_Paterno,
                ID_Medico = cita.ID_Medico,
                NombreMedico = cita.Medico?.Nombre,
                ApellidoMedico = cita.Medico?.Apellido_Paterno,
                Especialidad = cita.Medico?.Especialidad?.Nombre_Especialidad,
                Fecha_Cita = cita.Fecha_Cita,
                Hora_Cita = cita.Hora_Cita,
                ID_Consultorio = cita.ID_Consultorio,
                NombreConsultorio = cita.Consultorio?.Nombre_Consultorio,
                ID_Estatus = cita.ID_Estatus,
                EstatusNombre = cita.Estatus?.Nombre_Estatus,
                Fecha_Creacion = cita.Fecha_Creacion,
                Ultima_Actualizacion = cita.Ultima_Actualizacion
            };

            return citaDTO;
        }

        // POST: api/CitasMedicas
        [HttpPost]
        public async Task<ActionResult<CitaMedicaDTO>> CreateCitaMedica(CitaMedicaCrearDTO citaDTO)
        {
            var cita = new CitaMedica
            {
                ID_Paciente = citaDTO.ID_Paciente,
                ID_Medico = citaDTO.ID_Medico,
                Fecha_Cita = citaDTO.Fecha_Cita,
                Hora_Cita = citaDTO.Hora_Cita,
                ID_Consultorio = citaDTO.ID_Consultorio,
                ID_Estatus = citaDTO.ID_Estatus ?? 1, // Por defecto, estado Pendiente
                Fecha_Creacion = DateTime.Now,
                Ultima_Actualizacion = DateTime.Now
            };

            _context.CitasMedicas.Add(cita);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCitaMedica", new { id = cita.ID_Cita }, await GetCitaMedica(cita.ID_Cita));
        }

        // PUT: api/CitasMedicas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCitaMedica(int id, CitaMedicaActualizarDTO citaDTO)
        {
            var cita = await _context.CitasMedicas.FindAsync(id);
            if (cita == null)
            {
                return NotFound();
            }

            // Actualizar solo los campos que no son nulos
            if (citaDTO.ID_Paciente.HasValue)
                cita.ID_Paciente = citaDTO.ID_Paciente.Value;
            
            if (citaDTO.ID_Medico.HasValue)
                cita.ID_Medico = citaDTO.ID_Medico.Value;
            
            if (citaDTO.Fecha_Cita.HasValue)
                cita.Fecha_Cita = citaDTO.Fecha_Cita.Value;
            
            if (citaDTO.Hora_Cita.HasValue)
                cita.Hora_Cita = citaDTO.Hora_Cita.Value;
            
            if (citaDTO.ID_Consultorio.HasValue)
                cita.ID_Consultorio = citaDTO.ID_Consultorio.Value;
            
            if (citaDTO.ID_Estatus.HasValue)
                cita.ID_Estatus = citaDTO.ID_Estatus.Value;
            
            cita.Ultima_Actualizacion = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CitaMedicaExists(id))
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

        // DELETE: api/CitasMedicas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCitaMedica(int id)
        {
            var cita = await _context.CitasMedicas.FindAsync(id);
            if (cita == null)
            {
                return NotFound();
            }

            _context.CitasMedicas.Remove(cita);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CitaMedicaExists(int id)
        {
            return _context.CitasMedicas.Any(e => e.ID_Cita == id);
        }

        // GET: api/CitasMedicas/Medico/5
        [HttpGet("Medico/{id}")]
        public async Task<ActionResult<IEnumerable<CitaMedicaDTO>>> GetCitasByMedico(int id)
        {
            var citas = await _context.CitasMedicas
                .Include(c => c.Paciente)
                .Include(c => c.Medico)
                .ThenInclude(m => m!.Especialidad)
                .Include(c => c.Consultorio)
                .Include(c => c.Estatus)
                .Where(c => c.ID_Medico == id)
                .Select(c => new CitaMedicaDTO
                {
                    ID_Cita = c.ID_Cita,
                    ID_Paciente = c.ID_Paciente,
                    NombrePaciente = c.Paciente != null ? c.Paciente.Nombre : null,
                    ApellidoPaciente = c.Paciente != null ? c.Paciente.Apellido_Paterno : null,
                    ID_Medico = c.ID_Medico,
                    NombreMedico = c.Medico != null ? c.Medico.Nombre : null,
                    ApellidoMedico = c.Medico != null ? c.Medico.Apellido_Paterno : null,
                    Especialidad = c.Medico != null && c.Medico.Especialidad != null ? c.Medico.Especialidad.Nombre_Especialidad : null,
                    Fecha_Cita = c.Fecha_Cita,
                    Hora_Cita = c.Hora_Cita,
                    ID_Consultorio = c.ID_Consultorio,
                    NombreConsultorio = c.Consultorio != null ? c.Consultorio.Nombre_Consultorio : null,
                    ID_Estatus = c.ID_Estatus,
                    EstatusNombre = c.Estatus != null ? c.Estatus.Nombre_Estatus : null,
                    Fecha_Creacion = c.Fecha_Creacion,
                    Ultima_Actualizacion = c.Ultima_Actualizacion
                })
                .ToListAsync();

            return citas;
        }

        // GET: api/CitasMedicas/Paciente/5
        [HttpGet("Paciente/{id}")]
        public async Task<ActionResult<IEnumerable<CitaMedicaDTO>>> GetCitasByPaciente(int id)
        {
            var citas = await _context.CitasMedicas
                .Include(c => c.Paciente)
                .Include(c => c.Medico)
                .ThenInclude(m => m!.Especialidad)
                .Include(c => c.Consultorio)
                .Include(c => c.Estatus)
                .Where(c => c.ID_Paciente == id)
                .Select(c => new CitaMedicaDTO
                {
                    ID_Cita = c.ID_Cita,
                    ID_Paciente = c.ID_Paciente,
                    NombrePaciente = c.Paciente != null ? c.Paciente.Nombre : null,
                    ApellidoPaciente = c.Paciente != null ? c.Paciente.Apellido_Paterno : null,
                    ID_Medico = c.ID_Medico,
                    NombreMedico = c.Medico != null ? c.Medico.Nombre : null,
                    ApellidoMedico = c.Medico != null ? c.Medico.Apellido_Paterno : null,
                    Especialidad = c.Medico != null && c.Medico.Especialidad != null ? c.Medico.Especialidad.Nombre_Especialidad : null,
                    Fecha_Cita = c.Fecha_Cita,
                    Hora_Cita = c.Hora_Cita,
                    ID_Consultorio = c.ID_Consultorio,
                    NombreConsultorio = c.Consultorio != null ? c.Consultorio.Nombre_Consultorio : null,
                    ID_Estatus = c.ID_Estatus,
                    EstatusNombre = c.Estatus != null ? c.Estatus.Nombre_Estatus : null,
                    Fecha_Creacion = c.Fecha_Creacion,
                    Ultima_Actualizacion = c.Ultima_Actualizacion
                })
                .ToListAsync();

            return citas;
        }

        // GET: api/CitasMedicas/Fecha/2023-05-30
        [HttpGet("Fecha/{fecha}")]
        public async Task<ActionResult<IEnumerable<CitaMedicaDTO>>> GetCitasByFecha(DateTime fecha)
        {
            var citas = await _context.CitasMedicas
                .Include(c => c.Paciente)
                .Include(c => c.Medico)
                .ThenInclude(m => m!.Especialidad)
                .Include(c => c.Consultorio)
                .Include(c => c.Estatus)
                .Where(c => c.Fecha_Cita.Date == fecha.Date)
                .Select(c => new CitaMedicaDTO
                {
                    ID_Cita = c.ID_Cita,
                    ID_Paciente = c.ID_Paciente,
                    NombrePaciente = c.Paciente != null ? c.Paciente.Nombre : null,
                    ApellidoPaciente = c.Paciente != null ? c.Paciente.Apellido_Paterno : null,
                    ID_Medico = c.ID_Medico,
                    NombreMedico = c.Medico != null ? c.Medico.Nombre : null,
                    ApellidoMedico = c.Medico != null ? c.Medico.Apellido_Paterno : null,
                    Especialidad = c.Medico != null && c.Medico.Especialidad != null ? c.Medico.Especialidad.Nombre_Especialidad : null,
                    Fecha_Cita = c.Fecha_Cita,
                    Hora_Cita = c.Hora_Cita,
                    ID_Consultorio = c.ID_Consultorio,
                    NombreConsultorio = c.Consultorio != null ? c.Consultorio.Nombre_Consultorio : null,
                    ID_Estatus = c.ID_Estatus,
                    EstatusNombre = c.Estatus != null ? c.Estatus.Nombre_Estatus : null,
                    Fecha_Creacion = c.Fecha_Creacion,
                    Ultima_Actualizacion = c.Ultima_Actualizacion
                })
                .ToListAsync();

            return citas;
        }
    }
}
