// Prosty manifest galerii. Uzupełnij plikami w public/gallery/ zgodnie z instrukcją w README lub opisie asystenta.
// Dopuszczalne są ścieżki absolutne do public (np. '/gallery/gal-001.jpg').

export type SingleImage = {
  id: string;
  src: string;        // pełny obraz
  thumb?: string;     // miniatura (opcjonalna); jeśli brak, użyje src
  title?: string;
  description?: string;
};

export type BeforeAfterPair = {
  id: string;
  before: { src: string; thumb?: string };
  after: { src: string; thumb?: string };
  title?: string;
  description?: string;
};

// Uzupełnij poniższe zbiory według schematu nazewnictwa:
// - Zdjęcia zwykłe (29 szt.): /gallery/gal-001.jpg ... /gallery/gal-029.jpg
// - Przed/po (7 par):        /gallery/pairs/pair-01-before.jpg, /gallery/pairs/pair-01-after.jpg ... pair-07-*
// Opcjonalne miniatury wrzucaj do /gallery/thumbs/* i przypisz w polu thumb.

export const singleImages: SingleImage[] = [
  // Przykłady (usuń gdy wprowadzisz swoje):
  // { id: 'gal-001', src: '/gallery/gal-001.jpg', title: 'Projekt 1' },
  // { id: 'gal-002', src: '/gallery/gal-002.jpg' },
];

export const beforeAfterPairs: BeforeAfterPair[] = [
  // Przykład pary (usuń gdy wprowadzisz swoje):
  // {
  //   id: 'pair-01',
  //   before: { src: '/gallery/pairs/pair-01-before.jpg' },
  //   after:  { src: '/gallery/pairs/pair-01-after.jpg' },
  //   title: 'Vorgarten – vorher/nachher'
  // }
];
