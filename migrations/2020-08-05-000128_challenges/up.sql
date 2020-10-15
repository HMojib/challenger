-- CREATE EXTENSION btree_gist;

CREATE SCHEMA challenger;

CREATE TABLE challenger.event (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  description VARCHAR(150) NOT NULL,
  frequency INTERVAL NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  created_by UUID NOT NULL REFERENCES users.profile ON UPDATE CASCADE ON DELETE CASCADE
);

-- CREATE TABLE challenger.challenge (
--   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
--   set_id UUID NOT NULL REFERENCES challenger.set ON UPDATE CASCADE ON DELETE CASCADE,
--   created_at TIMESTAMP DEFAULT NOW(),
--   created_by UUID REFERENCES users.profile ON UPDATE CASCADE ON DELETE CASCADE
-- );

-- CREATE TABLE challenger.challenge_users(
--   challenge_id UUID NOT NULL REFERENCES challenger.challenge ON UPDATE CASCADE ON DELETE CASCADE,
--   users_id UUID NOT NULL REFERENCES users.profile ON UPDATE CASCADE ON DELETE CASCADE,
--   vote_id UUID REFERENCES users.profile ON UPDATE CASCADE ON DELETE SET NULL CHECK (vote_id != users_id),
--   effective_range TSTZRANGE NOT NULL,
--   EXCLUDE USING GIST (challenge_set_event_id WITH =, effective_range WITH &&),
--   PRIMARY KEY (challenge_id, users_id)
-- );

-- CREATE FUNCTION challenger.challenge_after_insert() RETURNS trigger AS $$
-- DECLARE
--     c_frequency INTERVAL:=(SELECT frequency FROM challenger.set WHERE id = NEW.set_id);
-- BEGIN 
--   WITH challenges AS (
--     SELECT 
--       id AS event_set_id, 
--       (ROW_NUMBER () OVER (ORDER BY created_at DESC) - 1 ) AS row_num
--     FROM challenger.event_set
--     WHERE event_set_id = NEW.set_id
--   )
--   INSERT INTO challenger.challenge_frequency (challenge_set_event_id, effective_range)
--     SELECT challenge_set_event_id, 
--       ('(' || row_num * c_frequency + NEW.start_time || ',' || (row_num + 1) * c_frequency + NEW.start_time || ']')::TSTZRANGE AS effective_range
--     FROM challenges;

--   INSERT INTO challenger.challenge_users (challenge_id, users_id) VALUES (NEW.id, NEW.created_by);
  
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path TO pg_catalog, public, challenger, pg_temp;

-- CREATE TRIGGER challenge_after_insert
-- AFTER INSERT ON challenger.challenge
-- FOR EACH ROW
-- EXECUTE PROCEDURE challenger.challenge_after_insert();