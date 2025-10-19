namespace MaidForYou.Application.DTOs
{
    public class UpdateBookingDto
    {
        public DateTime BookingDate { get; set; }
        public string Status { get; set; } = "Pending";
    }
}
