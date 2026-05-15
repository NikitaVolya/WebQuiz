/**
 * @file mockQuestions.ts
 * Reflet exact de la table SQL 'questions'
 */

export const MOCK_QUESTIONS = [
  // --- QUIZ 1 : Culture Générale ---
  {
    id: 101,
    quiz_id: 1,
    question_text: "Quelle est la capitale de l'Italie ?",
    image_url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    timer_seconds: 30,
    points_value: 10
  },
  {
    id: 102,
    quiz_id: 1,
    question_text: "Qui a peint la Joconde ?",
    image_url: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&q=80",
    timer_seconds: 30,
    points_value: 10
  },
  {
    id: 103,
    quiz_id: 1,
    question_text: "Quelle est la monnaie du Japon ?",
    image_url: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    timer_seconds: 30,
    points_value: 10
  },
  {
    id: 104,
    quiz_id: 1,
    question_text: "En quelle année l'homme a-t-il marché sur la Lune ?",
    image_url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",
    timer_seconds: 30,
    points_value: 10
  },
  {
    id: 105,
    quiz_id: 1,
    question_text: "Quel est le plus grand océan du monde ?",
    image_url: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&q=80",
    timer_seconds: 30,
    points_value: 10
  },

  // --- QUIZ 2 : Tech 2024 ---
  {
    id: 201,
    quiz_id: 2,
    question_text: "Que signifie 'AI' ?",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },
  {
    id: 202,
    quiz_id: 2,
    question_text: "Quel langage est principalement utilisé pour le style d'une page web ?",
    image_url: "https://images.unsplash.com/photo-1523437113738-bbd3ee89fb97?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },
  {
    id: 203,
    quiz_id: 2,
    question_text: "Qui est le fondateur de Microsoft ?",
    image_url: "https://images.unsplash.com/photo-1522071823991-b5ae7264385d?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },
  {
    id: 204,
    quiz_id: 2,
    question_text: "Quelle entreprise fabrique les processeurs 'Ryzen' ?",
    image_url: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },
  {
    id: 205,
    quiz_id: 2,
    question_text: "En informatique, que signifie 'URL' ?",
    image_url: "https://images.unsplash.com/photo-1546198632-9ef6368bef12?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },

  // --- QUIZ 3 : Cinéma & Séries ---
  {
    id: 301,
    quiz_id: 3,
    question_text: "Quel film détient le record du plus grand nombre d'Oscars (11) ?",
    image_url: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },
  {
    id: 302,
    quiz_id: 3,
    question_text: "Qui incarne Iron Man dans le MCU ?",
    image_url: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },
  {
    id: 303,
    quiz_id: 3,
    question_text: "Dans quelle série trouve-t-on le personnage de 'Walter White' ?",
    image_url: "https://images.unsplash.com/photo-1594908176850-d29201d549cc?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },
  {
    id: 304,
    quiz_id: 3,
    question_text: "Quel est le premier long-métrage d'animation de Disney ?",
    image_url: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },
  {
    id: 305,
    quiz_id: 3,
    question_text: "Qui a réalisé le film 'Inception' ?",
    image_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },

  // --- QUIZ 4 : Sport ---
  {
    id: 401,
    quiz_id: 4,
    question_text: "Quel athlète détient le record du monde du 100m ?",
    image_url: "https://images.unsplash.com/photo-1461896759624-f657bc29f58b?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },
  {
    id: 402,
    quiz_id: 4,
    question_text: "Quelle nation a gagné la Coupe du Monde de foot en 2022 ?",
    image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },

  // --- QUIZ 5 : Gaming ---
  {
    id: 501,
    quiz_id: 5,
    question_text: "Dans quel jeu trouve-t-on la carte 'Dust II' ?",
    image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },
  {
    id: 502,
    quiz_id: 5,
    question_text: "Quel est le nom du protagoniste dans The Legend of Zelda ?",
    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },

  // --- QUIZ 6 : Science/Espace ---
  {
    id: 601,
    quiz_id: 6,
    question_text: "Quelle est la planète la plus proche du Soleil ?",
    image_url: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },

  // --- QUIZ 7 : Nature ---
  {
    id: 701,
    quiz_id: 7,
    question_text: "Quel est le seul mammifère capable de voler ?",
    image_url: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },

  // --- QUIZ 8 : Histoire ---
  {
    id: 801,
    quiz_id: 8,
    question_text: "En quelle année a eu lieu la Révolution Française ?",
    image_url: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },

  // --- QUIZ 9 : Gastronomie ---
  {
    id: 901,
    quiz_id: 9,
    question_text: "De quel pays est originaire le Sushi ?",
    image_url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },

  // --- QUIZ 10 : Musique ---
  {
    id: 1001,
    quiz_id: 10,
    question_text: "Qui était le chanteur du groupe Queen ?",
    image_url: "https://images.unsplash.com/photo-1526218626217-dc65a29bb444?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  },

  // --- QUIZ 11 : Fitness ---
  {
    id: 1101,
    quiz_id: 11,
    question_text: "Quel muscle est principalement sollicité lors des tractions ?",
    image_url: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
    timer_seconds: 15,
    points_value: 100
  }
];