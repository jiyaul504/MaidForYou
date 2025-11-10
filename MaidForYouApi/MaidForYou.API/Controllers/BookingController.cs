using MaidForYou.Application.DTOs;
using MaidForYou.Application.Interfaces.IServices;
using MaidForYou.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaidForYou.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        // GET: api/booking
        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            if (!UserAuthVHelper.VerifyUser(User, new[] { "Admin" }, out string? errorMessage))
                return Forbid(errorMessage);

            var response = await _bookingService.GetAllBookingsAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        // GET: api/booking/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            if (!UserAuthVHelper.VerifyUser(User, new[] { "Admin", "Customer", "Maid" }, out string? errorMessage))
                return Forbid(errorMessage);

            var response = await _bookingService.GetBookingByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        // POST: api/booking
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] BookingDto bookingDto)
        {
            if (!UserAuthVHelper.VerifyUser(User, new[] { "Customer" }, out string? errorMessage))
                return Forbid(errorMessage);

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _bookingService.CreateBookingAsync(bookingDto);

            return response.Success
                ? CreatedAtAction(nameof(GetBookingById), new { id = response.Data?.Id }, response)
                : BadRequest(response);
        }

        // DELETE: api/booking/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            if (!UserAuthVHelper.VerifyUser(User, new[] { "Admin", "Customer" }, out string? errorMessage))
                return Forbid(errorMessage);

            var response = await _bookingService.CancelBookingAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }
    }
}
