import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, Eye, X, Phone, User, Tag, MessageSquare, Clock } from 'lucide-react';
import { getMessages, markAsRead, deleteMessage, type ContactMessage } from '../../utils/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const refresh = () => getMessages().then(setMessages);

  useEffect(() => { refresh(); }, []);

  const handleOpen = async (msg: ContactMessage) => {
    if (!msg.read) {
      await markAsRead(msg.id);
      refresh();
    }
    setSelected(msg);
  };

  const handleDelete = async (id: number) => {
    await deleteMessage(id);
    refresh();
    setDeleteConfirm(null);
    if (selected?.id === id) setSelected(null);
  };

  const unread = messages.filter(m => !m.read).length;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            Messages
            {unread > 0 && (
              <span className="px-2.5 py-0.5 bg-red-600 text-white text-sm font-bold rounded-full">{unread}</span>
            )}
          </h1>
          <p className="text-gray-400 mt-1">{messages.length} message{messages.length > 1 ? 's' : ''} reçu{messages.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <Mail className="w-14 h-14 mx-auto mb-4 opacity-20" />
          <p className="text-lg">Aucun message reçu</p>
          <p className="text-sm mt-1">Les messages du formulaire de contact apparaîtront ici.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="divide-y divide-zinc-800">
            {messages.map((msg, i) => (
              <motion.div key={msg.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-4 px-5 py-4 hover:bg-zinc-800/50 transition-colors cursor-pointer ${!msg.read ? 'bg-zinc-800/30' : ''}`}
                onClick={() => handleOpen(msg)}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm ${!msg.read ? 'bg-red-600' : 'bg-zinc-700'}`}>
                  {msg.name.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-semibold ${!msg.read ? 'text-white' : 'text-gray-300'}`}>{msg.name}</span>
                    {!msg.read && <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />}
                    {msg.brand && <span className="text-xs px-2 py-0.5 bg-zinc-700 text-gray-400 rounded-full">{msg.brand}</span>}
                  </div>
                  <p className={`text-sm truncate ${!msg.read ? 'text-gray-200' : 'text-gray-400'}`}>{msg.subject}</p>
                  <p className="text-gray-500 text-xs truncate mt-0.5">{msg.message}</p>
                </div>

                {/* Date + Actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-gray-500 text-xs whitespace-nowrap">{formatDate(msg.createdAt)}</span>
                  <div className="flex gap-1">
                    <button onClick={e => { e.stopPropagation(); handleOpen(msg); }}
                      className="w-7 h-7 bg-zinc-700 hover:bg-blue-600/30 hover:text-blue-400 text-gray-400 rounded-lg flex items-center justify-center transition-all">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); setDeleteConfirm(msg.id); }}
                      className="w-7 h-7 bg-zinc-700 hover:bg-red-600/30 hover:text-red-400 text-gray-400 rounded-lg flex items-center justify-center transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Modal détail message */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white truncate pr-4">{selected.subject}</h2>
                <button onClick={() => setSelected(null)}
                  className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl">
                  <User className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Nom</p>
                    <p className="text-white text-sm">{selected.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl">
                  <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Email</p>
                    <a href={`mailto:${selected.email}`} className="text-white text-sm hover:text-red-400 transition-colors">{selected.email}</a>
                  </div>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl">
                    <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-xs">Téléphone</p>
                      <a href={`tel:${selected.phone}`} className="text-white text-sm hover:text-red-400 transition-colors">{selected.phone}</a>
                    </div>
                  </div>
                )}
                {selected.brand && (
                  <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl">
                    <Tag className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-gray-400 text-xs">Marque d'intérêt</p>
                      <p className="text-white text-sm">{selected.brand}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-xl">
                  <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Reçu le</p>
                    <p className="text-white text-sm">{formatDate(selected.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-800 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-red-500" />
                  <p className="text-gray-400 text-xs">Message</p>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex gap-3">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl text-center text-sm hover:shadow-lg hover:shadow-red-600/30 transition-all">
                  Répondre par email
                </a>
                <button onClick={() => setDeleteConfirm(selected.id)}
                  className="w-12 h-12 bg-zinc-800 hover:bg-red-600/20 hover:text-red-400 text-gray-400 rounded-xl flex items-center justify-center transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
              <h3 className="text-white font-bold text-lg mb-2">Supprimer ce message ?</h3>
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

export default AdminMessages;
