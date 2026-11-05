# clean-main.py — re-serialise the server-rendered CMS sections of the captured page (everything in <main>
# after the hero app) into clean markup: source th-* classes kept, data-*/nonce/inline junk dropped,
# whitespace collapsed, root-relative hrefs absolute, every image rendition harvested locally (map.json).
# Strings are never rewritten — the text nodes pass through verbatim.
# usage: python3 -I clean-main.py <captured.html> <out.frag.html>
import sys, re, os, json, html, urllib.request, urllib.parse
from html.parser import HTMLParser

SRC, OUT = sys.argv[1], sys.argv[2]
ROOT = 'https://www.trygghansa.se'
IMG = 'stardust/prototypes/assets/img'
MAP = IMG + '/map.json'
KEEP = {'class', 'id', 'href', 'src', 'srcset', 'sizes', 'alt', 'type', 'role', 'scope', 'width', 'height',
        'colspan', 'rowspan', 'for', 'title', 'target', 'rel', 'loading', 'decoding', 'span', 'hidden'}
VOID = {'img', 'source', 'br', 'col', 'input', 'hr', 'meta', 'link'}
DROP = {'script', 'style', 'noscript', 'template'}
added = {}

def local(url):
    """absolute source URL -> local file name under assets/img (download once)."""
    absu = urllib.parse.urljoin(ROOT + '/', html.unescape(url))
    m = json.load(open(MAP))
    if absu in m: return m[absu]
    if absu in added: return added[absu]
    u = urllib.parse.urlparse(absu); q = urllib.parse.parse_qs(u.query)
    base = os.path.basename(u.path); stem, ext = os.path.splitext(base)
    fmt = q.get('format', [None])[0]; w = q.get('width', [None])[0]
    name = stem + ('_' + w if w else '') + ('.' + fmt if fmt else ext)
    taken = set(m.values()) | set(added.values())
    while name in taken: name = 'x' + name
    req = urllib.request.Request(absu, headers={'User-Agent': 'Mozilla/5.0 stardust-replica-harvest'})
    data = urllib.request.urlopen(req, timeout=30).read()
    open(os.path.join(IMG, name), 'wb').write(data)
    added[absu] = name
    return name

def fix_srcset(v):
    out = []
    for part in v.split(','):
        part = part.strip()
        if not part: continue
        bits = part.split()
        out.append(' '.join(['assets/img/' + local(bits[0])] + bits[1:]))
    return ', '.join(out)

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False); self.o = []; self.skip = 0; self.pic = None
    def handle_starttag(self, t, a):
        if self.skip:
            if t not in VOID: self.skip += 1
            return
        if t in DROP:
            self.skip = 1; return
        a = dict(a)
        if t == 'picture': self.pic = {'webp': False}
        if t == 'source' and self.pic is not None:
            if a.get('type') != 'image/webp' and self.pic['webp']: return  # keep one (webp) source only
            if a.get('type') == 'image/webp': self.pic['webp'] = True
        attrs = []
        for k, v in a.items():
            if k.startswith('aria-') or k in KEEP:
                if v is None: v = ''
                if k == 'href' and v.startswith('/'): v = ROOT + v
                if k == 'srcset': v = fix_srcset(html.unescape(v))
                if k == 'src' and t == 'img': v = 'assets/img/' + local(v)
                if k == 'class': v = ' '.join(v.split())
                if k == 'class' and not v: continue
                attrs.append(' %s="%s"' % (k, v.replace('"', '&quot;')) if v != '' or k in ('alt',) else ' ' + k)
        self.o.append('<%s%s>' % (t, ''.join(attrs)))
    def handle_startendtag(self, t, a):
        self.handle_starttag(t, a)
    def handle_endtag(self, t):
        if self.skip:
            if t not in VOID: self.skip -= 1
            return
        if t in VOID: return
        if t == 'picture': self.pic = None
        self.o.append('</%s>' % t)
    def handle_data(self, d):
        if not self.skip: self.o.append(re.sub(r'\s+', ' ', d))
    def handle_entityref(self, n):
        if not self.skip: self.o.append('&%s;' % n)
    def handle_charref(self, n):
        if not self.skip: self.o.append('&#%s;' % n)
    def handle_comment(self, d): pass

s = open(SRC, encoding='utf8').read()
i = s.find('<section class="th-campaign-banner"'); j = s.find('</main>')
p = P(); p.feed(s[i:j]); p.close()
out = ''.join(p.o)
B = r'(?:section|div|li|tr|ul|ol|table|thead|tbody|dialog|p|h[1-6]|nav|picture|colgroup|col|caption|th|td|source|img)'
out = re.sub(r'\s*(</?' + B + r'\b[^>]*>)\s*', r'\1', out)   # whitespace only around block-level tags
out = out.replace(' loading="lazy"', '')   # lazy images stay unloaded in stitched captures
out = out.replace('<li class="th-breadcrumbs__crumb"><a', '<li class="th-breadcrumbs__crumb"> <a')  # crumbs are inline: keep the live leading space
out = out.replace('</p><button class="th-button-link"', '</p> <button class="th-button-link"', 1)  # banner: p + button are inline
out = re.sub(r'(</(?:section|div|li|tr|ul|ol|table|thead|tbody|dialog|p|h2|h3|nav|picture)>)', r'\1\n', out)
open(OUT, 'w', encoding='utf8').write(out)
if added:
    m = json.load(open(MAP)); m.update(added); json.dump(m, open(MAP, 'w'), indent=1, ensure_ascii=False)
print('wrote', OUT, len(out), 'bytes;', len(added), 'new images')
