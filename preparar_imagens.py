# -*- coding: utf-8 -*-
# Normaliza e otimiza as imagens do site. Coloque os arquivos crus em assets/images/
# nomeados como: background, 1, 2, 3, 4, 5  (png/jpg/jpeg/webp) OU já com nome profissional.
# Rode:  python3 preparar_imagens.py
import os, glob
from PIL import Image
HERE=os.path.dirname(os.path.abspath(__file__))
IMG=os.path.join(HERE,"assets/images"); OPT=os.path.join(IMG,"optimized")
os.makedirs(OPT,exist_ok=True)
# nome cru -> nome profissional
MAP={
 "background":"background-wellness","1":"groceries-lista-compras","2":"rotina-cozinha",
 "3":"metodo-3-pilares","4":"mockup-entregaveis","5":"ritual-noturno",
}
def find(stem):
    for ext in (".png",".jpg",".jpeg",".webp",".PNG",".JPG",".JPEG",".WEBP"):
        p=os.path.join(IMG,stem+ext)
        if os.path.exists(p): return p
    return None
done=[]
for raw,pro in MAP.items():
    src=find(raw) or find(pro)
    if not src:
        print(f"  (faltando) {raw} -> {pro}"); continue
    im=Image.open(src).convert("RGB")
    # PNG normalizado (fallback) — limita largura a 1600px
    w=im.width
    if w>1600:
        im=im.resize((1600,int(im.height*1600/w)))
    png=os.path.join(IMG,pro+".png"); im.save(png,optimize=True)
    webp=os.path.join(OPT,pro+".webp"); im.save(webp,"WEBP",quality=82,method=6)
    done.append(pro)
    print(f"  OK {pro}: png={os.path.getsize(png)//1024}KB webp={os.path.getsize(webp)//1024}KB")
print(f"\nConcluido: {len(done)}/6 imagens preparadas.")
