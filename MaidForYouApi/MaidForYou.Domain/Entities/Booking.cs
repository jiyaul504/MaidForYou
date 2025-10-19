using MaidForYou.Domain.Common;
using MaidForYou.Domain.Enums;

namespace MaidForYou.Domain.Entities
{
    public class Booking : AuditableEntity
    {
        public int MaidId { get; set; }
        public int CustomerId { get; set; }
        public DateTime Date { get; set; }
        public string ServiceType { get; set; } = string.Empty;
        public BookingStatus Status { get; set; } = BookingStatus.Pending;

        // Navigation
        public Maid Maid { get; set; } = null!;
        public Customer Customer { get; set; } = null!;
        public Payment? Payment { get; set; }
    }
}
