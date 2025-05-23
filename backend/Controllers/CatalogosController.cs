using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CatalogosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CatalogosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Catalogos/Roles
        [HttpGet("Roles")]
        public async Task<ActionResult<IEnumerable<Rol>>> GetRoles()
        {
            return await _context.Roles.ToListAsync();
        }

        // GET: api/Catalogos/EstatusUsuarios
        [HttpGet("EstatusUsuarios")]
        public async Task<ActionResult<IEnumerable<EstatusUsuario>>> GetEstatusUsuarios()
        {
            return await _context.EstatusUsuarios.ToListAsync();
        }

        // GET: api/Catalogos/EstatusMedicos
        [HttpGet("EstatusMedicos")]
        public async Task<ActionResult<IEnumerable<EstatusMedico>>> GetEstatusMedicos()
        {
            return await _context.EstatusMedicos.ToListAsync();
        }

        // GET: api/Catalogos/EstatusPacientes
        [HttpGet("EstatusPacientes")]
        public async Task<ActionResult<IEnumerable<EstatusPaciente>>> GetEstatusPacientes()
        {
            return await _context.EstatusPacientes.ToListAsync();
        }

        // GET: api/Catalogos/EstatusConsultorios
        [HttpGet("EstatusConsultorios")]
        public async Task<ActionResult<IEnumerable<EstatusConsultorio>>> GetEstatusConsultorios()
        {
            return await _context.EstatusConsultorios.ToListAsync();
        }

        // GET: api/Catalogos/EstatusCitas
        [HttpGet("EstatusCitas")]
        public async Task<ActionResult<IEnumerable<EstatusCita>>> GetEstatusCitas()
        {
            return await _context.EstatusCitas.ToListAsync();
        }

        // GET: api/Catalogos/Especialidades
        [HttpGet("Especialidades")]
        public async Task<ActionResult<IEnumerable<Especialidad>>> GetEspecialidades()
        {
            return await _context.Especialidades.ToListAsync();
        }

        // GET: api/Catalogos/Alergias
        [HttpGet("Alergias")]
        public async Task<ActionResult<IEnumerable<Alergia>>> GetAlergias()
        {
            return await _context.Alergias.ToListAsync();
        }

        // GET: api/Catalogos/Operaciones
        [HttpGet("Operaciones")]
        public async Task<ActionResult<IEnumerable<Operacion>>> GetOperaciones()
        {
            return await _context.Operaciones.ToListAsync();
        }

        // GET: api/Catalogos/Padecimientos
        [HttpGet("Padecimientos")]
        public async Task<ActionResult<IEnumerable<Padecimiento>>> GetPadecimientos()
        {
            return await _context.Padecimientos.ToListAsync();
        }

        // GET: api/Catalogos/Generos
        [HttpGet("Generos")]
        public async Task<ActionResult<IEnumerable<Genero>>> GetGeneros()
        {
            return await _context.Generos.ToListAsync();
        }

        // GET: api/Catalogos/TiposSangre
        [HttpGet("TiposSangre")]
        public async Task<ActionResult<IEnumerable<TipoSangre>>> GetTiposSangre()
        {
            return await _context.TiposSangre.ToListAsync();
        }        // POST: api/Catalogos/CreateAlergia
        [HttpPost("CreateAlergia")]
        public async Task<ActionResult<Alergia>> CreateAlergia(Alergia alergia)
        {
            // Verificar si ya existe la alergia
            var existingAlergia = await _context.Alergias
                .FirstOrDefaultAsync(a => a.Nombre_Alergia.ToLower() == alergia.Nombre_Alergia.ToLower());
            
            if (existingAlergia != null)
            {
                return Ok(existingAlergia); // Devolver la existente para evitar duplicados
            }

            _context.Alergias.Add(alergia);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAlergias), new { id = alergia.ID_Alergias }, alergia);
        }        // POST: api/Catalogos/CreateOperacion
        [HttpPost("CreateOperacion")]
        public async Task<ActionResult<Operacion>> CreateOperacion(Operacion operacion)
        {
            // Verificar si ya existe la operación
            var existingOperacion = await _context.Operaciones
                .FirstOrDefaultAsync(o => o.Nombre_Operacion.ToLower() == operacion.Nombre_Operacion.ToLower());
            
            if (existingOperacion != null)
            {
                return Ok(existingOperacion); // Devolver la existente para evitar duplicados
            }

            _context.Operaciones.Add(operacion);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOperaciones), new { id = operacion.ID_Operaciones }, operacion);
        }        // POST: api/Catalogos/CreatePadecimiento
        [HttpPost("CreatePadecimiento")]
        public async Task<ActionResult<Padecimiento>> CreatePadecimiento(Padecimiento padecimiento)
        {
            // Verificar si ya existe el padecimiento
            var existingPadecimiento = await _context.Padecimientos
                .FirstOrDefaultAsync(p => p.Nombre_Padecimiento.ToLower() == padecimiento.Nombre_Padecimiento.ToLower());
            
            if (existingPadecimiento != null)
            {
                return Ok(existingPadecimiento); // Devolver el existente para evitar duplicados
            }

            _context.Padecimientos.Add(padecimiento);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPadecimientos), new { id = padecimiento.ID_Padecimientos }, padecimiento);
        }
    }
}
