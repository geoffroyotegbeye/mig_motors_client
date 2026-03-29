import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Agence {
  city: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  imageg: string;
  mapCoords: string;
  services: string[];
}

interface Pays {
  nom: string;
  agences: Agence[];
}

const pays: Pays[] = [
  {
    nom: 'BÉNIN',
    agences: [
      {
        city: 'Cotonou',
        address: 'Boulevard de la Marina, Quartier Cadjèhoun, Cotonou',
        phone: '+229 21 00 00 00',
        hours: 'Lun-Sam: 8h00 - 18h00',
        image: 'https://www.goafricaonline.com/media/cache/resolve/w1200/uploads/media/company_media/0001/91/5e4e485a37c6b-nouveau-showroom-mig-benin.JPG',
        imageg: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
        mapCoords: '6.3654,2.4183',
        services: ['Entretien général', 'Diagnostic électronique', 'Carrosserie', 'Climatisation'],
      },
      {
        city: 'Parakou',
        address: 'Route de Malanville, Quartier Banikanni, Parakou',
        phone: '+229 23 00 00 00',
        hours: 'Lun-Sam: 8h00 - 17h30',
        image: 'https://www.goafricaonline.com/media/cache/resolve/w1200/uploads/media/company_media/0001/91/5e4e485a37c6b-nouveau-showroom-mig-benin.JPG',
        imageg: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80',
        mapCoords: '9.3372,2.6303',
        services: ['Entretien véhicules', 'Vidange', 'Freinage', 'Pneus'],
      },
    ],
  },
  {
    nom: 'TOGO',
    agences: [
      {
        city: 'Lomé',
        address: 'Avenue de la Libération, Quartier Bè, Lomé',
        phone: '+228 22 00 00 00',
        hours: 'Lun-Sam: 8h00 - 18h00',
        image: 'https://www.goafricaonline.com/uploads/media/default/0004/30/65cceda32edf9-image-1.jpg',
        imageg: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
        mapCoords: '6.1375,1.2123',
        services: ['Mécanique générale', 'Électricité auto', 'Diagnostic', 'SAV complet'],
      },
    ],
  },
  {
    nom: 'BURKINA FASO',
    agences: [
      {
        city: 'Ouagadougou',
        address: 'Avenue Kwame Nkrumah, Zone Industrielle, Ouagadougou',
        phone: '+226 25 00 00 00',
        hours: 'Lun-Sam: 7h30 - 17h30',
        image: 'https://www.goafricaonline.com/uploads/media/company_media/0001/55/5c62a844df4da-facade-mig-motors-cfao-technology-benin.jpg',
        imageg: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
        mapCoords: '12.3714,1.5197',
        services: ['Service rapide', 'Pièces détachées', 'Carrosserie', 'Peinture'],
      },
    ],
  },
];

const AgenceCard = ({ agence, index }: { agence: Agence; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 items-stretch`}
  >
    {/* Image showroom */}
    <motion.div whileHover={{ scale: 1.02 }} className="lg:w-1/2 relative group">
      <div className="relative h-72 lg:h-full min-h-[280px] rounded-3xl overflow-hidden">
        <img src={agence.image} alt={`Showroom ${agence.city}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-white font-semibold">{agence.city}</span>
          </div>
          <p className="text-gray-300 text-sm">{agence.address}</p>
        </div>
        <div className="absolute top-5 right-5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 rounded-full text-white text-xs font-medium shadow-lg">
          MIG Motors {agence.city}
        </div>
      </div>
    </motion.div>

    {/* Infos */}
    <div className="lg:w-1/2 flex flex-col justify-center">
      <div className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 h-full shadow-sm dark:shadow-none">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-3">
          <span className="w-6 h-0.5 bg-red-600" />Atelier Agréé {agence.city}
        </h3>

        <div className="space-y-3 mb-6">
          {[
            { icon: MapPin, label: 'Adresse', value: agence.address },
            { icon: Phone, label: 'Téléphone', value: agence.phone },
            { icon: Clock, label: 'Horaires', value: agence.hours },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500 text-xs">{label}</p>
                <p className="text-gray-800 dark:text-gray-200 text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Image atelier */}
        <div className="relative h-44 rounded-2xl overflow-hidden mb-5">
          <img src={agence.imageg} alt={`Atelier ${agence.city}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-gray-300 text-xs mb-2">Services disponibles</p>
            <div className="flex flex-wrap gap-1.5">
              {agence.services.map((s, i) => (
                <span key={i} className="px-2 py-0.5 bg-white/10 border border-white/20 rounded-full text-white text-xs">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <a href={`https://www.google.com/maps?q=${agence.mapCoords}`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors text-sm">
          <MapPin className="w-4 h-4" />
          Voir sur Google Maps
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  </motion.div>
);

const Workshop = () => (
  <div className="min-h-screen pt-24 pb-20" style={{ fontFamily: 'Poppins, sans-serif' }}>

    <section className="py-10 bg-gray-50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-red-600/10 dark:bg-red-600/20 border border-red-600/30 rounded-full text-red-600 dark:text-red-400 text-sm font-medium mb-6">
            Nos Implantations
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nos <span className="gradient-text">Showrooms</span> en Afrique de l'Ouest
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Présents dans 3 pays pour vous servir au plus près de vos besoins.
          </p>
        </motion.div>

        {/* Pays */}
        <div className="space-y-20">
          {pays.map((p) => (
            <div key={p.nom}>
              {/* Titre pays */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-10"
              >
                <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-800" />
                <h2 className="text-2xl sm:text-3xl font-bold gradient-text px-4">{p.nom}</h2>
                <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-800" />
              </motion.div>

              {/* Agences du pays */}
              <div className="space-y-12">
                {p.agences.map((agence, i) => (
                  <AgenceCard key={agence.city} agence={agence} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 bg-white dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 p-6 sm:p-12 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Besoin d'un <span className="gradient-text">Entretien</span> ?
            </h3>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Prenez rendez-vous dès maintenant dans l'atelier le plus proche de chez vous.
            </p>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-red-600/30 transition-all duration-300">
              <span>Prendre rendez-vous</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </div>
);

export default Workshop;
