-- Insert sample data for development
INSERT INTO niches (name, slug, description) VALUES
('Hobbies & DIY', 'hobbies-diy', 'Creative hobbies and do-it-yourself projects'),
('Health & Fitness', 'health-fitness', 'Health, wellness, and fitness related content'),
('Technology', 'technology', 'Tech startups, software, and digital products'),
('Food & Cooking', 'food-cooking', 'Culinary ventures and food-related businesses'),
('Parenting', 'parenting', 'Products and services for parents and families');

-- Insert sample ideas
INSERT INTO ideas (title, problem, solution, audience, status, impact, confidence, effort, notes, tags, niche_id)
SELECT 
  'Custom Woodworking Plans',
  'People want unique furniture but lack design skills',
  'Subscription service for custom woodworking plans with video tutorials',
  'DIY enthusiasts and woodworkers',
  'Exploring',
  4,
  3,
  2,
  'High demand in r/woodworking community',
  'woodworking,subscription,plans',
  n.id
FROM niches n WHERE n.slug = 'hobbies-diy';

INSERT INTO ideas (title, problem, solution, audience, status, impact, confidence, effort, notes, tags, niche_id)
SELECT 
  'Meal Prep Delivery Service',
  'Busy professionals struggle with healthy meal planning',
  'Local meal prep service with customizable options',
  'Working professionals aged 25-45',
  'Validating',
  5,
  4,
  4,
  'Validating demand through local Facebook groups',
  'meal-prep,delivery,health',
  n.id
FROM niches n WHERE n.slug = 'food-cooking';

-- Insert sample highlights
INSERT INTO highlights (quote, permalink, subreddit, author, upvotes, notes, tags, niche_id)
SELECT 
  'The key to successful meal prep is starting with 3-4 staple recipes and building from there',
  'https://reddit.com/r/MealPrepSunday/comments/example',
  'MealPrepSunday',
  'mealprep_pro',
  127,
  'Great insight for our meal prep service validation',
  'meal-prep,tips,validation',
  n.id
FROM niches n WHERE n.slug = 'food-cooking';

-- Insert sample subreddits
INSERT INTO subreddits (name, url, subscriber_count, notes, niche_id)
SELECT 
  'r/woodworking',
  'https://reddit.com/r/woodworking',
  2500000,
  'Active community with high engagement on project posts',
  n.id
FROM niches n WHERE n.slug = 'hobbies-diy';

INSERT INTO subreddits (name, url, subscriber_count, notes, niche_id)
SELECT 
  'r/MealPrepSunday',
  'https://reddit.com/r/MealPrepSunday',
  1800000,
  'Great for understanding meal prep pain points and solutions',
  n.id
FROM niches n WHERE n.slug = 'food-cooking';
