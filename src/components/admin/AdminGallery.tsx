import React, { useEffect, useMemo, useState } from 'react';
import { useAdmin } from './AdminContext';

type Single = { id: string; src: string; thumb?: string; title?: string; description?: string };
type Pair = { id: string; title?: string; description?: string; before: { src: string; thumb?: string }; after: { src: string; thumb?: string } };

type Manifest = { singleImages: Single[]; beforeAfterPairs: Pair[] };

export default function AdminGallery() {
  const { token, setToken } = useAdmin();
  const [tab, setTab] = useState<'list' | 'single' | 'pair'>('list');

  if (!token) return null;
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-20 backdrop-blur bg-gray-50/80 dark:bg-gray-900/80 border-b border-green-600/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Panel administracyjny</h1>
          <button onClick={()=>setToken(null)} className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border hover:bg-gray-50 dark:hover:bg-gray-700">Wyloguj</button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800/90 border border-green-600/30 rounded-2xl shadow-xl p-4">
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={()=>setTab('list')} className={`px-3 py-2 rounded-lg transition ${tab==='list'?'bg-green-600 text-white':'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Lista</button>
            <button onClick={()=>setTab('single')} className={`px-3 py-2 rounded-lg transition ${tab==='single'?'bg-green-600 text-white':'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Dodaj zdjęcia</button>
            <button onClick={()=>setTab('pair')} className={`px-3 py-2 rounded-lg transition ${tab==='pair'?'bg-green-600 text-white':'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Dodaj parę</button>
          </div>

          {tab==='list' && <AdminList />}
          {tab==='single' && <UploadSingle />}
          {tab==='pair' && <UploadPair />}
        </div>
      </div>
    </section>
  );
}

function AdminList() {
  const { authHeader } = useAdmin();
  const [data, setData] = useState<Manifest>({ singleImages: [], beforeAfterPairs: [] });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch('/api/admin/list', { headers: { ...authHeader } }).then(r=>r.json()).then(setData);
  }, [authHeader, refresh]);

  const loading = !data || (data.singleImages.length===0 && data.beforeAfterPairs.length===0 && refresh===0);

  const items = useMemo(() => [
    ...data.singleImages.map(s => ({ kind: 'single' as const, id: s.id, title: s.title, description: s.description, thumb: s.thumb ?? s.src })),
    ...data.beforeAfterPairs.map(p => ({ kind: 'pair' as const, id: p.id, title: p.title, description: p.description, thumb: p.after.thumb ?? p.after.src })),
  ], [data]);

  return (
    <div>
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {Array.from({length:8}).map((_,i)=> (
            <div key={i} className="h-56 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(it => (
          <div key={it.id} className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl shadow overflow-hidden">
            <img src={it.thumb} alt="thumb" className="w-full h-40 object-cover" />
            <div className="p-3 space-y-2">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{it.id} {it.kind==='pair' && <span className="text-xs text-gray-500">(para)</span>}</div>
              <MetaEditor id={it.id} initial={{ title: it.title, description: it.description }} onSaved={()=>setRefresh(x=>x+1)} />
              <DeleteButton id={it.id} onDeleted={()=>setRefresh(x=>x+1)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetaEditor({ id, initial, onSaved }: { id: string; initial: { title?: string; description?: string }; onSaved: () => void }) {
  const { authHeader } = useAdmin();
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-2">
      <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Tytuł" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
      <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Opis" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" rows={2} />
      <div className="flex gap-2">
        <button disabled={busy} onClick={async ()=>{ setBusy(true); await fetch(`/api/admin/meta/${id}`, { method:'PATCH', headers: { 'Content-Type':'application/json', ...authHeader }, body: JSON.stringify({ title, description }) }); setBusy(false); onSaved(); }} className="px-3 py-1 rounded bg-green-600 text-white">Zapisz</button>
        <button disabled={busy} onClick={async ()=>{ setBusy(true); await fetch(`/api/admin/meta/${id}`, { method:'PATCH', headers: { 'Content-Type':'application/json', ...authHeader }, body: JSON.stringify({ title: '', description: '' }) }); setBusy(false); setTitle(''); setDescription(''); onSaved(); }} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">Wyczyść</button>
      </div>
    </div>
  );
}

function DeleteButton({ id, onDeleted }: { id: string; onDeleted: () => void }) {
  const { authHeader } = useAdmin();
  const [busy, setBusy] = useState(false);
  return (
    <button disabled={busy} onClick={async ()=>{ if(!confirm(`Usunąć ${id}?`)) return; setBusy(true); await fetch(`/api/admin/item/${id}`, { method:'DELETE', headers: { ...authHeader } }); setBusy(false); onDeleted(); }} className="px-3 py-1 rounded bg-red-600 text-white">Usuń</button>
  );
}

function UploadSingle() {
  const { authHeader } = useAdmin();
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState<{name:string; pct:number}[]>([]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...dropped]);
  }

  async function uploadAll() {
    const queue = [...files];
    const done: string[] = [];
    setProgress(queue.map(f=>({ name: f.name, pct: 0 })));
    for (const f of queue) {
      const fd = new FormData();
      fd.append('file', f);
      if (title) fd.append('title', title);
      if (description) fd.append('description', description);
      const r = await fetch('/api/admin/upload-single', { method: 'POST', headers: { ...authHeader }, body: fd });
      setProgress(prev => prev.map(p => p.name===f.name ? { ...p, pct: 100 } : p));
      if (!r.ok) { setLog(l=>[...l, `Błąd: ${f.name}`]); continue; }
      const j = await r.json();
      done.push(j.id);
      setLog(l=>[...l, `OK: ${f.name} -> ${j.id}`]);
    }
    alert(`Wgrane: ${done.length}/${files.length}`);
    setFiles([]);
  }

  return (
    <div className="space-y-4">
      <div onDragOver={(e)=>e.preventDefault()} onDrop={onDrop} className="border-2 border-dashed border-green-600/40 bg-white dark:bg-gray-900 rounded-2xl p-10 text-center text-gray-700 dark:text-gray-300">
        Przeciągnij zdjęcia tutaj (JPG/PNG/WebP)
      </div>
      {files.length>0 && <div className="text-sm text-gray-500 dark:text-gray-400">Wybrane: {files.map(f=>f.name).join(', ')}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" placeholder="Tytuł (opcjonalnie)" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <input className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" placeholder="Opis (opcjonalnie)" value={description} onChange={(e)=>setDescription(e.target.value)} />
      </div>
      <button onClick={uploadAll} className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">Wyślij {files.length>0?`(${files.length})`:''}</button>
      {progress.length>0 && (
        <div className="space-y-2">
          {progress.map(p => (
            <div key={p.name} className="text-sm">
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">{p.name}</span><span className="text-gray-500">{p.pct}%</span></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded">
                <div className="h-2 bg-green-600 rounded" style={{ width: `${p.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
      {log.length>0 && <pre className="text-xs bg-black/60 text-white p-3 rounded-xl max-h-60 overflow-auto">{log.join('\n')}</pre>}
    </div>
  );
}

function UploadPair() {
  const { authHeader } = useAdmin();
  const [beforeFile, setBefore] = useState<File | null>(null);
  const [afterFile, setAfter] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function uploadPair() {
    if (!beforeFile || !afterFile) { alert('Wybierz oba pliki'); return; }
    const fd = new FormData();
    fd.append('beforeFile', beforeFile);
    fd.append('afterFile', afterFile);
    if (title) fd.append('title', title);
    if (description) fd.append('description', description);
    const r = await fetch('/api/admin/upload-pair', { method: 'POST', headers: { ...authHeader }, body: fd });
    if (!r.ok) { alert('Błąd uploadu'); return; }
    alert('Para dodana');
    setBefore(null); setAfter(null); setTitle(''); setDescription('');
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Przed</div>
          <input type="file" accept="image/*" onChange={(e)=>setBefore(e.target.files?.[0]||null)} className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
        </div>
        <div>
          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Po</div>
          <input type="file" accept="image/*" onChange={(e)=>setAfter(e.target.files?.[0]||null)} className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" placeholder="Tytuł (opcjonalnie)" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <input className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" placeholder="Opis (opcjonalnie)" value={description} onChange={(e)=>setDescription(e.target.value)} />
      </div>
      <button onClick={uploadPair} className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">Wyślij parę</button>
    </div>
  );
}
