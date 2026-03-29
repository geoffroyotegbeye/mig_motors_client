import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Upload, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMarques, addMarque, updateMarque, deleteMarque, uploadImage, type Marque } from '../../utils/api';

const TYPES = ['Berlines & SUV', 'Luxe & Premium', 'Deux-roues', 'Camions & Utilitaires', 'Poids lourds & Bus', 'Citadines'];

const emptyForm = { nom: '', logo: '', type: TYPES[0], description: '' };

const AdminMarques = () => {
  const [marques, setMarques] = useState<Marque[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Marque | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;
  const totalPages = Math.ceil(marques.length / PER_PAGE);
  const paginated = marques.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const refresh = () => getMarques().then(setMarques);

  useEffect(() => { refresh(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setPreview(''); setModal(true); };
  const openEdit = (m: Marque) => { setEditing(m); setForm({ nom: m.nom, logo: m.logo || '', type: m.type, description: m.description || '' }); setPreview(m.logo || ''); setModal(true); };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const url = await uploadImage(file);
    setForm(f => ({ ...f, logo: url }));
  };

  const logoDisplay = preview || form.logo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateMarque(editing.id, form);
    } else {
      await addMarque(form);
    }
    refresh();
    setModal(false);
  };

  const handleDelete = async (id: number) => {
    await deleteMarque(id);
    refresh();
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Marques</h1>
          <p className="text-gray-400 mt-1">{marques.length} marque{marques.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-600/30 transition-all text-sm">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginated.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                {m.logo
                  ? <img src={m.logo} alt={m.nom} className="w-full h-full object-contain" onError={e => { e.currentTarget.style.display = 'none'; }} />
                  : <Tag className="w-6 h-6 text-gray-500" />}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(m)} className="w-8 h-8 bg-zinc-800 hover:bg-blue-600/20 hover:text-blue-400 text-gray-400 rounded-lg flex items-center justify-center transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteConfirm(m.id)} className="w-8 h-8 bg-zinc-800 hover:bg-red-600/20 hover:text-red-400 text-gray-400 rounded-lg flex items-center justify-center transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-white font-semibold">{m.nom}</h3>
            <span className="inline-block mt-1 px-2 py-0.5 bg-zinc-800 text-gray-400 text-xs rounded-full">{m.type}</span>
            {m.description && <p className="text-gray-500 text-xs mt-2 line-clamp-2">{m.description}</p>}
          </motion.div>
        ))}
      </div>

      {marques.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aucune marque. Ajoutez-en une !</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-gray-500 text-xs">
            {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, marques.length)} sur {marques.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-gray-400 hover:border-zinc-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all ${
                  p === page
                    ? 'bg-red-600 text-white border border-red-600'
                    : 'bg-zinc-900 border border-zinc-800 text-gray-400 hover:border-zinc-600 hover:text-white'
                }`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-gray-400 hover:border-zinc-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Ajout/Édition */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{editing ? 'Modifier la marque' : 'Nouvelle marque'}</h2>
                <button onClick={() => setModal(false)} className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Logo */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Logo de la marque</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                      {logoDisplay
                        ? <img src={logoDisplay} alt="logo" className="w-full h-full object-contain" />
                        : <Tag className="w-6 h-6 text-gray-500" />}
                    </div>
                    <div className="flex-1">
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-gray-300 text-sm rounded-xl transition-all w-full justify-center">
                        <Upload className="w-4 h-4" /> Uploader une image
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                      <input type="text" value={form.logo} onChange={e => { setPreview(e.target.value); setForm({ ...form, logo: e.target.value }); }}
                        placeholder="ou coller une URL"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-3 text-white text-sm placeholder-gray-500 focus:border-red-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Nom *</label>
                  <input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required
                    placeholder="Ex: KIA"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-red-500 outline-none transition-all" />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Type *</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:border-red-500 outline-none transition-all appearance-none cursor-pointer">
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3} placeholder="Description courte..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-red-500 outline-none transition-all resize-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)}
                    className="flex-1 py-3 bg-zinc-800 border border-zinc-700 text-gray-300 font-semibold rounded-xl hover:bg-zinc-700 transition-all">
                    Annuler
                  </button>
                  <button type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-600/30 transition-all">
                    {editing ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Supprimer la marque ?</h3>
              <p className="text-gray-400 text-sm mb-6">Les véhicules associés seront aussi supprimés.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-zinc-800 text-gray-300 rounded-xl hover:bg-zinc-700 transition-all">Annuler</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all">Supprimer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMarques;
