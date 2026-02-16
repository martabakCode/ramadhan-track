-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  avatar_url text,
  current_streak integer default 0,
  longest_streak integer default 0,
  total_points integer default 0,
  last_success_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- ============================================================
-- HADITHS (curated collection)
-- ============================================================
create table public.hadiths (
  id uuid default uuid_generate_v4() primary key,
  source text not null,            -- Bukhari, Muslim, Arba'in, etc.
  hadith_number integer not null,
  arabic_text text not null,
  translation text not null,
  reference text not null,         -- e.g. "HR. Bukhari No. 1"
  category text not null,          -- iman, sabar, sedekah, akhlak, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.hadiths enable row level security;
create policy "Hadiths are viewable by everyone." on public.hadiths for select using (true);

-- ============================================================
-- CHALLENGES (multi-type: quran, habit, hadith)
-- ============================================================
create table public.challenges (
  id uuid default uuid_generate_v4() primary key,
  day_number integer not null,
  title text not null,
  description text not null,
  challenge_type text not null check (challenge_type in ('quran', 'habit', 'hadith')),
  reward_points integer not null,
  challenge_date date not null,
  icon text not null,
  tips text,
  -- Qur'an-specific fields
  surah_number integer,
  ayah_start integer,
  ayah_end integer,
  -- Hadith-specific fields
  hadith_id uuid references public.hadiths(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(day_number, challenge_type)
);

alter table public.challenges enable row level security;
create policy "Challenges are viewable by everyone." on public.challenges for select using (true);

-- ============================================================
-- USER DAILY PROGRESS (unified tracker)
-- ============================================================
create table public.user_daily_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  challenge_id uuid references public.challenges(id) not null,
  completion_date date not null,
  completed boolean default true,
  points_earned integer not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, challenge_id, completion_date)
);

alter table public.user_daily_progress enable row level security;
create policy "Progress viewable by owner" on public.user_daily_progress for select using (auth.uid() = user_id);
create policy "Progress insertable by owner" on public.user_daily_progress for insert with check (auth.uid() = user_id);

-- ============================================================
-- USER HADITH BOOKMARKS
-- ============================================================
create table public.user_hadith_bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  hadith_id uuid references public.hadiths(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, hadith_id)
);

alter table public.user_hadith_bookmarks enable row level security;
create policy "Bookmarks viewable by owner" on public.user_hadith_bookmarks for select using (auth.uid() = user_id);
create policy "Bookmarks insertable by owner" on public.user_hadith_bookmarks for insert with check (auth.uid() = user_id);
create policy "Bookmarks deletable by owner" on public.user_hadith_bookmarks for delete using (auth.uid() = user_id);

-- ============================================================
-- BADGES
-- ============================================================
create table public.badges (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  description text not null,
  icon text not null,
  requirement_type text not null,
  requirement_value integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.badges enable row level security;
create policy "Badges viewable by everyone" on public.badges for select using (true);

-- User Badges
create table public.user_badges (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  badge_id uuid references public.badges(id) not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, badge_id)
);

alter table public.user_badges enable row level security;
create policy "User badges viewable by everyone" on public.user_badges for select using (true);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Update streak: a day is "successful" when ALL challenges for that day are completed
create or replace function update_streak(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_last_success date;
  v_current_streak integer;
  v_longest_streak integer;
  v_today date;
  v_total_today integer;
  v_completed_today integer;
begin
  select last_success_date, current_streak, longest_streak 
  into v_last_success, v_current_streak, v_longest_streak
  from profiles where id = p_user_id;
  
  v_today := current_date;

  -- Count total challenges for today
  select count(*) into v_total_today
  from challenges where challenge_date = v_today;

  -- Count completed challenges for today by this user
  select count(*) into v_completed_today
  from user_daily_progress 
  where user_id = p_user_id 
    and completion_date = v_today 
    and completed = true;

  -- Only update streak if ALL today's challenges are done
  if v_total_today > 0 and v_completed_today >= v_total_today then
    if v_last_success = v_today then
      -- Already counted today
      null;
    elsif v_last_success = v_today - 1 then
      v_current_streak := v_current_streak + 1;
    else
      v_current_streak := 1;
    end if;
    
    if v_current_streak > v_longest_streak then
      v_longest_streak := v_current_streak;
    end if;

    update profiles
    set 
      current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_success_date = v_today,
      updated_at = now()
    where id = p_user_id;
  end if;

  -- Always update total_points
  update profiles
  set 
    total_points = coalesce((
      select sum(points_earned) from user_daily_progress where user_id = p_user_id
    ), 0),
    updated_at = now()
  where id = p_user_id;
end;
$$;

-- Leaderboard function
create or replace function get_leaderboard(limit_count integer)
returns table (
  id uuid,
  name text,
  avatar_url text,
  current_streak integer,
  total_points integer,
  rank bigint
)
language sql
security definer
as $$
  select 
    id,
    name,
    avatar_url,
    current_streak,
    total_points,
    rank() over (order by total_points desc) as rank
  from profiles
  order by total_points desc
  limit limit_count;
$$;

-- Trigger for new user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
