// outline.mjs <page.html> <selector> [depth] — tag.class tree with short text, scripts/svg dropped
import fs from 'node:fs'; import * as cheerio from 'cheerio';
const [f, sel = 'main', d = '4'] = process.argv.slice(2);
const $ = cheerio.load(fs.readFileSync(f, 'utf8')); $('script,style,svg,noscript,link').remove();
const walk = (el, depth, pad) => {
  const c = ($(el).attr('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 3).join('.');
  const own = $(el).contents().filter((_, n) => n.type === 'text').text().replace(/\s+/g, ' ').trim().slice(0, 50);
  const extra = el.tagName === 'a' ? ` href=${$(el).attr('href')}` : el.tagName === 'img' ? ` src=${($(el).attr('src') || '').split('?')[0].split('/').pop()}` : '';
  console.log(`${pad}${el.tagName}${c ? '.' + c : ''}${extra}${own ? ' "' + own + '"' : ''}`);
  if (depth > 0) $(el).children().each((_, k) => walk(k, depth - 1, pad + ' '));
  else if ($(el).children().length) console.log(pad + ' …' + $(el).find('*').length);
};
$(sel).each((_, e) => walk(e, Number(d), ''));
