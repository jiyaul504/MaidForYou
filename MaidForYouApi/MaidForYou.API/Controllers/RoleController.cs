using MaidForYou.API.Helpers;
using MaidForYou.Application.Interfaces;
using MaidForYou.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace MaidForYou.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _roleService.GetAllAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _roleService.GetByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Role role)
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _roleService.CreateAsync(role);
            return response.Success ? Ok(response) : BadRequest(response);

        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromBody] Role role)
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _roleService.UpdateAsync(role);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _roleService.DeleteAsync(id);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
