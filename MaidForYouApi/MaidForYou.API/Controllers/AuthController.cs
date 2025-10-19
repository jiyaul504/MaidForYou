using MaidForYou.Application.DTOs.Auth;
using MaidForYou.Application.Helpers;
using MaidForYou.Application.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MaidForYou.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var response = await _authService.RegisterAsync(request);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var response = await _authService.LoginAsync(request);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "";
            var response = await _authService.LogoutAsync(userId);
            return StatusCode(response.StatusCode, response);
        }
    }
}
