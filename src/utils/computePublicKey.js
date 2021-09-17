const _sodium = require("libsodium-wrappers");

//compute publickey from a given privatekey
export const computePublicKey = async (privateKey) => {
  await _sodium.ready;
  const sodium = _sodium;

  let key = sodium.crypto_scalarmult_base(sodium.from_base64(privateKey));
  return sodium.to_base64(key);
};
