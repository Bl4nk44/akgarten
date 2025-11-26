import React, { useEffect, useMemo, useState } from 'react';
import { useAdmin } from './AdminContext';

type Single = { id: string; src: string; thumb?: string; title?: string; description?: string };
type Pair = { id: string; title?: string; description?: string; before: { src: string; thumb?: string }; after: { src: string; thumb?: string } };

type Manifest = { singleImages: Single[]; beforeAfterPairs: Pair[] };

export default function AdminGallery() {
  const { token } = useAdmin();
  const [tab, setTab] = useState<'list' | 'single' | 'pair'>('list');

  if (!token) return null;
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex gap-2 mb-6">
        <button onClick={()=>setTab('list')} className={`px-3 py-2 rounded ${tab==='list'?'bg-green-600 text-white':'bg-white dark:bg-gray-700'}`}>Lista</button>
        <button onClick={()=>setTab('single')} className={`px-3 py-2 rounded ${tab==='single'?'bg-green-600 text-white':'bg-white dark:bg-gray-700'}`}>Dodaj zdjęcia</button>
        <button onClick={()=>setTab('pair')} className={`px-3 py-2 rounded ${tab==='pair'?'bg-green-600 text-white':'bg-white dark:bg-gray-700'}`}>Dodaj parę</button>
      </div>
      {tab==='list' && <AdminList />}
      {tab==='single' && <UploadSingle />}
      {tab==='pair' && <UploadPair />}
    </div>
  );
}

function AdminList() {
  const { authHeader } = useAdmin();
  const [data, setData] = useState<Manifest>({ singleImages: [], beforeAfterPairs: [] });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch('/api/admin/list', { headers: { ...authHeader } }).then(r=>r.json()).then(setData);
  }, [authHeader, refresh]);

  const items = useMemo(() => [
    ...data.singleImages.map(s => ({ kind: 'single' as const, id: s.id, title: s.title, description: s.description, thumb: s.thumb ?? s.src })),
    ...data.beforeAfterPairs.map(p => ({ kind: 'pair' as const, id: p.id, title: p.title, description: p.description, thumb: p.after.thumb ?? p.after.src })),
  ], [data]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(it => (
          <div key={it.id} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <img src={it.thumb} alt="thumb" className="w-full h-40 object-cover" />
            <div className="p-3 space-y-2">
              <div className="font-semibold">{it.id} {it.kind==='pair' && <span className="text-xs text-gray-500">(para)</span>}</div>
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
      <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Tytuł" className="w-full px-2 py-1 rounded border bg-transparent" />
      <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Opis" className="w-full px-2 py-1 rounded border bg-transparent" rows={2} />
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

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...dropped]);
  }

  async function uploadAll() {
    const queue = [...files];
    const done: string[] = [];
    for (const f of queue) {
      const fd = new FormData();
      fd.append('file', f);
      if (title) fd.append('title', title);
      if (description) fd.append('description', description);
      const r = await fetch('/api/admin/upload-single', { method: 'POST', headers: { ...authHeader }, body: fd });
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
      <div onDragOver={(e)=>e.preventDefault()} onDrop={onDrop} className="border-2 border-dashed rounded-xl p-10 text-center">
        Przeciągnij zdjęcia tutaj (JPG/PNG/WebP)
      </div>
      {files.length>0 && <div className="text-sm text-gray-500">Wybrane: {files.map(f=>f.name).join(', ')}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="px-3 py-2 rounded border bg-transparent" placeholder="Tytuł (opcjonalnie)" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <input className="px-3 py-2 rounded border bg-transparent" placeholder="Opis (opcjonalnie)" value={description} onChange={(e)=>setDescription(e.target.value)} />
      </div>
      <button onClick={uploadAll} className="px-4 py-2 rounded bg-green-600 text-white font-semibold">Wyślij {files.length>0?`(${files.length})`:''}</button>
      {log.length>0 && <pre className="text-xs bg-black/50 text-white p-3 rounded max-h-60 overflow-auto">{log.join('\n')}</pre>}
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
          <div className="font-semibold mb-1">Before</div>
          <input type="file" accept="image/*" onChange={(e)=>setBefore(e.target.files?.[0]||null)} />
        </div>
        <div>
          <div className="font-semibold mb-1">After</div>
          <input type="file" accept="image/*" onChange={(e)=>setAfter(e.target.files?.[0]||null)} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="px-3 py-2 rounded border bg-transparent" placeholder="Tytuł (opcjonalnie)" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <input className="px-3 py-2 rounded border bg-transparent" placeholder="Opis (opcjonalnie)" value={description} onChange={(e)=>setDescription(e.target.value)} />
      </div>
      <button onClick={uploadPair} className="px-4 py-2 rounded bg-green-600 text-white font-semibold">Wyślij parę</button>
    </div>
  );
}
