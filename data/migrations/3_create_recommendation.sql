CREATE TABLE Recommendation (
  id SERIAL UNIQUE,
  from_id INTEGER NOT NULL,
  to_id INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  CONSTRAINT fk_video_from FOREIGN KEY (from_id) REFERENCES Video (id) ON DELETE CASCADE,
  CONSTRAINT fk_video_to FOREIGN KEY (to_id) REFERENCES Video (id) ON DELETE CASCADE
);

CREATE INDEX idx_recommendation ON Recommendation (from_id, to_id);
