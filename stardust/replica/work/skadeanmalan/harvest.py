# harvest.py — download webp renditions used by skadeanmalan into prototypes/assets/img; print url->file pairs (map.json merged separately)
import re, json, urllib.request, os, sys
s=open('stardust/current/pages/skadeanmalan.html',encoding='utf8').read()
m=s[s.find('<main'):s.find('</main>')]
out='stardust/prototypes/assets/img'; pairs={}
for ss in re.findall(r'<source srcset="([^"]*)"[^>]*type="image/webp"',m):
    for part in ss.split(','):
        u,w=part.strip().rsplit(' ',1); u=u.replace('&amp;','&'); url='https://www.trygghansa.se'+u
        base=u.split('?')[0].rsplit('/',1)[1].rsplit('.',1)[0]
        q=dict(x.split('=') for x in u.split('?')[1].split('&'))
        name='%s_%sx%s.webp'%(base,q['width'],q['height'])
        p=os.path.join(out,name)
        if not os.path.exists(p):
            req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
            data=urllib.request.urlopen(req,timeout=30).read(); open(p,'wb').write(data)
        pairs[url]=name
json.dump(pairs,open('stardust/replica/work/skadeanmalan/harvest-map.json','w'),indent=1)
print(len(pairs),'renditions')
