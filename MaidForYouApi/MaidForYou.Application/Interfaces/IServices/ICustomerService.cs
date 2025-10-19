using MaidForYou.Application.Common.Models;
using MaidForYou.Application.DTOs;

namespace MaidForYou.Application.Interfaces.IServices
{
    public interface ICustomerService
    {
        Task<ApiResponse<CustomerDto?>> GetCustomerByIdAsync(int id);
        Task<ApiResponse<CustomerDto>> RegisterCustomerAsync(CustomerDto customerDto);
        Task<ApiResponse<IEnumerable<CustomerDto>>> GetAllCustomersAsync();
    }
}
