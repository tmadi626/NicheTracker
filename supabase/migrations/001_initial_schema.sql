-- Create niches table
CREATE TABLE niches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ideas table
CREATE TABLE ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  problem TEXT,
  solution TEXT,
  audience VARCHAR(200),
  status VARCHAR(50) DEFAULT 'Backlog' CHECK (status IN ('Backlog', 'Exploring', 'Validating', 'Building', 'Launched')),
  impact INTEGER DEFAULT 1 CHECK (impact >= 1 AND impact <= 5),
  confidence INTEGER DEFAULT 1 CHECK (confidence >= 1 AND confidence <= 5),
  effort INTEGER DEFAULT 1 CHECK (effort >= 1 AND effort <= 5),
  ice_score DECIMAL(5,2) DEFAULT 0.0,
  notes TEXT,
  source_url VARCHAR(500),
  tags VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  niche_id UUID REFERENCES niches(id) ON DELETE CASCADE
);

-- Create highlights table
CREATE TABLE highlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  permalink VARCHAR(500),
  subreddit VARCHAR(100),
  author VARCHAR(100),
  upvotes INTEGER,
  notes TEXT,
  tags VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  niche_id UUID REFERENCES niches(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL
);

-- Create subreddits table
CREATE TABLE subreddits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  url VARCHAR(200) NOT NULL,
  subscriber_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  niche_id UUID REFERENCES niches(id) ON DELETE CASCADE
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_niches_updated_at BEFORE UPDATE ON niches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_highlights_updated_at BEFORE UPDATE ON highlights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subreddits_updated_at BEFORE UPDATE ON subreddits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate ICE score
CREATE OR REPLACE FUNCTION calculate_ice_score()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.effort > 0 THEN
        NEW.ice_score = ROUND((NEW.impact * NEW.confidence)::DECIMAL / NEW.effort, 2);
    ELSE
        NEW.ice_score = 0;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for ICE score calculation
CREATE TRIGGER calculate_ice_score_trigger BEFORE INSERT OR UPDATE ON ideas
    FOR EACH ROW EXECUTE FUNCTION calculate_ice_score();
