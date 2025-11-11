using System.Data;

namespace MaidForYou.Application.Interfaces.IRepositories
{
    public interface IUnitOfWork : IDisposable
    {
        IDbConnection Connection { get; }
        IDbTransaction Transaction { get; }

        IMaidRepository Maids { get; }
        IBookingRepository Bookings { get; }
        ICustomerRepository Customers { get; }
        IUserRepository Users { get; }
        IRoleRepository Roles { get; }

        Task CommitAsync();
        Task RollbackAsync();
    }
}
