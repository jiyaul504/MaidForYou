using MaidForYou.Domain.Entities;

namespace MaidForYou.Application.Interfaces.IRepositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<int> AddAsync(User user);

        Task UpdateRefreshTokenAsync(int userId, string refreshToken, DateTime expiry);
        Task<User?> GetByRefreshTokenAsync(string refreshToken);
    }
}
