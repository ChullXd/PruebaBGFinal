using Microsoft.AspNetCore.Mvc;
using BankBG.DTOs;
using BankBG.Services;

namespace BankBG.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var result = await _authService.RegisterAsync(model);
            if (result.Succeeded)
            {
                return Ok(new { Message = "Usuario registrado exitosamente" });
            }
            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var token = await _authService.LoginAsync(model);
            if (token == null)
            {
                return Unauthorized(new { Message = "Credenciales inválidas" });
            }
            return Ok(new { Token = token });
        }
    }
}