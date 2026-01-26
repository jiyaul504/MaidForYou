using MaidForYou.Application.Common.Models;
using MaidForYou.Application.DTOs.Common;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Application.Interfaces.IRepositories
{
    public interface IBookingRepository
    {
        Task<ApiResponse<Booking?>> GetByIdAsync(int id);
        Task<ApiResponse<int>> AddAsync(Booking booking);
        Task<ApiResponse<bool>> UpdateAsync(Booking booking);
        Task<ApiResponse<bool>> DeleteAsync(int id);
        Task<ApiResponse<PagedResultDto<Booking>>> GetPagedAsync(int pageNumber, int pageSize);
        Task<ApiResponse<IEnumerable<Booking>>> GetAllAsync();
    }
}
