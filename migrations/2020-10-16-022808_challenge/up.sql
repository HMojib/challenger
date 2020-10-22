CREATE EXTENSION btree_gist;

CREATE TABLE challenger.challenge_type (
    id SERIAL PRIMARY KEY,
    tag varchar(15) NOT NULL,
    title VARCHAR(25) NOT NULL
);

INSERT INTO challenger.challenge_type (id, tag, title) VALUES (1, 'music', 'Music');

CREATE TABLE challenger.challenge_template (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    challenge_type INT NOT NULL REFERENCES challenger.challenge_type(id) ON UPDATE CASCADE ON DELETE CASCADE,
    title VARCHAR(30) NOT NULL,
    description VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    created_by UUID NOT NULL REFERENCES users.profile ON UPDATE CASCADE ON DELETE CASCADE,
    deleted_at TIMESTAMPTZ
);

CREATE TABLE challenger.challenge (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES challenger.event(id) ON UPDATE CASCADE ON DELETE CASCADE,
    challenge_template_id UUID NOT NULL REFERENCES challenger.challenge_template(id) ON UPDATE CASCADE ON DELETE CASCADE,
    effective_range TSTZRANGE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    created_by UUID NOT NULL REFERENCES users.profile ON UPDATE CASCADE ON DELETE CASCADE,
    EXCLUDE USING GIST (event_id WITH =, effective_range WITH &&)
);