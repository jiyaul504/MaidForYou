using MaidForYou.Domain.Common;
using MaidForYou.Domain.Enums;
using MaidForYou.Domain.ValueObjects;

namespace MaidForYou.Domain.Entities
{
    public class Payment : AuditableEntity
    {
        public int BookingId { get; set; }
        public Money Amount { get; set; } = new Money(0, "USD");
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public DateTime? PaidAt { get; set; }

        // Navigation
        public Booking Booking { get; set; } = null!;
    }
}
