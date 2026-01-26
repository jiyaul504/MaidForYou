using MaidForYou.Application.Common.Models;
using MaidForYou.Application.DTOs;
using MaidForYou.Application.DTOs.Common;

namespace MaidForYou.Application.Interfaces.IServices
{
    public interface IMaidService
    {
        Task<ApiResponse<PagedResultDto<MaidDto>>> GetAvailableMaidsAsync(PaginationQueryDto query);

        Task<ApiResponse<MaidDto>> GetMaidByIdAsync(int id);

        Task<ApiResponse<MaidDto>> RegisterMaidAsync(MaidDto maidDto);
        Task<ApiResponse<bool>> UpdateAvailabilityAsync(int maidId, bool isAvailable);
    }
}
