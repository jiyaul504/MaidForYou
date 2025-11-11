namespace MaidForYou.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        public int RoleId { get; set; }
        public string Role { get; set; } = string.Empty;   // ✅ REQUIRED: this maps to DB column "Role"

        public string? RoleName { get; set; }              // ✅ Used only for JOIN (e.g., SELECT users.*, roles.Name AS RoleName)

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
