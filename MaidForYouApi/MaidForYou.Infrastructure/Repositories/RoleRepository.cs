using Dapper;
using MaidForYou.Application.Interfaces.IRepositories;
using MaidForYou.Domain.Entities;
using System.Data;

namespace MaidForYou.Infrastructure.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly IDbConnection _connection;
        private readonly IDbTransaction _transaction;

        public RoleRepository(IDbConnection connection, IDbTransaction transaction)
        {
            _connection = connection;
            _transaction = transaction;
        }

        public async Task<IEnumerable<Role>> GetAllAsync()
        {
            const string sql = "SELECT * FROM Roles";
            return await _connection.QueryAsync<Role>(sql, transaction: _transaction);
        }

        public async Task<Role?> GetByIdAsync(int id)
        {
            const string sql = "SELECT * FROM Roles WHERE Id = @Id";
            return await _connection.QueryFirstOrDefaultAsync<Role>(sql, new { Id = id }, _transaction);
        }

        public async Task<Role?> GetByNameAsync(string name)
        {
            const string sql = "SELECT * FROM Roles WHERE LOWER(Name) = LOWER(@Name)";
            return await _connection.QueryFirstOrDefaultAsync<Role>(sql, new { Name = name }, _transaction);
        }

        public async Task<int> AddAsync(Role role)
        {
            const string sql = @"
                INSERT INTO Roles (Name, PageName)
                VALUES (@Name, @PageName);
                SELECT CAST(SCOPE_IDENTITY() AS INT);";

            return await _connection.ExecuteScalarAsync<int>(
                sql,
                new { role.Name, role.PageName },
                _transaction
            );
        }

        public async Task<bool> UpdateAsync(Role role)
        {
            const string sql = @"
                UPDATE Roles SET
                    Name = @Name,
                    PageName = @PageName
                WHERE Id = @Id";

            var affected = await _connection.ExecuteAsync(
                sql,
                new { role.Id, role.Name, role.PageName },
                _transaction
            );

            return affected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            const string sql = "DELETE FROM Roles WHERE Id = @Id";

            var affected = await _connection.ExecuteAsync(
                sql,
                new { Id = id },
                _transaction
            );

            return affected > 0;
        }
    }
}
