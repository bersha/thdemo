// crop.mjs <png> <y> <h> [out] [--x n --w n --scale s] — crop a band of a capture for one-fact reads
import fs from 'node:fs';
import { PNG } from 'pngjs';
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? Number(a[i + 1]) : d; };
const [src, y0, h0, out = 'stardust/replica/crops/crop.png'] = a.filter((v, i) => !v.startsWith('--') && !(a[i - 1] || '').startsWith('--'));
const img = PNG.sync.read(fs.readFileSync(src));
const x = opt('--x', 0), w = Math.min(opt('--w', img.width), img.width - x);
const y = Number(y0), h = Math.min(Number(h0), img.height - y), s = opt('--scale', 1);
const ow = Math.floor(w / s), oh = Math.floor(h / s);
const o = new PNG({ width: ow, height: oh });
for (let j = 0; j < oh; j++) for (let i = 0; i < ow; i++) {
  const acc = [0, 0, 0, 0]; let n = 0;
  for (let dy = 0; dy < s; dy++) for (let dx = 0; dx < s; dx++) {
    const sx = x + i * s + dx, sy = y + j * s + dy; if (sx >= img.width || sy >= img.height) continue;
    const k = (sy * img.width + sx) * 4; for (let c = 0; c < 4; c++) acc[c] += img.data[k + c]; n++;
  }
  const k = (j * ow + i) * 4; for (let c = 0; c < 4; c++) o.data[k + c] = Math.round(acc[c] / n);
}
fs.writeFileSync(out, PNG.sync.write(o));
console.log(`${src} ${img.width}x${img.height} -> ${out} (${x},${y},${w}x${h} /${s})`);
