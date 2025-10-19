using MaidForYou.Application.Common.Models;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Domain.Interfaces
{
    public interface ICustomerRepository
    {
        Task<ApiResponse<Customer?>> GetByIdAsync(int id);
        Task<ApiResponse<int>> AddAsync(Customer customer);
    }
}
