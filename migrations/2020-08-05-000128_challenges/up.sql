CREATE EXTENSION btree_gist;
CREATE SCHEMA api;

CREATE TABLE api.challenge_set (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  description VARCHAR(150) NOT NULL,
  frequency INTERVAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users.profile ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE FUNCTION api.challenge_set_before_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN 
    NEW.created_by = api.get_current_user_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER challenge_set_before_insert
BEFORE INSERT ON api.challenge_set
FOR EACH ROW
EXECUTE PROCEDURE api.challenge_set_before_insert();

CREATE TABLE api.challenge_event (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  description VARCHAR(300) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users.profile ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE FUNCTION api.challenge_event_before_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN 
    NEW.created_by = api.get_current_user_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER challenge_event_before_insert
BEFORE INSERT ON api.challenge_event
FOR EACH ROW
EXECUTE PROCEDURE api.challenge_event_before_insert();

CREATE TABLE api.challenge_set_event (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users.profile ON UPDATE CASCADE ON DELETE CASCADE,
  challenge_set_id UUID NOT NULL REFERENCES api.challenge_set ON UPDATE CASCADE ON DELETE CASCADE,
  challenge_event_id UUID NOT NULL REFERENCES api.challenge_event ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE(challenge_event_id, challenge_set_id)
);

CREATE FUNCTION api.challenge_set_event_before_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN 
    NEW.created_by = api.get_current_user_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER challenge_set_event_before_insert
BEFORE INSERT ON api.challenge_set_event
FOR EACH ROW
EXECUTE PROCEDURE api.challenge_set_event_before_insert();

CREATE TABLE api.challenge (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_set_id UUID NOT NULL REFERENCES api.challenge_set ON UPDATE CASCADE ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL DEFAULT current_date::TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users.profile ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE api.challenge_frequency (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_set_event_id UUID NOT NULL REFERENCES api.challenge_set_event ON UPDATE CASCADE ON DELETE CASCADE,
  effective_range TSTZRANGE NOT NULL,
  EXCLUDE USING GIST (challenge_set_event_id WITH =, effective_range WITH &&)
);

CREATE TABLE api.challenge_user(
  challenge_id UUID NOT NULL REFERENCES api.challenge ON UPDATE CASCADE ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users.profile ON UPDATE CASCADE ON DELETE CASCADE,
  vote_id UUID REFERENCES users.profile ON UPDATE CASCADE ON DELETE SET NULL CHECK (vote_id != user_id),
  PRIMARY KEY (challenge_id, user_id)
);

CREATE FUNCTION api.challenge_before_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN 
    NEW.created_by = api.get_current_user_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER challenge_before_insert
BEFORE INSERT ON api.challenge
FOR EACH ROW
EXECUTE PROCEDURE api.challenge_before_insert();

CREATE FUNCTION api.challenge_after_insert() RETURNS trigger AS $$
DECLARE
    c_frequency INTERVAL;
BEGIN 
  SELECT frequency INTO c_frequency FROM api.challenge_set WHERE id = NEW.challenge_set_id;

  WITH challenges AS (
    SELECT 
      id AS challenge_set_event_id, 
      (ROW_NUMBER () OVER (ORDER BY created_at DESC) - 1 ) AS row_num
    FROM api.challenge_set_event
    WHERE challenge_set_id = NEW.challenge_set_id
  )
  INSERT INTO api.challenge_frequency (challenge_set_event_id, effective_range)
    SELECT challenge_set_event_id, 
      ('(' || row_num * c_frequency + NEW.start_time || ',' || (row_num + 1) * c_frequency + NEW.start_time || ']')::TSTZRANGE AS effective_range
    FROM challenges;

  INSERT INTO api.challenge_user (challenge_id, user_id) VALUES (NEW.id, NEW.created_by);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path TO pg_catalog, public, api, pg_temp;

CREATE TRIGGER challenge_after_insert
AFTER INSERT ON api.challenge
FOR EACH ROW
EXECUTE PROCEDURE api.challenge_after_insert();