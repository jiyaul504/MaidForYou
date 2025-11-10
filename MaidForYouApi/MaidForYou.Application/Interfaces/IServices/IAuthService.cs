using MaidForYou.Application.Common.Models;
using MaidForYou.Application.DTOs.Auth;

namespace MaidForYou.Application.Interfaces.IServices
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterRequestDto request);
        Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginRequestDto request);
        Task<ApiResponse<string>> LogoutAsync(string userId);
        Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(string refreshToken);

    }
}
