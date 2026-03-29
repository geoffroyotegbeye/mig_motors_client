import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, User, MessageSquare, Car } from 'lucide-react';
import { sendMessage } from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', brand: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendMessage(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', brand: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      // erreur silencieuse
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    { icon: MapPin, title: 'Siège Social', details: ['Boulevard de la Marina', 'Quartier Cadjèhoun', 'Cotonou, Bénin'] },
    { icon: Phone, title: 'Téléphone', details: ['+229 21 00 00 00', '+229 97 00 00 00'] },
    { icon: Mail, title: 'Email', details: ['contact@migmotors.com', 'commercial@migmotors.com'] },
    { icon: Clock, title: 'Horaires', details: ['Lun - Ven: 8h00 - 18h00', 'Samedi: 8h00 - 13h00'] },
  ];

  const brands = ['KIA', 'KAIYI', 'PIAGGIO', 'MERCEDES', 'FUSO', 'ASHOK LEYLAND', 'FIAT' ,'JEEP'];

  const inputClass = "w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 outline-none";

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <span className="inline-block px-4 py-2 bg-red-600/20 border border-red-600/30 rounded-full text-red-400 text-sm font-medium mb-6">
              Contactez-nous
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Restons en </span>
              <span className="gradient-text">Contact</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Une question ? Un projet d'achat ? Notre équipe est à votre écoute pour vous accompagner dans votre démarche automobile.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:col-span-3">
              <div className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm dark:shadow-none">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Envoyez-nous un message</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p>

                {isSubmitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
                      className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Envoyé !</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center">Merci de nous avoir contactés. Nous vous répondrons très bientôt.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Nom complet *</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Votre nom" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="votre@email.com" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Téléphone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+229 00 00 00 00" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Marque d'intérêt</label>
                        <div className="relative">
                          <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select name="brand" value={formData.brand} onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl py-4 pl-12 pr-4 text-gray-900 dark:text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 appearance-none cursor-pointer outline-none">
                            <option value="">Sélectionnez une marque</option>
                            {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Sujet *</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className={inputClass} placeholder="Objet de votre message" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">Message *</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl py-4 px-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-300 resize-none outline-none"
                        placeholder="Décrivez votre demande..." />
                    </div>

                    <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 hover:shadow-2xl hover:shadow-red-600/30 transition-all duration-300 disabled:opacity-70">
                      {isSubmitting ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <><span>Envoyer le message</span><Send className="w-5 h-5" /></>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:col-span-2 space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ x: 5 }}
                  className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-red-500/40 dark:hover:border-red-600/30 transition-all duration-300 shadow-sm dark:shadow-none">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-50 dark:bg-gradient-to-br dark:from-red-600/20 dark:to-red-800/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 dark:text-white font-semibold mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-500 dark:text-gray-400 text-sm">{detail}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                <div className="aspect-video relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63385.91947085952!2d2.3712855731155896!3d6.365396800000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1024a9e09f2d4a1d%3A0x6e3a3a7c7d7f6f1a!2sCotonou%2C%20Benin!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                    width="100%" height="100%"
                    style={{ border: 0, filter: 'grayscale(100%) contrast(83%)' }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="p-4">
                  <a href="https://www.google.com/maps?q=6.3654,2.4183" target="_blank" rel="noopener noreferrer"
                    className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors">
                    Ouvrir dans Google Maps →
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 dark:bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Questions <span className="gradient-text">Fréquentes</span>
            </h2>
          </motion.div>
          <div className="space-y-4">
            {[
              { q: 'Quelles sont vos conditions de financement ?', a: 'Nous proposons plusieurs solutions de financement adaptées à votre budget, incluant le crédit classique, la location avec option d\'achat (LOA) et le leasing. Contactez-nous pour une étude personnalisée.' },
              { q: 'Offrez-vous une garantie sur les véhicules ?', a: 'Tous nos véhicules neufs bénéficient de la garantie constructeur. Nous proposons également des extensions de garantie pour une tranquillité totale.' },
              { q: 'Puis-je faire entretenir mon véhicule dans vos ateliers ?', a: 'Absolument ! Nos ateliers agréés à Cotonou, Parakou, Lomé et Ouagadougou sont équipés pour l\'entretien et la réparation de toutes les marques que nous représentons.' },
            ].map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
                <h3 className="text-gray-900 dark:text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
