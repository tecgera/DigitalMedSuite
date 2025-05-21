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
                .Include(p => p.EstatusPaciente)
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
                    TipoSangre = p.TipoSangre != null ? p.TipoSangre.Tipo_Sangre : null,
                    ID_Alergias = p.ID_Alergias,
                    Alergia = p.Alergia != null ? p.Alergia.Nombre_Alergia : null,
                    ID_Operaciones = p.ID_Operaciones,
                    Operacion = p.Operacion != null ? p.Operacion.Nombre_Operacion : null,
                    ID_Padecimientos = p.ID_Padecimientos,
                    Padecimiento = p.Padecimiento != null ? p.Padecimiento.Nombre_Padecimiento : null,
                    ID_Genero = p.ID_Genero,
                    Genero = p.Genero != null ? p.Genero.Genero_Nombre : null,
                    CURP = p.CURP,
                    Fecha_Registro = p.Fecha_Registro,
                    ID_Estatus = p.ID_Estatus,
                    Estatus = p.EstatusPaciente != null ? p.EstatusPaciente.Nombre_Estatus : null
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
                .Include(p => p.EstatusPaciente)
                .Where(p => p.ID_Paciente == id)
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
                    TipoSangre = p.TipoSangre != null ? p.TipoSangre.Tipo_Sangre : null,
                    ID_Alergias = p.ID_Alergias,
                    Alergia = p.Alergia != null ? p.Alergia.Nombre_Alergia : null,
                    ID_Operaciones = p.ID_Operaciones,
                    Operacion = p.Operacion != null ? p.Operacion.Nombre_Operacion : null,
                    ID_Padecimientos = p.ID_Padecimientos,
                    Padecimiento = p.Padecimiento != null ? p.Padecimiento.Nombre_Padecimiento : null,
                    ID_Genero = p.ID_Genero,
                    Genero = p.Genero != null ? p.Genero.Genero_Nombre : null,
                    CURP = p.CURP,
                    Fecha_Registro = p.Fecha_Registro,
                    ID_Estatus = p.ID_Estatus,
                    Estatus = p.EstatusPaciente != null ? p.EstatusPaciente.Nombre_Estatus : null
                })
                .FirstOrDefaultAsync();

            if (paciente == null)
            {
                return NotFound();
            }

            return paciente;
        }

        // POST: api/Pacientes
        [HttpPost]
        public async Task<ActionResult<PacienteDTO>> PostPaciente(CreatePacienteDTO createPacienteDto)
        {
            var paciente = new Paciente
            {
                Nombre = createPacienteDto.Nombre,
                Apellido_Paterno = createPacienteDto.Apellido_Paterno,
                Apellido_Materno = createPacienteDto.Apellido_Materno,
                Fecha_Nacimiento = createPacienteDto.Fecha_Nacimiento,
                Calle = createPacienteDto.Calle,
                Codigo_Postal = createPacienteDto.Codigo_Postal,
                Num_Calle = createPacienteDto.Num_Calle,
                Correo_Electronico = createPacienteDto.Correo_Electronico,
                Telefono = createPacienteDto.Telefono,
                Altura = createPacienteDto.Altura,
                Peso = createPacienteDto.Peso,
                ID_Tipo = createPacienteDto.ID_Tipo,
                ID_Alergias = createPacienteDto.ID_Alergias,
                ID_Operaciones = createPacienteDto.ID_Operaciones,
                ID_Padecimientos = createPacienteDto.ID_Padecimientos,
                ID_Genero = createPacienteDto.ID_Genero,
                CURP = createPacienteDto.CURP,
                Fecha_Registro = DateTime.Now
            };

            // Buscar el estatus "Activo" para el paciente
            var estatusActivo = await _context.EstatusPacientes
                .FirstOrDefaultAsync(e => e.Nombre_Estatus == "Activo");
            if (estatusActivo != null)
            {
                paciente.ID_Estatus = estatusActivo.ID_Estatus;
            }

            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();

            // Cargar los datos relacionados para devolver el DTO completo
            var pacienteCreado = await GetPaciente(paciente.ID_Paciente);
            return CreatedAtAction(nameof(GetPaciente), new { id = paciente.ID_Paciente }, pacienteCreado.Value);
        }

        // PUT: api/Pacientes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaciente(int id, UpdatePacienteDTO updatePacienteDto)
        {
            var paciente = await _context.Pacientes.FindAsync(id);
            if (paciente == null)
            {
                return NotFound();
            }

            // Actualizar solo los campos que no son null en el DTO
            if (updatePacienteDto.Nombre != null)
                paciente.Nombre = updatePacienteDto.Nombre;
            if (updatePacienteDto.Apellido_Paterno != null)
                paciente.Apellido_Paterno = updatePacienteDto.Apellido_Paterno;
            if (updatePacienteDto.Apellido_Materno != null)
                paciente.Apellido_Materno = updatePacienteDto.Apellido_Materno;
            if (updatePacienteDto.Fecha_Nacimiento.HasValue)
                paciente.Fecha_Nacimiento = updatePacienteDto.Fecha_Nacimiento;
            if (updatePacienteDto.Calle != null)
                paciente.Calle = updatePacienteDto.Calle;
            if (updatePacienteDto.Codigo_Postal.HasValue)
                paciente.Codigo_Postal = updatePacienteDto.Codigo_Postal;
            if (updatePacienteDto.Num_Calle.HasValue)
                paciente.Num_Calle = updatePacienteDto.Num_Calle;
            if (updatePacienteDto.Correo_Electronico != null)
                paciente.Correo_Electronico = updatePacienteDto.Correo_Electronico;
            if (updatePacienteDto.Telefono != null)
                paciente.Telefono = updatePacienteDto.Telefono;
            if (updatePacienteDto.Altura.HasValue)
                paciente.Altura = updatePacienteDto.Altura;
            if (updatePacienteDto.Peso.HasValue)
                paciente.Peso = updatePacienteDto.Peso;
            if (updatePacienteDto.ID_Tipo.HasValue)
                paciente.ID_Tipo = updatePacienteDto.ID_Tipo;
            if (updatePacienteDto.ID_Alergias.HasValue)
                paciente.ID_Alergias = updatePacienteDto.ID_Alergias;
            if (updatePacienteDto.ID_Operaciones.HasValue)
                paciente.ID_Operaciones = updatePacienteDto.ID_Operaciones;
            if (updatePacienteDto.ID_Padecimientos.HasValue)
                paciente.ID_Padecimientos = updatePacienteDto.ID_Padecimientos;
            if (updatePacienteDto.ID_Genero.HasValue)
                paciente.ID_Genero = updatePacienteDto.ID_Genero;
            if (updatePacienteDto.CURP != null)
                paciente.CURP = updatePacienteDto.CURP;
            if (updatePacienteDto.ID_Estatus.HasValue)
                paciente.ID_Estatus = updatePacienteDto.ID_Estatus;

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

            // En lugar de eliminar, actualizar el estatus a "Inactivo"
            var estatusInactivo = await _context.EstatusPacientes
                .FirstOrDefaultAsync(e => e.Nombre_Estatus == "Inactivo");
            if (estatusInactivo != null)
            {
                paciente.ID_Estatus = estatusInactivo.ID_Estatus;
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

        private bool PacienteExists(int id)
        {
            return _context.Pacientes.Any(e => e.ID_Paciente == id);
        }

        // GET: api/Pacientes/tipos-sangre
        [HttpGet("tipos-sangre")]
        public async Task<ActionResult<IEnumerable<TipoSangre>>> GetTiposSangre()
        {
            return await _context.TiposSangre.ToListAsync();
        }

        // GET: api/Pacientes/alergias
        [HttpGet("alergias")]
        public async Task<ActionResult<IEnumerable<Alergia>>> GetAlergias()
        {
            return await _context.Alergias.ToListAsync();
        }

        // GET: api/Pacientes/operaciones
        [HttpGet("operaciones")]
        public async Task<ActionResult<IEnumerable<Operacion>>> GetOperaciones()
        {
            return await _context.Operaciones.ToListAsync();
        }

        // GET: api/Pacientes/padecimientos
        [HttpGet("padecimientos")]
        public async Task<ActionResult<IEnumerable<Padecimiento>>> GetPadecimientos()
        {
            return await _context.Padecimientos.ToListAsync();
        }

        // GET: api/Pacientes/generos
        [HttpGet("generos")]
        public async Task<ActionResult<IEnumerable<Genero>>> GetGeneros()
        {
            return await _context.Generos.ToListAsync();
        }
    }
}