-- Create video category enum type
create type video_category as enum (
  'entertainment',
  'education',
  'gaming',
  'music',
  'dance',
  'sports',
  'food',
  'lifestyle',
  'technology',
  'travel',
  'comedy',
  'fashion',
  'art',
  'fitness',
  'beauty',
  'pets',
  'other'
);

-- Add category column to tiktok_videos table
alter table tiktok_videos
add column if not exists category video_category default 'other'::video_category not null;

-- Create index on category column
create index if not exists idx_videos_category on tiktok_videos(category);
