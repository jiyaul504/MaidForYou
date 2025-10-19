using MaidForYou.Application.Common.Models;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Domain.Interfaces
{
    public interface IMaidRepository
    {
        Task<ApiResponse<Maid?>> GetByIdAsync(int id);
        Task<ApiResponse<IEnumerable<Maid>>> GetAvailableAsync();
    }
}
