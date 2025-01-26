-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table
CREATE TABLE tiktok_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Videos table
CREATE TABLE tiktok_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES tiktok_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  embedding VECTOR(1536),
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  dislikes_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_stitch BOOLEAN DEFAULT FALSE,
  original_video_id UUID REFERENCES tiktok_videos(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Comments table
CREATE TABLE tiktok_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES tiktok_videos(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES tiktok_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Likes table
CREATE TABLE tiktok_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES tiktok_videos(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES tiktok_users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(video_id, user_id)
);

-- Dislikes table
CREATE TABLE tiktok_dislikes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES tiktok_videos(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES tiktok_users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(video_id, user_id)
);

-- Shares table
CREATE TABLE tiktok_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES tiktok_videos(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES tiktok_users(id) ON DELETE CASCADE,
  recipient_user_id TEXT REFERENCES tiktok_users(id) ON DELETE SET NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Stitches table
CREATE TABLE tiktok_stitches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_video_id UUID NOT NULL REFERENCES tiktok_videos(id) ON DELETE CASCADE,
  stitched_video_id UUID NOT NULL REFERENCES tiktok_videos(id) ON DELETE CASCADE,
  start_time NUMERIC NOT NULL,
  end_time NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX tiktok_videos_user_id_idx ON tiktok_videos(user_id);
CREATE INDEX tiktok_comments_video_id_idx ON tiktok_comments(video_id);
CREATE INDEX tiktok_likes_video_id_idx ON tiktok_likes(video_id);
CREATE INDEX tiktok_dislikes_video_id_idx ON tiktok_dislikes(video_id);
CREATE INDEX tiktok_shares_video_id_idx ON tiktok_shares(video_id);

CREATE TABLE tiktok_forwards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    video_id UUID NOT NULL,            -- Changed to UUID
    recipient_user_id TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, video_id, recipient_user_id),
    FOREIGN KEY (user_id) REFERENCES tiktok_users(id),
    FOREIGN KEY (video_id) REFERENCES tiktok_videos(id),
    FOREIGN KEY (recipient_user_id) REFERENCES tiktok_users(id)
);
