export const currentVersion = "2.0.6";
export const MAX_FILE_SIZE = 1024 * 1024 * 1024;
export const CHUNK_SIZE = 64 * 1024 * 1024;
export const crypto_secretstream_xchacha20poly1305_ABYTES = 17;
export const encoder = new TextEncoder();
export const decoder = new TextDecoder();
export const sigCodes = {
    v1: "Encrypted Using Hat.sh",
    v2: "zDKO6XYXioc",
  };
export const SIGNATURE = new Uint8Array(encoder.encode(sigCodes["v2"]));


