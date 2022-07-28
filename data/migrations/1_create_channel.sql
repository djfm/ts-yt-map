CREATE TYPE channel_type AS ENUM('/user/', '/c/', '/channel/', '/');

CREATE TABLE Channel (
  id SERIAL UNIQUE,
  youtube_id TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  html_lang TEXT NOT NULL,
  type channel_type NOT NULL,
  language TEXT NULL DEFAULT NULL,
  short_name TEXT NOT NULL,
  human_name TEXT NOT NULL,
  raw_subscriber_count TEXT NOT NULL,
  subscriber_count INTEGER NOT NULL DEFAULT -1,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_short_name ON Channel (short_name);
CREATE INDEX idx_human_name ON Channel (human_name);
CREATE INDEX idx_youtube_id ON Channel (youtube_id);
