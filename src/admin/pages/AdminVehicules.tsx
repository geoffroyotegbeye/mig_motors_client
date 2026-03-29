import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Upload, Car, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getVehicules, addVehicule, updateVehicule, deleteVehicule, getMarques, uploadImage, type Vehicule, type Marque } from '../../utils/api';

const CARBURANTS = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'];
const TRANSMISSIONS = ['Manuelle', 'Automatique'];
const STATUTS = ['disponible', 'reserve', 'vendu'] as const;

const emptyForm: {
  marqueId: number; nom: string; prix: string; annee: string;
  carburant: string; transmission: string; couleur: string;
  description: string; image: string; statut: 'disponible' | 'vendu' | 'reserve';
} = {
  marqueId: 0, nom: '', prix: '', annee: new Date().getFullYear().toString(),
  carburant: CARBURANTS[0], transmission: TRANSMISSIONS[0],
  couleur: '', description: '', image: '', statut: 'disponible',
};

const AdminVehicules = () => {
  const [marques, setMarques] = useState<Marque[]>([]);
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Vehicule | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filterMarque, setFilterMarque] = useState('');
  const [preview, setPreview] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => getVehicules().then(setVehicules);

  useEffect(() => {
    getMarques().then(data => {
      setMarques(data);
      setForm(f => ({ ...f, marqueId: data[0]?.id || 0 }));
    });
    refresh();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, marqueId: marques[0]?.id || 0 });
    setPreview('');
    setModal(true);
  };

  const openEdit = (v: Vehicule) => {
    setEditing(v);
    setForm({ marqueId: v.marqueId, nom: v.nom, prix: v.prix, annee: v.annee, carburant: v.carburant, transmission: v.transmission, couleur: v.couleur || '', description: v.description || '', image: v.image || '', statut: v.statut });
    setPreview(v.image || '');
    setModal(true);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const url = await uploadImage(file);
    setForm(f => ({ ...f, image: url }));
  };

  const imageDisplay = preview || form.image;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateVehicule(editing.id, form);
    } else {
      await addVehicule(form);
    }
    refresh();
    setModal(false);
  };

  const handleDelete = async (id: number) => {
    await deleteVehicule(id);
    refresh();
    setDeleteConfirm(null);
  };

  const filtered = vehicules.filter(v => {
    const marque = marques.find(m => m.id === v.marqueId);
    const matchSearch = v.nom.toLowerCase().includes(search.toLowerCase()) || marque?.nom.toLowerCase().includes(search.toLowerCase());
    const matchMarque = filterMarque ? v.marqueId === parseInt(filterMarque) : true;
    return matchSearch && matchMarque;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const inputClass = "w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-red-500 outline-none transition-all text-sm";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Véhicules</h1>
          <p className="text-gray-400 mt-1">{vehicules.length} véhicule{vehicules.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-600/30 transition-all text-sm">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:border-zinc-600 outline-none text-sm" />
        </div>
        <select value={filterMarque} onChange={e => { setFilterMarque(e.target.value); setPage(1); }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:border-zinc-600 outline-none text-sm appearance-none cursor-pointer">
          <option value="">Toutes les marques</option>
          {marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">Véhicule</th>
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3 uppercase tracking-wider hidden sm:table-cell">Marque</th>
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3 uppercase tracking-wider hidden md:table-cell">Prix</th>
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3 uppercase tracking-wider hidden lg:table-cell">Carburant</th>
                <th className="text-left text-gray-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">Statut</th>
                <th className="text-right text-gray-400 text-xs font-medium px-4 py-3 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {paginated.map((v, i) => {
                const marque = marques.find(m => m.id === v.marqueId);
                return (
                  <motion.tr key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                          {v.image ? <img src={v.image} alt={v.nom} className="w-full h-full object-cover" /> : <Car className="w-5 h-5 text-gray-500 m-2.5" />}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{v.nom}</p>
                          <p className="text-gray-500 text-xs">{v.annee}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-gray-300 text-sm">{marque?.nom || '—'}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-300 text-sm">À partir de {v.prix} FCFA</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-gray-300 text-sm">{v.carburant}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        v.statut === 'disponible' ? 'bg-green-600/20 text-green-400' :
                        v.statut === 'reserve' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>{v.statut}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(v)} className="w-8 h-8 bg-zinc-800 hover:bg-blue-600/20 hover:text-blue-400 text-gray-400 rounded-lg flex items-center justify-center transition-all">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteConfirm(v.id)} className="w-8 h-8 bg-zinc-800 hover:bg-red-600/20 hover:text-red-400 text-gray-400 rounded-lg flex items-center justify-center transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucun véhicule trouvé</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-gray-500 text-xs">
            {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} sur {filtered.length}
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

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{editing ? 'Modifier le véhicule' : 'Nouveau véhicule'}</h2>
                <button onClick={() => setModal(false)} className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Photo du véhicule</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-16 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {imageDisplay ? <img src={imageDisplay} alt="véhicule" className="w-full h-full object-cover" /> : <Car className="w-7 h-7 text-gray-500" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-gray-300 text-sm rounded-xl transition-all w-full justify-center">
                        <Upload className="w-4 h-4" /> Uploader une photo
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                      <input type="text" value={form.image} onChange={e => { setPreview(e.target.value); setForm({ ...form, image: e.target.value }); }}
                        placeholder="ou coller une URL"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-3 text-white text-sm placeholder-gray-500 focus:border-red-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>

                {/* Marque + Nom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Marque *</label>
                    <select value={form.marqueId} onChange={e => setForm({ ...form, marqueId: parseInt(e.target.value) })} required
                      className={inputClass + ' appearance-none cursor-pointer'}>
                      {marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Nom du véhicule *</label>
                    <input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required
                      placeholder="Ex: KIA Sportage" className={inputClass} />
                  </div>
                </div>

                {/* Prix + Année */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Prix (FCFA) *</label>
                    <input type="text" value={form.prix} onChange={e => setForm({ ...form, prix: e.target.value })} required
                      placeholder="Ex: 18 500 000" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Année *</label>
                    <input type="number" value={form.annee} onChange={e => setForm({ ...form, annee: e.target.value })} required
                      min="1990" max="2030" className={inputClass} />
                  </div>
                </div>

                {/* Carburant + Transmission */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Carburant</label>
                    <select value={form.carburant} onChange={e => setForm({ ...form, carburant: e.target.value })}
                      className={inputClass + ' appearance-none cursor-pointer'}>
                      {CARBURANTS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Transmission</label>
                    <select value={form.transmission} onChange={e => setForm({ ...form, transmission: e.target.value })}
                      className={inputClass + ' appearance-none cursor-pointer'}>
                      {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* Couleur seule */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Couleur</label>
                  <input type="text" value={form.couleur} onChange={e => setForm({ ...form, couleur: e.target.value })}
                    placeholder="Ex: Blanc" className={inputClass} />
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Statut</label>
                  <div className="flex gap-3">
                    {STATUTS.map(s => (
                      <button key={s} type="button" onClick={() => setForm({ ...form, statut: s })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all border ${
                          form.statut === s
                            ? s === 'disponible' ? 'bg-green-600/20 border-green-600/50 text-green-400'
                              : s === 'reserve' ? 'bg-yellow-600/20 border-yellow-600/50 text-yellow-400'
                              : 'bg-gray-600/20 border-gray-600/50 text-gray-400'
                            : 'bg-zinc-800 border-zinc-700 text-gray-500 hover:border-zinc-600'
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3} placeholder="Description du véhicule..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:border-red-500 outline-none transition-all resize-none text-sm" />
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
              <h3 className="text-white font-bold text-lg mb-2">Supprimer ce véhicule ?</h3>
              <p className="text-gray-400 text-sm mb-6">Cette action est irréversible.</p>
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

export default AdminVehicules;
