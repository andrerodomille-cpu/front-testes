import CryptoJS from "crypto-js";

const secretKey = "minha_chave_super_secreta"; // Visível no frontend!

export function encryptAES(data: object): string {
  const json = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(json, secretKey).toString();
  return encrypted;
}

export function decryptAES(cipherText: string): object | null {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (err) {
    console.error("Erro ao descriptografar:", err);
    return null;
  }
}
