/**
 * @file mockQuizzes.ts
 * Reflet exact de la table SQL 'quizzes'
 */

export const MOCK_QUIZZES = [
  {
    id: 1,
    category_id: 1,
    creator_id: 1,
    title: "Culture Générale",
    questions_count: 5,
    description: "Testez vos connaissances de base !",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    is_public: 1
  },
  {
    id: 2,
    category_id: 2, // cat-tech
    creator_id: 1,
    title: "Spécial Tech 2024",
    questions_count: 5,
    description: "IA, Hardware et Web.",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    is_public: 1
  },
  {
    id: 3,
    category_id: 3, // cat-cinema
    creator_id: 1,
    title: "Cinéma & Séries",
    questions_count: 5,
    description: "Popcorn et grand écran.",
    image_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728",
    is_public: 1
  },
  {
    id: 4,
    category_id: 4, // cat-sport
    creator_id: 1,
    title: "Légendes du Sport",
    questions_count: 2,
    description: "Des JO au football, connaissez-vous les records ?",
    image_url: "https://images.unsplash.com/photo-1504450758481-7338eba7524a",
    is_public: 1
  },
  {
    id: 5,
    category_id: 5, // cat-gaming
    creator_id: 1,
    title: "Gaming & E-sport",
    questions_count: 2,
    description: "De Mario à League of Legends.",
    image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
    is_public: 1
  },
  {
    id: 6,
    category_id: 6, // cat-science
    creator_id: 1,
    title: "Espace & Astronomie",
    questions_count: 1,
    description: "Vers l'infini et au-delà.",
    image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    is_public: 1
  },
  {
    id: 7,
    category_id: 6, // cat-science
    creator_id: 1,
    title: "Monde Animal",
    questions_count: 1,
    description: "Découvrez les secrets de la faune sauvage.",
    image_url: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd",
    is_public: 1
  },
  {
    id: 8,
    category_id: 7, // cat-history
    creator_id: 1,
    title: "Histoire de France",
    questions_count: 1,
    description: "Des rois à la République.",
    image_url: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=1200&q=80",
    is_public: 1
  },
  {
    id: 9,
    category_id: 8, // cat-food
    creator_id: 1,
    title: "Gastronomie Mondiale",
    questions_count: 1,
    description: "Un tour du monde des saveurs.",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    is_public: 1
  },
  {
    id: 10,
    category_id: 1, // cat-culture
    creator_id: 1,
    title: "Musique & Rock",
    questions_count: 1,
    description: "Guitares, synthés et légendes.",
    image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    is_public: 1
  },
  {
    id: 11,
    category_id: 4, // cat-sport
    creator_id: 1,
    title: "Force & Mental",
    questions_count: 1,
    description: "Le quiz pour les passionnés de training.",
    image_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80",
    is_public: 1
  }
];