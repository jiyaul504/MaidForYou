using MaidForYou.Domain.Common;
using MaidForYou.Domain.ValueObjects;

namespace MaidForYou.Domain.Entities
{
    public class Customer : AuditableEntity
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Value Object
        public Address Address { get; set; } = null!;

        // Navigation
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
