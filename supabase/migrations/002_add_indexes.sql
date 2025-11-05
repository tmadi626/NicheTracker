-- Add indexes for performance
CREATE INDEX idx_ideas_niche_id ON ideas(niche_id);
CREATE INDEX idx_highlights_niche_id ON highlights(niche_id);
CREATE INDEX idx_highlights_idea_id ON highlights(idea_id);
CREATE INDEX idx_subreddits_niche_id ON subreddits(niche_id);
CREATE INDEX idx_ideas_ice_score ON ideas(ice_score DESC);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX idx_highlights_created_at ON highlights(created_at DESC);
CREATE INDEX idx_subreddits_subscriber_count ON subreddits(subscriber_count DESC);
CREATE INDEX idx_niches_created_at ON niches(created_at DESC);
