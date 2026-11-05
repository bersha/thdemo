// harvest-img.mjs — download every captured <img> of the planned pages into stardust/prototypes/assets/img, write map.json
import fs from 'node:fs';
const dir = 'stardust/current/pages', out = 'stardust/prototypes/assets/img';
const map = fs.existsSync(`${out}/map.json`) ? JSON.parse(fs.readFileSync(`${out}/map.json`)) : {};
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const p = JSON.parse(fs.readFileSync(`${dir}/${f}`));
  for (const im of p.media?.imgs || []) {
    if (map[im.src]) continue;
    const u = new URL(im.src);
    let name = u.pathname.split('/').pop().replace(/[^\w.-]/g, '_');
    const fmt = u.searchParams.get('format'); if (fmt) name = name.replace(/\.\w+$/, '') + '.' + fmt;
    while (Object.values(map).includes(name)) name = 'x' + name;
    const r = await fetch(im.src); if (!r.ok) { console.log('miss', r.status, im.src); continue; }
    fs.writeFileSync(`${out}/${name}`, Buffer.from(await r.arrayBuffer())); map[im.src] = name;
  }
}
fs.writeFileSync(`${out}/map.json`, JSON.stringify(map, null, 1));
console.log(Object.keys(map).length, 'images');
