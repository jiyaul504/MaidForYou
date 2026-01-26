using MaidForYou.API.Helpers;
using MaidForYou.Application.DTOs;
using MaidForYou.Application.DTOs.Common;
using MaidForYou.Application.Interfaces;
using MaidForYou.Application.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace MaidForYou.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaidController : ControllerBase
    {
        private readonly IMaidService _maidService;
        private readonly IRoleService _roleService;
        public MaidController(IMaidService maidService,IRoleService roleService)
        {
            _roleService=roleService;
            _maidService = maidService;
        }

        // GET: api/maid/available
        //[HttpGet("available")]
        //public async Task<IActionResult> GetAvailableMaids()
        //{
        //    var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
        //    if (!authResponse.Success)
        //        return StatusCode(authResponse.StatusCode, new {Message=authResponse.Message});

        //    var response = await _maidService.GetAvailableMaidsAsync();
        //    return response.Success ? Ok(response) : BadRequest(response);
        //}
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableMaids([FromQuery] PaginationQueryDto query)
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _maidService.GetAvailableMaidsAsync(query);
            return response.Success ? Ok(response) : BadRequest(response);
        }


        // GET: api/maid/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetMaidById(int id)
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _maidService.GetMaidByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        // POST: api/maid
        [HttpPost]
        public async Task<IActionResult> RegisterMaid([FromBody] MaidDto maidDto)
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _maidService.RegisterMaidAsync(maidDto);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        // PUT: api/maid/{id}/availability
        [HttpPut("{id:int}/availability")]
        public async Task<IActionResult> UpdateAvailability(int id, [FromQuery] bool isAvailable)
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _maidService.UpdateAvailabilityAsync(id, isAvailable);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
