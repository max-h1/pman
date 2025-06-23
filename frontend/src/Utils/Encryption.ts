import { Entry } from '../types';
const crypto = window.crypto;
// import { Buffer } from 'buffer';

export const ABtoB64 = (input: Uint8Array): string => {
	return btoa(String.fromCharCode(...input));
};

export const B64toAB = (input: string): Uint8Array => {
	const binary = atob(input);
	return new Uint8Array([...binary].map((char) => char.charCodeAt(0)));
};

export const strtoAB = (input: string): Uint8Array => {
	return new TextEncoder().encode(input);
};

export const ABtoStr = (input: Uint8Array): string => {
	return new TextDecoder().decode(input);
};

const randomBytes = (length: number): Uint8Array => {
	return crypto.getRandomValues(new Uint8Array(length));
};

export const importKey = async (rawKey: Uint8Array): Promise<CryptoKey> => {
	return await crypto.subtle.importKey('raw', rawKey, { name: 'AES-CBC', length: 256 }, true, [
		'encrypt',
		'decrypt',
	]);
};

export const pbkdf2 = async (
	password: string | Uint8Array,
	salt: string | Uint8Array
): Promise<Uint8Array> => {
	var passwordBuf;
	var saltBuf;
	if (typeof password === 'string') {
		passwordBuf = strtoAB(password);
	} else {
		passwordBuf = password.buffer;
	}

	if (typeof salt === 'string') {
		saltBuf = strtoAB(salt);
	} else {
		saltBuf = salt.buffer;
	}

	let pbkdf2Params: Pbkdf2Params = {
		name: 'PBKDF2',
		salt: saltBuf,
		iterations: 600000,
		hash: 'SHA-256',
	};

	let impKey = await crypto.subtle.importKey('raw', passwordBuf, { name: 'PBKDF2' } as any, false, [
		'deriveBits',
	]);

	const buffer = await crypto.subtle.deriveBits(pbkdf2Params, impKey, 256);
	return new Uint8Array(buffer);
};

// Encrypt a password entry
export const encryptAES = async (
	data: ArrayBuffer,
	symKey: Uint8Array
): Promise<{ encrypted: Uint8Array; iv: Uint8Array }> => {
	const iv = randomBytes(16);
	console.log('IV Length', iv.byteLength);
	const impKey = await crypto.subtle.importKey('raw', symKey, { name: 'AES-CBC' } as any, false, [
		'encrypt',
	]);
	const buffer = await crypto.subtle.encrypt({ name: 'AES-CBC', iv: iv }, impKey, data);
	return { encrypted: new Uint8Array(buffer), iv: iv };
};

// Decrypt a password entry
export const decryptAES = async (
	data: Uint8Array,
	symKey: Uint8Array,
	iv: Uint8Array
): Promise<Uint8Array> => {
	console.log('IV (decrypt stage):', iv);
	var impKey;
	var buffer;
	try {
		impKey = await crypto.subtle.importKey('raw', symKey, { name: 'AES-CBC' } as any, false, [
			'decrypt',
		]);
	} catch (error) {
		console.error('Error importing key:', error);
		throw new Error('Key import failed');
	}
	try {
		buffer = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: iv }, impKey, data);
		return new Uint8Array(buffer);
	} catch (error) {
		throw new Error('Decryption failed');
	}
};

export const generateSymKey = async () => {
	const key = await crypto.subtle.generateKey(
		{
			name: 'AES-CBC',
			length: 256,
		},
		true,
		['encrypt', 'decrypt']
	);
	const rawKey = await crypto.subtle.exportKey('raw', key);
	return new Uint8Array(rawKey);
};

export const hdkf = async (key: Uint8Array) => {
	const hkdfParams: HkdfParams = {
		name: 'HKDF',
		salt: randomBytes(32),
		info: strtoAB('hdkf'),
		hash: { name: 'SHA-256' },
	};

	const impKey = await crypto.subtle.importKey('raw', key, { name: 'HKDF' } as any, false, [
		'deriveBits',
	]);
	const stretchedKey = await crypto.subtle.deriveBits(hkdfParams, impKey, 512);
	return new Uint8Array(stretchedKey);
};

export const encryptEntry = async (entry: Entry, symkey: Uint8Array) => {
	let passArray = strtoAB(entry.password);
	let { encrypted, iv } = await encryptAES(passArray, symkey);

	let encryptedPass = ABtoB64(encrypted);
	let encryptedEntry = { ...entry };

	encryptedEntry.password = encryptedPass;
	encryptedEntry.iv = ABtoB64(iv);

	return encryptedEntry;
};

export const decryptEntry = async (entry: Entry, symkey: Uint8Array) => {
	console.log('Decrypting entry:', entry);
	try {
		let encryptedPass = B64toAB(entry.password);
		let iv = B64toAB(entry.iv);
		let decryptedPass = await decryptAES(encryptedPass, symkey, iv);
		entry.password = ABtoStr(decryptedPass);
		return entry;
	} catch (error) {
		console.error('Error decrypting entry:', error, 'Entry:', entry);
		return entry; // Return the entry as is if decryption fails
	}
};
