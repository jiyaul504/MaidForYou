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

        public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterRequestDto request)
        {
            var encryptedPassword = _encryptionHelper.EncryptString(request.Password);

            var existingUser = await _unitOfWork.Users.GetByEmailAsync(request.Email);
            if (existingUser != null)
                return ApiResponse<AuthResponseDto>.FailureResponse("Email already registered.");

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = encryptedPassword, 
                Role = request.Role ?? "User",
                CreatedAt = DateTime.UtcNow
            };

            var newUserId = await _unitOfWork.Users.AddAsync(user);
            if (newUserId <= 0)
            {
                await _unitOfWork.RollbackAsync();
                return ApiResponse<AuthResponseDto>.FailureResponse("Failed to register user.");
            }

            await _unitOfWork.CommitAsync();

            var token = await _jwtService.GenerateTokenAsync(user);

            return ApiResponse<AuthResponseDto>.SuccessResponse(new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                Role = user.Role
            }, "User registered successfully.");
        }

        public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginRequestDto request)
        {
            string plainEmail = _encryptionHelper.DecryptString(request.Email);
            string plainPassword = _encryptionHelper.DecryptString(request.Password);

            var user = await _unitOfWork.Users.GetByEmailAsync(plainEmail);
            if (user == null)
                return ApiResponse<AuthResponseDto>.FailureResponse("Invalid email or password.");
            var encryptedPassword = _encryptionHelper.EncryptString(plainPassword);
            if (user.PasswordHash != encryptedPassword)
                return ApiResponse<AuthResponseDto>.FailureResponse("Invalid email or password.");

            var token = await _jwtService.GenerateTokenAsync(user);
            return ApiResponse<AuthResponseDto>.SuccessResponse(new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                Role = user.Role,
                FullName = user.FullName
            }, "Login successful.");
        }


        public async Task<ApiResponse<string>> LogoutAsync(string userId)
        {
            await Task.CompletedTask;
            return ApiResponse<string>.SuccessResponse("User logged out successfully.", userId);
        }
    }
}
