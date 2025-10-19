using Dapper;
using MaidForYou.Application.Common.Models;
using MaidForYou.Application.Interfaces.IRepositories;
using MaidForYou.Domain.Entities;
using System.Data;

namespace MaidForYou.Infrastructure.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly IDbConnection _connection;
        private readonly IDbTransaction _transaction;

        public CustomerRepository(IDbConnection connection, IDbTransaction transaction)
        {
            _connection = connection;
            _transaction = transaction;
        }

        public async Task<ApiResponse<Customer?>> GetByIdAsync(int id)
        {
            var query = "SELECT * FROM Customers WHERE Id = @Id";
            var customer = await _connection.QueryFirstOrDefaultAsync<Customer>(query, new { Id = id }, _transaction);

            return customer == null
                ? ApiResponse<Customer?>.FailureResponse("Customer not found")
                : ApiResponse<Customer?>.SuccessResponse(customer);
        }

        public async Task<ApiResponse<int>> AddAsync(Customer customer)
        {
            var query = @"
                INSERT INTO Customers (FullName, Phone, Email, Address_Street, Address_City, Address_State, Address_ZipCode, CreatedAt)
                VALUES (@FullName, @Phone, @Email, @Street, @City, @State, @ZipCode, @CreatedAt);
                SELECT CAST(SCOPE_IDENTITY() as int);";

            var id = await _connection.ExecuteScalarAsync<int>(query, new
            {
                customer.FullName,
                customer.Phone,
                customer.Email,
                Street = customer.Address.Street,
                City = customer.Address.City,
                State = customer.Address.State,
                ZipCode = customer.Address.ZipCode,
                customer.CreatedAt
            }, _transaction);

            customer.Id = id;
            return ApiResponse<int>.SuccessResponse(id, "Customer added successfully");
        }

        public async Task<ApiResponse<bool>> UpdateAsync(Customer customer)
        {
            var query = @"
                UPDATE Customers 
                SET FullName = @FullName,
                    Phone = @Phone,
                    Email = @Email,
                    Address_Street = @Street,
                    Address_City = @City,
                    Address_State = @State,
                    Address_ZipCode = @ZipCode,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";

            var affectedRows = await _connection.ExecuteAsync(query, new
            {
                customer.FullName,
                customer.Phone,
                customer.Email,
                Street = customer.Address.Street,
                City = customer.Address.City,
                State = customer.Address.State,
                ZipCode = customer.Address.ZipCode,
                UpdatedAt = DateTime.UtcNow,
                customer.Id
            }, _transaction);

            return affectedRows > 0
                ? ApiResponse<bool>.SuccessResponse(true, "Customer updated successfully")
                : ApiResponse<bool>.FailureResponse("Customer update failed");
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var query = "DELETE FROM Customers WHERE Id = @Id";
            var affectedRows = await _connection.ExecuteAsync(query, new { Id = id }, _transaction);

            return affectedRows > 0
                ? ApiResponse<bool>.SuccessResponse(true, "Customer deleted successfully")
                : ApiResponse<bool>.FailureResponse("Customer not found");
        }

        public async Task<ApiResponse<IEnumerable<Customer>>> GetAllAsync()
        {
            var query = "SELECT * FROM Customers";
            var customers = await _connection.QueryAsync<Customer>(query, transaction: _transaction);

            return ApiResponse<IEnumerable<Customer>>.SuccessResponse(customers);
        }
    }
}
