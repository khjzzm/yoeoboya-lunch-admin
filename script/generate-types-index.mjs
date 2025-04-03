// scripts/generate-types-index.mjs
import fs from "fs";
import path from "path";

const TYPES_DIR = path.resolve("src/types");
const OUTPUT_FILE = path.join(TYPES_DIR, "index.ts");

function walkDir(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walkDir(filepath, filelist);
    } else if (file.endsWith(".ts") && !file.endsWith("index.ts")) {
      filelist.push(path.relative(TYPES_DIR, filepath).replace(/\\/g, "/"));
    }
  });
  return filelist;
}

const files = walkDir(TYPES_DIR);
const exports = files.map(file => `export * from "./${file.replace(/\.ts$/, "")}";`);

fs.writeFileSync(OUTPUT_FILE, exports.join("\n") + "\n");
console.log(`✅ Generated ${OUTPUT_FILE} with ${exports.length} exports.`);