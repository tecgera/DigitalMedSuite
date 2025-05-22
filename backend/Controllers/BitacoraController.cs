using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        }

        // GET: api/Bitacora/Fecha/2023-05-30
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
    }
}
