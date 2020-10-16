DROP INDEX challenger.event_event_type_idx;

ALTER TABLE challenger.event DROP COLUMN event_type;

DROP TABLE challenger.event_type;