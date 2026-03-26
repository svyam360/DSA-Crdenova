ALTER TABLE app_user
  ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

UPDATE app_user
SET password_hash = '$2y$10$Q4Im6qEge05QEo0Inn251Ooil5iV/X/BQ9DKi0CB.acK5GnBhekmi'
WHERE email = 'admin@dsa.com' AND (password_hash IS NULL OR password_hash = '');

UPDATE app_user
SET password_hash = '$2y$10$b08mNsTGN4BU3NqACU0vZ..6VQgx0SeL9OOjvjGIXKE76LMDsiFVq'
WHERE email = 'dsa@prime.com' AND (password_hash IS NULL OR password_hash = '');

UPDATE app_user
SET password_hash = '$2y$10$oJGWTcgcwn4H98j3YihlCenVeitpjQGzM.c1A0Psspu6lm8pE6FXK'
WHERE email = 'agent@prime.com' AND (password_hash IS NULL OR password_hash = '');

INSERT INTO app_user (full_name, email, role, is_active, password_hash)
SELECT 'Super Admin', 'admin@dsa.com', 'ADMIN', TRUE,
       '$2y$10$Q4Im6qEge05QEo0Inn251Ooil5iV/X/BQ9DKi0CB.acK5GnBhekmi'
WHERE NOT EXISTS (SELECT 1 FROM app_user WHERE email = 'admin@dsa.com');

INSERT INTO app_user (full_name, email, role, is_active, password_hash)
SELECT 'Prime DSA Owner', 'dsa@prime.com', 'DSA', TRUE,
       '$2y$10$b08mNsTGN4BU3NqACU0vZ..6VQgx0SeL9OOjvjGIXKE76LMDsiFVq'
WHERE NOT EXISTS (SELECT 1 FROM app_user WHERE email = 'dsa@prime.com');

INSERT INTO app_user (full_name, email, role, is_active, password_hash)
SELECT 'Field Agent Kumar', 'agent@prime.com', 'AGENT', TRUE,
       '$2y$10$oJGWTcgcwn4H98j3YihlCenVeitpjQGzM.c1A0Psspu6lm8pE6FXK'
WHERE NOT EXISTS (SELECT 1 FROM app_user WHERE email = 'agent@prime.com');
