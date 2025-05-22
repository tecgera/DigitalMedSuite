using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsultoriosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ConsultoriosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Consultorios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConsultorioDTO>>> GetConsultorios()
        {
            var consultorios = await _context.Consultorios
                .Include(c => c.Estatus)
                .Select(c => new ConsultorioDTO
                {
                    ID_Consultorio = c.ID_Consultorio,
                    Nombre_Consultorio = c.Nombre_Consultorio,
                    ID_Estatus = c.ID_Estatus,
                    EstatusNombre = c.Estatus != null ? c.Estatus.Nombre_Estatus : null
                })
                .ToListAsync();

            return consultorios;
        }

        // GET: api/Consultorios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ConsultorioDTO>> GetConsultorio(int id)
        {
            var consultorio = await _context.Consultorios
                .Include(c => c.Estatus)
                .FirstOrDefaultAsync(c => c.ID_Consultorio == id);

            if (consultorio == null)
            {
                return NotFound();
            }

            var consultorioDTO = new ConsultorioDTO
            {
                ID_Consultorio = consultorio.ID_Consultorio,
                Nombre_Consultorio = consultorio.Nombre_Consultorio,
                ID_Estatus = consultorio.ID_Estatus,
                EstatusNombre = consultorio.Estatus?.Nombre_Estatus
            };

            return consultorioDTO;
        }

        // POST: api/Consultorios
        [HttpPost]
        public async Task<ActionResult<ConsultorioDTO>> CreateConsultorio(ConsultorioCrearDTO consultorioDTO)
        {
            var consultorio = new Consultorio
            {
                Nombre_Consultorio = consultorioDTO.Nombre_Consultorio,
                ID_Estatus = consultorioDTO.ID_Estatus
            };

            _context.Consultorios.Add(consultorio);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetConsultorio", new { id = consultorio.ID_Consultorio }, new ConsultorioDTO
            {
                ID_Consultorio = consultorio.ID_Consultorio,
                Nombre_Consultorio = consultorio.Nombre_Consultorio,
                ID_Estatus = consultorio.ID_Estatus
            });
        }

        // PUT: api/Consultorios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateConsultorio(int id, ConsultorioActualizarDTO consultorioDTO)
        {
            var consultorio = await _context.Consultorios.FindAsync(id);
            if (consultorio == null)
            {
                return NotFound();
            }

            // Actualizar solo los campos que no son nulos
            if (consultorioDTO.Nombre_Consultorio != null)
                consultorio.Nombre_Consultorio = consultorioDTO.Nombre_Consultorio;
            
            if (consultorioDTO.ID_Estatus.HasValue)
                consultorio.ID_Estatus = consultorioDTO.ID_Estatus;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConsultorioExists(id))
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

        // DELETE: api/Consultorios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsultorio(int id)
        {
            var consultorio = await _context.Consultorios.FindAsync(id);
            if (consultorio == null)
            {
                return NotFound();
            }

            _context.Consultorios.Remove(consultorio);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ConsultorioExists(int id)
        {
            return _context.Consultorios.Any(e => e.ID_Consultorio == id);
        }
    }
}
