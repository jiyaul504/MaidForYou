namespace MaidForYou.Domain.Enums
{
    public enum UserRole
    {
        Admin = 1,
        Customer = 2,
        Maid = 3
    }

    public static class UserRoleHelper
    {
        public static string GetRoleDescription(string roleValue)
        {
            if (Enum.TryParse<UserRole>(roleValue, true, out var role))
            {
                return GetRoleDescription(role);
            }
            return string.Empty;
        }

        public static string GetRoleDescription(UserRole role)
        {
            return role switch
            {
                UserRole.Admin => "Admin",
                UserRole.Customer => "Customer",
                UserRole.Maid => "Maid",
                _ => string.Empty
            };
        }

        public static int GetRoleId(string roleValue)
        {
            if (Enum.TryParse<UserRole>(roleValue, true, out var role))
            {
                return (int)role;
            }
            return 0;
        }

        public static UserRole? GetRoleById(int id)
        {
            if (Enum.IsDefined(typeof(UserRole), id))
                return (UserRole)id;
            return null;
        }
    }
}
