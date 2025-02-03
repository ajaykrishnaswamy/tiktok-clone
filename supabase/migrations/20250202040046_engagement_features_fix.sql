-- Drop existing tables if they exist
drop table if exists "video_likes" cascade;
drop table if exists "video_dislikes" cascade;
drop table if exists "video_comments" cascade;
drop table if exists "user_preferences" cascade;
drop table if exists "video_watch_history" cascade;

-- Create extension if not exists
create extension if not exists "uuid-ossp";

-- Create video interactions tables
create table if not exists "video_likes" (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references tiktok_videos(id) on delete cascade,
  user_id text references tiktok_users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(video_id, user_id)
);

create table if not exists "video_dislikes" (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references tiktok_videos(id) on delete cascade,
  user_id text references tiktok_users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(video_id, user_id)
);

create table if not exists "video_comments" (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references tiktok_videos(id) on delete cascade,
  user_id text references tiktok_users(id) on delete cascade,
  content text not null,
  parent_comment_id uuid references video_comments(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user preferences and watch history tables
create table if not exists "user_preferences" (
  id uuid default uuid_generate_v4() primary key,
  user_id text references tiktok_users(id) on delete cascade unique,
  interests text[] default array[]::text[],
  preferred_categories text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists "video_watch_history" (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references tiktok_videos(id) on delete cascade,
  user_id text references tiktok_users(id) on delete cascade,
  watch_duration_seconds integer default 0,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(video_id, user_id)
);

-- Enable RLS
alter table if exists "video_likes" enable row level security;
alter table if exists "video_dislikes" enable row level security;
alter table if exists "video_comments" enable row level security;
alter table if exists "user_preferences" enable row level security;
alter table if exists "video_watch_history" enable row level security;

-- Add RLS policies
create policy "Users can view their own likes"
  on video_likes for select
  using (auth.uid()::text = user_id);

create policy "Users can insert their own likes"
  on video_likes for insert
  with check (auth.uid()::text = user_id);

create policy "Users can delete their own likes"
  on video_likes for delete
  using (auth.uid()::text = user_id);

create policy "Users can view their own dislikes"
  on video_dislikes for select
  using (auth.uid()::text = user_id);

create policy "Users can insert their own dislikes"
  on video_dislikes for insert
  with check (auth.uid()::text = user_id);

create policy "Users can delete their own dislikes"
  on video_dislikes for delete
  using (auth.uid()::text = user_id);

create policy "Users can view all comments"
  on video_comments for select
  using (true);

create policy "Users can insert their own comments"
  on video_comments for insert
  with check (auth.uid()::text = user_id);

create policy "Users can update their own comments"
  on video_comments for update
  using (auth.uid()::text = user_id);

create policy "Users can delete their own comments"
  on video_comments for delete
  using (auth.uid()::text = user_id);

create policy "Users can view their own preferences"
  on user_preferences for select
  using (auth.uid()::text = user_id);

create policy "Users can update their own preferences"
  on user_preferences for update
  using (auth.uid()::text = user_id);

create policy "Users can view their own watch history"
  on video_watch_history for select
  using (auth.uid()::text = user_id);

create policy "Users can insert their own watch history"
  on video_watch_history for insert
  with check (auth.uid()::text = user_id);

create policy "Users can update their own watch history"
  on video_watch_history for update
  using (auth.uid()::text = user_id);

-- Create functions for engagement metrics
create or replace function get_video_engagement_metrics(video_id uuid)
returns table (
  likes_count bigint,
  dislikes_count bigint,
  comments_count bigint,
  total_watch_time bigint,
  completion_rate numeric
) language plpgsql security definer as $$
begin
  return query
  select
    (select count(*) from video_likes where video_likes.video_id = $1) as likes_count,
    (select count(*) from video_dislikes where video_dislikes.video_id = $1) as dislikes_count,
    (select count(*) from video_comments where video_comments.video_id = $1) as comments_count,
    (select coalesce(sum(watch_duration_seconds), 0) from video_watch_history where video_watch_history.video_id = $1) as total_watch_time,
    (select coalesce(avg(case when completed then 1 else 0 end), 0) from video_watch_history where video_watch_history.video_id = $1) as completion_rate;
end;
$$;
