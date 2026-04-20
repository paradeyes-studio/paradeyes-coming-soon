import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SOURCE_SVG = path.join(process.cwd(), "public", "favicon.svg");
const OUT_DIR = path.join(process.cwd(), "public");

const sizes = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "favicon-192x192.png" },
  { size: 512, name: "favicon-512x512.png" },
];

const svgBuffer = fs.readFileSync(SOURCE_SVG);

for (const { size, name } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(path.join(OUT_DIR, name));
  console.log(`Generated ${name}`);
}

const icoBuffer = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
fs.writeFileSync(path.join(OUT_DIR, "favicon.ico"), icoBuffer);
console.log("Generated favicon.ico (PNG-encoded 32x32 fallback)");

console.log("All favicons generated");
