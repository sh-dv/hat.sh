export const formatUrl = async (filename) => {
    let safeUrl =  encodeURIComponent(filename);
    return safeUrl;
}