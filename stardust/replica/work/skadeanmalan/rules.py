# rules.py <css> <selector-regex> — print rules where an individual selector matches; only matching selectors shown, with @media
import re, sys
s=open(sys.argv[1],encoding='utf8').read(); rx=re.compile(sys.argv[2])
i=0; media=[]; out=[]
tok=re.compile(r'([^{}]*)\{|\}')
stack=[]
pos=0
while True:
    m=tok.search(s,pos)
    if not m: break
    if m.group(0)=='}':
        if stack: stack.pop()
        pos=m.end(); continue
    sel=m.group(1).strip()
    if sel.startswith('@'):
        stack.append(sel); pos=m.end(); continue
    j=s.find('}',m.end()); body=s[m.end():j]
    hits=[x for x in sel.split(',') if rx.search(x)]
    if hits:
        med=' '.join(x for x in stack if x.startswith('@media') or x.startswith('@container'))
        print(','.join(hits)[:300], ('   '+med) if med else '')
        print('    ', body.strip()[:400])
    pos=j+1
