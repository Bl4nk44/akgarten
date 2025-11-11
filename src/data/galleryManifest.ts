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
  { id: 'gal-001', src: '/gallery/gal-001.jpg' },
  { id: 'gal-002', src: '/gallery/gal-002.jpg' },
  { id: 'gal-003', src: '/gallery/gal-003.jpg' },
  { id: 'gal-004', src: '/gallery/gal-004.jpg' },
  { id: 'gal-005', src: '/gallery/gal-005.jpg' },
  { id: 'gal-006', src: '/gallery/gal-006.jpg' },
  { id: 'gal-007', src: '/gallery/gal-007.jpg' },
  { id: 'gal-008', src: '/gallery/gal-008.jpg' },
  { id: 'gal-009', src: '/gallery/gal-009.jpg' },
  { id: 'gal-010', src: '/gallery/gal-010.jpg' },
  { id: 'gal-011', src: '/gallery/gal-011.jpg' },
  { id: 'gal-012', src: '/gallery/gal-012.jpg' },
  { id: 'gal-013', src: '/gallery/gal-013.jpg' },
  { id: 'gal-014', src: '/gallery/gal-014.jpg' },
  { id: 'gal-015', src: '/gallery/gal-015.jpg' },
  { id: 'gal-016', src: '/gallery/gal-016.jpg' },
  { id: 'gal-017', src: '/gallery/gal-017.jpg' },
  { id: 'gal-018', src: '/gallery/gal-018.jpg' },
  { id: 'gal-019', src: '/gallery/gal-019.jpg' },
  { id: 'gal-020', src: '/gallery/gal-020.jpg' },
  { id: 'gal-021', src: '/gallery/gal-021.jpg' },
  { id: 'gal-022', src: '/gallery/gal-022.jpg' },
  { id: 'gal-023', src: '/gallery/gal-023.jpg' },
  { id: 'gal-024', src: '/gallery/gal-024.jpg' },
  { id: 'gal-025', src: '/gallery/gal-025.jpg' },
  // brak 026–029 w repo – dodasz jak będziesz miał
];

export const beforeAfterPairs: BeforeAfterPair[] = [
  { id: 'pair-01', before: { src: '/gallery/pairs/pair-01-before.jpg' }, after: { src: '/gallery/pairs/pair-01-after.jpg' } },
  { id: 'pair-02', before: { src: '/gallery/pairs/pair-02-before.jpg' }, after: { src: '/gallery/pairs/pair-02-after.jpg' } },
  { id: 'pair-03', before: { src: '/gallery/pairs/pair-03-before.jpg' }, after: { src: '/gallery/pairs/pair-03-after.jpg' } },
  { id: 'pair-04', before: { src: '/gallery/pairs/pair-04-before.jpg' }, after: { src: '/gallery/pairs/pair-04-after.jpg' } },
  { id: 'pair-05', before: { src: '/gallery/pairs/pair-05-before.jpg' }, after: { src: '/gallery/pairs/pair-05-after.jpg' } },
  { id: 'pair-06', before: { src: '/gallery/pairs/pair-06-before.jpg' }, after: { src: '/gallery/pairs/pair-06-after.jpg' } },
  { id: 'pair-07', before: { src: '/gallery/pairs/pair-07-before.jpg' }, after: { src: '/gallery/pairs/pair-07-after.jpg' } },
];
