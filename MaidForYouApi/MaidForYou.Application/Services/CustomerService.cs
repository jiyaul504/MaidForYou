using MaidForYou.Application.Common.Models;
using MaidForYou.Application.DTOs;
using MaidForYou.Application.Interfaces.IRepositories;
using MaidForYou.Application.Interfaces.IServices;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Application.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CustomerService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<CustomerDto?>> GetCustomerByIdAsync(int id)
        {
            var customerResponse = await _unitOfWork.Customers.GetByIdAsync(id);
            if (!customerResponse.Success || customerResponse.Data == null)
                return ApiResponse<CustomerDto?>.FailureResponse("Customer not found.");

            var dto = new CustomerDto
            {
                Id = customerResponse.Data.Id,
                FullName = customerResponse.Data.FullName,
                Email = customerResponse.Data.Email,
                Phone = customerResponse.Data.Phone
            };

            return ApiResponse<CustomerDto?>.SuccessResponse(dto);
        }

        public async Task<ApiResponse<CustomerDto>> RegisterCustomerAsync(CustomerDto customerDto)
        {
            var customer = new Customer
            {
                FullName = customerDto.FullName,
                Email = customerDto.Email,
                Phone = customerDto.Phone,
                CreatedAt = DateTime.UtcNow
            };

            var addResponse = await _unitOfWork.Customers.AddAsync(customer);
            if (!addResponse.Success)
            {
                await _unitOfWork.RollbackAsync();
                return ApiResponse<CustomerDto>.FailureResponse(addResponse.Message ?? "Failed to register customer.");
            }

            await _unitOfWork.CommitAsync();

            var resultDto = new CustomerDto
            {
                Id = customer.Id,
                FullName = customer.FullName,
                Email = customer.Email,
                Phone = customer.Phone
            };

            return ApiResponse<CustomerDto>.SuccessResponse(resultDto, "Customer registered successfully.");
        }

        public async Task<ApiResponse<IEnumerable<CustomerDto>>> GetAllCustomersAsync()
        {
            var customersResponse = await _unitOfWork.Customers.GetAllAsync();
            if (!customersResponse.Success || customersResponse.Data == null)
                return ApiResponse<IEnumerable<CustomerDto>>.FailureResponse(customersResponse.Message ?? "Failed to load customers.");

            var dtos = customersResponse.Data.Select(c => new CustomerDto
            {
                Id = c.Id,
                FullName = c.FullName,
                Email = c.Email,
                Phone = c.Phone
            });

            return ApiResponse<IEnumerable<CustomerDto>>.SuccessResponse(dtos);
        }
    }
}
