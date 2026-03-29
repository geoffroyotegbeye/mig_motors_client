import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Car, Fuel, Settings, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getVehicules, getMarques, type Vehicule, type Marque } from '../utils/api';

const Vehicules = () => {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [marques, setMarques] = useState<Marque[]>([]);
  const [search, setSearch] = useState('');
  const [filterMarque, setFilterMarque] = useState('');
  const [filterCarburant, setFilterCarburant] = useState('');

  useEffect(() => {
    getVehicules().then(data => setVehicules(data.filter(v => v.statut !== 'vendu')));
    getMarques().then(setMarques);
  }, []);

  const filtered = vehicules.filter(v => {
    const marque = marques.find(m => m.id === v.marqueId);
    const matchSearch = v.nom.toLowerCase().includes(search.toLowerCase()) || marque?.nom.toLowerCase().includes(search.toLowerCase());
    const matchMarque = filterMarque ? v.marqueId === parseInt(filterMarque) : true;
    const matchCarburant = filterCarburant ? v.carburant === filterCarburant : true;
    return matchSearch && matchMarque && matchCarburant;
  });

  const carburants = [...new Set(vehicules.map(v => v.carburant))];

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <section className="relative py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <span className="inline-block px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-full text-red-400 text-sm font-medium mb-6">
              Notre Stock
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Nos </span>
              <span className="gradient-text">Véhicules</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Découvrez notre sélection de véhicules disponibles. Trouvez celui qui correspond à vos besoins.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-8 bg-white dark:bg-zinc-900/50 border-b border-gray-200 dark:border-zinc-800 sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un véhicule..."
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:border-red-500 outline-none text-sm" />
            </div>
            <div className="flex gap-3">
              <select value={filterMarque} onChange={e => setFilterMarque(e.target.value)}
                className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl py-2.5 px-4 text-gray-900 dark:text-white focus:border-red-500 outline-none text-sm appearance-none cursor-pointer">
                <option value="">Toutes marques</option>
                {marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
              </select>
              <select value={filterCarburant} onChange={e => setFilterCarburant(e.target.value)}
                className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl py-2.5 px-4 text-gray-900 dark:text-white focus:border-red-500 outline-none text-sm appearance-none cursor-pointer">
                <option value="">Carburant</option>
                {carburants.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
            <Filter className="w-3 h-3" /> {filtered.length} véhicule{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-white dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Car className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Aucun véhicule trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((v, i) => {
                const marque = marques.find(m => m.id === v.marqueId);
                return (
                  <motion.div key={v.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }}
                    className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none hover:border-red-500/40 dark:hover:border-red-600/30 transition-all duration-300 group">
                    {/* Image */}
                    <div className="relative h-48 bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                      {v.image
                        ? <img src={v.image} alt={v.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center"><Car className="w-12 h-12 text-gray-300 dark:text-gray-600" /></div>
                      }
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          v.statut === 'disponible' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                        }`}>{v.statut}</span>
                      </div>
                      {marque?.logo && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-zinc-800 rounded-lg p-1 flex items-center justify-center">
                          <img src={marque.logo} alt={marque.nom} className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">{marque?.nom} • {v.annee}</p>
                      <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-3">{v.nom}</h3>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                          <Fuel className="w-3.5 h-3.5 text-red-500" /> {v.carburant}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                          <Settings className="w-3.5 h-3.5 text-red-500" /> {v.transmission}
                        </div>
                        {v.couleur && (
                          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs col-span-2">
                            <span className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-zinc-600 flex-shrink-0" style={{ backgroundColor: v.couleur.toLowerCase() === 'blanc' ? '#fff' : v.couleur.toLowerCase() === 'noir' ? '#000' : v.couleur.toLowerCase() === 'rouge' ? '#dc2626' : v.couleur.toLowerCase() === 'bleu' ? '#2563eb' : '#9ca3af' }} />
                            {v.couleur}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800">
                        <p className="text-gray-400 text-xs">À partir de</p>
                        <p className="text-gray-900 dark:text-white font-bold text-sm">{v.prix} <span className="text-xs font-normal text-gray-400">FCFA</span></p>
                        <Link to="/contact"
                          className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-semibold rounded-lg hover:shadow-md hover:shadow-red-600/30 transition-all">
                          Contacter
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Vehicules;
