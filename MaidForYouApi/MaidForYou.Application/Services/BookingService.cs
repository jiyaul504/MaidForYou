using MaidForYou.Application.Common.Models;
using MaidForYou.Application.DTOs;
using MaidForYou.Application.Interfaces.IRepositories;
using MaidForYou.Application.Interfaces.IServices;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Application.Services
{
    public class BookingService : IBookingService
    {
        private readonly IUnitOfWork _unitOfWork;

        public BookingService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<BookingDto>> CreateBookingAsync(BookingDto bookingDto)
        {
            var booking = new Booking
            {
                MaidId = bookingDto.MaidId,
                CustomerId = bookingDto.CustomerId,
                Date = bookingDto.BookingDate,
                ServiceType = bookingDto.ServiceType ?? "General Cleaning",
                Status = Enum.TryParse(bookingDto.Status, out Domain.Enums.BookingStatus status)
                            ? status
                            : Domain.Enums.BookingStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            var maidResponse = await _unitOfWork.Maids.GetByIdAsync(booking.MaidId);
            if (!maidResponse.Success || maidResponse.Data == null || !maidResponse.Data.IsAvailable)
                return ApiResponse<BookingDto>.FailureResponse("Maid is not available.");

            var customerResponse = await _unitOfWork.Customers.GetByIdAsync(booking.CustomerId);
            if (!customerResponse.Success || customerResponse.Data == null)
                return ApiResponse<BookingDto>.FailureResponse("Customer not found.");

            var addResult = await _unitOfWork.Bookings.AddAsync(booking);
            if (!addResult.Success)
                return ApiResponse<BookingDto>.FailureResponse(addResult.Message ?? "Failed to create booking.");

            await _unitOfWork.CommitAsync();

            var resultDto = new BookingDto
            {
                Id = booking.Id,
                MaidId = booking.MaidId,
                CustomerId = booking.CustomerId,
                CustomerName = customerResponse.Data.FullName,
                MaidName = maidResponse.Data.FullName,
                BookingDate = booking.Date,
                ServiceType = booking.ServiceType,
                Status = booking.Status.ToString()
            };

            return ApiResponse<BookingDto>.SuccessResponse(resultDto, "Booking created successfully.");
        }

        public async Task<ApiResponse<BookingDto?>> GetBookingByIdAsync(int id)
        {
            var bookingResponse = await _unitOfWork.Bookings.GetByIdAsync(id);

            if (!bookingResponse.Success || bookingResponse.Data == null)
                return ApiResponse<BookingDto?>.FailureResponse("Booking not found.");

            var booking = bookingResponse.Data;

            var dto = new BookingDto
            {
                Id = booking.Id,
                MaidId = booking.MaidId,
                CustomerId = booking.CustomerId,
                CustomerName = booking.Customer?.FullName ?? string.Empty,
                MaidName = booking.Maid?.FullName ?? string.Empty,
                BookingDate = booking.Date,
                ServiceType = booking.ServiceType,
                Status = booking.Status.ToString()
            };

            return ApiResponse<BookingDto?>.SuccessResponse(dto);
        }

        public async Task<ApiResponse<IEnumerable<BookingDto>>> GetAllBookingsAsync()
        {
            var bookingsResponse = await _unitOfWork.Bookings.GetAllAsync();

            if (!bookingsResponse.Success || bookingsResponse.Data == null)
                return ApiResponse<IEnumerable<BookingDto>>.FailureResponse("No bookings found.");

            var dtos = bookingsResponse.Data.Select(b => new BookingDto
            {
                Id = b.Id,
                MaidId = b.MaidId,
                CustomerId = b.CustomerId,
                CustomerName = b.Customer?.FullName ?? string.Empty,
                MaidName = b.Maid?.FullName ?? string.Empty,
                BookingDate = b.Date,
                ServiceType = b.ServiceType,
                Status = b.Status.ToString()
            });

            return ApiResponse<IEnumerable<BookingDto>>.SuccessResponse(dtos);
        }

        public async Task<ApiResponse<bool>> CancelBookingAsync(int id)
        {
            var bookingResponse = await _unitOfWork.Bookings.GetByIdAsync(id);

            if (!bookingResponse.Success || bookingResponse.Data == null)
                return ApiResponse<bool>.FailureResponse("Booking not found.");

            var deleteResponse = await _unitOfWork.Bookings.DeleteAsync(id);
            if (!deleteResponse.Success)
                return ApiResponse<bool>.FailureResponse(deleteResponse.Message ?? "Failed to cancel booking.");

            await _unitOfWork.CommitAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Booking cancelled successfully.");
        }
    }
}
