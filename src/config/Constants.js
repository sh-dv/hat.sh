export const currentVersion = "2.3.6";
export const MAX_FILE_SIZE = 1024 * 1024 * 1024;
export const CHUNK_SIZE = 64 * 1024 * 1024;
export const crypto_secretstream_xchacha20poly1305_ABYTES = 17;
export const encoder = new TextEncoder();
export const decoder = new TextDecoder();
export const SIGNATURES = {
  v1: "Encrypted Using Hat.sh",
  v2_symmetric: "zDKO6XYXioc",
  v2_asymmetric: "hTWKbfoikeg",
};
