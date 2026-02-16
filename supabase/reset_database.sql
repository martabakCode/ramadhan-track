-- ============================================================
-- FULL DATABASE RESET: Drop → Schema → Backfill → Seed
-- ============================================================
-- WARNING: This drops ALL public tables and recreates them.
-- Auth users are preserved; profiles are backfilled.

-- 1. Drop existing objects
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.get_leaderboard(integer);
DROP FUNCTION IF EXISTS public.update_streak(uuid);

DROP TABLE IF EXISTS public.user_hadith_bookmarks CASCADE;
DROP TABLE IF EXISTS public.user_daily_progress CASCADE;
DROP TABLE IF EXISTS public.user_challenge_progress CASCADE;
DROP TABLE IF EXISTS public.user_badges CASCADE;
DROP TABLE IF EXISTS public.challenges CASCADE;
DROP TABLE IF EXISTS public.hadiths CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Schema
create extension if not exists "uuid-ossp";

-- Profiles
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

-- Hadiths
create table public.hadiths (
  id uuid default uuid_generate_v4() primary key,
  source text not null,
  hadith_number integer not null,
  arabic_text text not null,
  translation text not null,
  reference text not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.hadiths enable row level security;
create policy "Hadiths are viewable by everyone." on public.hadiths for select using (true);

-- Challenges
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
  surah_number integer,
  ayah_start integer,
  ayah_end integer,
  hadith_id uuid references public.hadiths(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(day_number, challenge_type)
);
alter table public.challenges enable row level security;
create policy "Challenges are viewable by everyone." on public.challenges for select using (true);

-- User Daily Progress
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

-- User Hadith Bookmarks
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

-- Badges
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

create table public.user_badges (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  badge_id uuid references public.badges(id) not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, badge_id)
);
alter table public.user_badges enable row level security;
create policy "User badges viewable by everyone" on public.user_badges for select using (true);

-- Functions
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

  select count(*) into v_total_today
  from challenges where challenge_date = v_today;

  select count(*) into v_completed_today
  from user_daily_progress 
  where user_id = p_user_id 
    and completion_date = v_today 
    and completed = true;

  if v_total_today > 0 and v_completed_today >= v_total_today then
    if v_last_success = v_today then
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

  update profiles
  set 
    total_points = coalesce((
      select sum(points_earned) from user_daily_progress where user_id = p_user_id
    ), 0),
    updated_at = now()
  where id = p_user_id;
end;
$$;

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
    id, name, avatar_url, current_streak, total_points,
    rank() over (order by total_points desc) as rank
  from profiles
  order by total_points desc
  limit limit_count;
$$;

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

-- 3. Backfill profiles for existing auth users
INSERT INTO public.profiles (id, email, name, avatar_url)
SELECT id, email, raw_user_meta_data->>'name', raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. SEED DATA
-- ============================================================

-- 4a. Hadiths (30 curated hadiths, one per day)
INSERT INTO public.hadiths (id, source, hadith_number, arabic_text, translation, reference, category) VALUES
(uuid_generate_v4(), 'Arba''in Nawawi', 1,
 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
 'Sesungguhnya setiap amalan tergantung pada niatnya, dan setiap orang akan mendapatkan apa yang dia niatkan.',
 'HR. Bukhari No. 1, Muslim No. 1907', 'niat'),

(uuid_generate_v4(), 'Arba''in Nawawi', 2,
 'بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ',
 'Islam dibangun di atas lima perkara: syahadat, shalat, zakat, puasa Ramadhan, dan haji.',
 'HR. Bukhari No. 8, Muslim No. 16', 'iman'),

(uuid_generate_v4(), 'Bukhari', 1903,
 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
 'Barangsiapa berpuasa Ramadhan dengan iman dan mengharap pahala, maka diampuni dosa-dosanya yang telah lalu.',
 'HR. Bukhari No. 1903', 'puasa'),

(uuid_generate_v4(), 'Muslim', 2699,
 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ',
 'Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah mudahkan baginya jalan menuju surga.',
 'HR. Muslim No. 2699', 'ilmu'),

(uuid_generate_v4(), 'Bukhari', 6018,
 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
 'Barangsiapa beriman kepada Allah dan hari akhir, hendaklah berkata baik atau diam.',
 'HR. Bukhari No. 6018, Muslim No. 47', 'akhlak'),

(uuid_generate_v4(), 'Tirmidzi', 2317,
 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ',
 'Bertakwalah kepada Allah di mana saja kamu berada, iringilah keburukan dengan kebaikan niscaya ia akan menghapusnya, dan bergaullah dengan manusia dengan akhlak yang baik.',
 'HR. Tirmidzi No. 2317', 'akhlak'),

(uuid_generate_v4(), 'Muslim', 2577,
 'يَا عِبَادِي إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي وَجَعَلْتُهُ بَيْنَكُمْ مُحَرَّمًا فَلَا تَظَالَمُوا',
 'Wahai hamba-Ku, Aku haramkan kezaliman atas diri-Ku dan Aku jadikan ia haram di antara kalian, maka janganlah saling menzalimi.',
 'HR. Muslim No. 2577', 'keadilan'),

(uuid_generate_v4(), 'Bukhari', 52,
 'إِنَّ الْحَلَالَ بَيِّنٌ وَإِنَّ الْحَرَامَ بَيِّنٌ وَبَيْنَهُمَا مُشْتَبِهَاتٌ',
 'Sesungguhnya yang halal itu jelas dan yang haram itu jelas, dan di antara keduanya terdapat perkara-perkara syubhat.',
 'HR. Bukhari No. 52, Muslim No. 1599', 'halal-haram'),

(uuid_generate_v4(), 'Bukhari', 13,
 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
 'Tidaklah sempurna iman seseorang hingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri.',
 'HR. Bukhari No. 13, Muslim No. 45', 'persaudaraan'),

(uuid_generate_v4(), 'Muslim', 2564,
 'لَا تَحَاسَدُوا وَلَا تَنَاجَشُوا وَلَا تَبَاغَضُوا وَلَا تَدَابَرُوا',
 'Janganlah saling hasad, janganlah saling menipu, janganlah saling membenci, dan janganlah saling membelakangi.',
 'HR. Muslim No. 2564', 'persaudaraan'),

(uuid_generate_v4(), 'Tirmidzi', 2516,
 'احْفَظِ اللَّهَ يَحْفَظْكَ احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ',
 'Jagalah Allah, niscaya Allah akan menjagamu. Jagalah Allah, niscaya kamu akan mendapati-Nya di hadapanmu.',
 'HR. Tirmidzi No. 2516', 'tawakkal'),

(uuid_generate_v4(), 'Bukhari', 1423,
 'سَبْعَةٌ يُظِلُّهُمُ اللَّهُ فِي ظِلِّهِ يَوْمَ لَا ظِلَّ إِلَّا ظِلُّهُ',
 'Ada tujuh golongan yang Allah naungi di bawah naungan-Nya pada hari tidak ada naungan kecuali naungan-Nya.',
 'HR. Bukhari No. 1423, Muslim No. 1031', 'amal-saleh'),

(uuid_generate_v4(), 'Bukhari', 6502,
 'إِنَّ اللَّهَ قَالَ مَنْ عَادَى لِي وَلِيًّا فَقَدْ آذَنْتُهُ بِالْحَرْبِ',
 'Sesungguhnya Allah berfirman: Barangsiapa memusuhi wali-Ku, maka Aku umumkan perang kepadanya.',
 'HR. Bukhari No. 6502', 'taqwa'),

(uuid_generate_v4(), 'Arba''in Nawawi', 18,
 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ',
 'Bertakwalah kepada Allah di mana saja engkau berada.',
 'HR. Tirmidzi No. 1987', 'taqwa'),

(uuid_generate_v4(), 'Muslim', 223,
 'الطُّهُورُ شَطْرُ الْإِيمَانِ',
 'Kebersihan adalah sebagian dari iman.',
 'HR. Muslim No. 223', 'kebersihan'),

(uuid_generate_v4(), 'Bukhari', 6116,
 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
 'Orang yang kuat bukanlah yang pandai bergulat, tetapi orang yang kuat adalah yang mampu mengendalikan dirinya ketika marah.',
 'HR. Bukhari No. 6116, Muslim No. 2609', 'sabar'),

(uuid_generate_v4(), 'Tirmidzi', 1924,
 'خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ وَأَنَا خَيْرُكُمْ لِأَهْلِي',
 'Sebaik-baik kalian adalah yang paling baik terhadap keluarganya, dan aku adalah yang paling baik di antara kalian terhadap keluargaku.',
 'HR. Tirmidzi No. 1924', 'keluarga'),

(uuid_generate_v4(), 'Muslim', 2588,
 'إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ',
 'Sesungguhnya Allah tidak melihat kepada rupa kalian dan harta kalian, tetapi Dia melihat kepada hati dan amalan kalian.',
 'HR. Muslim No. 2588', 'ikhlas'),

(uuid_generate_v4(), 'Bukhari', 5997,
 'مَنْ لَا يَرْحَمُ لَا يُرْحَمُ',
 'Barangsiapa tidak menyayangi, maka tidak akan disayangi.',
 'HR. Bukhari No. 5997, Muslim No. 2318', 'kasih-sayang'),

(uuid_generate_v4(), 'Muslim', 2699,
 'مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ',
 'Barangsiapa melapangkan satu kesusahan dunia dari seorang mukmin, Allah akan melapangkan satu kesusahan akhirat darinya.',
 'HR. Muslim No. 2699', 'tolong-menolong'),

(uuid_generate_v4(), 'Bukhari', 1443,
 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ',
 'Sedekah tidak akan mengurangi harta.',
 'HR. Muslim No. 2588', 'sedekah'),

(uuid_generate_v4(), 'Tirmidzi', 2488,
 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ',
 'Mukmin yang kuat lebih baik dan lebih dicintai Allah daripada mukmin yang lemah.',
 'HR. Muslim No. 2664', 'kekuatan'),

(uuid_generate_v4(), 'Bukhari', 6137,
 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
 'Senyummu di hadapan saudaramu adalah sedekah.',
 'HR. Tirmidzi No. 1956', 'sedekah'),

(uuid_generate_v4(), 'Muslim', 2553,
 'الدُّعَاءُ هُوَ الْعِبَادَةُ',
 'Doa adalah ibadah.',
 'HR. Tirmidzi No. 3247', 'doa'),

(uuid_generate_v4(), 'Bukhari', 7405,
 'أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ',
 'Seorang hamba paling dekat kepada Tuhannya adalah ketika ia sedang sujud.',
 'HR. Muslim No. 482', 'shalat'),

(uuid_generate_v4(), 'Tirmidzi', 3522,
 'إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ',
 'Sesungguhnya Allah mencintai jika salah seorang dari kalian mengerjakan suatu pekerjaan, ia menyempurnakannya.',
 'HR. Baihaqi', 'ihsan'),

(uuid_generate_v4(), 'Bukhari', 2442,
 'انْصُرْ أَخَاكَ ظَالِمًا أَوْ مَظْلُومًا',
 'Tolonglah saudaramu yang zalim atau yang dizalimi.',
 'HR. Bukhari No. 2442', 'keadilan'),

(uuid_generate_v4(), 'Muslim', 2607,
 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ',
 'Barangsiapa beriman kepada Allah dan hari akhir, hendaklah memuliakan tamunya.',
 'HR. Bukhari No. 6018', 'akhlak'),

(uuid_generate_v4(), 'Tirmidzi', 2305,
 'كُلُّ ابْنِ آدَمَ خَطَّاءٌ وَخَيْرُ الْخَطَّائِينَ التَّوَّابُونَ',
 'Setiap anak Adam pasti berbuat dosa, dan sebaik-baik orang yang berdosa adalah yang bertaubat.',
 'HR. Tirmidzi No. 2305', 'taubat'),

(uuid_generate_v4(), 'Bukhari', 6064,
 'إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ فِي الْأَمْرِ كُلِّهِ',
 'Sesungguhnya Allah Maha Lembut dan menyukai kelembutan dalam segala urusan.',
 'HR. Bukhari No. 6024, Muslim No. 2593', 'kelembutan');

-- Now we need to reference hadith IDs. We'll use a CTE approach.
-- First, let's assign day numbers to hadiths in order of insertion.
-- We'll create a temp mapping.

DO $$
DECLARE
  hadith_ids uuid[];
  i integer;
BEGIN
  -- Get hadith IDs in insertion order
  SELECT array_agg(id ORDER BY created_at, id) INTO hadith_ids FROM public.hadiths;

  -- 4b. Insert challenges: 3 per day (quran + hadith + habit) = 90 rows
  FOR i IN 1..30 LOOP
    -- QURAN challenge for day i
    INSERT INTO public.challenges (day_number, title, description, challenge_type, reward_points, challenge_date, icon, tips, surah_number, ayah_start, ayah_end)
    VALUES (
      i,
      CASE i
        WHEN 1 THEN 'Baca QS Al-Fatihah'
        WHEN 2 THEN 'Baca QS Al-Baqarah 1-5'
        WHEN 3 THEN 'Baca QS Al-Mulk 1-10'
        WHEN 4 THEN 'Baca QS Yasin 1-12'
        WHEN 5 THEN 'Baca QS Ar-Rahman 1-13'
        WHEN 6 THEN 'Baca QS Al-Waqi''ah 1-14'
        WHEN 7 THEN 'Baca QS Al-Kahfi 1-10'
        WHEN 8 THEN 'Baca QS Maryam 1-15'
        WHEN 9 THEN 'Baca QS Taha 1-8'
        WHEN 10 THEN 'Baca QS Al-Anbiya 1-10'
        WHEN 11 THEN 'Baca QS Al-Mu''minun 1-11'
        WHEN 12 THEN 'Baca QS An-Nur 35-40'
        WHEN 13 THEN 'Baca QS Al-Furqan 63-77'
        WHEN 14 THEN 'Baca QS Luqman 12-19'
        WHEN 15 THEN 'Baca QS As-Sajdah 1-11'
        WHEN 16 THEN 'Baca QS Al-Ahzab 21-24'
        WHEN 17 THEN 'Baca QS Fatir 1-8'
        WHEN 18 THEN 'Baca QS Az-Zumar 53-59'
        WHEN 19 THEN 'Baca QS Ghafir 1-7'
        WHEN 20 THEN 'Baca QS Fussilat 30-36'
        WHEN 21 THEN 'Baca QS Al-Hujurat 10-13'
        WHEN 22 THEN 'Baca QS Adz-Dzariyat 56-58'
        WHEN 23 THEN 'Baca QS Al-Hasyr 21-24'
        WHEN 24 THEN 'Baca QS At-Tahrim 6-8'
        WHEN 25 THEN 'Baca QS Al-Muzammil 1-10'
        WHEN 26 THEN 'Baca QS Al-Insan 1-12'
        WHEN 27 THEN 'Baca QS An-Naba 1-16'
        WHEN 28 THEN 'Baca QS Al-Infitar 1-19'
        WHEN 29 THEN 'Baca QS Al-Ikhlas, Al-Falaq, An-Nas'
        WHEN 30 THEN 'Khatam Doa & Refleksi Qur''an'
      END,
      CASE i
        WHEN 1 THEN 'Baca dan tadabbur QS Al-Fatihah, surah pembuka Al-Qur''an.'
        WHEN 2 THEN 'Baca QS Al-Baqarah ayat 1-5 tentang sifat orang bertaqwa.'
        WHEN 3 THEN 'Baca QS Al-Mulk ayat 1-10 tentang kebesaran Allah.'
        WHEN 4 THEN 'Baca QS Yasin ayat 1-12 sebagai jantung Al-Qur''an.'
        WHEN 5 THEN 'Baca QS Ar-Rahman ayat 1-13 tentang nikmat Allah.'
        WHEN 6 THEN 'Baca QS Al-Waqi''ah tentang hari kiamat.'
        WHEN 7 THEN 'Baca QS Al-Kahfi ayat 1-10, sunnah hari Jumat.'
        WHEN 8 THEN 'Baca QS Maryam tentang kisah Maryam dan Isa AS.'
        WHEN 9 THEN 'Baca QS Taha tentang kisah Musa AS.'
        WHEN 10 THEN 'Baca QS Al-Anbiya tentang kisah para nabi.'
        WHEN 11 THEN 'Baca QS Al-Mu''minun tentang sifat orang beriman.'
        WHEN 12 THEN 'Baca ayat Nur tentang cahaya Allah.'
        WHEN 13 THEN 'Baca sifat-sifat Ibadur Rahman.'
        WHEN 14 THEN 'Baca nasihat Luqman kepada anaknya.'
        WHEN 15 THEN 'Baca QS As-Sajdah tentang penciptaan.'
        WHEN 16 THEN 'Baca tentang teladan Rasulullah.'
        WHEN 17 THEN 'Baca QS Fatir tentang penciptaan alam.'
        WHEN 18 THEN 'Baca tentang rahmat dan ampunan Allah.'
        WHEN 19 THEN 'Baca QS Ghafir tentang Pengampun.'
        WHEN 20 THEN 'Baca tentang malaikat yang menyambut orang beriman.'
        WHEN 21 THEN 'Baca tentang persaudaraan dan adab sosial.'
        WHEN 22 THEN 'Baca tentang tujuan penciptaan manusia.'
        WHEN 23 THEN 'Baca tentang nama-nama Allah yang agung.'
        WHEN 24 THEN 'Baca tentang menjaga keluarga dari api neraka.'
        WHEN 25 THEN 'Baca tentang qiyamul lail.'
        WHEN 26 THEN 'Baca tentang balasan surga bagi orang beriman.'
        WHEN 27 THEN 'Baca tentang hari kiamat.'
        WHEN 28 THEN 'Baca tentang hari pembalasan.'
        WHEN 29 THEN 'Baca 3 surah pelindung sebagai penutup.'
        WHEN 30 THEN 'Doa khatam Qur''an dan refleksi perjalanan tilawah.'
      END,
      'quran', 10, CURRENT_DATE + (i - 1), '📖',
      'Baca dengan tartil dan pahami maknanya.',
      CASE i
        WHEN 1 THEN 1 WHEN 2 THEN 2 WHEN 3 THEN 67 WHEN 4 THEN 36 WHEN 5 THEN 55
        WHEN 6 THEN 56 WHEN 7 THEN 18 WHEN 8 THEN 19 WHEN 9 THEN 20 WHEN 10 THEN 21
        WHEN 11 THEN 23 WHEN 12 THEN 24 WHEN 13 THEN 25 WHEN 14 THEN 31 WHEN 15 THEN 32
        WHEN 16 THEN 33 WHEN 17 THEN 35 WHEN 18 THEN 39 WHEN 19 THEN 40 WHEN 20 THEN 41
        WHEN 21 THEN 49 WHEN 22 THEN 51 WHEN 23 THEN 59 WHEN 24 THEN 66 WHEN 25 THEN 73
        WHEN 26 THEN 76 WHEN 27 THEN 78 WHEN 28 THEN 82 WHEN 29 THEN 112 WHEN 30 THEN NULL
      END,
      CASE i
        WHEN 1 THEN 1 WHEN 2 THEN 1 WHEN 3 THEN 1 WHEN 4 THEN 1 WHEN 5 THEN 1
        WHEN 6 THEN 1 WHEN 7 THEN 1 WHEN 8 THEN 1 WHEN 9 THEN 1 WHEN 10 THEN 1
        WHEN 11 THEN 1 WHEN 12 THEN 35 WHEN 13 THEN 63 WHEN 14 THEN 12 WHEN 15 THEN 1
        WHEN 16 THEN 21 WHEN 17 THEN 1 WHEN 18 THEN 53 WHEN 19 THEN 1 WHEN 20 THEN 30
        WHEN 21 THEN 10 WHEN 22 THEN 56 WHEN 23 THEN 21 WHEN 24 THEN 6 WHEN 25 THEN 1
        WHEN 26 THEN 1 WHEN 27 THEN 1 WHEN 28 THEN 1 WHEN 29 THEN 1 WHEN 30 THEN NULL
      END,
      CASE i
        WHEN 1 THEN 7 WHEN 2 THEN 5 WHEN 3 THEN 10 WHEN 4 THEN 12 WHEN 5 THEN 13
        WHEN 6 THEN 14 WHEN 7 THEN 10 WHEN 8 THEN 15 WHEN 9 THEN 8 WHEN 10 THEN 10
        WHEN 11 THEN 11 WHEN 12 THEN 40 WHEN 13 THEN 77 WHEN 14 THEN 19 WHEN 15 THEN 11
        WHEN 16 THEN 24 WHEN 17 THEN 8 WHEN 18 THEN 59 WHEN 19 THEN 7 WHEN 20 THEN 36
        WHEN 21 THEN 13 WHEN 22 THEN 58 WHEN 23 THEN 24 WHEN 24 THEN 8 WHEN 25 THEN 10
        WHEN 26 THEN 12 WHEN 27 THEN 16 WHEN 28 THEN 19 WHEN 29 THEN 5 WHEN 30 THEN NULL
      END
    );

    -- HADITH challenge for day i
    INSERT INTO public.challenges (day_number, title, description, challenge_type, reward_points, challenge_date, icon, tips, hadith_id)
    VALUES (
      i,
      'Murojaah Hadits Hari ' || i,
      'Baca, pahami, dan renungkan hadits hari ini. Tandai selesai setelah murojaah.',
      'hadith', 10, CURRENT_DATE + (i - 1), '📜',
      'Baca artinya dan coba hafal inti pesannya.',
      hadith_ids[i]
    );

    -- HABIT challenge for day i
    INSERT INTO public.challenges (day_number, title, description, challenge_type, reward_points, challenge_date, icon, tips)
    VALUES (
      i,
      CASE i
        WHEN 1 THEN 'Niat & Doa Awal Ramadhan'
        WHEN 2 THEN 'Shalat Tarawih Berjamaah'
        WHEN 3 THEN 'Sedekah untuk Tetangga'
        WHEN 4 THEN 'Sahur Sebelum Imsak'
        WHEN 5 THEN 'Puasa Tanpa Mengeluh'
        WHEN 6 THEN 'Doa Berbuka Puasa'
        WHEN 7 THEN 'Shalat Dhuha'
        WHEN 8 THEN 'Dzikir Pagi & Petang'
        WHEN 9 THEN 'Infaq Online'
        WHEN 10 THEN 'Silaturahmi via Chat'
        WHEN 11 THEN 'Tilawah Bersama Keluarga'
        WHEN 12 THEN 'Berbagi Takjil'
        WHEN 13 THEN 'Istighfar 100 Kali'
        WHEN 14 THEN 'Kunjungi Saudara'
        WHEN 15 THEN 'Evaluasi Tengah Ramadhan'
        WHEN 16 THEN 'Shalat Tahajud'
        WHEN 17 THEN 'Belajar Ilmu Agama'
        WHEN 18 THEN 'Maafkan Seseorang'
        WHEN 19 THEN 'Bersihkan Masjid'
        WHEN 20 THEN 'Zakat Fitrah'
        WHEN 21 THEN 'Iktikaf di Masjid'
        WHEN 22 THEN 'Cari Lailatul Qadr'
        WHEN 23 THEN 'Tadabbur & Renungan'
        WHEN 24 THEN 'Bantu Anak Yatim'
        WHEN 25 THEN 'Shalawat 1000 Kali'
        WHEN 26 THEN 'Surat untuk Orang Tua'
        WHEN 27 THEN 'Bersih-bersih Rumah'
        WHEN 28 THEN 'Persiapan Lebaran'
        WHEN 29 THEN 'Takbiran Idul Fitri'
        WHEN 30 THEN 'Refleksi & Komitmen'
      END,
      CASE i
        WHEN 1 THEN 'Perbaiki niat puasa dan baca doa menyambut Ramadhan.'
        WHEN 2 THEN 'Laksanakan shalat Tarawih berjamaah di masjid.'
        WHEN 3 THEN 'Berikan sesuatu kepada tetangga, bisa makanan atau minuman.'
        WHEN 4 THEN 'Bangun untuk sahur dan makan sebelum imsak.'
        WHEN 5 THEN 'Jaga lisan sepanjang hari, hindari mengeluh.'
        WHEN 6 THEN 'Hafal dan amalkan doa berbuka puasa.'
        WHEN 7 THEN 'Tunaikan shalat Dhuha minimal 2 rakaat.'
        WHEN 8 THEN 'Baca dzikir pagi setelah Subuh dan dzikir petang setelah Ashar.'
        WHEN 9 THEN 'Sisihkan rezeki untuk berinfaq melalui platform donasi.'
        WHEN 10 THEN 'Kirim pesan silaturahmi kepada teman atau kerabat.'
        WHEN 11 THEN 'Ajak keluarga untuk tilawah bersama setelah Maghrib.'
        WHEN 12 THEN 'Siapkan takjil dan bagikan kepada orang di sekitarmu.'
        WHEN 13 THEN 'Perbanyak istighfar minimal 100 kali sepanjang hari.'
        WHEN 14 THEN 'Kunjungi atau hubungi saudara untuk mempererat silaturahmi.'
        WHEN 15 THEN 'Evaluasi ibadah 15 hari pertama, tingkatkan untuk sisa Ramadhan.'
        WHEN 16 THEN 'Bangun sebelum sahur untuk shalat Tahajud minimal 2 rakaat.'
        WHEN 17 THEN 'Ikuti kajian atau tonton ceramah untuk menambah ilmu.'
        WHEN 18 THEN 'Buka hati untuk memaafkan seseorang yang pernah menyakitimu.'
        WHEN 19 THEN 'Bantu membersihkan masjid atau mushola di lingkunganmu.'
        WHEN 20 THEN 'Tunaikan zakat fitrah untuk diri sendiri dan keluarga.'
        WHEN 21 THEN 'Luangkan waktu untuk iktikaf di masjid.'
        WHEN 22 THEN 'Perbanyak ibadah di malam ganjil 10 hari terakhir.'
        WHEN 23 THEN 'Baca tafsir dari ayat yang sering dibaca.'
        WHEN 24 THEN 'Berikan bantuan atau perhatian kepada anak yatim.'
        WHEN 25 THEN 'Perbanyak shalawat minimal 1000 kali.'
        WHEN 26 THEN 'Tulis pesan apresiasi atau doa untuk orang tua.'
        WHEN 27 THEN 'Bersihkan rumah dan rapikan barang untuk Lebaran.'
        WHEN 28 THEN 'Siapkan baju dan keperluan Idul Fitri.'
        WHEN 29 THEN 'Ikuti takbiran bersama di masjid atau lingkungan.'
        WHEN 30 THEN 'Refleksikan 30 hari dan komitmen lanjutkan kebiasaan baik.'
      END,
      'habit', 10, CURRENT_DATE + (i - 1), '🕌',
      CASE i
        WHEN 1 THEN 'Baca doa: "Allahumma ahillahu alaina bil amni wal iman..."'
        WHEN 2 THEN 'Datang lebih awal dan ikuti hingga witir.'
        WHEN 3 THEN 'Siapkan takjil atau makanan berbuka.'
        WHEN 4 THEN 'Makan bergizi dan perbanyak air putih.'
        WHEN 5 THEN 'Ganti keluhan dengan dzikir atau istighfar.'
        WHEN 6 THEN 'Doa: "Allahumma laka sumtu wa ala rizqika aftartu..."'
        WHEN 7 THEN '15-30 menit setelah matahari terbit.'
        WHEN 8 THEN 'Gunakan buku Al-Ma''tsurat sebagai panduan.'
        WHEN 9 THEN 'Sedekah konsisten, meski sedikit.'
        WHEN 10 THEN 'Hubungi 3 orang yang sudah lama tidak berkomunikasi.'
        WHEN 11 THEN 'Bergantian membaca dan saling koreksi tajwid.'
        WHEN 12 THEN 'Bisa kurma, es buah, atau gorengan sederhana.'
        WHEN 13 THEN 'Baca "Astaghfirullahal adzim" di sela aktivitas.'
        WHEN 14 THEN 'Jika tidak bisa bertemu, kirim pesan atau telepon.'
        WHEN 15 THEN 'Catat pencapaian dan target yang belum tercapai.'
        WHEN 16 THEN 'Waktu terbaik: sepertiga malam terakhir.'
        WHEN 17 THEN 'Catat poin-poin penting dari kajian.'
        WHEN 18 THEN 'Mulai dengan mendoakan kebaikan untuk orang tersebut.'
        WHEN 19 THEN 'Ajak teman atau tetangga untuk gotong royong.'
        WHEN 20 THEN 'Bayar sebelum shalat Ied agar lebih afdhal.'
        WHEN 21 THEN 'Manfaatkan untuk membaca Quran, dzikir, dan berdoa.'
        WHEN 22 THEN 'Doa: "Allahumma innaka afuwwun tuhibbul afwa fa''fu anni."'
        WHEN 23 THEN 'Gunakan aplikasi Quran dengan tafsir bahasa Indonesia.'
        WHEN 24 THEN 'Bisa donasi, hadiah, atau waktu bermain bersama.'
        WHEN 25 THEN 'Baca shalawat singkat di sela-sela aktivitas.'
        WHEN 26 THEN 'Sampaikan langsung atau kirim via pesan.'
        WHEN 27 THEN 'Libatkan seluruh anggota keluarga.'
        WHEN 28 THEN 'Potong kuku, mandi, pakai wangi-wangian.'
        WHEN 29 THEN 'Nikmati malam takbiran bersama saudara seiman.'
        WHEN 30 THEN 'Tulis 3 kebiasaan baik yang ingin dipertahankan.'
      END
    );
  END LOOP;
END $$;

-- 4c. Badges
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value) VALUES
('Pemula', 'Selesaikan tantangan pertama', '🌟', 'completion', 1),
('📖 7 Hari Qur''an', 'Baca Qur''an 7 hari berturut-turut', '📖', 'quran_streak', 7),
('📜 7 Hari Hadits', 'Murojaah hadits 7 hari berturut-turut', '📜', 'hadith_streak', 7),
('🔥 Konsisten', 'Streak 7 hari berturut-turut', '🔥', 'streak', 7),
('⭐ Tekun', 'Streak 14 hari berturut-turut', '⭐', 'streak', 14),
('💎 Istiqomah', 'Streak 21 hari berturut-turut', '💎', 'streak', 21),
('🏆 Juara Ramadhan', '30 hari perfect Ramadhan', '🏆', 'streak', 30),
('💰 Dermawan', 'Kumpulkan 500 poin', '💰', 'points', 500);

-- Force schema cache reload
NOTIFY pgrst, 'reload schema';
