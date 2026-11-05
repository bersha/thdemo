// boxes.mjs <measure.json> [out.txt] — compact one-line-per-box table of a measure.mjs --json file
import fs from 'node:fs';
const [f, out] = process.argv.slice(2);
const j = JSON.parse(fs.readFileSync(f, 'utf8'));
const pages = j.pages || j;
const skip = v => ['normal','none','0px','start','auto','fill','rgba(0, 0, 0, 0)'].includes(v);
let s = '';
for (const [url, byW] of Object.entries(pages)) for (const [w, sels] of Object.entries(byW)) {
  s += `== ${w} ${url}\n`;
  for (const [sel, arr] of Object.entries(sels)) {
    const e = arr && arr[0]; if (!e) { s += `${sel}: MISSING\n`; continue; }
    const r = e.rect || {};
    const pr = Object.entries(e.props || {}).filter(([k, v]) => !skip(v) && !['width','height','opacity','boxSizing','border'].includes(k) && !(k==='display'&&v==='block') && !(k==='position'&&v==='static')).map(([k, v]) => `${k}=${v}`).join('; ');
    s += `${sel} [${arr.length}${e.visible===false?' hidden':''}] ${r.x},${r.y} ${r.w}x${r.h} "${(e.text||'').slice(0,30)}" | ${pr}\n`;
  }
}
if (out) fs.writeFileSync(out, s); else process.stdout.write(s);
