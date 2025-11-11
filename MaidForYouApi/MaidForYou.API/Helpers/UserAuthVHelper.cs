using MaidForYou.Application.Common.Models;
using MaidForYou.Application.Interfaces;
using System.Security.Claims;

namespace MaidForYou.API.Helpers
{
    public static class UserAuthVHelper
    {
        public static async Task<ApiResponse<bool>> VerifyUser(ClaimsPrincipal? user,IRoleService roleService)
        {
            if (user?.Identity?.IsAuthenticated != true)
            {
                return ApiResponse<bool>.FailureResponse(
                    "User is not authenticated.",
                    statusCode: 401
                );
            }

            var roleClaim = user.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(roleClaim))
            {
                return ApiResponse<bool>.FailureResponse(
                    "User role not found in token.",
                    statusCode: 403
                );
            }

            var roleResponse = await roleService.GetAllAsync();

            if (!roleResponse.Success || roleResponse.Data == null)
            {
                return ApiResponse<bool>.FailureResponse(
                    "Failed to retrieve roles from the system.",
                    statusCode: 500
                );
            }

            if (!roleResponse.Data.Any())
            {
                return ApiResponse<bool>.FailureResponse(
                    "No roles available in the system.",
                    statusCode: 500
                );
            }

            bool roleIsValid = roleResponse.Data
                .Any(r => r.Name.Equals(roleClaim, StringComparison.OrdinalIgnoreCase));

            if (!roleIsValid)
            {
                return ApiResponse<bool>.FailureResponse(
                    $"Access denied. Invalid role: {roleClaim}.",
                    statusCode: 403
                );
            }

            return ApiResponse<bool>.SuccessResponse(
                true,
                "User is authorized."
            );
        }
    }
}
