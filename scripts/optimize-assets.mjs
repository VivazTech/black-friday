// Converte os assets originais do designer (pasta CODEX) em WebP dimensionado para a web.
// Uso: node scripts/optimize-assets.mjs "<caminho para CODEX/assets>"
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const source = process.argv[2];
if (!source || !fs.statSync(source).isDirectory()) {
  throw new Error('Informe a pasta de assets originais.');
}
const root = path.resolve(import.meta.dirname, '..');
const images = path.join(root, 'src', 'assets');
const videos = path.join(root, 'public', 'videos');
fs.mkdirSync(images, { recursive: true });
fs.mkdirSync(videos, { recursive: true });

// [arquivo original, nome final, largura máxima, qualidade]
const conversions = [
  ['hero-desktop-2026.png', 'hero-desktop', 2560, 78],
  ['65_3739_imgFrame2604.png', 'hero-mobile', 1080, 78],
  ['65_3739_imgSeloBlackFriday263.png', 'selo-black-friday', 920, 88],
  ['65_3739_imgSeloCriancasGratis1.png', 'selo-criancas-gratis', 600, 88],
  ['65_3739_imgSeloParcelamento1.png', 'selo-parcelamento', 600, 88],
  ['65_3739_imgSeloDesconto1.png', 'selo-desconto', 600, 88],
  ['65_3739_imgSeloParqueAquatico1.png', 'selo-parque-aquatico', 600, 88],
  ['65_3739_imgSeloVip1.png', 'selo-vip', 600, 88],
  ['65_3739_imgSeloIngressosAtrativo1.png', 'selo-ingressos', 600, 88],
  ['65_3739_imgSeloVendas1.png', 'selo-vendas', 600, 88],
  ['65_3984_imgFrame2433.png', 'gallery-heated', 1000, 80],
  ['65_3984_imgFrame2435.png', 'gallery-outdoor', 1000, 80],
  ['65_3984_imgFrame2437.png', 'gallery-waterpark', 1000, 80],
  ['65_3984_imgFrame2436.png', 'gallery-room', 1000, 80],
  ['65_3984_imgFrame2438.png', 'gallery-destination', 1000, 80],
  ['gallery-dining-original.jpg', 'gallery-dining', 1000, 80],
  ['gallery-heated-alt.png', 'gallery-heated-alt', 1000, 80],
  ['gallery-outdoor-alt.png', 'gallery-outdoor-alt', 1000, 80],
  ['gallery-waterpark-alt.png', 'gallery-waterpark-alt', 1000, 80],
  ['gallery-room-alt.png', 'gallery-room-alt', 1000, 80],
  ['gallery-destination-alt.png', 'gallery-destination-alt', 1000, 80],
  ['gallery-dining-alt.png', 'gallery-dining-alt', 1000, 80],
  ['93_2385_imgFrame2439.png', 'promo-poster', 1200, 80],
  ['93_2385_imgSectionComoFunciona1.png', 'como-funciona-bg', 2400, 78],
  ['aqua_raw_1.png', 'aqua-poster', 853, 80],
];

for (const [input, name, width, quality] of conversions) {
  const output = path.join(images, `${name}.webp`);
  const info = await sharp(path.join(source, input))
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(output);
  console.log(`${name}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

const badge = await sharp(path.join(source, 'selo-black-friday-animado.gif'), { animated: true })
  .webp({ quality: 80, effort: 4 })
  .toFile(path.join(images, 'selo-black-friday-animado.webp'));
console.log(`selo-black-friday-animado.webp  ${(badge.size / 1024).toFixed(0)} KB`);

for (const file of ['footer-logo.png', 'folhas.svg']) {
  fs.copyFileSync(path.join(source, file), path.join(images, file));
}
for (const file of ['black-friday-15s.mp4', 'aquafoz-compilado.mp4']) {
  fs.copyFileSync(path.join(source, file), path.join(videos, file));
}
console.log('Assets prontos.');
