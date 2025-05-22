using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedicosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Medicos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicoDTO>>> GetMedicos()
        {
            var medicos = await _context.Medicos
                .Include(m => m.Especialidad)
                .Include(m => m.Estatus)
                .Select(m => new MedicoDTO
                {
                    ID_Medico = m.ID_Medico,
                    Nombre = m.Nombre,
                    Apellido_Paterno = m.Apellido_Paterno,
                    Apellido_Materno = m.Apellido_Materno,
                    Correo = m.Correo,
                    Telefono = m.Telefono,
                    ID_Especialidad = m.ID_Especialidad,
                    NombreEspecialidad = m.Especialidad != null ? m.Especialidad.Nombre_Especialidad : null,
                    Estado = m.Estado,
                    ID_Estatus = m.ID_Estatus,
                    NombreEstatus = m.Estatus != null ? m.Estatus.Nombre_Estatus : null,
                    Fecha_Creacion = m.Fecha_Creacion
                })
                .ToListAsync();

            return medicos;
        }

        // GET: api/Medicos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicoDTO>> GetMedico(int id)
        {
            var medico = await _context.Medicos
                .Include(m => m.Especialidad)
                .Include(m => m.Estatus)
                .FirstOrDefaultAsync(m => m.ID_Medico == id);

            if (medico == null)
            {
                return NotFound();
            }

            var medicoDTO = new MedicoDTO
            {
                ID_Medico = medico.ID_Medico,
                Nombre = medico.Nombre,
                Apellido_Paterno = medico.Apellido_Paterno,
                Apellido_Materno = medico.Apellido_Materno,
                Correo = medico.Correo,
                Telefono = medico.Telefono,
                ID_Especialidad = medico.ID_Especialidad,
                NombreEspecialidad = medico.Especialidad?.Nombre_Especialidad,
                Estado = medico.Estado,
                ID_Estatus = medico.ID_Estatus,
                NombreEstatus = medico.Estatus?.Nombre_Estatus,
                Fecha_Creacion = medico.Fecha_Creacion
            };

            return medicoDTO;
        }

        // POST: api/Medicos
        [HttpPost]
        public async Task<ActionResult<MedicoDTO>> CreateMedico(MedicoCrearDTO medicoDTO)
        {
            var medico = new Medico
            {
                ID_Medico = medicoDTO.ID_Medico,
                Nombre = medicoDTO.Nombre,
                Apellido_Paterno = medicoDTO.Apellido_Paterno,
                Apellido_Materno = medicoDTO.Apellido_Materno,
                Correo = medicoDTO.Correo,
                Telefono = medicoDTO.Telefono,
                ID_Especialidad = medicoDTO.ID_Especialidad,
                Estado = medicoDTO.Estado,
                ID_Estatus = medicoDTO.ID_Estatus,
                Fecha_Creacion = DateTime.Now
            };

            _context.Medicos.Add(medico);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMedico", new { id = medico.ID_Medico }, new MedicoDTO
            {
                ID_Medico = medico.ID_Medico,
                Nombre = medico.Nombre,
                Apellido_Paterno = medico.Apellido_Paterno,
                Apellido_Materno = medico.Apellido_Materno,
                Correo = medico.Correo,
                Telefono = medico.Telefono,
                ID_Especialidad = medico.ID_Especialidad,
                Estado = medico.Estado,
                ID_Estatus = medico.ID_Estatus,
                Fecha_Creacion = medico.Fecha_Creacion
            });
        }

        // PUT: api/Medicos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedico(int id, MedicoActualizarDTO medicoDTO)
        {
            var medico = await _context.Medicos.FindAsync(id);
            if (medico == null)
            {
                return NotFound();
            }

            // Actualizar solo los campos que no son nulos
            if (medicoDTO.Nombre != null)
                medico.Nombre = medicoDTO.Nombre;
            
            if (medicoDTO.Apellido_Paterno != null)
                medico.Apellido_Paterno = medicoDTO.Apellido_Paterno;
            
            if (medicoDTO.Apellido_Materno != null)
                medico.Apellido_Materno = medicoDTO.Apellido_Materno;
            
            if (medicoDTO.Correo != null)
                medico.Correo = medicoDTO.Correo;
            
            if (medicoDTO.Telefono != null)
                medico.Telefono = medicoDTO.Telefono;
            
            if (medicoDTO.ID_Especialidad.HasValue)
                medico.ID_Especialidad = medicoDTO.ID_Especialidad;
            
            if (medicoDTO.Estado != null)
                medico.Estado = medicoDTO.Estado;
            
            if (medicoDTO.ID_Estatus.HasValue)
                medico.ID_Estatus = medicoDTO.ID_Estatus;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MedicoExists(id))
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

        // DELETE: api/Medicos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedico(int id)
        {
            var medico = await _context.Medicos.FindAsync(id);
            if (medico == null)
            {
                return NotFound();
            }

            _context.Medicos.Remove(medico);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MedicoExists(int id)
        {
            return _context.Medicos.Any(e => e.ID_Medico == id);
        }

        // GET: api/Medicos/Especialidad/1
        [HttpGet("Especialidad/{id}")]
        public async Task<ActionResult<IEnumerable<MedicoDTO>>> GetMedicosByEspecialidad(int id)
        {
            var medicos = await _context.Medicos
                .Include(m => m.Especialidad)
                .Include(m => m.Estatus)
                .Where(m => m.ID_Especialidad == id)
                .Select(m => new MedicoDTO
                {
                    ID_Medico = m.ID_Medico,
                    Nombre = m.Nombre,
                    Apellido_Paterno = m.Apellido_Paterno,
                    Apellido_Materno = m.Apellido_Materno,
                    Correo = m.Correo,
                    Telefono = m.Telefono,
                    ID_Especialidad = m.ID_Especialidad,
                    NombreEspecialidad = m.Especialidad != null ? m.Especialidad.Nombre_Especialidad : null,
                    Estado = m.Estado,
                    ID_Estatus = m.ID_Estatus,
                    NombreEstatus = m.Estatus != null ? m.Estatus.Nombre_Estatus : null,
                    Fecha_Creacion = m.Fecha_Creacion
                })
                .ToListAsync();

            return medicos;
        }
    }
}
