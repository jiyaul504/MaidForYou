using MaidForYou.Application.DTOs;
using MaidForYou.Application.Interfaces.IServices;
using MaidForYou.API.Helpers;
using Microsoft.AspNetCore.Mvc;
using MaidForYou.Application.Interfaces;

namespace MaidForYou.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly IRoleService _roleService;

        public CustomerController(ICustomerService customerService,IRoleService roleService)
        {
            _roleService = roleService;
            _customerService = customerService;
        }

        // GET: api/customer
        [HttpGet]
        public async Task<IActionResult> GetAllCustomers()
        {
           var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _customerService.GetAllCustomersAsync();
            return response.Success ? Ok(response) : BadRequest(response);
        }

        // GET: api/customer/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCustomerById(int id)
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _customerService.GetCustomerByIdAsync(id);
            return response.Success ? Ok(response) : NotFound(response);
        }

        // POST: api/customer
        [HttpPost]
        public async Task<IActionResult> RegisterCustomer([FromBody] CustomerDto customerDto)
        {
            var authResponse = await UserAuthVHelper.VerifyUser(User, _roleService);
            if (!authResponse.Success)
                return StatusCode(authResponse.StatusCode, new { Message = authResponse.Message });

            var response = await _customerService.RegisterCustomerAsync(customerDto);
            return response.Success ? Ok(response) : BadRequest(response);
        }
    }
}
