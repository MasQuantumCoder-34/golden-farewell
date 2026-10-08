import encryptedPayload from "./encrypted-data.json";

export interface KeepsakeConfig {
  name: string;
  photo: string;
  from: string;
  to: string;
  farewell: string[];
  phdMessage: string;
  dua: string[];
  memories: string[];
  frameCards: string[];
  frameFooter: string;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function base64ToBytes(b64: string): Uint8Array {
  const binaryString = typeof window !== "undefined" ? window.atob(b64) : Buffer.from(b64, "base64").toString("binary");
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decryptKeepsake(password: string): Promise<KeepsakeConfig> {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Web Cryptography API is unavailable.");
  }

  const salt = hexToBytes(encryptedPayload.salt);
  const iv = hexToBytes(encryptedPayload.iv);
  const ciphertext = base64ToBytes(encryptedPayload.ciphertext);

  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    ciphertext
  );

  const dec = new TextDecoder();
  return JSON.parse(dec.decode(decrypted)) as KeepsakeConfig;
}
