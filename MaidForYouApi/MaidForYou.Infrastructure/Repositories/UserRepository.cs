using Dapper;
using MaidForYou.Application.Interfaces.IRepositories;
using MaidForYou.Domain.Entities;
using System.Data;

namespace MaidForYou.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IDbConnection _connection;
        private readonly IDbTransaction _transaction;

        public UserRepository(IDbConnection connection, IDbTransaction transaction)
        {
            _connection = connection;
            _transaction = transaction;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            const string query = "SELECT * FROM Users WHERE Email = @Email";
            return await _connection.QueryFirstOrDefaultAsync<User>(
                query,
                new { Email = email },
                transaction: _transaction
            );
        }

        public async Task<int> AddAsync(User user)
        {
            const string query = @"
                INSERT INTO Users (FullName, Email, PasswordHash, Role, CreatedAt)
                VALUES (@FullName, @Email, @PasswordHash, @Role, @CreatedAt);
                SELECT CAST(SCOPE_IDENTITY() as int);";

            return await _connection.ExecuteScalarAsync<int>(
                query,
                new
                {
                    user.FullName,
                    user.Email,
                    user.PasswordHash,
                    user.Role,
                    user.CreatedAt
                },
                transaction: _transaction
            );
        }
    }
}
