using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;
using MaidForYou.Domain.Entities;

namespace MaidForYou.Application.Helpers
{

    public class EncryptionHelperService
    {
        private readonly byte[] _keyBytes;
        private readonly byte[] _ivBytes;

        public EncryptionHelperService(IOptions<EncryptionSettings> options)
        {
            _keyBytes = Encoding.UTF8.GetBytes(options.Value.Key);
            _ivBytes = Encoding.UTF8.GetBytes(options.Value.IV);
        }

        public string DecryptString(string cipherTextBase64)
        {
            var cipherBytes = Convert.FromBase64String(cipherTextBase64);
            using var aes = Aes.Create();
            aes.Key = _keyBytes;
            aes.IV = _ivBytes;

            using var decryptor = aes.CreateDecryptor();
            using var ms = new MemoryStream(cipherBytes);
            using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
            using var sr = new StreamReader(cs);
            return sr.ReadToEnd();
        }

        public string EncryptString(string plainText)
        {
            using var aes = Aes.Create();
            aes.Key = _keyBytes;
            aes.IV = _ivBytes;

            using var encryptor = aes.CreateEncryptor();
            using var ms = new MemoryStream();
            using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
            using (var sw = new StreamWriter(cs))
            {
                sw.Write(plainText);
            }
            return Convert.ToBase64String(ms.ToArray());
        }
    }

}
