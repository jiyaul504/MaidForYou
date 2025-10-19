// encryption.service.ts
import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
    private readonly key = CryptoJS.enc.Utf8.parse('G7h8Jk9Lm0N1Pq2Rs3Tu4Vw5Xy6Za7Bc');
    private readonly iv = CryptoJS.enc.Utf8.parse('Z8K1L3U6E2H9G5T8');

    encrypt(text: string): string {
        const encrypted = CryptoJS.AES.encrypt(text, this.key, {
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.toString();
    }

    decrypt(cipherText: string): string {
        const decrypted = CryptoJS.AES.decrypt(cipherText, this.key, {
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}
