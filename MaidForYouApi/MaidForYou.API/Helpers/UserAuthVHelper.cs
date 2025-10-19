using MaidForYou.Domain.Enums;
using System.Security.Claims;

namespace MaidForYou.API.Helpers
{
    public class UserAuthVHelper
    {
        public static bool VerifyUser(ClaimsPrincipal? user, UserRole[] allowedRoles, out string? errorMessage)
        {
            errorMessage = null;

            if (user == null || !user.Identity?.IsAuthenticated == true)
            {
                errorMessage = "User is not authenticated.";
                return false;
            }

            var roleClaim = user.FindFirst(ClaimTypes.Role)?.Value;
            if (string.IsNullOrEmpty(roleClaim))
            {
                errorMessage = "User role not found in token.";
                return false;
            }

            if (!Enum.TryParse<UserRole>(roleClaim, out var userRole))
            {
                errorMessage = $"Invalid user role: {roleClaim}.";
                return false;
            }

            if (!allowedRoles.Contains(userRole))
            {
                errorMessage = $"Access denied. Required roles: {string.Join(", ", allowedRoles)}. Your role: {userRole}.";
                return false;
            }

            return true;
        }

    }
}
