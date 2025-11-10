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

        public async Task<Role?> GetByIdAsync(int id)
        {
            const string query = "SELECT * FROM Roles WHERE Id = @Id";
            return await _connection.QueryFirstOrDefaultAsync<Role>(query, new { Id = id }, _transaction);
        }

        public async Task<Role?> GetByNameAsync(string name)
        {
            const string query = "SELECT * FROM Roles WHERE LOWER(Name) = LOWER(@Name)";
            return await _connection.QueryFirstOrDefaultAsync<Role>(query, new { Name = name }, _transaction);
        }

        public async Task<IEnumerable<Role>> GetAllAsync()
        {
            const string query = "SELECT * FROM Roles";
            return await _connection.QueryAsync<Role>(query, transaction: _transaction);
        }
    }
}
