using MaidForYou.Application.DTOs;
using MaidForYou.Application.Interfaces.IServices;
using MaidForYou.API.Helpers;
using Microsoft.AspNetCore.Mvc;
using MaidForYou.Application.Interfaces;

namespace MaidForYou.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IRoleService _roleService;

        public BookingController(IBookingService bookingService, IRoleService roleService)
        {
            _bookingService = bookingService;
            _roleService = roleService;
        }

        // GET: api/booking
        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _bookingService.GetAllBookingsAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        // GET: api/booking/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _bookingService.GetBookingByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        // POST: api/booking
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingDto bookingDto)
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _bookingService.CreateBookingAsync(bookingDto);
            return response.Success ? Ok(response) : BadRequest(response);
        }

        // DELETE: api/booking/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _bookingService.CancelBookingAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }
    }
}
