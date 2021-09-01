const _sodium = require("libsodium-wrappers");

export const formatUrl = async (filename) => {
    await _sodium.ready;
    const sodium = _sodium;
    let safeUrl =  sodium.to_base64(filename, sodium.base64_variants.URLSAFE_NO_PADDING);
    return safeUrl;
}