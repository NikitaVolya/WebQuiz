/**
 * @file mockAnswers.ts
 * Reflet exact de la table SQL 'answers'
 */

export const MOCK_ANSWERS = [
  // --- Quiz 1 : Culture Générale ---
  { id: 1011, question_id: 101, answer_text: "Milan", is_correct: 0 },
  { id: 1012, question_id: 101, answer_text: "Rome", is_correct: 1 },
  { id: 1013, question_id: 101, answer_text: "Naples", is_correct: 0 },
  { id: 1014, question_id: 101, answer_text: "Venise", is_correct: 0 },

  { id: 1021, question_id: 102, answer_text: "Van Gogh", is_correct: 0 },
  { id: 1022, question_id: 102, answer_text: "Picasso", is_correct: 0 },
  { id: 1023, question_id: 102, answer_text: "Léonard de Vinci", is_correct: 1 },
  { id: 1024, question_id: 102, answer_text: "Claude Monet", is_correct: 0 },

  { id: 1031, question_id: 103, answer_text: "Yuan", is_correct: 0 },
  { id: 1032, question_id: 103, answer_text: "Won", is_correct: 0 },
  { id: 1033, question_id: 103, answer_text: "Yen", is_correct: 1 },
  { id: 1034, question_id: 103, answer_text: "Dollar", is_correct: 0 },

  { id: 1041, question_id: 104, answer_text: "1965", is_correct: 0 },
  { id: 1042, question_id: 104, answer_text: "1969", is_correct: 1 },
  { id: 1043, question_id: 104, answer_text: "1972", is_correct: 0 },
  { id: 1044, question_id: 104, answer_text: "1959", is_correct: 0 },

  { id: 1051, question_id: 105, answer_text: "Océan Atlantique", is_correct: 0 },
  { id: 1052, question_id: 105, answer_text: "Océan Indien", is_correct: 0 },
  { id: 1053, question_id: 105, answer_text: "Océan Arctique", is_correct: 0 },
  { id: 1054, question_id: 105, answer_text: "Océan Pacifique", is_correct: 1 },

  // --- Quiz 2 : Tech 2024 ---
  { id: 2011, question_id: 201, answer_text: "Artificial Intelligence", is_correct: 1 },
  { id: 2012, question_id: 201, answer_text: "Apple Interface", is_correct: 0 },
  { id: 2013, question_id: 201, answer_text: "Auto Index", is_correct: 0 },

  { id: 2021, question_id: 202, answer_text: "Python", is_correct: 0 },
  { id: 2022, question_id: 202, answer_text: "PHP", is_correct: 0 },
  { id: 2023, question_id: 202, answer_text: "CSS", is_correct: 1 },
  { id: 2024, question_id: 202, answer_text: "C++", is_correct: 0 },

  { id: 2031, question_id: 203, answer_text: "Steve Jobs", is_correct: 0 },
  { id: 2032, question_id: 203, answer_text: "Bill Gates", is_correct: 1 },
  { id: 2033, question_id: 203, answer_text: "Elon Musk", is_correct: 0 },
  { id: 2034, question_id: 203, answer_text: "Mark Zuckerberg", is_correct: 0 },

  { id: 2041, question_id: 204, answer_text: "Intel", is_correct: 0 },
  { id: 2042, question_id: 204, answer_text: "Nvidia", is_correct: 0 },
  { id: 2043, question_id: 204, answer_text: "Apple", is_correct: 0 },
  { id: 2044, question_id: 204, answer_text: "AMD", is_correct: 1 },

  { id: 2051, question_id: 205, answer_text: "Uniform Resource Locator", is_correct: 1 },
  { id: 2052, question_id: 205, answer_text: "Unit Remote Line", is_correct: 0 },
  { id: 2053, question_id: 205, answer_text: "User Response Logo", is_correct: 0 },

  // --- Quiz 3 : Cinéma & Séries ---
  { id: 3011, question_id: 301, answer_text: "Avatar", is_correct: 0 },
  { id: 3012, question_id: 301, answer_text: "Titanic", is_correct: 1 },
  { id: 3013, question_id: 301, answer_text: "Le Roi Lion", is_correct: 0 },
  { id: 3014, question_id: 301, answer_text: "Inception", is_correct: 0 },

  { id: 3021, question_id: 302, answer_text: "Chris Evans", is_correct: 0 },
  { id: 3022, question_id: 302, answer_text: "Tom Holland", is_correct: 0 },
  { id: 3023, question_id: 302, answer_text: "Robert Downey Jr.", is_correct: 1 },
  { id: 3024, question_id: 302, answer_text: "Chris Hemsworth", is_correct: 0 },

  { id: 3031, question_id: 303, answer_text: "Prison Break", is_correct: 0 },
  { id: 3032, question_id: 303, answer_text: "Breaking Bad", is_correct: 1 },
  { id: 3033, question_id: 303, answer_text: "The Wire", is_correct: 0 },
  { id: 3034, question_id: 303, answer_text: "Narcos", is_correct: 0 },

  { id: 3041, question_id: 304, answer_text: "Bambi", is_correct: 0 },
  { id: 3042, question_id: 304, answer_text: "Pinocchio", is_correct: 0 },
  { id: 3043, question_id: 304, answer_text: "Blanche-Neige", is_correct: 1 },
  { id: 3044, question_id: 304, answer_text: "Dumbo", is_correct: 0 },

  { id: 3051, question_id: 305, answer_text: "Spielberg", is_correct: 0 },
  { id: 3052, question_id: 305, answer_text: "Christopher Nolan", is_correct: 1 },
  { id: 3053, question_id: 305, answer_text: "Quentin Tarantino", is_correct: 0 },
  { id: 3054, question_id: 305, answer_text: "James Cameron", is_correct: 0 },

  // --- Quiz 4 : Sport ---
  { id: 4011, question_id: 401, answer_text: "Carl Lewis", is_correct: 0 },
  { id: 4012, question_id: 401, answer_text: "Usain Bolt", is_correct: 1 },
  { id: 4013, question_id: 401, answer_text: "Tyson Gay", is_correct: 0 },
  { id: 4014, question_id: 401, answer_text: "Yohan Blake", is_correct: 0 },

  { id: 4021, question_id: 402, answer_text: "France", is_correct: 0 },
  { id: 4022, question_id: 402, answer_text: "Brésil", is_correct: 0 },
  { id: 4023, question_id: 402, answer_text: "Argentine", is_correct: 1 },
  { id: 4024, question_id: 402, answer_text: "Allemagne", is_correct: 0 },

  // --- Quiz 5 : Gaming ---
  { id: 5011, question_id: 501, answer_text: "Call of Duty", is_correct: 0 },
  { id: 5012, question_id: 501, answer_text: "Overwatch", is_correct: 0 },
  { id: 5013, question_id: 501, answer_text: "Counter-Strike", is_correct: 1 },
  { id: 5014, question_id: 501, answer_text: "Valorant", is_correct: 0 },

  { id: 5021, question_id: 502, answer_text: "Zelda", is_correct: 0 },
  { id: 5022, question_id: 502, answer_text: "Link", is_correct: 1 },
  { id: 5023, question_id: 502, answer_text: "Ganon", is_correct: 0 },
  { id: 5024, question_id: 502, answer_text: "Navi", is_correct: 0 },

  // --- Quiz 6 : Science ---
  { id: 6011, question_id: 601, answer_text: "Vénus", is_correct: 0 },
  { id: 6012, question_id: 601, answer_text: "Mars", is_correct: 0 },
  { id: 6013, question_id: 601, answer_text: "Mercure", is_correct: 1 },
  { id: 6014, question_id: 601, answer_text: "Jupiter", is_correct: 0 },

  // --- Quiz 7 : Nature ---
  { id: 7011, question_id: 701, answer_text: "L'écureuil volant", is_correct: 0 },
  { id: 7012, question_id: 701, answer_text: "La chauve-souris", is_correct: 1 },
  { id: 7013, question_id: 701, answer_text: "L'autruche", is_correct: 0 },
  { id: 7014, question_id: 701, answer_text: "Le colibri", is_correct: 0 },

  // --- Quiz 8 : Histoire ---
  { id: 8011, question_id: 801, answer_text: "1776", is_correct: 0 },
  { id: 8012, question_id: 801, answer_text: "1789", is_correct: 1 },
  { id: 8013, question_id: 801, answer_text: "1804", is_correct: 0 },
  { id: 8014, question_id: 801, answer_text: "1815", is_correct: 0 },

  // --- Quiz 9 : Gastronomie ---
  { id: 9011, question_id: 901, answer_text: "Chine", is_correct: 0 },
  { id: 9012, question_id: 901, answer_text: "Thaïlande", is_correct: 0 },
  { id: 9013, question_id: 901, answer_text: "Corée du Sud", is_correct: 0 },
  { id: 9014, question_id: 901, answer_text: "Japon", is_correct: 1 },

  // --- Quiz 10 : Musique ---
  { id: 10011, question_id: 1001, answer_text: "Mick Jagger", is_correct: 0 },
  { id: 10012, question_id: 1001, answer_text: "David Bowie", is_correct: 0 },
  { id: 10013, question_id: 1001, answer_text: "Freddie Mercury", is_correct: 1 },
  { id: 10014, question_id: 1001, answer_text: "Elton John", is_correct: 0 },

  // --- Quiz 11 : Fitness ---
  { id: 11011, question_id: 1101, answer_text: "Pectoraux", is_correct: 0 },
  { id: 11012, question_id: 1101, answer_text: "Dorsaux", is_correct: 1 },
  { id: 11013, question_id: 1101, answer_text: "Quadriceps", is_correct: 0 },
  { id: 11014, question_id: 1101, answer_text: "Mollets", is_correct: 0 }
];