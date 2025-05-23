using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BitacoraController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BitacoraController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Bitacora
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bitacora>>> GetBitacora()
        {
            return await _context.Bitacoras
                .Include(b => b.Tabla)
                .Include(b => b.TipoMovimiento)
                .OrderByDescending(b => b.Fecha_Modificacion)
                .ToListAsync();
        }

        // GET: api/Bitacora/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bitacora>> GetBitacora(int id)
        {
            var bitacora = await _context.Bitacoras
                .Include(b => b.Tabla)
                .Include(b => b.TipoMovimiento)
                .FirstOrDefaultAsync(b => b.ID_Bitacora == id);

            if (bitacora == null)
            {
                return NotFound();
            }

            return bitacora;
        }

        // GET: api/Bitacora/Tabla/1
        [HttpGet("Tabla/{id}")]
        public async Task<ActionResult<IEnumerable<Bitacora>>> GetBitacoraByTabla(int id)
        {
            return await _context.Bitacoras
                .Include(b => b.Tabla)
                .Include(b => b.TipoMovimiento)
                .Where(b => b.ID_Tabla == id)
                .OrderByDescending(b => b.Fecha_Modificacion)
                .ToListAsync();
        }

        // GET: api/Bitacora/Registro/1/Tabla/2
        [HttpGet("Registro/{idRegistro}/Tabla/{idTabla}")]
        public async Task<ActionResult<IEnumerable<Bitacora>>> GetBitacoraByRegistroAndTabla(int idRegistro, int idTabla)
        {
            return await _context.Bitacoras
                .Include(b => b.Tabla)
                .Include(b => b.TipoMovimiento)
                .Where(b => b.ID_Registro == idRegistro && b.ID_Tabla == idTabla)
                .OrderByDescending(b => b.Fecha_Modificacion)
                .ToListAsync();
        }

        // GET: api/Bitacora/Usuario/admin
        [HttpGet("Usuario/{usuario}")]
        public async Task<ActionResult<IEnumerable<Bitacora>>> GetBitacoraByUsuario(string usuario)
        {
            return await _context.Bitacoras
                .Include(b => b.Tabla)
                .Include(b => b.TipoMovimiento)
                .Where(b => b.Usuario != null && b.Usuario.Contains(usuario))
                .OrderByDescending(b => b.Fecha_Modificacion)
                .ToListAsync();
        }        // GET: api/Bitacora/Fecha/2023-05-30
        [HttpGet("Fecha/{fecha}")]
        public async Task<ActionResult<IEnumerable<Bitacora>>> GetBitacoraByFecha(DateTime fecha)
        {
            return await _context.Bitacoras
                .Include(b => b.Tabla)
                .Include(b => b.TipoMovimiento)
                .Where(b => b.Fecha_Modificacion.Date == fecha.Date)
                .OrderByDescending(b => b.Fecha_Modificacion)
                .ToListAsync();
        }

        // *** NUEVO SISTEMA DE BITÁCORA CON EVENTOS ***

        // POST: api/Bitacora/RegistrarEvento
        [HttpPost("RegistrarEvento")]
        [Authorize]
        public async Task<ActionResult<EventoBitacora>> RegistrarEvento(EventoBitacora evento)
        {
            if (evento == null)
            {
                return BadRequest("Datos del evento no proporcionados");
            }

            // Asignar usuario del token si no está definido
            if (string.IsNullOrEmpty(evento.Usuario))
            {
                evento.Usuario = User.Identity?.Name;
            }

            // Asignar fecha actual si no está definida
            if (evento.FechaHora == default)
            {
                evento.FechaHora = DateTime.Now;
            }

            _context.EventosBitacora.Add(evento);
            await _context.SaveChangesAsync();

            return CreatedAtAction("ObtenerEvento", new { id = evento.ID_Evento }, evento);
        }

        // GET: api/Bitacora/ObtenerEvento/5
        [HttpGet("ObtenerEvento/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<EventoBitacora>> ObtenerEvento(int id)
        {
            var evento = await _context.EventosBitacora.FindAsync(id);

            if (evento == null)
            {
                return NotFound();
            }

            return evento;
        }

        // GET: api/Bitacora/ObtenerEventos
        [HttpGet("ObtenerEventos")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<EventoBitacora>>> ObtenerEventos(
            [FromQuery] string? usuario = null,
            [FromQuery] string? accion = null,
            [FromQuery] string? entidad = null,
            [FromQuery] DateTime? fechaDesde = null,
            [FromQuery] DateTime? fechaHasta = null,
            [FromQuery] int? limite = 100)
        {
            IQueryable<EventoBitacora> query = _context.EventosBitacora;

            // Aplicar filtros si se proporcionan
            if (!string.IsNullOrEmpty(usuario))
                query = query.Where(e => e.Usuario != null && e.Usuario.Contains(usuario));

            if (!string.IsNullOrEmpty(accion))
                query = query.Where(e => e.Accion.Contains(accion));

            if (!string.IsNullOrEmpty(entidad))
                query = query.Where(e => e.Entidad.Contains(entidad));

            if (fechaDesde.HasValue)
                query = query.Where(e => e.FechaHora >= fechaDesde.Value);

            if (fechaHasta.HasValue)
                query = query.Where(e => e.FechaHora <= fechaHasta.Value);

            // Ordenar por fecha descendente (más recientes primero)
            query = query.OrderByDescending(e => e.FechaHora);

            // Limitar resultados
            if (limite.HasValue && limite > 0)
                query = query.Take(limite.Value);

            return await query.ToListAsync();
        }
    }
}
