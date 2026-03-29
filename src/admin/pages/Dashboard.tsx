import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Car, CheckCircle, Mail, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMarques, getVehicules, getMessages, type Marque, type Vehicule, type ContactMessage } from '../../utils/api';

const Dashboard = () => {
  const [marques, setMarques] = useState<Marque[]>([]);
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    getMarques().then(setMarques);
    getVehicules().then(setVehicules);
    getMessages().then(setMessages);
  }, []);

  const unreadMessages = messages.filter(m => !m.read).length;

  const stats = [
    { label: 'Marques', value: marques.length, icon: Tag, color: 'from-blue-600 to-blue-700', link: '/admin/marques', badge: 0 },
    { label: 'Véhicules', value: vehicules.length, icon: Car, color: 'from-red-600 to-red-700', link: '/admin/vehicules', badge: 0 },
    { label: 'Disponibles', value: vehicules.filter(v => v.statut === 'disponible').length, icon: CheckCircle, color: 'from-green-600 to-green-700', link: '/admin/vehicules', badge: 0 },
    { label: 'Messages', value: messages.length, icon: Mail, color: 'from-purple-600 to-purple-700', link: '/admin/messages', badge: unreadMessages },
  ];

  const recentVehicules = [...vehicules].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const recentMessages = messages.slice(0, 4);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Vue d'ensemble de votre catalogue</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={stat.link} className="block bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all group">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                {stat.badge > 0 && (
                  <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">{stat.badge} non lu{stat.badge > 1 ? 's' : ''}</span>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Véhicules récents */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-500" /> Véhicules récents
            </h2>
            <Link to="/admin/vehicules" className="text-red-400 text-sm hover:text-red-300 transition-colors">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {recentVehicules.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Aucun véhicule</p>
            ) : recentVehicules.map(v => {
              const marque = marques.find(m => m.id === v.marqueId);
              return (
                <div key={v.id} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-700">
                    {v.image ? <img src={v.image} alt={v.nom} className="w-full h-full object-cover" /> : <Car className="w-6 h-6 text-gray-500 m-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{v.nom}</p>
                    <p className="text-gray-400 text-xs">{marque?.nom} • {v.annee}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                    v.statut === 'disponible' ? 'bg-green-600/20 text-green-400' :
                    v.statut === 'reserve' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-gray-600/20 text-gray-400'
                  }`}>{v.statut}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Messages récents */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-500" /> Messages récents
              {unreadMessages > 0 && <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">{unreadMessages}</span>}
            </h2>
            <Link to="/admin/messages" className="text-red-400 text-sm hover:text-red-300 transition-colors">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Aucun message</p>
            ) : recentMessages.map(msg => (
              <Link key={msg.id} to="/admin/messages"
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-zinc-700/50 ${!msg.read ? 'bg-zinc-800' : 'bg-zinc-800/50'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm ${!msg.read ? 'bg-red-600' : 'bg-zinc-700'}`}>
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`text-sm font-medium truncate ${!msg.read ? 'text-white' : 'text-gray-300'}`}>{msg.name}</p>
                    {!msg.read && <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-gray-500 text-xs truncate">{msg.subject}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
