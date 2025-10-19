namespace MaidForYou.Application.DTOs
{
    public class BookingDto
    {
        public int Id { get; set; }
        public int MaidId { get; set; }         
        public int CustomerId { get; set; }     
        public string CustomerName { get; set; } = string.Empty;
        public string MaidName { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public string ServiceType { get; set; } = string.Empty; 
        public string Status { get; set; } = "Pending";
    }
}
