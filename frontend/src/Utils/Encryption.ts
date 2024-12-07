const crypto = window.crypto;

export const strToAB = (input: string): ArrayBuffer => {
  const encoder = new TextEncoder();
  return encoder.encode(input).buffer;
};

export const ABtoStr = (input: ArrayBuffer): string => {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(input);
};

const randomBytes = (length: number): ArrayBuffer => {
  return crypto.getRandomValues(new Uint8Array(length)).buffer;
};

export const importUserKey = async (rawKey: Uint8Array): Promise<CryptoKey> => {
  return await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

export const pbkdf2 = async (
  password: ArrayBuffer,
  salt: ArrayBuffer
): Promise<ArrayBuffer> => {
  const pbkdf2Params: Pbkdf2Params = {
    name: "PBKDF2",
    salt: salt,
    iterations: 600000,
    hash: "SHA-256",
  };

  const impKey = await crypto.subtle.importKey(
    "raw",
    password,
    { name: "PBKDF2" } as any,
    false,
    ["deriveBits"]
  );
  const buffer = await crypto.subtle.deriveBits(pbkdf2Params, impKey, 256);
  return buffer;
};

// Encrypt a password entry
export const encryptAES = async (
  data: ArrayBuffer,
  symKey: ArrayBuffer
): Promise<{ encrypted: ArrayBuffer; iv: ArrayBuffer }> => {
  const iv = randomBytes(16);

  const impKey = await crypto.subtle.importKey(
    "raw",
    symKey,
    { name: "AES-CBC" } as any,
    false,
    ["encrypt"]
  );
  const buffer = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: iv },
    impKey,
    data
  );
  return { encrypted: buffer, iv };
};

// Decrypt a password entry
export const decryptAES = async (
  data: ArrayBuffer,
  symKey: ArrayBuffer,
  iv: ArrayBuffer
): Promise<ArrayBuffer> => {
  const impKey = await crypto.subtle.importKey(
    "raw",
    symKey,
    { name: "AES-CBC" } as any,
    false,
    ["decrypt"]
  );

  const buffer = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv },
    impKey,
    data
  );
  return buffer;
};

export const generateSymKey = async () => {
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-CBC",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const rawKey = await crypto.subtle.exportKey("raw", key);
  return rawKey;
};

export const hdkf = async (key: ArrayBuffer) => {
  const hkdfParams: HkdfParams = {
    name: "HKDF",
    salt: randomBytes(32),
    info: strToAB("hdkf"),
    hash: { name: "SHA-256" },
  };

  const impKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HKDF" } as any,
    false,
    ["deriveBits"]
  );
  const buffer = await crypto.subtle.deriveBits(hkdfParams, impKey, 512);
  return buffer;
};
