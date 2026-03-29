import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Car, Truck, Bike, Fuel, Settings } from 'lucide-react';
import { getMarques, getVehicules, type Marque, type Vehicule } from '../utils/api';

const Brands = () => {
  const [selectedBrand, setSelectedBrand] = useState<Marque | null>(null);
  const [brands, setBrands] = useState<Marque[]>([]);
  const [allVehicules, setAllVehicules] = useState<Vehicule[]>([]);

  useEffect(() => {
    getMarques().then(setBrands);
    getVehicules().then(setAllVehicules);
  }, []);

  const getIcon = (type: string) => {
    if (type.includes('Camions') || type.includes('Poids')) return Truck;
    if (type.includes('Deux-roues')) return Bike;
    return Car;
  };

  const getBrandVehicules = (marqueId: number) =>
    allVehicules.filter(v => v.marqueId === marqueId && v.statut !== 'vendu');

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-600/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <span className="inline-block px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-full text-red-400 text-sm font-medium mb-6">
              Notre Catalogue
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Nos </span>
              <span className="gradient-text">Marques</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Explorez notre gamme exclusive de marques automobiles prestigieuses.
              Cliquez sur une marque pour découvrir ses véhicules.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-20 bg-white dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 justify-items-center">
            {brands.map((brand, index) => {
              const Icon = getIcon(brand.type);
              const count = getBrandVehicules(brand.id).length;
              return (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring', bounce: 0.4 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSelectedBrand(brand)}
                  className="cursor-pointer group"
                >
                  <div className="brand-circle relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full bg-gray-100 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 border-2 border-gray-200 dark:border-zinc-700 hover:border-red-500 dark:hover:border-red-600/50 flex flex-col items-center justify-center p-4 sm:p-6 transition-all duration-500 shadow-sm dark:shadow-none">
                    <div className="absolute inset-0 rounded-full bg-red-600/0 group-hover:bg-red-600/5 dark:group-hover:bg-red-600/10 transition-all duration-500" />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 mb-2 flex items-center justify-center">
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.nom}
                            className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                            onError={e => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                          <Icon className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <span className="text-gray-800 dark:text-white font-semibold text-sm md:text-base text-center">{brand.nom}</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest">{brand.type}</span>
                    {count > 0 && (
                      <p className="text-xs text-red-500 mt-1">{count} véhicule{count > 1 ? 's' : ''}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedBrand && (() => {
          const vehicules = getBrandVehicules(selectedBrand.id);
          const Icon = getIcon(selectedBrand.type);
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
              onClick={() => setSelectedBrand(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ type: 'spring', bounce: 0.3 }}
                className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-3xl"
                onClick={e => e.stopPropagation()}
              >
                <button onClick={() => setSelectedBrand(null)}
                  className="absolute top-5 right-5 z-10 w-10 h-10 bg-gray-100 dark:bg-zinc-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-300 group">
                  <X className="w-5 h-5 text-gray-600 dark:text-white group-hover:text-white" />
                </button>

                <div className="p-5 sm:p-8">
                  {/* Header marque */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-2xl p-3 flex items-center justify-center flex-shrink-0">
                      {selectedBrand.logo
                        ? <img src={selectedBrand.logo} alt={selectedBrand.nom} className="w-full h-full object-contain" />
                        : <Icon className="w-8 h-8 text-gray-400" />}
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{selectedBrand.nom}</h2>
                      <span className="inline-block mt-1 px-3 py-1 bg-red-600/10 dark:bg-red-600/20 border border-red-600/30 rounded-full text-red-600 dark:text-red-400 text-xs">
                        {selectedBrand.type}
                      </span>
                    </div>
                  </div>

                  {selectedBrand.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8">{selectedBrand.description}</p>
                  )}

                  {/* Véhicules */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-8 h-0.5 bg-red-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Véhicules disponibles
                      {vehicules.length > 0 && <span className="ml-2 text-sm text-gray-400 font-normal">({vehicules.length})</span>}
                    </h3>
                  </div>

                  {vehicules.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl">
                      <Car className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p className="text-gray-400 text-sm">Aucun véhicule disponible pour cette marque.</p>
                      <p className="text-gray-500 text-xs mt-1">Contactez-nous pour plus d'informations.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                      {vehicules.map((v, i) => (
                        <motion.div key={v.id}
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                          className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl overflow-hidden hover:border-red-500/40 dark:hover:border-red-600/30 transition-all group">
                          {/* Image */}
                          <div className="relative h-40 bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                            {v.image
                              ? <img src={v.image} alt={v.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              : <div className="w-full h-full flex items-center justify-center"><Car className="w-10 h-10 text-gray-400" /></div>}
                            <div className="absolute top-2 left-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.statut === 'disponible' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                                {v.statut}
                              </span>
                            </div>
                          </div>
                          {/* Info */}
                          <div className="p-4">
                            <p className="text-gray-400 text-xs mb-1">{v.annee}</p>
                            <h4 className="text-gray-900 dark:text-white font-semibold text-sm mb-3">{v.nom}</h4>
                            <div className="flex items-center gap-3 mb-3">
                              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                                <Fuel className="w-3 h-3 text-red-500" /> {v.carburant}
                              </span>
                              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                                <Settings className="w-3 h-3 text-red-500" /> {v.transmission}
                              </span>
                              {v.couleur && <span className="text-gray-500 dark:text-gray-400 text-xs">{v.couleur}</span>}
                            </div>
                            <p className="text-gray-900 dark:text-white font-bold text-sm">
<p className="text-gray-400 text-xs">À partir de</p>
                            <p className="text-gray-900 dark:text-white font-bold text-sm">{v.prix} <span className="text-xs font-normal text-gray-400">FCFA</span></p>
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <a href="/contact"
                      className="group flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full flex items-center justify-center space-x-2 hover:shadow-xl hover:shadow-red-600/30 transition-all">
                      <span>Demander un devis</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a href="/contact"
                      className="flex-1 px-6 py-3 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-white font-semibold rounded-full text-center hover:border-red-500/50 transition-all">
                      Visiter le showroom
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default Brands;
