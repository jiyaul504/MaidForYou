using Dapper;
using System.Data;

namespace MaidForYou.Infrastructure.Persistence.Seed
{
    public class DatabaseSeeder
    {
        private readonly IDbConnection _connection;

        public DatabaseSeeder(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task SeedAsync()
        {
            await SeedRolesAsync();   
            await SeedUsersAsync();
        }

        // ROLES 
        private async Task SeedRolesAsync()
        {
            var count = await _connection.ExecuteScalarAsync<int>(
                "SELECT COUNT(1) FROM Roles");

            if (count > 0) return;

            var sql = @"INSERT INTO Roles (Name, PageName)
                        VALUES (@Name, @PageName)";

            var roles = new[]
            {
                new { Name = "Admin", PageName = "AdminDashboard" },
                new { Name = "Customer", PageName = "CustomerHome" },
                new { Name = "Maid", PageName = "MaidDashboard" }
            };

            await _connection.ExecuteAsync(sql, roles);
        }

        //  USERS
        private async Task SeedUsersAsync()
        {
            var count = await _connection.ExecuteScalarAsync<int>(
                "SELECT COUNT(1) FROM Users");

            if (count > 0) return;

            var sql = @"
                INSERT INTO Users 
                (FullName, Email, PasswordHash, CreatedAt, RefreshToken, RefreshTokenExpiry, RoleId)
                VALUES
                (@FullName, @Email, @PasswordHash, GETUTCDATE(), @RefreshToken, @RefreshTokenExpiry, @RoleId)";

            var users = new[]
            {
                new {
                    FullName = "Admin",
                    Email = "admin@gmail.com",
                    PasswordHash = "KuQN898B16LrLwLOxgfhwQ==",
                    RefreshToken = (string?)null,
                    RefreshTokenExpiry = (DateTime?)null,
                    RoleId = 1
                },
                new {
                    FullName = "Jiyaul Siddique",
                    Email = "alice@example.com",
                    PasswordHash = "AJDqQdI7Qj+EqJ5IyZu32A==",
                    RefreshToken = (string?)null,
                    RefreshTokenExpiry = (DateTime?)null,
                    RoleId = 1
                },
                new {
                    FullName = "Ali",
                    Email = "ali@gmail.com",
                    PasswordHash = "T3zbpjHRz2SzFzKEe8ELzw==",
                    RefreshToken = (string?)null,
                    RefreshTokenExpiry = (DateTime?)null,
                    RoleId = 3
                },
                new {
                    FullName = "Azad",
                    Email = "azad@gmail.com",
                    PasswordHash = "JsHXOWsAWVUP1rCXQ7zz+w==",
                    RefreshToken = (string?)null,
                    RefreshTokenExpiry = (DateTime?)null,
                    RoleId = 2
                }
            };

            await _connection.ExecuteAsync(sql, users);
        }
    }
}
