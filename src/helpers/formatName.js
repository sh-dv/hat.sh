export const formatName = (fileName) => {
  //remove .enc
  let trimmed = fileName.replace(".enc", "");
  //remove parenthesis
  let clean = trimmed.replace(/ *\([^)]*\) */g, "");

  return clean;
};
