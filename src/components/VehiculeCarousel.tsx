import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Car, Fuel, Settings, ArrowRight } from 'lucide-react';
import { type Vehicule } from '../utils/api';

interface Props {
  vehicules: Vehicule[];
  marqueName?: string;
}

const VehiculeCarousel = ({ vehicules, marqueName }: Props) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const go = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    go((current + 1) % vehicules.length, 1);
  }, [current, vehicules.length, go]);

  const prev = useCallback(() => {
    go((current - 1 + vehicules.length) % vehicules.length, -1);
  }, [current, vehicules.length, go]);

  // Auto-slide toutes les 4s
  useEffect(() => {
    if (vehicules.length <= 1) return;
    timerRef.current = setTimeout(next, 4000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, next, vehicules.length]);

  if (vehicules.length === 0) return null;

  const v = vehicules[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="w-full">
      {/* Slide principal */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800" style={{ aspectRatio: '16/9' }}>
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={v.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {v.image
              ? <img src={v.image} alt={v.nom} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><Car className="w-16 h-16 text-gray-300 dark:text-gray-600" /></div>
            }
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Infos sur l'image */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              {/* Statut */}
              <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium mb-2 ${
                v.statut === 'disponible' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
              }`}>{v.statut}</span>

              <h3 className="text-white font-bold text-lg sm:text-xl leading-tight">{v.nom}</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3">{v.annee}</p>

              {/* Specs */}
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="flex items-center gap-1 text-gray-300 text-xs">
                  <Fuel className="w-3.5 h-3.5 text-red-400" /> {v.carburant}
                </span>
                <span className="flex items-center gap-1 text-gray-300 text-xs">
                  <Settings className="w-3.5 h-3.5 text-red-400" /> {v.transmission}
                </span>
                {v.couleur && <span className="text-gray-300 text-xs">{v.couleur}</span>}
              </div>

              {/* Prix + CTA */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-gray-400 text-xs">À partir de</p>
                  <p className="text-white font-bold text-base sm:text-lg">
                    {v.prix} <span className="text-xs font-normal text-gray-400">FCFA</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    const params = new URLSearchParams({
                      brand: marqueName || '',
                      subject: `Demande de devis - ${v.nom}`,
                      message: `Bonjour,\n\nJe suis intéressé(e) par le véhicule suivant :\n- Modèle : ${v.nom}\n- Année : ${v.annee}\n- Prix : ${v.prix} FCFA\n\nMerci de me contacter pour plus d'informations.`,
                    });
                    navigate(`/contact?${params.toString()}`);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-red-600 to-red-700 text-white text-xs sm:text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-red-600/30 transition-all whitespace-nowrap"
                >
                  Demander un devis <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Boutons prev/next */}
        {vehicules.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots + thumbnails */}
      {vehicules.length > 1 && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {vehicules.map((item, i) => (
            <button
              key={item.id}
              onClick={() => go(i, i > current ? 1 : -1)}
              className={`flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                i === current
                  ? 'border-red-500 opacity-100 scale-105'
                  : 'border-transparent opacity-50 hover:opacity-75'
              }`}
              style={{ width: 56, height: 40 }}
            >
              {item.image
                ? <img src={item.image} alt={item.nom} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-zinc-700 flex items-center justify-center"><Car className="w-4 h-4 text-gray-400" /></div>
              }
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehiculeCarousel;
