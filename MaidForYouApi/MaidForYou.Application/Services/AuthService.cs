using MaidForYou.Application.Common.Models;
using MaidForYou.Application.DTOs.Auth;
using MaidForYou.Application.Helpers;
using MaidForYou.Application.Interfaces.IRepositories;
using MaidForYou.Application.Interfaces.IServices;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJwtTokenService _jwtService;
        private readonly EncryptionHelperService _encryptionHelper;

        public AuthService(
            IUnitOfWork unitOfWork,
            IJwtTokenService jwtService,
            EncryptionHelperService encryptionHelper)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
            _encryptionHelper = encryptionHelper;
        }

        private string TryDecrypt(string input)
        {
            try { return _encryptionHelper.DecryptString(input); }
            catch { return input; }
        }

        public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterRequestDto request)
        {
            var encryptedPassword = _encryptionHelper.EncryptString(request.Password);

            var existingUser = await _unitOfWork.Users.GetByEmailAsync(request.Email);
            if (existingUser != null)
                return ApiResponse<AuthResponseDto>.FailureResponse("Email already registered.");

            var role = await _unitOfWork.Roles.GetByNameAsync(request.Role ?? "Customer");
            if (role == null)
                return ApiResponse<AuthResponseDto>.FailureResponse("Invalid role.");

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = encryptedPassword,
                RoleId = role.Id,        
                CreatedAt = DateTime.UtcNow
            };

            var newUserId = await _unitOfWork.Users.AddAsync(user);
            if (newUserId <= 0)
            {
                await _unitOfWork.RollbackAsync();
                return ApiResponse<AuthResponseDto>.FailureResponse("Failed to register user.");
            }

            await _unitOfWork.CommitAsync();

            user.Id = newUserId;
            user.RoleName = role.Name;   

            var token = await _jwtService.GenerateTokenAsync(user);

            return ApiResponse<AuthResponseDto>.SuccessResponse(new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                Role = user.RoleName       
            }, "User registered successfully.");
        }

        public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginRequestDto request)
        {
            string plainEmail = TryDecrypt(request.Email);
            string plainPassword = TryDecrypt(request.Password);

            var user = await _unitOfWork.Users.GetByEmailAsync(plainEmail);
            if (user == null)
                return ApiResponse<AuthResponseDto>.FailureResponse("Invalid email or password.");

            var encryptedPassword = _encryptionHelper.EncryptString(plainPassword);
            if (user.PasswordHash != encryptedPassword)
                return ApiResponse<AuthResponseDto>.FailureResponse("Invalid email or password.");

            var token = await _jwtService.GenerateTokenAsync(user);

            var refreshToken = _jwtService.GenerateRefreshToken();
            var refreshExpiry = DateTime.UtcNow.AddDays(7);

            await _unitOfWork.Users.UpdateRefreshTokenAsync(user.Id, refreshToken, refreshExpiry);
            await _unitOfWork.CommitAsync();

            return ApiResponse<AuthResponseDto>.SuccessResponse(new AuthResponseDto
            {
                Token = token,
                RefreshToken = refreshToken,
                Email = user.Email,
                Role = user.RoleName,      
                FullName = user.FullName
            }, "Login successful.");
        }

        public async Task<ApiResponse<AuthResponseDto>> RefreshTokenAsync(string refreshToken)
        {
            var user = await _unitOfWork.Users.GetByRefreshTokenAsync(refreshToken);

            if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
                return ApiResponse<AuthResponseDto>.FailureResponse("Invalid or expired refresh token.");

            var newAccessToken = await _jwtService.GenerateTokenAsync(user);

            var newRefreshToken = _jwtService.GenerateRefreshToken();
            var newExpiry = DateTime.UtcNow.AddDays(7);

            await _unitOfWork.Users.UpdateRefreshTokenAsync(user.Id, newRefreshToken, newExpiry);
            await _unitOfWork.CommitAsync();

            return ApiResponse<AuthResponseDto>.SuccessResponse(new AuthResponseDto
            {
                Token = newAccessToken,
                RefreshToken = newRefreshToken,
                Email = user.Email,
                Role = user.RoleName,       
                FullName = user.FullName
            }, "Token refreshed successfully.");
        }

        public async Task<ApiResponse<string>> LogoutAsync(string userId)
        {
            await Task.CompletedTask;
            return ApiResponse<string>.SuccessResponse("User logged out successfully.", userId);
        }
    }
}
