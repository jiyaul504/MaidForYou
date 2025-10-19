using MaidForYou.Application.Common.Models;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Application.Interfaces.IRepositories
{
    public interface ICustomerRepository
    {
        Task<ApiResponse<Customer?>> GetByIdAsync(int id);
        Task<ApiResponse<int>> AddAsync(Customer customer);
        Task<ApiResponse<bool>> UpdateAsync(Customer customer);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<IEnumerable<Customer>>> GetAllAsync();
    }
}
