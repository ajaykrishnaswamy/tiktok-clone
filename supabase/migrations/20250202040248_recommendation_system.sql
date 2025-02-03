-- Create a function to calculate user similarity score based on common interests
create or replace function calculate_user_similarity(user_id_1 text, user_id_2 text)
returns float language plpgsql security definer as $$
declare
  common_interests float;
  total_interests float;
begin
  select 
    count(distinct i1)::float / nullif(count(distinct i1) + count(distinct i2) - count(distinct i1 & i2), 0)::float
  into common_interests
  from 
    (select unnest(interests) as i1 from user_preferences where user_id = user_id_1) a
    full outer join
    (select unnest(interests) as i2 from user_preferences where user_id = user_id_2) b
    on i1 = i2;
    
  return coalesce(common_interests, 0);
end;
$$;

-- Create a function to get video score based on engagement metrics
create or replace function calculate_video_engagement_score(video_id uuid)
returns float language plpgsql security definer as $$
declare
  engagement_metrics record;
  engagement_score float;
begin
  select * from get_video_engagement_metrics(video_id) into engagement_metrics;
  
  -- Calculate weighted score based on different metrics
  engagement_score := (
    engagement_metrics.likes_count * 2.0 +  -- Higher weight for likes
    engagement_metrics.comments_count * 1.5 +  -- Medium weight for comments
    (engagement_metrics.completion_rate * 100) * 3.0  -- Highest weight for completion rate
  ) / nullif(
    engagement_metrics.likes_count + 
    engagement_metrics.dislikes_count + 
    engagement_metrics.comments_count + 1, 0
  );
  
  return coalesce(engagement_score, 0);
end;
$$;

-- Create the main recommendation function
create or replace function get_recommended_videos(
  p_user_id text,
  p_limit integer default 20,
  p_exclude_watched boolean default true
)
returns table (
  video_id uuid,
  title text,
  description text,
  url text,
  thumbnail_url text,
  user_id text,
  created_at timestamp with time zone,
  recommendation_score float
) language plpgsql security definer as $$
declare
  user_interests text[];
  user_categories text[];
begin
  -- Get user preferences
  select interests, preferred_categories 
  into user_interests, user_categories
  from user_preferences 
  where user_id = p_user_id;

  return query
  with video_scores as (
    select 
      v.id,
      v.title,
      v.description,
      v.url,
      v.thumbnail_url,
      v.user_id,
      v.created_at,
      -- Calculate final score based on multiple factors
      (
        calculate_video_engagement_score(v.id) * 0.4 +  -- 40% weight for engagement
        case 
          when v.category = any(user_categories) then 2.0  -- Boost for matching categories
          else 0.0 
        end +
        case 
          when exists (
            select 1 
            from unnest(user_interests) i 
            where v.description ilike '%' || i || '%'
          ) then 1.5  -- Boost for matching interests
          else 0.0
        end +
        (1.0 / (extract(epoch from now() - v.created_at) / 86400 + 1))  -- Recency factor
      ) as score
    from tiktok_videos v
    where 
      (not p_exclude_watched or 
       not exists (
         select 1 
         from video_watch_history h 
         where h.video_id = v.id and h.user_id = p_user_id
       ))
  )
  select 
    vs.id,
    vs.title,
    vs.description,
    vs.url,
    vs.thumbnail_url,
    vs.user_id,
    vs.created_at,
    vs.score as recommendation_score
  from video_scores vs
  order by vs.score desc
  limit p_limit;
end;
$$;

-- Create an index to improve query performance
create index if not exists idx_videos_created_at on tiktok_videos(created_at desc);

-- Grant necessary permissions
grant execute on function calculate_user_similarity(text, text) to authenticated;
grant execute on function calculate_video_engagement_score(uuid) to authenticated;
grant execute on function get_recommended_videos(text, integer, boolean) to authenticated;
