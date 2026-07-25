import { BeMyEyesVolunteer } from '../types';

export const BE_MY_EYES_INFO = {
  title: "Be My Eyes - Assistance Visuelle Bénévole",
  mission: "Connecter gratuitement les personnes aveugles ou malvoyantes à des bénévoles voyants et des entreprises partenaires via des appels vidéo en direct.",
  stats: {
    volunteers: "7 500 000+",
    blindUsers: "700 000+",
    languages: "185+",
    countries: "150+"
  },
  keyFeatures: [
    {
      title: "Appel Bénévole Direct",
      desc: "Rejoignez un bénévole voyant en moins de 30 secondes pour une aide vidéo instantanée."
    },
    {
      title: "Assistance Spécialisée (Corporate)",
      desc: "Contactez le support technique d'entreprises partenaires (Microsoft, Google, L'Oréal, Banque, etc.)."
    },
    {
      title: "Escalade Gemma-Eyes vers Bénévole",
      desc: "Si l'IA doute sur un médicament ou un document complexe, passez la main à un humain en un clic."
    },
    {
      title: "Service 100% Gratuit & Confidentiel",
      desc: "Disponible 24h/24, 7j/7 grâce à une communauté mondiale réactive."
    }
  ]
};

export const MOCK_VOLUNTEERS: BeMyEyesVolunteer[] = [
  {
    id: 'vol-1',
    name: 'Sophie Laurent',
    language: 'Français (France)',
    rating: 4.95,
    location: 'Paris, France',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'vol-2',
    name: 'Marc Dubois',
    language: 'Français (Canada)',
    rating: 4.98,
    location: 'Montréal, Canada',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'vol-3',
    name: 'Elena Rossi',
    language: 'Français / Italien',
    rating: 4.92,
    location: 'Lyon, France',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  }
];
