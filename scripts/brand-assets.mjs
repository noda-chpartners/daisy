import sharp from "sharp";
import { writeFileSync } from "node:fs";

const flower = `
  <g fill="#241F1C" transform="translate(16 16)">
    <ellipse cx="0" cy="-7.2" rx="2.7" ry="5.4"/>
    <ellipse cx="0" cy="-7.2" rx="2.7" ry="5.4" transform="rotate(45)"/>
    <ellipse cx="0" cy="-7.2" rx="2.7" ry="5.4" transform="rotate(90)"/>
    <ellipse cx="0" cy="-7.2" rx="2.7" ry="5.4" transform="rotate(135)"/>
  </g>
  <circle cx="16" cy="16" r="2.7" fill="#A68456"/>
`;

const apple = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#F4EFE8"/>
  ${flower}
</svg>`;

const icon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#F4EFE8"/>
  ${flower}
</svg>`;

function pngToIco(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png]);
}

const photo = await sharp("src/assets/images/IMG_7937.jpg")
  .resize(760, 630, { fit: "cover", position: "centre" })
  .toBuffer();

const overlay = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="520" height="630" fill="#F4EFE8"/>
  <rect x="508" width="28" height="630" fill="#F4EFE8"/>
  <g transform="translate(72 168) scale(2.4)">
    ${flower}
  </g>
  <rect x="72" y="268" width="42" height="1" fill="#A68456"/>
  <text x="72" y="360" fill="#241F1C" font-family="Georgia, 'Times New Roman', serif" font-size="92">Daisy</text>
  <text x="74" y="418" fill="#6E5432" font-family="Georgia, 'Times New Roman', serif" font-size="28" font-style="italic">Wakayama</text>
  <text x="74" y="468" fill="#5C534C" font-family="'Yu Gothic', 'YuGothic', Meiryo, sans-serif" font-size="26">和歌山のメンズエステ</text>
  <text x="74" y="512" fill="#241F1C" font-family="'Yu Gothic', 'YuGothic', Meiryo, sans-serif" font-size="22">南海和歌山市駅</text>
</svg>`);

await sharp(Buffer.from(apple)).png().toFile("public/apple-touch-icon.png");

const png32 = await sharp(Buffer.from(icon)).png().toBuffer();
writeFileSync("public/favicon.ico", pngToIco(png32));

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 3,
    background: "#f4efe8",
  },
})
  .composite([
    { input: photo, left: 480, top: 0 },
    { input: overlay, left: 0, top: 0 },
  ])
  .jpeg({ quality: 86 })
  .toFile("public/ogp.jpg");

console.log("assets written");
