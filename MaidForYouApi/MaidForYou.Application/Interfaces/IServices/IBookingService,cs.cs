using MaidForYou.Application.Common.Models;
using MaidForYou.Application.DTOs;
using MaidForYou.Application.DTOs.Common;

namespace MaidForYou.Application.Interfaces.IServices
{
    public interface IBookingService
    {
        Task<ApiResponse<BookingDto>> CreateBookingAsync(BookingDto bookingDto);
        Task<ApiResponse<BookingDto?>> GetBookingByIdAsync(int id);
        Task<ApiResponse<PagedResultDto<BookingDto>>> GetAllBookingsAsync(PaginationQueryDto query);
        Task<ApiResponse<bool>> CancelBookingAsync(int id);
    }
}
