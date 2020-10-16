CREATE TABLE challenger.event_type (
    id SERIAL PRIMARY KEY,
    tag varchar(15) NOT NULL,
    title VARCHAR(25) NOT NULL
);

INSERT INTO challenger.event_type (id, tag, title) VALUES (1, 'music', 'Music');

ALTER TABLE challenger.event ADD COLUMN event_type INT NOT NULL REFERENCES challenger.event_type(id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE INDEX event_event_type_idx ON challenger.event(event_type);