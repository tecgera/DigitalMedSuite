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
                .Include(m => m.EstatusMedico)
                .Select(m => new MedicoDTO
                {
                    ID_Medico = m.ID_Medico,
                    Nombre = m.Nombre,
                    Apellido_Paterno = m.Apellido_Paterno,
                    Apellido_Materno = m.Apellido_Materno,
                    Correo = m.Correo,
                    Telefono = m.Telefono,
                    ID_Especialidad = m.ID_Especialidad,
                    Especialidad = m.Especialidad != null ? m.Especialidad.Nombre_Especialidad : null,
                    Estado = m.Estado,
                    Fecha_Creacion = m.Fecha_Creacion,
                    ID_Estatus = m.ID_Estatus,
                    Estatus = m.EstatusMedico != null ? m.EstatusMedico.Nombre_Estatus : null
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
                .Include(m => m.EstatusMedico)
                .Where(m => m.ID_Medico == id)
                .Select(m => new MedicoDTO
                {
                    ID_Medico = m.ID_Medico,
                    Nombre = m.Nombre,
                    Apellido_Paterno = m.Apellido_Paterno,
                    Apellido_Materno = m.Apellido_Materno,
                    Correo = m.Correo,
                    Telefono = m.Telefono,
                    ID_Especialidad = m.ID_Especialidad,
                    Especialidad = m.Especialidad != null ? m.Especialidad.Nombre_Especialidad : null,
                    Estado = m.Estado,
                    Fecha_Creacion = m.Fecha_Creacion,
                    ID_Estatus = m.ID_Estatus,
                    Estatus = m.EstatusMedico != null ? m.EstatusMedico.Nombre_Estatus : null
                })
                .FirstOrDefaultAsync();

            if (medico == null)
            {
                return NotFound();
            }

            return medico;
        }

        // POST: api/Medicos
        [HttpPost]
        public async Task<ActionResult<MedicoDTO>> PostMedico(CreateMedicoDTO createMedicoDto)
        {
            var medico = new Medico
            {
                Nombre = createMedicoDto.Nombre,
                Apellido_Paterno = createMedicoDto.Apellido_Paterno,
                Apellido_Materno = createMedicoDto.Apellido_Materno,
                Correo = createMedicoDto.Correo,
                Telefono = createMedicoDto.Telefono,
                ID_Especialidad = createMedicoDto.ID_Especialidad,
                Estado = createMedicoDto.Estado,
                Fecha_Creacion = DateTime.Now
            };

            // Buscar el estatus "Activo" para el médico
            var estatusActivo = await _context.EstatusMedicos
                .FirstOrDefaultAsync(e => e.Nombre_Estatus == "Activo");
            if (estatusActivo != null)
            {
                medico.ID_Estatus = estatusActivo.ID_Estatus;
            }

            _context.Medicos.Add(medico);
            await _context.SaveChangesAsync();

            // Cargar los datos relacionados para devolver el DTO completo
            var medicoCreado = await GetMedico(medico.ID_Medico);
            return CreatedAtAction(nameof(GetMedico), new { id = medico.ID_Medico }, medicoCreado.Value);
        }

        // PUT: api/Medicos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedico(int id, UpdateMedicoDTO updateMedicoDto)
        {
            var medico = await _context.Medicos.FindAsync(id);
            if (medico == null)
            {
                return NotFound();
            }

            // Actualizar solo los campos que no son null en el DTO
            if (updateMedicoDto.Nombre != null)
                medico.Nombre = updateMedicoDto.Nombre;
            if (updateMedicoDto.Apellido_Paterno != null)
                medico.Apellido_Paterno = updateMedicoDto.Apellido_Paterno;
            if (updateMedicoDto.Apellido_Materno != null)
                medico.Apellido_Materno = updateMedicoDto.Apellido_Materno;
            if (updateMedicoDto.Correo != null)
                medico.Correo = updateMedicoDto.Correo;
            if (updateMedicoDto.Telefono != null)
                medico.Telefono = updateMedicoDto.Telefono;
            if (updateMedicoDto.ID_Especialidad.HasValue)
                medico.ID_Especialidad = updateMedicoDto.ID_Especialidad;
            if (updateMedicoDto.Estado != null)
                medico.Estado = updateMedicoDto.Estado;
            if (updateMedicoDto.ID_Estatus.HasValue)
                medico.ID_Estatus = updateMedicoDto.ID_Estatus;

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

            // En lugar de eliminar, actualizar el estatus a "Inactivo"
            var estatusInactivo = await _context.EstatusMedicos
                .FirstOrDefaultAsync(e => e.Nombre_Estatus == "Inactivo");
            if (estatusInactivo != null)
            {
                medico.ID_Estatus = estatusInactivo.ID_Estatus;
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

        private bool MedicoExists(int id)
        {
            return _context.Medicos.Any(e => e.ID_Medico == id);
        }

        // GET: api/Medicos/especialidades
        [HttpGet("especialidades")]
        public async Task<ActionResult<IEnumerable<Especialidad>>> GetEspecialidades()
        {
            return await _context.Especialidades.ToListAsync();
        }

        // GET: api/Medicos/por-especialidad/{especialidadId}
        [HttpGet("por-especialidad/{especialidadId}")]
        public async Task<ActionResult<IEnumerable<MedicoDTO>>> GetMedicosPorEspecialidad(int especialidadId)
        {
            var medicos = await _context.Medicos
                .Include(m => m.Especialidad)
                .Include(m => m.EstatusMedico)
                .Where(m => m.ID_Especialidad == especialidadId && m.ID_Estatus == 1) // Asumiendo que 1 es el ID de estatus "Activo"
                .Select(m => new MedicoDTO
                {
                    ID_Medico = m.ID_Medico,
                    Nombre = m.Nombre,
                    Apellido_Paterno = m.Apellido_Paterno,
                    Apellido_Materno = m.Apellido_Materno,
                    Correo = m.Correo,
                    Telefono = m.Telefono,
                    ID_Especialidad = m.ID_Especialidad,
                    Especialidad = m.Especialidad != null ? m.Especialidad.Nombre_Especialidad : null,
                    Estado = m.Estado,
                    Fecha_Creacion = m.Fecha_Creacion,
                    ID_Estatus = m.ID_Estatus,
                    Estatus = m.EstatusMedico != null ? m.EstatusMedico.Nombre_Estatus : null
                })
                .ToListAsync();

            return medicos;
        }
    }
}