export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  brand: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const MESSAGES_KEY = 'mig_messages';

export const getMessages = (): ContactMessage[] => {
  const data = localStorage.getItem(MESSAGES_KEY);
  return data ? JSON.parse(data) : [];
};

export const addMessage = (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): ContactMessage => {
  const messages = getMessages();
  const newMsg: ContactMessage = { ...msg, id: Date.now().toString(), createdAt: new Date().toISOString(), read: false };
  localStorage.setItem(MESSAGES_KEY, JSON.stringify([newMsg, ...messages]));
  return newMsg;
};

export const markAsRead = (id: string) => {
  const messages = getMessages().map(m => m.id === id ? { ...m, read: true } : m);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
};

export const deleteMessage = (id: string) => {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(getMessages().filter(m => m.id !== id)));
};

export interface Marque {
  id: string;
  nom: string;
  logo: string; // base64 ou URL
  type: string;
  description: string;
  createdAt: string;
}

export interface Vehicule {
  id: string;
  marqueId: string;
  nom: string;
  prix: string;
  annee: string;
  carburant: string;
  transmission: string;
  couleur: string;
  description: string;
  image: string; // base64 ou URL
  statut: 'disponible' | 'vendu' | 'réservé';
  createdAt: string;
}

const MARQUES_KEY = 'mig_marques';
const VEHICULES_KEY = 'mig_vehicules';

const defaultMarques: Marque[] = [
  { id: '1', nom: 'KIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/KIA_logo2.svg/800px-KIA_logo2.svg.png', type: 'Berlines & SUV', description: 'Leader mondial de l\'innovation automobile.', createdAt: new Date().toISOString() },
  { id: '2', nom: 'MERCEDES', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/800px-Mercedes-Logo.svg.png', type: 'Luxe & Premium', description: 'L\'incarnation du luxe automobile allemand.', createdAt: new Date().toISOString() },
  { id: '3', nom: 'FIAT', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Fiat_Automobiles_logo.svg/800px-Fiat_Automobiles_logo.svg.png', type: 'Citadines', description: 'Le charme et l\'ingéniosité italienne.', createdAt: new Date().toISOString() },
  { id: '4', nom: 'FUSO', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Mitsubishi_Fuso_Logo.svg/800px-Mitsubishi_Fuso_Logo.svg.png', type: 'Camions & Utilitaires', description: 'Camions robustes pour conditions exigeantes.', createdAt: new Date().toISOString() },
  { id: '5', nom: 'PIAGGIO', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Piaggio_logo.svg/800px-Piaggio_logo.svg.png', type: 'Deux-roues', description: 'Mobilité urbaine élégante à l\'italienne.', createdAt: new Date().toISOString() },
  { id: '6', nom: 'KAIYI', logo: 'https://www.kaiyiauto.com/img/logo.png', type: 'Berlines & SUV', description: 'L\'avenir de l\'automobile chinoise.', createdAt: new Date().toISOString() },
  { id: '7', nom: 'ASHOK LEYLAND', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Ashok_Leyland_logo.svg/800px-Ashok_Leyland_logo.svg.png', type: 'Poids lourds & Bus', description: 'Solutions de transport fiables.', createdAt: new Date().toISOString() },
  { id: '8', nom: 'JEEP', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Ashok_Leyland_logo.svg/800px-Ashok_Leyland_logo.svg.png', type: 'SUV', description: ' transport confortable.', createdAt: new Date().toISOString() },
];

const defaultVehicules: Vehicule[] = [
  { id: '1', marqueId: '1', nom: 'KIA Sportage', prix: '18 500 000', annee: '2024', carburant: 'Essence', transmission: 'Automatique', couleur: 'Blanc', description: 'SUV compact moderne avec technologie avancée.', image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80', statut: 'disponible', createdAt: new Date().toISOString() },
  { id: '2', marqueId: '1', nom: 'KIA Picanto', prix: '9 200 000', annee: '2024', carburant: 'Essence', transmission: 'Manuelle', couleur: 'Rouge', description: 'Citadine économique et agile.', image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80', statut: 'disponible', createdAt: new Date().toISOString() },
  { id: '3', marqueId: '2', nom: 'Mercedes Classe C', prix: '45 000 000', annee: '2023', carburant: 'Diesel', transmission: 'Automatique', couleur: 'Noir', description: 'Berline de luxe par excellence.', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80', statut: 'disponible', createdAt: new Date().toISOString() },
  { id: '4', marqueId: '3', nom: 'Fiat 500', prix: '8 900 000', annee: '2023', carburant: 'Essence', transmission: 'Automatique', couleur: 'Bleu', description: 'Icône du style italien.', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80', statut: 'réservé', createdAt: new Date().toISOString() },
  { id: '5', marqueId: '8', nom: 'JEEP 500', prix: '8 900 000', annee: '2023', carburant: 'Essence', transmission: 'Automatique', couleur: 'Bleu', description: 'Icône du style italien.', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80', statut: 'réservé', createdAt: new Date().toISOString() },
];

// --- Marques ---
export const getMarques = (): Marque[] => {
  const data = localStorage.getItem(MARQUES_KEY);
  if (!data) {
    localStorage.setItem(MARQUES_KEY, JSON.stringify(defaultMarques));
    return defaultMarques;
  }
  return JSON.parse(data);
};

export const saveMarques = (marques: Marque[]) => {
  localStorage.setItem(MARQUES_KEY, JSON.stringify(marques));
};

export const addMarque = (marque: Omit<Marque, 'id' | 'createdAt'>): Marque => {
  const marques = getMarques();
  const newMarque: Marque = { ...marque, id: Date.now().toString(), createdAt: new Date().toISOString() };
  saveMarques([...marques, newMarque]);
  return newMarque;
};

export const updateMarque = (id: string, data: Partial<Marque>) => {
  const marques = getMarques().map(m => m.id === id ? { ...m, ...data } : m);
  saveMarques(marques);
};

export const deleteMarque = (id: string) => {
  saveMarques(getMarques().filter(m => m.id !== id));
  saveVehicules(getVehicules().filter(v => v.marqueId !== id));
};

// --- Véhicules ---
export const getVehicules = (): Vehicule[] => {
  const data = localStorage.getItem(VEHICULES_KEY);
  if (!data) {
    localStorage.setItem(VEHICULES_KEY, JSON.stringify(defaultVehicules));
    return defaultVehicules;
  }
  return JSON.parse(data);
};

export const saveVehicules = (vehicules: Vehicule[]) => {
  localStorage.setItem(VEHICULES_KEY, JSON.stringify(vehicules));
};

export const addVehicule = (vehicule: Omit<Vehicule, 'id' | 'createdAt'>): Vehicule => {
  const vehicules = getVehicules();
  const newVehicule: Vehicule = { ...vehicule, id: Date.now().toString(), createdAt: new Date().toISOString() };
  saveVehicules([...vehicules, newVehicule]);
  return newVehicule;
};

export const updateVehicule = (id: string, data: Partial<Vehicule>) => {
  const vehicules = getVehicules().map(v => v.id === id ? { ...v, ...data } : v);
  saveVehicules(vehicules);
};

export const deleteVehicule = (id: string) => {
  saveVehicules(getVehicules().filter(v => v.id !== id));
};
