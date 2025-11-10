using System.Security.Claims;

namespace MaidForYou.API.Helpers
{
    public static class UserAuthVHelper
    {
        public static bool VerifyUser(ClaimsPrincipal? user, string[] allowedRoles, out string? errorMessage)
        {
            errorMessage = null;

            if (user == null || user.Identity?.IsAuthenticated != true)
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

            if (!allowedRoles.Contains(roleClaim, StringComparer.OrdinalIgnoreCase))
            {
                errorMessage = $"Access denied. Required roles: {string.Join(", ", allowedRoles)}. Your role: {roleClaim}.";
                return false;
            }

            return true;
        }
    }

}
