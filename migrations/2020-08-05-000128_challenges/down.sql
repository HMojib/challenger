-- DROP TRIGGER challenge_set_before_insert ON api.challenge_set;
-- DROP TRIGGER challenge_event_before_insert ON api.challenge_event;
-- DROP TRIGGER challenge_set_event_before_insert ON api.challenge_set_event;
-- DROP TRIGGER challenge_before_insert ON api.challenge;
-- DROP TRIGGER challenge_after_insert ON api.challenge;

-- DROP FUNCTION api.challenge_set_before_insert();
-- DROP FUNCTION api.challenge_event_before_insert();
-- DROP FUNCTION api.challenge_set_event_before_insert();
-- DROP FUNCTION api.challenge_before_insert();
-- DROP FUNCTION api.challenge_after_insert();

-- DROP TABLE api.challenge_user;
-- DROP TABLE api.challenge_frequency;
-- DROP TABLE api.challenge;
-- DROP TABLE api.challenge_set_event;
-- DROP TABLE api.challenge_set;
-- DROP TABLE api.challenge_event;

-- DROP EXTENSION btree_gist;

-- DROP SCHEMA api;


DROP TABLE challenger.event;
DROP SCHEMA challenger;