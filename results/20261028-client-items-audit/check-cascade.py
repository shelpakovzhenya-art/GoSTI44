"""Bounded static cascade check for bath-closing declarations, not browser QA."""
from pathlib import Path
import json,re,urllib.request
from bs4 import BeautifulSoup

p=Path(__file__).resolve().parent
html=BeautifulSoup(urllib.request.urlopen('https://tangerin.ru/vse-dlya-otdyha/banya-i-kupel').read(),'html.parser')
node=html.select_one('#bath-booking')
old=(p.parent.parent/'source/runtime/.next/static/chunks/1m2h-compact-legal-20261028.css').read_text(encoding='utf8')
new=old+'\n'+(p/'bath-closing.css').read_text(encoding='utf8')

def split(text,delimiter=','):
 start=0;depth=0;quote=None;escaped=False
 for i,c in enumerate(text):
  if escaped:escaped=False;continue
  if c=='\\':escaped=True;continue
  if quote:
   if c==quote:quote=None
   continue
  if c in '\"\'':quote=c;continue
  if c in '([':depth+=1
  elif c in ')]':depth-=1
  elif c==delimiter and depth==0:yield text[start:i];start=i+1
 yield text[start:]

def blocks(text):
 start=0;opening=None;depth=0;quote=None;escaped=False
 for i,c in enumerate(text):
  if escaped:escaped=False;continue
  if c=='\\':escaped=True;continue
  if quote:
   if c==quote:quote=None
   continue
  if c in '\"\'':quote=c;continue
  if c=='{':
   if depth==0:opening=i
   depth+=1
  elif c=='}':
   depth-=1
   if depth==0:yield text[start:opening].strip(),text[opening+1:i];start=i+1
 assert depth==0

def rules(text,layer=None,media=()):
 for head,body in blocks(text):
  if head.startswith('@layer '):yield from rules(body,head.split()[1],media)
  elif head.startswith('@media '):yield from rules(body,layer,media+(head[7:],))
  elif not head.startswith('@'):yield head,body,layer,media

def matches_media(conditions,width):
 for cond in conditions:
  for op,value in re.findall(r'\((min|max)-width:\s*([0-9.]+)px\)',cond):
   if op=='max'and width>float(value)or op=='min'and width<float(value):return False
 return True

def winners(css,width):
 found={};order=0
 for selectors,body,layer,media in rules(re.sub(r'/\*.*?\*/','',css,flags=re.S)):
  if layer!='clientPalette'or not matches_media(media,width):continue
  declarations=[]
  for part in split(body,';'):
   if ':'not in part:continue
   prop,value=part.split(':',1);prop=prop.strip();value=value.strip()
   if '!important'not in value:continue
   value=value.replace('!important','').strip()
   if prop in ['padding','padding-right','background','background-image','border','border-top']:declarations.append((prop,value))
  if not declarations:continue
  for selector in split(selectors):
   selector=selector.strip()
   if '::'in selector:continue
   try:match=node in html.select(selector)
   except Exception:continue
   if not match:continue
   ids=len(re.findall(r'#[\w-]+',selector));classes=len(re.findall(r'\.[\w-]+|\[[^]]+\]|:[\w-]+',selector))
   for prop,value in declarations:
    order+=1;targets={prop:value}
    if prop=='padding':
     vals=value.split();targets={'padding-right':vals[0]if len(vals)==1 else vals[1]}
    elif prop=='background':targets={'background-image':'none'if value in ['none','transparent']else value}
    elif prop=='border':targets={'border-top':value}
    for key,val in targets.items():
     priority=(ids,classes,order)
     if key not in found or priority>found[key]['priority']:found[key]={'value':val,'selector':selector,'priority':priority}
 return found

checks=[]
for width in [320,390,768,1366]:
 a,b=winners(old,width),winners(new,width)
 for prop,expected in [('padding-right','0'),('background-image','none'),('border-top','0')]:
  assert b[prop]['value']==expected,(width,prop,b[prop])
  assert b[prop]['priority'][0]==11
 checks.append({'width':width,'before':a,'after':b})
assert checks[-1]['before']['padding-right']['value']=='150px'
assert 'url('in checks[-1]['before']['background-image']['value']
assert checks[-1]['before']['border-top']['value'].startswith('1px')
(p/'cascade-checks.json').write_text(json.dumps({'method':'static matching declarations in clientPalette; not computed browser styles','checks':checks},ensure_ascii=False,indent=2),encoding='utf8')
print('Legacy defect reproduced; new 11-ID rule wins at320/390/768/1366: right padding0, background-image none, border-top0')
