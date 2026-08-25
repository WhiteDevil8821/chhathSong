import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import pngToIco from 'png-to-ico';

const svgPath = path.resolve('public/favicon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

function renderPng(size) {
  const resvg = new Resvg(svgContent, {
    fitTo: {
      mode: 'width',
      value: size,
    },
    shapeRendering: 2,
    textRendering: 2,
    imageRendering: 0,
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

async function main() {
  console.log('Generating PNG and ICO favicons from SVG...');

  const sizes = [16, 32, 48, 96, 180, 192, 512];
  const pngBuffers = {};

  for (const size of sizes) {
    const png = renderPng(size);
    pngBuffers[size] = png;
  }

  // Save distinct PNG files
  fs.writeFileSync('public/favicon-16x16.png', pngBuffers[16]);
  fs.writeFileSync('public/favicon-32x32.png', pngBuffers[32]);
  fs.writeFileSync('public/favicon-48x48.png', pngBuffers[48]);
  fs.writeFileSync('public/favicon-96x96.png', pngBuffers[96]);
  fs.writeFileSync('public/apple-touch-icon.png', pngBuffers[180]);
  fs.writeFileSync('public/icons/icon-192.png', pngBuffers[192]);
  fs.writeFileSync('public/icons/icon-512.png', pngBuffers[512]);
  fs.writeFileSync('public/favicon-192x192.png', pngBuffers[192]);
  fs.writeFileSync('public/favicon-512x512.png', pngBuffers[512]);

  // Generate multi-size binary ICO file (16, 32, 48)
  const icoBuffer = await pngToIco([
    'public/favicon-16x16.png',
    'public/favicon-32x32.png',
    'public/favicon-48x48.png',
  ]);
  fs.writeFileSync('public/favicon.ico', icoBuffer);

  console.log('Successfully generated all PNG & binary ICO files!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
