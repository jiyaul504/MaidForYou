using System.Data;
using MaidForYou.Application.Interfaces.IRepositories;
using Microsoft.Data.SqlClient;

namespace MaidForYou.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IDbConnection _connection;
        private IDbTransaction _transaction;

        public IMaidRepository Maids { get; }
        public IBookingRepository Bookings { get; }
        public ICustomerRepository Customers { get; }
        public IUserRepository Users { get; }
        public IRoleRepository Roles { get; }



        public IDbConnection Connection => _connection;
        public IDbTransaction Transaction => _transaction;

        public UnitOfWork(string connectionString)
        {
            _connection = new SqlConnection(connectionString);
            _connection.Open();

            // Begin transaction immediately
            _transaction = _connection.BeginTransaction();

            // Initialize repositories with shared connection + transaction
            Roles = new RoleRepository(_connection, _transaction);
            Maids = new MaidRepository(_connection, _transaction);
            Bookings = new BookingRepository(_connection, _transaction);
            Customers = new CustomerRepository(_connection, _transaction);
            Users = new UserRepository(_connection, _transaction);

        }

        public async Task CommitAsync()
        {
            _transaction?.Commit();
            _transaction?.Dispose();

            _transaction = _connection.BeginTransaction(); 
            await Task.CompletedTask;
        }

        public async Task RollbackAsync()
        {
            _transaction?.Rollback();
            _transaction?.Dispose();

            _transaction = _connection.BeginTransaction(); // Start new transaction
            await Task.CompletedTask;
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _connection?.Dispose();
        }
    }
}
