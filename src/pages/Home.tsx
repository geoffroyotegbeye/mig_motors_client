import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, Shield, Award, Users, Wrench, Star, ArrowRight, Car, Truck, Bike } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { getMarques, getVehicules, type Marque, type Vehicule } from '../utils/api';

const Home = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [marques, setMarques] = useState<Marque[]>([]);
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);

  useEffect(() => {
    getMarques().then(setMarques);
    getVehicules({ statut: 'disponible' }).then(setVehicules);
  }, []);

  const getIcon = (type: string) => {
    if (type.includes('Camions') || type.includes('Poids') || type.includes('Utilitaires')) return Truck;
    if (type.includes('Deux-roues')) return Bike;
    return Car;
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
          <div className="absolute inset-0 opacity-100">
            <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80" alt="Luxury car" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </motion.div>

        <div className="absolute inset-0 overflow-hidden">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1/2 -right-1/2 w-full h-full border border-red-600/10 rounded-full" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full border border-gray-600/10 rounded-full" />
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-6">
                <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600/20 border border-red-600/30 rounded-full text-red-400 text-xs sm:text-sm font-medium">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  N°1 de l'automobile en Afrique de l'Ouest
                </span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6">
                <span className="text-white">Bienvenue chez</span>
                <br />
                <span className="gradient-text">MIG Motors</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                Découvrez l'excellence automobile au cœur de l'Afrique.
                <span className="text-red-400"> Votre rêve</span> de mobilité commence ici,
                avec les marques les plus prestigieuses du monde.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/marques"
                  className="group px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full flex items-center justify-center space-x-2 hover:shadow-2xl hover:shadow-red-600/30 transition-all duration-300">
                  <span>Découvrir nos marques</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/contact"
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-white/10 border-2 border-white/30 hover:border-white text-white font-semibold rounded-full text-center transition-all duration-300 hover:bg-white/20">
                  Prendre rendez-vous
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center text-gray-400">
            <span className="text-xs sm:text-sm mb-2">Défiler vers le bas</span>
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* Gammes */}
      <section className="py-16 sm:py-24 bg-white dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-4 py-2 bg-red-600/10 dark:bg-red-600/20 border border-red-600/30 rounded-full text-red-600 dark:text-red-400 text-sm font-medium mb-4 sm:mb-6">
              Notre offre
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Nos <span className="gradient-text">Marques</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
              Un véhicule pour chaque besoin, du deux-roues au poids lourd.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-4 sm:gap-6 lg:gap-8">
            {marques.map((marque, index) => {
              const Icon = getIcon(marque.type);
              return (
                <motion.div key={marque.id}
                  initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring', bounce: 0.4 }} whileHover={{ y: -8 }}>
                  <Link to="/marques" className="flex flex-col items-center group">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 border-2 border-gray-200 dark:border-zinc-700
                    group-hover:border-red-500 dark:group-hover:border-red-600/50 flex items-center justify-center transition-all duration-500 relative shadow-sm dark:shadow-none p-3">
                      <div className="absolute inset-0 rounded-full bg-red-600/0 group-hover:bg-red-600/5 dark:group-hover:bg-red-600/10 transition-all duration-500" />
                      {marque.logo
                        ? <img src={marque.logo} alt={marque.nom} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" onError={e => { e.currentTarget.style.display = 'none'; }} />
                        : <Icon className="w-7 h-7 text-gray-400 group-hover:text-red-500 transition-colors duration-300" />}
                    </div>
                    <p className="mt-2 sm:mt-3 text-gray-800 dark:text-white font-semibold text-xs text-center leading-tight">{marque.nom}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs text-center mt-0.5 hidden sm:block">{marque.type}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-32 bg-gray-50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-4 py-2 bg-red-600/10 dark:bg-red-600/20 border border-red-600/30 rounded-full text-red-600 dark:text-red-400 text-sm font-medium mb-4 sm:mb-6">
              Pourquoi nous choisir
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Des Services <span className="gradient-text">d'Exception</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Nous nous engageons à vous offrir une expérience automobile incomparable, de l'achat à l'entretien.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Shield, title: 'Garantie Premium', description: 'Profitez d\'une garantie constructeur étendue sur tous nos véhicules neufs.' },
              { icon: Award, title: 'Excellence Certifiée', description: 'Concessionnaire agréé des plus grandes marques automobiles mondiales.' },
              { icon: Users, title: 'Service Personnalisé', description: 'Une équipe dédiée pour vous accompagner dans votre projet automobile.' },
              { icon: Wrench, title: 'SAV Professionnel', description: 'Un atelier moderne équipé des dernières technologies de diagnostic.' },
            ].map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}
                className="group p-6 sm:p-8 bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-3xl hover:border-red-500/40 dark:hover:border-red-600/30 transition-all duration-500 shadow-sm dark:shadow-none">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-50 dark:bg-gradient-to-br dark:from-red-600/20 dark:to-red-800/20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Véhicules récents */}
      <section className="py-16 sm:py-24 bg-white dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-4 py-2 bg-red-600/10 dark:bg-red-600/20 border border-red-600/30 rounded-full text-red-600 dark:text-red-400 text-sm font-medium mb-4 sm:mb-6">
              Disponibles maintenant
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Nos <span className="gradient-text">Véhicules</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
              Découvrez notre sélection de véhicules disponibles.
            </p>
          </motion.div>

          {vehicules.length === 0 ? (
            <p className="text-center text-gray-400">Aucun véhicule disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicules.slice(0, 8).map((v, i) => (
                <motion.div key={v.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }} whileHover={{ y: -6 }}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none hover:border-red-500/40 dark:hover:border-red-600/30 transition-all duration-300 group">
                  <div className="relative h-48 bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                    {v.image
                      ? <img src={v.image} alt={v.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center"><Car className="w-12 h-12 text-gray-300 dark:text-gray-600" /></div>}
                    <div className="absolute top-3 left-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-500 text-white">Disponible</span>
                    </div>
                    {v.marque?.logo && (
                      <div className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-zinc-800 rounded-lg p-1 flex items-center justify-center">
                        <img src={v.marque.logo} alt={v.marque.nom} className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">{v.marque?.nom} • {v.annee}</p>
                    <h3 className="text-gray-900 dark:text-white font-semibold text-base mb-2">{v.nom}</h3>
                    <div className="flex items-end justify-between pt-3 border-t border-gray-100 dark:border-zinc-800">
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">À partir de</p>
                        <p className="text-gray-900 dark:text-white font-bold text-sm">{v.prix} <span className="text-xs font-normal text-gray-400">FCFA</span></p>
                      </div>
                      <Link to="/contact" className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-semibold rounded-lg hover:shadow-md hover:shadow-red-600/30 transition-all">
                        Contacter
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {vehicules.length > 8 && (
            <div className="text-center mt-10">
              <Link to="/vehicules" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-red-600/30 transition-all">
                Voir tous les véhicules <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&q=80" alt="Luxury car interior"
            className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
              Prêt à Vivre l'Expérience
              <span className="gradient-text"> MIG Motors</span> ?
            </h2>
            <p className="text-base sm:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Visitez notre showroom et découvrez notre gamme exceptionnelle de véhicules. Nos conseillers vous attendent.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/marques"
                className="group px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-red-600 to-red-700 text-white text-base sm:text-lg font-semibold rounded-full flex items-center justify-center space-x-3 hover:shadow-2xl hover:shadow-red-600/40 transition-all duration-300">
                <span>Explorer nos véhicules</span>
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/contact"
                className="px-8 py-4 sm:px-10 sm:py-5 bg-white/10 backdrop-blur border border-white/20 text-white text-base sm:text-lg font-semibold rounded-full text-center hover:bg-white/20 transition-all duration-300">
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
