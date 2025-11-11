using MaidForYou.Application.Common.Models;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Application.Interfaces
{
    public interface IRoleService
    {
        Task<ApiResponse<IEnumerable<Role>>> GetAllAsync();
        Task<ApiResponse<Role>> GetByIdAsync(int id);
        Task<ApiResponse<Role>> CreateAsync(Role role);
        Task<ApiResponse<Role>> UpdateAsync(Role role);
        Task<ApiResponse<string>> DeleteAsync(int id);
    }
}
