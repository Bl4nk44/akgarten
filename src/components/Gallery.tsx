import React, { useEffect, useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

function inferThumb(pathStr: string): string | undefined {
  if (!pathStr.startsWith('/gallery/')) return undefined;
  const lastDot = pathStr.lastIndexOf('.');
  if (lastDot === -1) return undefined;
  const withThumbDir = pathStr.replace('/gallery/', '/gallery/thumbs/');
  return withThumbDir.slice(0, withThumbDir.lastIndexOf('.')) + '.thumb' + withThumbDir.slice(withThumbDir.lastIndexOf('.'));
}

type SingleImage = { id: string; src: string; thumb?: string; title?: string; description?: string };
type Pair = { id: string; title?: string; description?: string; before: { src: string; thumb?: string }; after: { src: string; thumb?: string } };

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'gallery' | 'pairs'>('all');
  const [isPairModal, setIsPairModal] = useState(false);
  const pageSize = 8; // 2 rzędy x 4 kolumny (albo 3 kolumny na mniejszych ekranach)
  const [page, setPage] = useState(0);

  const [singleImages, setSingleImages] = useState<SingleImage[]>([]);
  const [beforeAfterPairs, setBeforeAfterPairs] = useState<Pair[]>([]);

  useEffect(() => {
    let aborted = false;
    fetch('/api/gallery')
      .then(r => r.json())
      .then((data) => {
        if (aborted) return;
        setSingleImages(Array.isArray(data?.singleImages) ? data.singleImages : []);
        setBeforeAfterPairs(Array.isArray(data?.beforeAfterPairs) ? data.beforeAfterPairs : []);
      })
      .catch(() => {
        // zostaw puste na fail
      });
    return () => { aborted = true; };
  }, []);

  const allItems = useMemo(() => {
    // W "all" pokazujemy najpierw zwykłe, potem pary (miniatura z "after")
    const singles = singleImages.map(img => ({ type: 'single' as const, id: img.id, origin: img.src, thumb: img.thumb || inferThumb(img.src), title: img.title, description: img.description }));
    const pairs = beforeAfterPairs.map(p => ({ type: 'pair' as const, id: p.id, origin: p.after.src, thumb: p.after.thumb || inferThumb(p.after.src), title: p.title, description: p.description }));
    return [...singles, ...pairs];
  }, [singleImages, beforeAfterPairs]);

  const currentList = useMemo(() => {
    if (filter === 'gallery') {
      return singleImages.map(img => ({ type: 'single' as const, id: img.id, origin: img.src, thumb: img.thumb || inferThumb(img.src), title: img.title, description: img.description }));
    }
    if (filter === 'pairs') {
      return beforeAfterPairs.map(p => ({ type: 'pair' as const, id: p.id, origin: p.after.src, thumb: p.after.thumb || inferThumb(p.after.src), title: p.title, description: p.description }));
    }
    return allItems;
  }, [filter, allItems, singleImages, beforeAfterPairs]);

  const totalPages = Math.ceil(currentList.length / pageSize);
  const pagedItems = currentList.slice(page * pageSize, page * pageSize + pageSize);

  const openLightbox = (index: number) => {
    const item = pagedItems[index];
    setSelectedIndex(index);
    setIsPairModal(item.type === 'pair');
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const next = () => {
    if (selectedIndex === null) return;
    const nextIndex = (selectedIndex + 1) % pagedItems.length;
    setSelectedIndex(nextIndex);
    setIsPairModal(pagedItems[nextIndex].type === 'pair');
  };

  const prev = () => {
    if (selectedIndex === null) return;
    const prevIndex = selectedIndex === 0 ? pagedItems.length - 1 : selectedIndex - 1;
    setSelectedIndex(prevIndex);
    setIsPairModal(pagedItems[prevIndex].type === 'pair');
  };



  return (
    <section id="gallery" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Unsere Projekte
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Entdecken Sie eine Auswahl unserer schönsten Gartenprojekte und lassen Sie sich inspirieren.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { value: 'all', label: 'Alle', icon: '🌿' },
            { value: 'gallery', label: 'Galerie', icon: '🖼️' },
            { value: 'pairs', label: 'Vorher/Nachher', icon: '🪄' },
          ].map((category) => (
            <button
              key={category.value}
              onClick={() => { setFilter(category.value as any); setPage(0); }}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                filter === category.value
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-600 shadow-md'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* Image Grid: 2 rzędy x 3/4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pagedItems.map((item, index) => (
            <div key={item.id} className="group cursor-pointer" onClick={() => openLightbox(index)}>
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <img
                  src={item.thumb || item.origin}
                  srcSet={`${item.thumb || item.origin} 1x, ${item.origin} 2x`}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  alt={item.title || ''}
                  loading="lazy"
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500 bg-black"
                />
                {item.type === 'pair' && (
                  <span className="absolute top-3 left-3 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-md">Vorher/Nachher</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    {item.title && <h3 className="text-lg font-bold mb-1">{item.title}</h3>}
                    {item.description && <p className="text-xs opacity-90">{item.description}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))} className={`px-4 py-2 rounded-lg border ${page === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Zurück</button>
            <span className="text-sm text-gray-600 dark:text-gray-300">Seite {page + 1} von {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} className={`px-4 py-2 rounded-lg border ${page >= totalPages - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Mehr anzeigen</button>
          </div>
        )}

        {/* Lightbox */}
        {selectedIndex !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl max-h-full">
              <button onClick={closeLightbox} className="absolute top-4 right-4 z-10 bg-white text-black p-2 rounded-full shadow hover:bg-green-100 transition-colors">
                <X className="h-6 w-6" />
              </button>

              <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-2 rounded-full shadow hover:bg-green-100 transition-colors">
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-2 rounded-full shadow hover:bg-green-100 transition-colors">
                <ChevronRight className="h-6 w-6" />
              </button>

              {!isPairModal ? (
                <img
                  src={pagedItems[selectedIndex].origin}
                  srcSet={`${pagedItems[selectedIndex].thumb || pagedItems[selectedIndex].origin} 1x, ${pagedItems[selectedIndex].origin} 2x`}
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  alt={pagedItems[selectedIndex].title || ''}
                  className="mx-auto max-w-full max-h-[80vh] object-contain rounded-lg bg-black"
                />
              ) : (
                <BeforeAfterViewer pairId={pagedItems[selectedIndex].id} pairs={beforeAfterPairs} />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function BeforeAfterViewer({ pairId, pairs }: { pairId: string; pairs: Pair[] }) {
  const pair = pairs.find(p => p.id === pairId);
  const [pos, setPos] = useState(0); // start maks w lewo (100% Vorher)
  if (!pair) return null;

  const beforeSrc = pair.before.src;
  const beforeThumb = pair.before.thumb || inferThumb(beforeSrc);
  const afterSrc = pair.after.src;
  const afterThumb = pair.after.thumb || inferThumb(afterSrc);

  // Auto-animacja suwaka do prawej po otwarciu
  React.useEffect(() => {
    let raf = 0;
    let start = 0;
    const duration = 2000; // ms
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      setPos(Math.round(progress * 100));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [pairId]);

  // Baza = Nachher (na spodzie), na wierzchu "Vorher" o zmiennej szerokości
  return (
    <div className="relative mx-auto w-full max-w-4xl h-[60vh] bg-black rounded-lg overflow-hidden select-none">
      <img
        src={afterThumb || afterSrc}
        srcSet={`${afterThumb || afterSrc} 1x, ${afterSrc} 2x`}
        sizes="(min-width: 1024px) 80vw, 100vw"
        alt="Nachher"
        className="absolute inset-0 w-full h-full object-contain bg-black"
      />
      <div className="absolute inset-0" style={{ width: `${100 - pos}%`, overflow: 'hidden' }}>
        <img
          src={beforeThumb || beforeSrc}
          srcSet={`${beforeThumb || beforeSrc} 1x, ${beforeSrc} 2x`}
          sizes="(min-width: 1024px) 80vw, 100vw"
          alt="Vorher"
          className="w-full h-full object-contain bg-black"
        />
      </div>
      <div className="absolute inset-y-0" style={{ left: `${100 - pos}%` }}>
        <div className="w-0.5 h-full bg-white/70" />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded shadow">{pos}%</div>
      </div>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2" />
      <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded">Vorher</div>
      <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">Nachher</div>
    </div>
  );
}
