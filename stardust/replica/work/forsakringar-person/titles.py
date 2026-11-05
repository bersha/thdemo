# titles.py <file> — add the live title="" attributes to header/footer links (verbatim from the capture)
import re, sys
p = sys.argv[1]; s = open(p, encoding='utf8').read()
H = ['Privat', 'Företag', 'Bilförsäkring', 'Hemförsäkring', 'Personförsäkring', 'Mc, motor och andra fordon', 'Djurförsäkringar', 'Anmäl skada', 'Logga in', 'Sök']
F = ['Om webbplatsen', 'Cookies', 'Personuppgifter']
def scope(tag, names, logo):
    global s
    i = s.find('<' + tag); j = s.find('</' + tag + '>', i); seg = s[i:j]
    def rep(m):
        a, inner = m.group(1), m.group(2)
        text = re.sub(r'<[^>]+>', '', inner).strip()
        if 'title=' in a: return m.group(0)
        if text in names or ('logo' in inner and logo):
            t = text if text in names else 'Till startsidan'
            return '<a title="%s"%s>%s</a>' % (t, a[2:], inner)
        return m.group(0)
    seg = re.sub(r'(<a [^>]*)>(.*?)</a>', lambda m: rep(type('M', (), {'group': lambda self, k=0: [m.group(0), m.group(1), m.group(2)][k]})()), seg, flags=re.S)
    s = s[:i] + seg + s[j:]
scope('header', H, True); scope('footer', F, True)
open(p, 'w', encoding='utf8').write(s)
