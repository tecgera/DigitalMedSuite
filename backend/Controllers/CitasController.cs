using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CitasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CitasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Citas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CitaDTO>>> GetCitas()
        {
            var citas = await _context.Citas
                .Include(c => c.Paciente)
                .Include(c => c.Medico)
                .Include(c => c.Consultorio)
                .Include(c => c.EstatusCita)
                .Select(c => new CitaDTO
                {
                    ID_Cita = c.ID_Cita,
                    ID_Paciente = c.ID_Paciente,
                    NombrePaciente = c.Paciente == null ? "" :
                        (c.Paciente.Nombre == null ? "" : c.Paciente.Nombre) + " " +
                        (c.Paciente.Apellido_Paterno == null ? "" : c.Paciente.Apellido_Paterno) + " " +
                        (c.Paciente.Apellido_Materno == null ? "" : c.Paciente.Apellido_Materno),
                    ID_Medico = c.ID_Medico,
                    NombreMedico = c.Medico == null ? "" :
                        (c.Medico.Nombre == null ? "" : c.Medico.Nombre) + " " +
                        (c.Medico.Apellido_Paterno == null ? "" : c.Medico.Apellido_Paterno) + " " +
                        (c.Medico.Apellido_Materno == null ? "" : c.Medico.Apellido_Materno),
                    Especialidad = c.Medico == null || c.Medico.Especialidad == null ? null : c.Medico.Especialidad.Nombre_Especialidad,
                    Fecha_Cita = c.Fecha_Cita,
                    Hora_Cita = c.Hora_Cita,
                    ID_Consultorio = c.ID_Consultorio,
                    NombreConsultorio = c.Consultorio == null ? null : c.Consultorio.Nombre_Consultorio,
                    ID_Estatus = c.ID_Estatus,
                    Estatus = c.EstatusCita == null ? null : c.EstatusCita.Nombre_Estatus,
                    Fecha_Creacion = c.Fecha_Creacion,
                    Ultima_Actualizacion = c.Ultima_Actualizacion
                })
                .OrderByDescending(c => c.Fecha_Cita)
                .ThenBy(c => c.Hora_Cita)
                .ToListAsync();

            return citas;
        }

        // GET: api/Citas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CitaDTO>> GetCita(int id)
        {
            var cita = await _context.Citas
                .Include(c => c.Paciente)
                .Include(c => c.Medico)
                .Include(c => c.Consultorio)
                .Include(c => c.EstatusCita)
                .Where(c => c.ID_Cita == id)
                .Select(c => new CitaDTO
                {
                    ID_Cita = c.ID_Cita,
                    ID_Paciente = c.ID_Paciente,
                    NombrePaciente = c.Paciente == null ? "" :
                        (c.Paciente.Nombre == null ? "" : c.Paciente.Nombre) + " " +
                        (c.Paciente.Apellido_Paterno == null ? "" : c.Paciente.Apellido_Paterno) + " " +
                        (c.Paciente.Apellido_Materno == null ? "" : c.Paciente.Apellido_Materno),
                    ID_Medico = c.ID_Medico,
                    NombreMedico = c.Medico == null ? "" :
                        (c.Medico.Nombre == null ? "" : c.Medico.Nombre) + " " +
                        (c.Medico.Apellido_Paterno == null ? "" : c.Medico.Apellido_Paterno) + " " +
                        (c.Medico.Apellido_Materno == null ? "" : c.Medico.Apellido_Materno),
                    Especialidad = c.Medico == null || c.Medico.Especialidad == null ? null : c.Medico.Especialidad.Nombre_Especialidad,
                    Fecha_Cita = c.Fecha_Cita,
                    Hora_Cita = c.Hora_Cita,
                    ID_Consultorio = c.ID_Consultorio,
                    NombreConsultorio = c.Consultorio == null ? null : c.Consultorio.Nombre_Consultorio,
                    ID_Estatus = c.ID_Estatus,
                    Estatus = c.EstatusCita == null ? null : c.EstatusCita.Nombre_Estatus,
                    Fecha_Creacion = c.Fecha_Creacion,
                    Ultima_Actualizacion = c.Ultima_Actualizacion
                })
                .FirstOrDefaultAsync();

            if (cita == null)
            {
                return NotFound();
            }

            return cita;
        }

        // GET: api/Citas/paciente/5
        [HttpGet("paciente/{pacienteId}")]
        public async Task<ActionResult<IEnumerable<CitaDTO>>> GetCitasPorPaciente(int pacienteId)
        {
            var citas = await _context.Citas
                .Include(c => c.Paciente)
                .Include(c => c.Medico)
                .Include(c => c.Consultorio)
                .Include(c => c.EstatusCita)
                .Where(c => c.ID_Paciente == pacienteId)
                .Select(c => new CitaDTO
                {
                    ID_Cita = c.ID_Cita,
                    ID_Paciente = c.ID_Paciente,
                    NombrePaciente = c.Paciente == null ? "" :
                        (c.Paciente.Nombre == null ? "" : c.Paciente.Nombre) + " " +
                        (c.Paciente.Apellido_Paterno == null ? "" : c.Paciente.Apellido_Paterno) + " " +
                        (c.Paciente.Apellido_Materno == null ? "" : c.Paciente.Apellido_Materno),
                    ID_Medico = c.ID_Medico,
                    NombreMedico = c.Medico == null ? "" :
                        (c.Medico.Nombre == null ? "" : c.Medico.Nombre) + " " +
                        (c.Medico.Apellido_Paterno == null ? "" : c.Medico.Apellido_Paterno) + " " +
                        (c.Medico.Apellido_Materno == null ? "" : c.Medico.Apellido_Materno),
                    Especialidad = c.Medico == null || c.Medico.Especialidad == null ? null : c.Medico.Especialidad.Nombre_Especialidad,
                    Fecha_Cita = c.Fecha_Cita,
                    Hora_Cita = c.Hora_Cita,
                    ID_Consultorio = c.ID_Consultorio,
                    NombreConsultorio = c.Consultorio == null ? null : c.Consultorio.Nombre_Consultorio,
                    ID_Estatus = c.ID_Estatus,
                    Estatus = c.EstatusCita == null ? null : c.EstatusCita.Nombre_Estatus,
                    Fecha_Creacion = c.Fecha_Creacion,
                    Ultima_Actualizacion = c.Ultima_Actualizacion
                })
                .OrderByDescending(c => c.Fecha_Cita)
                .ThenBy(c => c.Hora_Cita)
                .ToListAsync();

            return citas;
        }

        // GET: api/Citas/medico/5
        [HttpGet("medico/{medicoId}")]
        public async Task<ActionResult<IEnumerable<CitaDTO>>> GetCitasPorMedico(int medicoId)
        {
            var citas = await _context.Citas
                .Include(c => c.Paciente)
                .Include(c => c.Medico)
                .Include(c => c.Consultorio)
                .Include(c => c.EstatusCita)
                .Where(c => c.ID_Medico == medicoId)
                .Select(c => new CitaDTO
                {
                    ID_Cita = c.ID_Cita,
                    ID_Paciente = c.ID_Paciente,
                    NombrePaciente = c.Paciente == null ? "" :
                        (c.Paciente.Nombre == null ? "" : c.Paciente.Nombre) + " " +
                        (c.Paciente.Apellido_Paterno == null ? "" : c.Paciente.Apellido_Paterno) + " " +
                        (c.Paciente.Apellido_Materno == null ? "" : c.Paciente.Apellido_Materno),
                    ID_Medico = c.ID_Medico,
                    NombreMedico = c.Medico == null ? "" :
                        (c.Medico.Nombre == null ? "" : c.Medico.Nombre) + " " +
                        (c.Medico.Apellido_Paterno == null ? "" : c.Medico.Apellido_Paterno) + " " +
                        (c.Medico.Apellido_Materno == null ? "" : c.Medico.Apellido_Materno),
                    Especialidad = c.Medico == null || c.Medico.Especialidad == null ? null : c.Medico.Especialidad.Nombre_Especialidad,
                    Fecha_Cita = c.Fecha_Cita,
                    Hora_Cita = c.Hora_Cita,
                    ID_Consultorio = c.ID_Consultorio,
                    NombreConsultorio = c.Consultorio == null ? null : c.Consultorio.Nombre_Consultorio,
                    ID_Estatus = c.ID_Estatus,
                    Estatus = c.EstatusCita == null ? null : c.EstatusCita.Nombre_Estatus,
                    Fecha_Creacion = c.Fecha_Creacion,
                    Ultima_Actualizacion = c.Ultima_Actualizacion
                })
                .OrderBy(c => c.Fecha_Cita)
                .ThenBy(c => c.Hora_Cita)
                .ToListAsync();

            return citas;
        }

        // POST: api/Citas
        [HttpPost]
        public async Task<ActionResult<CitaDTO>> PostCita(CreateCitaDTO createCitaDto)
        {
            // Verificar que el médico exista y esté activo
            var medico = await _context.Medicos
                .FirstOrDefaultAsync(m => m.ID_Medico == createCitaDto.ID_Medico && m.ID_Estatus == 1);
            if (medico == null)
            {
                return BadRequest("El médico especificado no existe o no está activo.");
            }

            // Verificar que el paciente exista y esté activo
            var paciente = await _context.Pacientes
                .FirstOrDefaultAsync(p => p.ID_Paciente == createCitaDto.ID_Paciente && p.ID_Estatus == 1);
            if (paciente == null)
            {
                return BadRequest("El paciente especificado no existe o no está activo.");
            }

            // Verificar que el consultorio exista y esté activo
            var consultorio = await _context.Consultorios
                .FirstOrDefaultAsync(c => c.ID_Consultorio == createCitaDto.ID_Consultorio && c.ID_Estatus == 1);
            if (consultorio == null)
            {
                return BadRequest("El consultorio especificado no existe o no está activo.");
            }

            // Verificar que el médico esté disponible en esa fecha y hora
            var existeCitaMedico = await _context.Citas
                .AnyAsync(c => c.ID_Medico == createCitaDto.ID_Medico &&
                              c.Fecha_Cita.Date == createCitaDto.Fecha_Cita.Date &&
                              c.Hora_Cita == createCitaDto.Hora_Cita &&
                              c.ID_Estatus != 3); // Asumiendo que 3 es el ID de estatus "Cancelada"

            if (existeCitaMedico)
            {
                return BadRequest("El médico ya tiene una cita programada para esta fecha y hora.");
            }

            // Verificar que el consultorio esté disponible
            var existeCitaConsultorio = await _context.Citas
                .AnyAsync(c => c.ID_Consultorio == createCitaDto.ID_Consultorio &&
                              c.Fecha_Cita.Date == createCitaDto.Fecha_Cita.Date &&
                              c.Hora_Cita == createCitaDto.Hora_Cita &&
                              c.ID_Estatus != 3);

            if (existeCitaConsultorio)
            {
                return BadRequest("El consultorio ya está ocupado para esta fecha y hora.");
            }

            var cita = new Cita
            {
                ID_Paciente = createCitaDto.ID_Paciente,
                ID_Medico = createCitaDto.ID_Medico,
                Fecha_Cita = createCitaDto.Fecha_Cita,
                Hora_Cita = createCitaDto.Hora_Cita,
                ID_Consultorio = createCitaDto.ID_Consultorio,
                Fecha_Creacion = DateTime.Now,
                Ultima_Actualizacion = DateTime.Now
            };

            // Buscar el estatus "Programada" para la cita
            var estatusProgramada = await _context.EstatusCitas
                .FirstOrDefaultAsync(e => e.Nombre_Estatus == "Programada");
            if (estatusProgramada != null)
            {
                cita.ID_Estatus = estatusProgramada.ID_Estatus;
            }

            _context.Citas.Add(cita);
            await _context.SaveChangesAsync();

            // Cargar los datos relacionados para devolver el DTO completo
            var citaCreada = await GetCita(cita.ID_Cita);
            return CreatedAtAction(nameof(GetCita), new { id = cita.ID_Cita }, citaCreada.Value);
        }

        // PUT: api/Citas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCita(int id, UpdateCitaDTO updateCitaDto)
        {
            var cita = await _context.Citas.FindAsync(id);
            if (cita == null)
            {
                return NotFound();
            }

            if (updateCitaDto.Fecha_Cita.HasValue)
                cita.Fecha_Cita = updateCitaDto.Fecha_Cita.Value;
            if (updateCitaDto.Hora_Cita.HasValue)
                cita.Hora_Cita = updateCitaDto.Hora_Cita.Value;
            if (updateCitaDto.ID_Consultorio.HasValue)
            {
                // Verificar que el consultorio exista y esté activo
                var consultorioExiste = await _context.Consultorios
                    .AnyAsync(c => c.ID_Consultorio == updateCitaDto.ID_Consultorio.Value && c.ID_Estatus == 1);
                if (!consultorioExiste)
                {
                    return BadRequest("El consultorio especificado no existe o no está activo.");
                }
                cita.ID_Consultorio = updateCitaDto.ID_Consultorio.Value;
            }
            if (updateCitaDto.ID_Estatus.HasValue)
            {
                // Verificar que el estatus exista
                var estatusExiste = await _context.EstatusCitas
                    .AnyAsync(e => e.ID_Estatus == updateCitaDto.ID_Estatus.Value);
                if (!estatusExiste)
                {
                    return BadRequest("El estatus especificado no existe.");
                }
                cita.ID_Estatus = updateCitaDto.ID_Estatus.Value;
            }

            cita.Ultima_Actualizacion = DateTime.Now;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CitaExists(id))
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

        // DELETE: api/Citas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCita(int id)
        {
            var cita = await _context.Citas.FindAsync(id);
            if (cita == null)
            {
                return NotFound();
            }

            // En lugar de eliminar, actualizar el estatus a "Cancelada"
            var estatusCancelada = await _context.EstatusCitas
                .FirstOrDefaultAsync(e => e.Nombre_Estatus == "Cancelada");
            if (estatusCancelada != null)
            {
                cita.ID_Estatus = estatusCancelada.ID_Estatus;
                cita.Ultima_Actualizacion = DateTime.Now;
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

        private bool CitaExists(int id)
        {
            return _context.Citas.Any(e => e.ID_Cita == id);
        }

        // GET: api/Citas/consultorios
        [HttpGet("consultorios")]
        public async Task<ActionResult<IEnumerable<Consultorio>>> GetConsultorios()
        {
            return await _context.Consultorios
                .Where(c => c.ID_Estatus == 1) // Asumiendo que 1 es el ID de estatus "Activo"
                .ToListAsync();
        }

        // GET: api/Citas/estatus
        [HttpGet("estatus")]
        public async Task<ActionResult<IEnumerable<EstatusCita>>> GetEstatusCitas()
        {
            return await _context.EstatusCitas.ToListAsync();
        }
    }
}