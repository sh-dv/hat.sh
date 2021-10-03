const _sodium = require("libsodium-wrappers");

export const generatePassword = async () => {
  await _sodium.ready;
  const sodium = _sodium;
  let password = sodium.to_base64(
    sodium.randombytes_buf(16),
    sodium.base64_variants.URLSAFE_NO_PADDING
  );
  return password;
};
