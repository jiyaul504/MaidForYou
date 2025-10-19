namespace MaidForYou.Application.DTOs
{
    public class CreateBookingDto
    {
        public int CustomerId { get; set; }
        public int MaidId { get; set; }
        public DateTime BookingDate { get; set; }
    }
}
