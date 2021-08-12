export const currentVersion = "2.0.5";

export const crypto_secretstream_xchacha20poly1305_ABYTES = 17;

export const MAX_FILE_SIZE = 1073741824;
export const CHUNK_SIZE = 64 * 1024 * 1024;

export const encoder = new TextEncoder();
export const decoder = new TextDecoder();
export const sigCode = "zDKO6XYXioc";
export const SIGNATURE = new Uint8Array(encoder.encode(sigCode));