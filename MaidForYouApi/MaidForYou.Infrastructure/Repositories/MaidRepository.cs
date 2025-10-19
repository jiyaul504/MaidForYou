using Dapper;
using System.Data;
using MaidForYou.Application.Interfaces.IRepositories;
using MaidForYou.Application.Common.Models;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Infrastructure.Repositories
{
    public class MaidRepository : IMaidRepository
    {
        private readonly IDbConnection _connection;
        private readonly IDbTransaction _transaction;

        public MaidRepository(IDbConnection connection, IDbTransaction transaction)
        {
            _connection = connection;
            _transaction = transaction;
        }

        public async Task<ApiResponse<Maid?>> GetByIdAsync(int id)
        {
            try
            {
                var sql = "SELECT * FROM Maids WHERE Id = @Id";
                var maid = await _connection.QueryFirstOrDefaultAsync<Maid>(sql, new { Id = id }, _transaction);

                return maid == null
                    ? ApiResponse<Maid?>.FailureResponse("Maid not found.")
                    : ApiResponse<Maid?>.SuccessResponse(maid);
            }
            catch (Exception ex)
            {
                return ApiResponse<Maid?>.FailureResponse($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<IEnumerable<Maid>>> GetAvailableAsync()
        {
            try
            {
                var sql = "SELECT * FROM Maids WHERE IsAvailable = 1";
                var maids = await _connection.QueryAsync<Maid>(sql, transaction: _transaction);

                return ApiResponse<IEnumerable<Maid>>.SuccessResponse(maids);
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<Maid>>.FailureResponse($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<IEnumerable<Maid>>> GetAllAsync()
        {
            try
            {
                var sql = "SELECT * FROM Maids";
                var maids = await _connection.QueryAsync<Maid>(sql, transaction: _transaction);

                return ApiResponse<IEnumerable<Maid>>.SuccessResponse(maids);
            }
            catch (Exception ex)
            {
                return ApiResponse<IEnumerable<Maid>>.FailureResponse($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<int>> AddAsync(Maid maid)
        {
            try
            {
                var sql = @"
                    INSERT INTO Maids 
                        (FullName, Phone, Email, Experience, IsAvailable, Address_Street, Address_City, Address_State, Address_ZipCode, CreatedAt)
                    VALUES 
                        (@FullName, @Phone, @Email, @Experience, @IsAvailable, @Street, @City, @State, @ZipCode, @CreatedAt);
                    SELECT CAST(SCOPE_IDENTITY() as int);";

                var id = await _connection.ExecuteScalarAsync<int>(sql, new
                {
                    maid.FullName,
                    maid.Phone,
                    maid.Email,
                    maid.Experience,
                    maid.IsAvailable,
                    Street = maid.Address.Street,
                    City = maid.Address.City,
                    State = maid.Address.State,
                    ZipCode = maid.Address.ZipCode,
                    CreatedAt = DateTime.UtcNow
                }, _transaction);

                return ApiResponse<int>.SuccessResponse(id, "Maid added successfully.");
            }
            catch (Exception ex)
            {
                return ApiResponse<int>.FailureResponse($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> UpdateAsync(Maid maid)
        {
            try
            {
                var sql = @"
                    UPDATE Maids
                    SET FullName = @FullName,
                        Phone = @Phone,
                        Email = @Email,
                        Experience = @Experience,
                        IsAvailable = @IsAvailable,
                        Address_Street = @Street,
                        Address_City = @City,
                        Address_State = @State,
                        Address_ZipCode = @ZipCode,
                        UpdatedAt = @UpdatedAt
                    WHERE Id = @Id";

                await _connection.ExecuteAsync(sql, new
                {
                    maid.FullName,
                    maid.Phone,
                    maid.Email,
                    maid.Experience,
                    maid.IsAvailable,
                    Street = maid.Address.Street,
                    City = maid.Address.City,
                    State = maid.Address.State,
                    ZipCode = maid.Address.ZipCode,
                    UpdatedAt = DateTime.UtcNow,
                    maid.Id
                }, _transaction);

                return ApiResponse<bool>.SuccessResponse(true, "Maid updated successfully.");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.FailureResponse($"Error: {ex.Message}");
            }
        }
    }
}
