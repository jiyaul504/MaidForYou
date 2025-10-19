using MaidForYou.Application.Common.Models;
using MaidForYou.Application.DTOs;

namespace MaidForYou.Application.Interfaces.IServices
{
    public interface IMaidService
    {
        Task<ApiResponse<MaidDto?>> GetMaidByIdAsync(int id);
        Task<ApiResponse<IEnumerable<MaidDto>>> GetAvailableMaidsAsync();
        Task<ApiResponse<MaidDto>> RegisterMaidAsync(MaidDto maidDto);
        Task<ApiResponse<bool>> UpdateAvailabilityAsync(int maidId, bool isAvailable);
    }
}
