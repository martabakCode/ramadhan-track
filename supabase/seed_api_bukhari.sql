-- ============================================================
-- SEED DATA FOR RAMADHAN APP (API VERSION - FIXED)
-- Uses 'bukhari' for Hadith API reliability
-- ============================================================

-- 1. Clean up
DELETE FROM public.user_daily_progress;
DELETE FROM public.challenges;
DELETE FROM public.badges;

-- 2. Insert Challenges

-- TRACK 1: HABIT (Same as before)
INSERT INTO public.challenges (day_number, title, description, challenge_type, reward_points, challenge_date, icon, tips, payload) VALUES
(1, 'Niat & Target Ramadhan', 'Perbarui niat puasa dan tulis 3 target ibadah Ramadhan tahun ini.', 'habit', 10, CURRENT_DATE, '🤲', 'Tulis target realistis: khatam 1x, sedekah rutin, dll.', null),
(2, 'Tarawih Full Sampai Witir', 'Shalat Tarawih berjamaah dan usahakan tidak pulang sebelum witir.', 'habit', 10, CURRENT_DATE + 1, '🕌', 'Datang lebih awal agar dapat saf depan.', null),
(3, 'Hindari Debat Kusir', 'Jaga lisan dari perdebatan yang tidak bermanfaat, meski kamu benar.', 'habit', 15, CURRENT_DATE + 2, '🤐', 'Lebih baik diam daripada menyakiti hati orang lain.', null),
(4, 'Sedekah Menu Berbuka', 'Traktir atau kirim makanan berbuka untuk orang lain.', 'habit', 15, CURRENT_DATE + 3, '🍱', 'Utamakan orang yang sedang berpuasa.', null),
(5, 'Puasa Tanpa Ghibah', 'Hari ini zero ghibah, zero gosip, zero debat tidak penting.', 'habit', 20, CURRENT_DATE + 4, '🤐', 'Kalau mulai gosip, alihkan topik.', null),
(6, 'Doa Mustajab Sebelum Maghrib', 'Luangkan 10 menit sebelum adzan Maghrib untuk doa khusus.', 'habit', 15, CURRENT_DATE + 5, '🌅', 'Waktu menjelang berbuka adalah waktu mustajab.', null),
(7, 'Sahur Sunnah Nabi', 'Bangun sahur dan akhirkan waktu sahur mendekati imsak.', 'habit', 10, CURRENT_DATE + 6, '🌙', 'Tambahkan kurma dan air putih.', null),
(8, 'Jumat Berkah', 'Lakukan satu kebaikan ekstra di hari Jumat ini.', 'habit', 15, CURRENT_DATE + 7, '🕌', 'Bisa sedekah, shalawat, atau baca Al-Kahfi.', null),
(9, 'Infaq Harian Ramadhan', 'Mulai kebiasaan infaq kecil tapi setiap hari.', 'habit', 15, CURRENT_DATE + 8, '💝', 'Tidak harus besar, yang penting rutin.', null),
(10, 'Dzikir 100x Setelah Shalat', 'Tambahkan dzikir tasbih, tahmid, takbir setelah shalat wajib.', 'habit', 15, CURRENT_DATE + 9, '📿', '33x Tasbih, 33x Tahmid, 34x Takbir.', null),
(11, 'Tilawah Ba’da Subuh', 'Luangkan waktu tilawah setelah Subuh.', 'habit', 20, CURRENT_DATE + 10, '🌄', 'Biasakan sebelum aktivitas kerja/kampus.', null),
(12, 'Berbagi Takjil di Jalan', 'Bagikan takjil kepada pengendara atau pejalan kaki.', 'habit', 15, CURRENT_DATE + 11, '🍹', 'Niatkan untuk membantu orang berbuka tepat waktu.', null),
(13, 'Istighfar 500x', 'Perbanyak istighfar sepanjang hari.', 'habit', 20, CURRENT_DATE + 12, '🤲', 'Bisa dicicil setiap selesai shalat.', null),
(14, 'Silaturahmi Ramadhan', 'Hubungi kerabat yang jarang kontak.', 'habit', 20, CURRENT_DATE + 13, '📞', 'Mulai dengan minta maaf menjelang Idul Fitri.', null),
(15, 'Mid-Ramadhan Checkpoint', 'Evaluasi progres ibadah dan perbaiki kekurangan.', 'habit', 20, CURRENT_DATE + 14, '📊', 'Tingkatkan kualitas, bukan hanya kuantitas.', null),
(16, 'Qiyamul Lail Challenge', 'Bangun malam untuk Tahajud minimal 2 rakaat.', 'habit', 30, CURRENT_DATE + 15, '🌌', 'Set alarm 30 menit sebelum sahur.', null),
(17, 'Ngaji Tafsir 30 Menit', 'Pelajari tafsir ayat yang dibaca hari ini.', 'habit', 20, CURRENT_DATE + 16, '📚', 'Gunakan tafsir bahasa Indonesia.', null),
(18, 'Memaafkan Sebelum Idul Fitri', 'Maafkan orang yang pernah menyakiti.', 'habit', 30, CURRENT_DATE + 17, '🤍', 'Mulai dengan doa untuknya.', null),
(19, 'Sedekah Terbaikmu', 'Berikan sedekah terbaik di 10 hari terakhir.', 'habit', 25, CURRENT_DATE + 18, '💎', 'Fokus pada malam ganjil.', null),
(20, 'Bayar Zakat Fitrah', 'Tunaikan zakat sebelum hari raya.', 'habit', 15, CURRENT_DATE + 19, '🌾', 'Utamakan sebelum shalat Ied.', null),
(21, 'Iktikaf 1 Jam', 'Luangkan minimal 1 jam untuk i’tikaf.', 'habit', 30, CURRENT_DATE + 20, '🕌', 'Fokus dzikir dan doa.', null),
(22, 'Malam Ganjil Extra Ibadah', 'Tambahkan ibadah di malam ganjil.', 'habit', 30, CURRENT_DATE + 21, '✨', 'Baca doa Lailatul Qadr.', null),
(23, 'Sedekah Subuh', 'Sedekah setelah Subuh.', 'habit', 20, CURRENT_DATE + 22, '🌄', 'Transfer atau langsung beri ke yang membutuhkan.', null),
(24, 'Khatam Target Check', 'Cek apakah target khatam sudah tercapai, kejar jika belum.', 'habit', 40, CURRENT_DATE + 23, '📖', 'Manfaatkan waktu luang.', null),
(25, 'Takbiran & Syukur', 'Perbanyak takbir menjelang Idul Fitri.', 'habit', 15, CURRENT_DATE + 24, '🕌', 'Baca takbir setelah Maghrib terakhir Ramadhan.', null),
(26, 'Sedekah Pakaian Layak', 'Berikan pakaian layak untuk yang membutuhkan.', 'habit', 20, CURRENT_DATE + 25, '👕', 'Pastikan kondisi masih bagus.', null),
(27, 'Doa untuk Orang Tua', 'Doakan kedua orang tua secara khusus.', 'habit', 15, CURRENT_DATE + 26, '🤲', 'Rabbighfirli waliwalidayya.', null),
(28, 'Bersih Hati Sebelum Lebaran', 'Minta maaf kepada keluarga terdekat.', 'habit', 20, CURRENT_DATE + 27, '🤝', 'Sampaikan dengan tulus.', null),
(29, 'Persiapan Shalat Ied', 'Siapkan diri untuk shalat Ied.', 'habit', 15, CURRENT_DATE + 28, '🌙', 'Mandi sunnah dan pakai wangi-wangian.', null),
(30, 'Komitmen Pasca Ramadhan', 'Tulis komitmen menjaga amalan setelah Ramadhan.', 'habit', 25, CURRENT_DATE + 29, '📓', 'Minimal 3 amalan yang dipertahankan.', null);

-- TRACK 2: QURAN (One Day One Juz)
INSERT INTO public.challenges (day_number, title, description, challenge_type, reward_points, challenge_date, icon, tips, payload)
SELECT 
    d, 
    'One Day One Juz: Juz ' || d, 
    'Baca Al-Qur''an Juz ' || d || ' hari ini. Sempatkan waktu setelah shalat fardhu.',
    'quran',
    30,
    CURRENT_DATE + (d - 1),
    '📖',
    'Bagi menjadi 2 lembar setiap selesai shalat fardhu.',
    jsonb_build_object('type', 'quran', 'juz', d)
FROM generate_series(1, 30) as d;

-- TRACK 3: HADITH (Bukhari Pilihan)
-- Use 'bukhari' for reliability.
INSERT INTO public.challenges (day_number, title, description, challenge_type, reward_points, challenge_date, icon, tips, payload)
SELECT 
    d, 
    'Hadits Bukhari No. ' || d, 
    'Baca dan renungkan makna Hadits Bukhari nomor ' || d || '.',
    'hadith',
    20,
    CURRENT_DATE + (d - 1),
    '📜',
    'Baca terjemahan dan ambil pelajaran utamanya.',
    jsonb_build_object('type', 'hadith', 'source', 'bukhari', 'number', d)
FROM generate_series(1, 30) as d;

-- 3. Insert Badges (Same as before)
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value) VALUES
('Awal yang Baik', 'Menyelesaikan tantangan hari pertama', '🌱', 'streak', 1),
('Pejuang Ramadhan', 'Menjaga streak selama 7 hari berturut-turut', '🔥', 'streak', 7),
('Istiqomah', 'Menjaga streak selama 14 hari berturut-turut', '⭐', 'streak', 14),
('Lailatul Qadr Hunter', 'Menjaga streak selama 20 hari berturut-turut', '💎', 'streak', 20),
('Ramadhan Champion', 'Menyelesaikan tantangan selama 30 hari penuh!', '🏆', 'streak', 30),
('Ahli Ibadah', 'Mengumpulkan 100 poin', 'koin_perunggu', 'points', 100),
('Sultan Pahala', 'Mengumpulkan 500 poin', 'koin_perak', 'points', 500),
('Master Taqwa', 'Mengumpulkan 1000 poin', 'koin_emas', 'points', 1000);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
