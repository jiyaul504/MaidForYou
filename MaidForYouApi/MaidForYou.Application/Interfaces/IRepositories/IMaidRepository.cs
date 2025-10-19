using MaidForYou.Application.Common.Models;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Application.Interfaces.IRepositories
{
    public interface IMaidRepository
    {
        Task<ApiResponse<Maid?>> GetByIdAsync(int id);
        Task<ApiResponse<IEnumerable<Maid>>> GetAvailableAsync();
        Task<ApiResponse<IEnumerable<Maid>>> GetAllAsync();
        Task<ApiResponse<int>> AddAsync(Maid maid);
        Task<ApiResponse<bool>> UpdateAsync(Maid maid);
    }

}
