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
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        // GET: api/customer
        [HttpGet]
        public async Task<IActionResult> GetAllCustomers()
        {
            if (!UserAuthVHelper.VerifyUser(User, new UserRole[] { UserRole.Admin }, out string? errorMessage))
                return Unauthorized(new { Message = errorMessage });


            var response = await _customerService.GetAllCustomersAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        // GET: api/customer/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCustomerById(int id)
        {
            if (!UserAuthVHelper.VerifyUser(User, new UserRole[] { UserRole.Admin, UserRole.Customer }, out string? errorMessage))
                return Unauthorized(new { Message = errorMessage });

            var response = await _customerService.GetCustomerByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        // POST: api/customer
        [HttpPost]
        [AllowAnonymous] // Optional: allow new customer registration without JWT
        public async Task<IActionResult> RegisterCustomer([FromBody] CustomerDto customerDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _customerService.RegisterCustomerAsync(customerDto);
            return response.Success
                ? CreatedAtAction(nameof(GetCustomerById), new { id = response.Data?.Id }, response)
                : BadRequest(response);
        }
    }
}
