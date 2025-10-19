namespace MaidForYou.Application.DTOs
{
    public class MaidDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }

        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string Experience { get; set; } = string.Empty;

        public AddressDto Address { get; set; } = new AddressDto();
    }

    public class AddressDto
    {
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
    }
}
