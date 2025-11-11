import React, { useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { singleImages, beforeAfterPairs } from '@/data/galleryManifest';

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'gallery' | 'pairs'>('all');
  const [isPairModal, setIsPairModal] = useState(false);
  const pageSize = 8; // 2 rzędy x 4 kolumny (albo 3 kolumny na mniejszych ekranach)
  const [page, setPage] = useState(0);

  const allItems = useMemo(() => {
    // W "all" pokazujemy najpierw zwykłe, potem pary (miniatura z "after")
    const singles = singleImages.map(img => ({ type: 'single' as const, id: img.id, src: img.thumb || img.src, title: img.title, description: img.description }));
    const pairs = beforeAfterPairs.map(p => ({ type: 'pair' as const, id: p.id, src: p.after.thumb || p.after.src, title: p.title, description: p.description }));
    return [...singles, ...pairs];
  }, []);

  const currentList = useMemo(() => {
    if (filter === 'gallery') {
      return singleImages.map(img => ({ type: 'single' as const, id: img.id, src: img.thumb || img.src, title: img.title, description: img.description }));
    }
    if (filter === 'pairs') {
      return beforeAfterPairs.map(p => ({ type: 'pair' as const, id: p.id, src: p.after.thumb || p.after.src, title: p.title, description: p.description }));
    }
    return allItems;
  }, [filter, allItems]);

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

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1);
    }
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
                <img src={item.src} alt={item.title || ''} loading="lazy" className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
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
                <img src={pagedItems[selectedIndex].src} alt={pagedItems[selectedIndex].title || ''} className="mx-auto max-w-full max-h-[80vh] object-contain rounded-lg" />
              ) : (
                <BeforeAfterViewer pairId={pagedItems[selectedIndex].id} />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function BeforeAfterViewer({ pairId }: { pairId: string }) {
  const pair = beforeAfterPairs.find(p => p.id === pairId);
  const [pos, setPos] = useState(50);
  if (!pair) return null;

  const before = pair.before.src;
  const after = pair.after.src;

  return (
    <div className="relative mx-auto w-full max-w-4xl h-[60vh] bg-black/20 rounded-lg overflow-hidden select-none">
      <img src={before} alt="Vorher" className="absolute inset-0 w-full h-full object-contain" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={after} alt="Nachher" className="w-full h-full object-contain" />
      </div>
      <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="w-0.5 h-full bg-white/70" />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded shadow">{pos}%</div>
      </div>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2" />
      <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded">Vorher</div>
      <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">Nachher</div>
    </div>
  );
}
