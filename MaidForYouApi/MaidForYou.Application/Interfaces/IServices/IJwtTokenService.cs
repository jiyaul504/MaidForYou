using MaidForYou.Domain.Entities;

namespace MaidForYou.Application.Interfaces.IServices
{
    public interface IJwtTokenService
    {
        Task<string> GenerateTokenAsync(User user);
    }
}
