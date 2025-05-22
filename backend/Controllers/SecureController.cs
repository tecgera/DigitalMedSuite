using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SecureController : ControllerBase
    {
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetPublic()
        {
            return Ok(new { message = "This is a public endpoint. Anyone can access it." });
        }

        [HttpGet("protected")]
        [Authorize]
        public IActionResult GetProtected()
        {
            var userName = User.Identity?.Name;
            return Ok(new { message = $"Hello, {userName}! This is a protected endpoint. Only authenticated users can access it." });
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Administrador")]
        public IActionResult GetAdmin()
        {
            return Ok(new { message = "This is an admin endpoint. Only users with Administrator role can access it." });
        }
    }
}
