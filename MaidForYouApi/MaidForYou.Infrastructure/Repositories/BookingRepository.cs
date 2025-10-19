using System.Data;
using Dapper;
using MaidForYou.Application.Common.Models;
using MaidForYou.Application.Interfaces.IRepositories;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Infrastructure.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly IDbConnection _connection;
        private readonly IDbTransaction _transaction;

        public BookingRepository(IDbConnection connection, IDbTransaction transaction)
        {
            _connection = connection;
            _transaction = transaction;
        }

        public async Task<ApiResponse<Booking?>> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Bookings WHERE Id = @Id";
            var booking = await _connection.QueryFirstOrDefaultAsync<Booking>(sql, new { Id = id }, _transaction);

            return booking != null
                ? ApiResponse<Booking?>.SuccessResponse(booking)
                : ApiResponse<Booking?>.FailureResponse("Booking not found.");
        }

        public async Task<ApiResponse<int>> AddAsync(Booking booking)
        {
            var sql = @"
                INSERT INTO Bookings (MaidId, CustomerId, Date, ServiceType, Status, CreatedAt)
                VALUES (@MaidId, @CustomerId, @Date, @ServiceType, @Status, @CreatedAt);
                SELECT CAST(SCOPE_IDENTITY() as int);";

            var id = await _connection.ExecuteScalarAsync<int>(sql, booking, _transaction);
            return ApiResponse<int>.SuccessResponse(id, "Booking created successfully.");
        }

        public async Task<ApiResponse<bool>> UpdateAsync(Booking booking)
        {
            var sql = @"
                UPDATE Bookings
                SET MaidId      = @MaidId,
                    CustomerId  = @CustomerId,
                    Date        = @Date,
                    ServiceType = @ServiceType,
                    Status      = @Status,
                    UpdatedAt   = @UpdatedAt
                WHERE Id = @Id";

            var rows = await _connection.ExecuteAsync(sql, booking, _transaction);
            return rows > 0
                ? ApiResponse<bool>.SuccessResponse(true, "Booking updated successfully.")
                : ApiResponse<bool>.FailureResponse("Booking update failed.");
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var sql = "DELETE FROM Bookings WHERE Id = @Id";
            var rows = await _connection.ExecuteAsync(sql, new { Id = id }, _transaction);

            return rows > 0
                ? ApiResponse<bool>.SuccessResponse(true, "Booking deleted successfully.")
                : ApiResponse<bool>.FailureResponse("Booking not found.");
        }

        public async Task<ApiResponse<IEnumerable<Booking>>> GetAllAsync()
        {
            var sql = "SELECT * FROM Bookings";
            var bookings = await _connection.QueryAsync<Booking>(sql, transaction: _transaction);

            return ApiResponse<IEnumerable<Booking>>.SuccessResponse(bookings);
        }
    }
}
