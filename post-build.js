const {
  writeFile,
  readFile,
} = require("fs").promises;
const { join } = require("path");

const main = async () => {
  const file = await readFile(join(__dirname, "out/404/index.html"));

  await writeFile(join(__dirname, "out/404.html"), file);
};

main();