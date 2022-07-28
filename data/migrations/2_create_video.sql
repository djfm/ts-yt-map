CREATE TABLE Video (
  id SERIAL UNIQUE,
  channel_id INTEGER NOT NULL,
  url TEXT NOT NULL,

  raw_like_count TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT -1,

  raw_view_count TEXT NOT NULL,
  view_count INTEGER NOT NULL DEFAULT -1,

  title TEXT NOT NULL,
  description TEXT NOT NULL,

  raw_published_on TEXT NOT NULL,
  published_on DATE NOT NULL DEFAULT '1987-09-26 00:00:00',

  crawled BOOLEAN NOT NULL DEFAULT FALSE,
  latest_crawl_attempted_at TIMESTAMP NOT NULL,
  crawl_attempt_count INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  CONSTRAINT fk_video_channel FOREIGN KEY (channel_id) REFERENCES Channel (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_url ON Video (url);
CREATE INDEX idx_channel_id ON Video (channel_id);

CREATE INDEX idx_crawled ON Video (crawled);
CREATE INDEX idx_latest_crawl_attempted_at ON Video (latest_crawl_attempted_at);
CREATE INDEX idx_crawl_attempt_count ON Video (crawl_attempt_count);
