using MaidForYou.Application.DTOs;
using MaidForYou.Application.Interfaces.IServices;
using MaidForYou.Domain.Enums;
using MaidForYou.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaidForYou.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class MaidController : ControllerBase
    {
        private readonly IMaidService _maidService;

        public MaidController(IMaidService maidService)
        {
            _maidService = maidService;
        }

        // GET: api/maid/available
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableMaids()
        {
            // Admin and Customer can view available maids
            if (!UserAuthVHelper.VerifyUser(User, new UserRole[] { UserRole.Admin, UserRole.Customer }, out string? errorMessage))
                return Unauthorized(new { Message = errorMessage });

            var response = await _maidService.GetAvailableMaidsAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        // GET: api/maid/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetMaidById(int id)
        {
            // Admin, Customer, or Maid can view maid details
            if (!UserAuthVHelper.VerifyUser(User, new UserRole[] { UserRole.Admin, UserRole.Customer, UserRole.Maid }, out string? errorMessage))
                return Unauthorized(new { Message = errorMessage });

            var response = await _maidService.GetMaidByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        // POST: api/maid
        [HttpPost]
        public async Task<IActionResult> RegisterMaid([FromBody] MaidDto maidDto)
        {
            // Only Admin can register new maids
            if (!UserAuthVHelper.VerifyUser(User, new UserRole[] { UserRole.Admin }, out string? errorMessage))
                return Unauthorized(new { Message = errorMessage });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _maidService.RegisterMaidAsync(maidDto);
            return response.Success
                ? CreatedAtAction(nameof(GetMaidById), new { id = response.Data?.Id }, response)
                : BadRequest(response);
        }

        // PUT: api/maid/{id}/availability
        [HttpPut("{id:int}/availability")]
        public async Task<IActionResult> UpdateAvailability(int id, [FromQuery] bool isAvailable)
        {
            // Only Admin can update maid availability
            if (!UserAuthVHelper.VerifyUser(User, new UserRole[] { UserRole.Admin }, out string? errorMessage))
                return Unauthorized(new { Message = errorMessage });

            var response = await _maidService.UpdateAvailabilityAsync(id, isAvailable);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
