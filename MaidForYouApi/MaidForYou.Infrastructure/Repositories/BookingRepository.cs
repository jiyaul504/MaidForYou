using Dapper;
using MaidForYou.Application.Common.Models;
using MaidForYou.Application.DTOs.Common;
using MaidForYou.Application.Interfaces.IRepositories;
using MaidForYou.Domain.Entities;
using MaidForYou.Infrastructure.Common;
using System.Data;

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

        public async Task<ApiResponse<PagedResultDto<Booking>>> GetPagedAsync(int pageNumber, int pageSize)
        {
            var countSql = "SELECT COUNT(1) FROM Bookings";
            var totalRecords = await _connection.ExecuteScalarAsync<int>(countSql, transaction: _transaction);

            var dataSql = @"
                            SELECT 
                                b.*,
                                c.Id, c.FullName,
                                m.Id, m.FullName
                            FROM Bookings b
                            LEFT JOIN Customers c ON b.CustomerId = c.Id
                            LEFT JOIN Maids m ON b.MaidId = m.Id
                            ORDER BY b.Id DESC
                            OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

            var bookings = await _connection.QueryAsync<Booking, Customer, Maid, Booking>(
                dataSql,
                (booking, customer, maid) =>
                {
                    booking.Customer = customer;
                    booking.Maid = maid;
                    return booking;
                },
                new
                {
                    Offset = (pageNumber - 1) * pageSize,
                    PageSize = pageSize
                },
                transaction: _transaction,
                splitOn: "Id,Id"
            );

            var result = new PagedResultDto<Booking>
            {
                Items = bookings.ToList(),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords
            };

            return ApiResponse<PagedResultDto<Booking>>.SuccessResponse(result);
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
