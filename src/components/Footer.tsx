import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logoDark from '../assets/logo_darkmode.png';
import logoLight from '../assets/logo_whitemode.png';

const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-zinc-900 dark:bg-gradient-to-b dark:from-zinc-900 dark:to-black pt-20 pb-8 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-600/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-16">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <img
                src={theme === 'dark' ? logoDark : logoLight}
                alt="MIG Motors"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Votre partenaire de confiance pour l'acquisition de véhicules de qualité et un service après-vente d'excellence.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, index) => (
                <motion.a key={index} href="#" whileHover={{ scale: 1.2, y: -3 }}
                  className="w-10 h-10 bg-zinc-800 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center transition-all duration-300 group">
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <h4 className="text-white font-semibold text-lg mb-6 flex items-center">
              <span className="w-8 h-0.5 bg-red-600 mr-3" />Navigation
            </h4>
            <ul className="space-y-3">
              {['Accueil', 'Nos Marques', 'Atelier & SAV', 'Contact'].map((link, index) => (
                <li key={index}>
                  <Link to={link === 'Accueil' ? '/' : `/${link.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-4 h-0.5 bg-red-600 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Marques */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h4 className="text-white font-semibold text-lg mb-6 flex items-center">
              <span className="w-8 h-0.5 bg-red-600 mr-3" />Nos Marques
            </h4>
            <ul className="space-y-3">
              {['KIA', 'KAIYI', 'PIAGGIO', 'MERCEDES', 'FUSO', 'ASHOK LEYLAND', 'FIAT', 'JEEP'].map((brand, index) => (
                <li key={index}>
                  <Link to="/marques" className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-4 h-0.5 bg-red-600 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
            <h4 className="text-white font-semibold text-lg mb-6 flex items-center">
              <span className="w-8 h-0.5 bg-red-600 mr-3" />Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Cotonou, Bénin - Quartier Cadjèhoun</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+229 21 00 00 00</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">contact@migmotors.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-zinc-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">© {currentYear} MIG Motors. Tous droits réservés.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-red-400 text-sm transition-colors">Politique de confidentialité</a>
              <a href="#" className="text-gray-500 hover:text-red-400 text-sm transition-colors">Mentions légales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
