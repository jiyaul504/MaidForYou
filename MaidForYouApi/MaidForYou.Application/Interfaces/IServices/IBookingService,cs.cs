using MaidForYou.Application.Common.Models;
using MaidForYou.Application.DTOs;

namespace MaidForYou.Application.Interfaces.IServices
{
    public interface IBookingService
    {
        Task<ApiResponse<BookingDto>> CreateBookingAsync(BookingDto bookingDto);
        Task<ApiResponse<BookingDto?>> GetBookingByIdAsync(int id);
        Task<ApiResponse<IEnumerable<BookingDto>>> GetAllBookingsAsync();
        Task<ApiResponse<bool>> CancelBookingAsync(int id);
    }
}
