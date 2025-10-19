using MaidForYou.Application.Common.Models;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Application.Interfaces.IRepositories
{
    public interface IBookingRepository
    {
        Task<ApiResponse<Booking?>> GetByIdAsync(int id);
        Task<ApiResponse<int>> AddAsync(Booking booking);
        Task<ApiResponse<bool>> UpdateAsync(Booking booking);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<IEnumerable<Booking>>> GetAllAsync();
    }
}
