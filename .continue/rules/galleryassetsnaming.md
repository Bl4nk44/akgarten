---
globs: src/components/Gallery.tsx
description: Standardy nazewnictwa i lokacji assetów dla galerii, aby komponent
  Gallery.tsx poprawnie je odczytał.
---

Umieszczaj zdjęcia galerii w public/gallery. Nazewnictwo: zwykłe: gal-XXX.(jpg|webp) od 001 do 029; pary przed/po: pairs/pair-YY-before.(jpg|webp) i pairs/pair-YY-after.(jpg|webp) od 01 do 07. Miniatury (opcjonalne) w public/gallery/thumbs/ o analogicznych nazwach: gal-XXX.thumb.(jpg|webp) lub pair-YY-before.thumb.(jpg|webp), pair-YY-after.thumb.(jpg|webp). Używaj ścieżek absolutnych od root: '/gallery/...'.