const _sodium = require("libsodium-wrappers");

export const generateAsymmetricKeys = async () => {
  await _sodium.ready;
  const sodium = _sodium;

  const keyPair = sodium.crypto_kx_keypair();
  let keys = {
    publicKey: sodium.to_base64(keyPair.publicKey),
    privateKey: sodium.to_base64(keyPair.privateKey),
  };

  return keys;
};

