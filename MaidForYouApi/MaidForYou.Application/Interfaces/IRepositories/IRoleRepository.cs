using MaidForYou.Domain.Entities;

namespace MaidForYou.Application.Interfaces.IRepositories
{
    public interface IRoleRepository
    {
        Task<Role?> GetByIdAsync(int id);
        Task<Role?> GetByNameAsync(string name);
        Task<IEnumerable<Role>> GetAllAsync();
    }

}
