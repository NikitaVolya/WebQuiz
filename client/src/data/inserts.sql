INSERT INTO categories (name, description, image_url, color_code, slug) VALUES
('Culture', 'Art, littérature et connaissances générales.', 'https://images.unsplash.com/photo-1513001900722-370f803f498d?w=800&q=80', '#6c5ce7', 'culture-generale'),
('Tech', 'Informatique, IA et nouvelles technologies.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', '#0984e3', 'technologies'),
('Cinéma', 'Films, séries et pop culture.', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80', '#e17055', 'cinema-pop-culture'),
('Sport', 'Records, athlètes et fitness.', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', '#00b894', 'sport-fitness'),
('Gaming', 'E-sport et jeux vidéo cultes.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', '#fdcb6e', 'gaming-esport'),
('Science', 'Espace, astronomie et nature.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', '#a29bfe', 'sciences-nature'),
('Histoire', 'Événements marquants et grandes figures.', 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=800&q=80', '#d63031', 'histoire-monde'),
('Gastronomie', 'Cuisine du monde et saveurs.', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', '#e84393', 'gastronomie-cuisine');

-- On stocke les IDs des catégories pour la suite
SET @cat_culture = (SELECT id FROM categories WHERE slug = 'culture-generale');
SET @cat_tech = (SELECT id FROM categories WHERE slug = 'technologies');
SET @cat_cinema = (SELECT id FROM categories WHERE slug = 'cinema-pop-culture');
SET @cat_sport = (SELECT id FROM categories WHERE slug = 'sport-fitness');
SET @cat_gaming = (SELECT id FROM categories WHERE slug = 'gaming-esport');
SET @cat_science = (SELECT id FROM categories WHERE slug = 'sciences-nature');
SET @cat_histoire = (SELECT id FROM categories WHERE slug = 'histoire-monde');
SET @cat_gastronomie = (SELECT id FROM categories WHERE slug = 'gastronomie-cuisine');


INSERT INTO quizzes (category_id, creator_id, title, questions_count, description, image_url, is_public) VALUES
(@cat_culture, NULL, 'Culture Générale', 5, 'Testez vos connaissances !', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', TRUE),
(@cat_tech, NULL, 'Spécial Tech 2024', 5, 'IA, Hardware et Web.', 'https://images.unsplash.com/photo-1518770660439-4636190af475', TRUE),
(@cat_cinema, NULL, 'Cinéma & Séries', 5, 'Popcorn et grand écran.', 'https://images.unsplash.com/photo-1485846234645-a62644f84728', TRUE),
(@cat_sport, NULL, 'Légendes du Sport', 2, 'Records mondiaux.', 'https://images.unsplash.com/photo-1504450758481-7338eba7524a', TRUE),
(@cat_gaming, NULL, 'Gaming & E-sport', 2, 'De Mario à LoL.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e', TRUE),
(@cat_science, NULL, 'Espace & Astronomie', 1, 'Vers l''infini.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', TRUE),
(@cat_science, NULL, 'Monde Animal', 1, 'Faune sauvage.', 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd', TRUE),
(@cat_histoire, NULL, 'Histoire de France', 1, 'Rois et République.', 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=1200&q=80', TRUE),
(@cat_gastronomie, NULL, 'Gastronomie Mondiale', 1, 'Tour du monde.', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', TRUE),
(@cat_culture, NULL, 'Musique & Rock', 1, 'Légendes du rock.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4', TRUE),
(@cat_sport, NULL, 'Force & Mental', 1, 'Passion training.', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80', TRUE);

-- On prépare les variables pour lier les questions
SET @q_culture = (SELECT id FROM quizzes WHERE title = 'Culture Générale');
SET @q_tech = (SELECT id FROM quizzes WHERE title = 'Spécial Tech 2024');
SET @q_cinema = (SELECT id FROM quizzes WHERE title = 'Cinéma & Séries');
SET @q_sport = (SELECT id FROM quizzes WHERE title = 'Légendes du Sport');
SET @q_gaming = (SELECT id FROM quizzes WHERE title = 'Gaming & E-sport');
SET @q_espace = (SELECT id FROM quizzes WHERE title = 'Espace & Astronomie');
SET @q_animal = (SELECT id FROM quizzes WHERE title = 'Monde Animal');
SET @q_histoire = (SELECT id FROM quizzes WHERE title = 'Histoire de France');
SET @q_gastro = (SELECT id FROM quizzes WHERE title = 'Gastronomie Mondiale');
SET @q_musique = (SELECT id FROM quizzes WHERE title = 'Musique & Rock');
SET @q_fitness = (SELECT id FROM quizzes WHERE title = 'Force & Mental');

-- ==========================================================
-- QUIZ 1 : CULTURE GÉNÉRALE
-- ==========================================================

-- Q1
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_culture, 'Quelle est la capitale de l''Italie ?', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80', 30, 10);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Milan', 0), (@curr_q, 'Rome', 1), (@curr_q, 'Naples', 0), (@curr_q, 'Venise', 0);

-- Q2
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_culture, 'Qui a peint la Joconde ?', 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&q=80', 30, 10);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Van Gogh', 0), (@curr_q, 'Picasso', 0), (@curr_q, 'Léonard de Vinci', 1), (@curr_q, 'Claude Monet', 0);

-- Q3
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_culture, 'Quelle est la monnaie du Japon ?', 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80', 30, 10);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Yuan', 0), (@curr_q, 'Won', 0), (@curr_q, 'Yen', 1), (@curr_q, 'Dollar', 0);

-- Q4
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_culture, 'En quelle année l''homme a-t-il marché sur la Lune ?', 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80', 30, 10);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, '1965', 0), (@curr_q, '1969', 1), (@curr_q, '1972', 0), (@curr_q, '1959', 0);

-- Q5
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_culture, 'Quel est le plus grand océan du monde ?', 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&q=80', 30, 10);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Océan Atlantique', 0), (@curr_q, 'Océan Indien', 0), (@curr_q, 'Océan Arctique', 0), (@curr_q, 'Océan Pacifique', 1);

-- ==========================================================
-- QUIZ 2 : TECH 2024
-- ==========================================================

-- Q6
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_tech, 'Que signifie ''AI'' ?', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Artificial Intelligence', 1), (@curr_q, 'Apple Interface', 0), (@curr_q, 'Auto Index', 0);

-- Q7
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_tech, 'Quel langage est principalement utilisé pour le style d''une page web ?', 'https://images.unsplash.com/photo-1523437113738-bbd3ee89fb97?w=800&q=80', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Python', 0), (@curr_q, 'PHP', 0), (@curr_q, 'CSS', 1), (@curr_q, 'C++', 0);

-- Q8
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_tech, 'Qui est le fondateur de Microsoft ?', 'https://images.unsplash.com/photo-1522071823991-b5ae7264385d?w=800&q=80', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Steve Jobs', 0), (@curr_q, 'Bill Gates', 1), (@curr_q, 'Elon Musk', 0), (@curr_q, 'Mark Zuckerberg', 0);

-- Q9
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_tech, 'Quelle entreprise fabrique les processeurs ''Ryzen'' ?', 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=800&q=80', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Intel', 0), (@curr_q, 'Nvidia', 0), (@curr_q, 'Apple', 0), (@curr_q, 'AMD', 1);

-- Q10
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_tech, 'En informatique, que signifie ''URL'' ?', 'https://images.unsplash.com/photo-1546198632-9ef6368bef12?w=800&q=80', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Uniform Resource Locator', 1), (@curr_q, 'Unit Remote Line', 0), (@curr_q, 'User Response Logo', 0);

-- ==========================================================
-- QUIZ 3 : CINÉMA & SÉRIES
-- ==========================================================

-- Q11
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_cinema, 'Quel film détient le record du plus grand nombre d''Oscars (11) ?', 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&q=80', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Avatar', 0), (@curr_q, 'Titanic', 1), (@curr_q, 'Le Roi Lion', 0), (@curr_q, 'Inception', 0);

-- Q12
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_cinema, 'Qui incarne Iron Man dans le MCU ?', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&q=80', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Chris Evans', 0), (@curr_q, 'Tom Holland', 0), (@curr_q, 'Robert Downey Jr.', 1), (@curr_q, 'Chris Hemsworth', 0);

-- Q13
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_cinema, 'Dans quelle série trouve-t-on le personnage de ''Walter White'' ?', 'https://images.unsplash.com/photo-1594908176850-d29201d549cc?w=800&q=80', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Prison Break', 0), (@curr_q, 'Breaking Bad', 1), (@curr_q, 'The Wire', 0), (@curr_q, 'Narcos', 0);

-- Q14
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_cinema, 'Quel est le premier long-métrage d''animation de Disney ?', 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800&q=80', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Bambi', 0), (@curr_q, 'Pinocchio', 0), (@curr_q, 'Blanche-Neige', 1), (@curr_q, 'Dumbo', 0);

-- Q15
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) 
VALUES (@q_cinema, 'Qui a réalisé le film ''Inception'' ?', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Spielberg', 0), (@curr_q, 'Christopher Nolan', 1), (@curr_q, 'Quentin Tarantino', 0), (@curr_q, 'James Cameron', 0);

-- ==========================================================
-- AUTRES QUIZ (1-2 QUESTIONS CHACUN)
-- ==========================================================

-- Sport (Q16-17)
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) VALUES (@q_sport, 'Quel athlète détient le record du monde du 100m ?', '...', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Usain Bolt', 1), (@curr_q, 'Tyson Gay', 0);

INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) VALUES (@q_sport, 'Quelle nation a gagné la Coupe du Monde 2022 ?', '...', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Argentine', 1), (@curr_q, 'France', 0);

-- Gaming (Q18-19)
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) VALUES (@q_gaming, 'Dans quel jeu trouve-t-on la carte ''Dust II'' ?', '...', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Counter-Strike', 1), (@curr_q, 'Valorant', 0);

INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) VALUES (@q_gaming, 'Nom du protagoniste dans Zelda ?', '...', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Link', 1), (@curr_q, 'Zelda', 0);

-- Espace (Q20)
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) VALUES (@q_espace, 'Planète la plus proche du Soleil ?', '...', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Mercure', 1), (@curr_q, 'Mars', 0);

-- Animal (Q21)
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) VALUES (@q_animal, 'Seul mammifère capable de voler ?', '...', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'La chauve-souris', 1), (@curr_q, 'L''autruche', 0);

-- Histoire (Q22)
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) VALUES (@q_histoire, 'Année de la Révolution Française ?', '...', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, '1789', 1), (@curr_q, '1804', 0);

-- Gastronomie (Q23)
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) VALUES (@q_gastro, 'Origine du Sushi ?', '...', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Japon', 1), (@curr_q, 'Chine', 0);

-- Musique (Q24)
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) VALUES (@q_musique, 'Chanteur de Queen ?', '...', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Freddie Mercury', 1), (@curr_q, 'David Bowie', 0);

-- Fitness (Q25)
INSERT INTO questions (quiz_id, question_text, image_url, timer_seconds, points_value) VALUES (@q_fitness, 'Muscle sollicité par les tractions ?', '...', 15, 100);
SET @curr_q = LAST_INSERT_ID();
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (@curr_q, 'Dorsaux', 1), (@curr_q, 'Pectoraux', 0);