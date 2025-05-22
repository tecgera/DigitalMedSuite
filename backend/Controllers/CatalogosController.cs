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
        }
    }
}
