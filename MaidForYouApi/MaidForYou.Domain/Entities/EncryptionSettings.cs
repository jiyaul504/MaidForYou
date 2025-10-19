namespace MaidForYou.Domain.Entities
{
    public class EncryptionSettings
    {
        public string Key { get; set; } = string.Empty; // 32 chars for AES-256
        public string IV { get; set; } = string.Empty;  // 16 chars for AES
    }

}
