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
            const string query = @"
                SELECT u.*, r.Name AS RoleName
                FROM Users u
                LEFT JOIN Roles r ON u.RoleId = r.Id
                WHERE LOWER(u.Email) = LOWER(@Email);";

            return await _connection.QueryFirstOrDefaultAsync<User>(
                query,
                new { Email = email },
                transaction: _transaction
            );
        }

        public async Task<int> AddAsync(User user)
        {
            const string query = @"
            INSERT INTO Users (FullName, Email, PasswordHash, Role, RoleId, CreatedAt)
            VALUES (@FullName, @Email, @PasswordHash, @Role, @RoleId, @CreatedAt);
            SELECT CAST(SCOPE_IDENTITY() AS INT);";

            return await _connection.ExecuteScalarAsync<int>(
                query,
                new
                {
                    user.FullName,
                    user.Email,
                    user.PasswordHash,
                    user.Role,    
                    user.RoleId,
                    user.CreatedAt
                },
                transaction: _transaction
            );
        }

        public async Task UpdateRefreshTokenAsync(int userId, string refreshToken, DateTime expiry)
        {
            const string query = @"
                UPDATE Users SET 
                    RefreshToken = @RefreshToken,
                    RefreshTokenExpiry = @Expiry
                WHERE Id = @Id";

            await _connection.ExecuteAsync(
                query,
                new { Id = userId, RefreshToken = refreshToken, Expiry = expiry },
                transaction: _transaction
            );
        }

        public async Task<User?> GetByRefreshTokenAsync(string refreshToken)
        {
            const string query = @"
                SELECT u.*, r.Name AS RoleName
                FROM Users u
                LEFT JOIN Roles r ON u.RoleId = r.Id
                WHERE u.RefreshToken = @Token;";

            return await _connection.QueryFirstOrDefaultAsync<User>(
                query,
                new { Token = refreshToken },
                transaction: _transaction
            );
        }
    }
}
