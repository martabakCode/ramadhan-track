-- Seed data for Challenges
-- Run this in Supabase SQL Editor AFTER running schema.sql

-- Clear existing data if needed (optional)
DELETE FROM public.challenges;

INSERT INTO public.challenges (day_number, title, description, category, difficulty, reward_points, challenge_date, icon, tips) VALUES
(1, 'Niat & Target Ramadhan', 'Perbarui niat puasa dan tulis 3 target ibadah Ramadhan tahun ini.', 'doa', 'easy', 10, CURRENT_DATE, '🤲', 'Tulis target realistis: khatam 1x, sedekah rutin, dll.'),

(2, 'Tarawih Full Sampai Witir', 'Shalat Tarawih berjamaah dan usahakan tidak pulang sebelum witir.', 'ibadah', 'easy', 10, CURRENT_DATE + 1, '🕌', 'Datang lebih awal agar dapat saf depan.'),

(3, 'One Day One Juz', 'Mulai komitmen 1 hari 1 juz agar bisa khatam 30 hari.', 'quran', 'medium', 20, CURRENT_DATE + 2, '📖', 'Bagi 4 sesi agar tidak terasa berat.'),

(4, 'Sedekah Menu Berbuka', 'Traktir atau kirim makanan berbuka untuk orang lain.', 'sedekah', 'easy', 15, CURRENT_DATE + 3, '🍱', 'Utamakan orang yang sedang berpuasa.'),

(5, 'Puasa Tanpa Ghibah', 'Hari ini zero ghibah, zero gosip, zero debat tidak penting.', 'akhlak', 'medium', 20, CURRENT_DATE + 4, '🤐', 'Kalau mulai gosip, alihkan topik.'),

(6, 'Doa Mustajab Sebelum Maghrib', 'Luangkan 10 menit sebelum adzan Maghrib untuk doa khusus.', 'doa', 'easy', 15, CURRENT_DATE + 5, '🌅', 'Waktu menjelang berbuka adalah waktu mustajab.'),

(7, 'Sahur Sunnah Nabi', 'Bangun sahur dan akhirkan waktu sahur mendekati imsak.', 'puasa', 'easy', 10, CURRENT_DATE + 6, '🌙', 'Tambahkan kurma dan air putih.'),

(8, 'Jumat Berkah Al-Kahfi', 'Jika Jumat, baca Surah Al-Kahfi lengkap.', 'quran', 'medium', 20, CURRENT_DATE + 7, '📖', 'Baca pagi atau setelah Ashar.'),

(9, 'Infaq Harian Ramadhan', 'Mulai kebiasaan infaq kecil tapi setiap hari.', 'sedekah', 'easy', 15, CURRENT_DATE + 8, '💝', 'Tidak harus besar, yang penting rutin.'),

(10, 'Dzikir 100x Setelah Shalat', 'Tambahkan dzikir tasbih, tahmid, takbir setelah shalat wajib.', 'doa', 'easy', 15, CURRENT_DATE + 9, '📿', '33x Tasbih, 33x Tahmid, 34x Takbir.'),

(11, 'Tilawah Ba’da Subuh', 'Luangkan waktu tilawah setelah Subuh.', 'quran', 'medium', 20, CURRENT_DATE + 10, '🌄', 'Biasakan sebelum aktivitas kerja/kampus.'),

(12, 'Berbagi Takjil di Jalan', 'Bagikan takjil kepada pengendara atau pejalan kaki.', 'sedekah', 'easy', 15, CURRENT_DATE + 11, '🍹', 'Niatkan untuk membantu orang berbuka tepat waktu.'),

(13, 'Istighfar 500x', 'Perbanyak istighfar sepanjang hari.', 'doa', 'medium', 20, CURRENT_DATE + 12, '🤲', 'Bisa dicicil setiap selesai shalat.'),

(14, 'Silaturahmi Ramadhan', 'Hubungi kerabat yang jarang kontak.', 'akhlak', 'medium', 20, CURRENT_DATE + 13, '📞', 'Mulai dengan minta maaf menjelang Idul Fitri.'),

(15, 'Mid-Ramadhan Checkpoint', 'Evaluasi progres ibadah dan perbaiki kekurangan.', 'ilmu', 'medium', 20, CURRENT_DATE + 14, '📊', 'Tingkatkan kualitas, bukan hanya kuantitas.'),

(16, 'Qiyamul Lail Challenge', 'Bangun malam untuk Tahajud minimal 2 rakaat.', 'ibadah', 'hard', 30, CURRENT_DATE + 15, '🌌', 'Set alarm 30 menit sebelum sahur.'),

(17, 'Ngaji Tafsir 30 Menit', 'Pelajari tafsir ayat yang dibaca hari ini.', 'ilmu', 'medium', 20, CURRENT_DATE + 16, '📚', 'Gunakan tafsir bahasa Indonesia.'),

(18, 'Memaafkan Sebelum Idul Fitri', 'Maafkan orang yang pernah menyakiti.', 'akhlak', 'hard', 30, CURRENT_DATE + 17, '🤍', 'Mulai dengan doa untuknya.'),

(19, 'Sedekah Terbaikmu', 'Berikan sedekah terbaik di 10 hari terakhir.', 'sedekah', 'medium', 25, CURRENT_DATE + 18, '💎', 'Fokus pada malam ganjil.'),

(20, 'Bayar Zakat Fitrah', 'Tunaikan zakat sebelum hari raya.', 'sedekah', 'easy', 15, CURRENT_DATE + 19, '🌾', 'Utamakan sebelum shalat Ied.'),

(21, 'Iktikaf 1 Jam', 'Luangkan minimal 1 jam untuk i’tikaf.', 'ibadah', 'hard', 30, CURRENT_DATE + 20, '🕌', 'Fokus dzikir dan doa.'),

(22, 'Malam Ganjil Extra Ibadah', 'Tambahkan ibadah di malam ganjil.', 'ibadah', 'hard', 30, CURRENT_DATE + 21, '✨', 'Baca doa Lailatul Qadr.'),

(23, 'Sedekah Subuh', 'Sedekah setelah Subuh.', 'sedekah', 'medium', 20, CURRENT_DATE + 22, '🌄', 'Transfer atau langsung beri ke yang membutuhkan.'),

(24, 'Khatam Qur’an', 'Selesaikan target khatam Ramadhan.', 'quran', 'hard', 40, CURRENT_DATE + 23, '📖', 'Bisa khatam bersama keluarga.'),

(25, 'Takbiran & Syukur', 'Perbanyak takbir menjelang Idul Fitri.', 'ibadah', 'easy', 15, CURRENT_DATE + 24, '🕌', 'Baca takbir setelah Maghrib terakhir Ramadhan.'),

(26, 'Sedekah Pakaian Layak', 'Berikan pakaian layak untuk yang membutuhkan.', 'sedekah', 'medium', 20, CURRENT_DATE + 25, '👕', 'Pastikan kondisi masih bagus.'),

(27, 'Doa untuk Orang Tua', 'Doakan kedua orang tua secara khusus.', 'doa', 'easy', 15, CURRENT_DATE + 26, '🤲', 'Rabbighfirli waliwalidayya.'),

(28, 'Bersih Hati Sebelum Lebaran', 'Minta maaf kepada keluarga terdekat.', 'akhlak', 'medium', 20, CURRENT_DATE + 27, '🤝', 'Sampaikan dengan tulus.'),

(29, 'Persiapan Shalat Ied', 'Siapkan diri untuk shalat Ied.', 'ibadah', 'easy', 15, CURRENT_DATE + 28, '🌙', 'Mandi sunnah dan pakai wangi-wangian.'),

(30, 'Komitmen Pasca Ramadhan', 'Tulis komitmen menjaga amalan setelah Ramadhan.', 'ilmu', 'medium', 25, CURRENT_DATE + 29, '📓', 'Minimal 3 amalan yang dipertahankan.');

-- Insert Badges
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value) VALUES
('Pemula', 'Selesaikan tantangan pertama', '🌟', 'completion', 1),
('Konsisten', 'Streak 7 hari berturut-turut', '🔥', 'streak', 7),
('Tekun', 'Streak 14 hari berturut-turut', '⭐', 'streak', 14),
('Istiqomah', 'Streak 21 hari berturut-turut', '💎', 'streak', 21),
('Juara Ramadhan', 'Selesaikan semua 30 tantangan', '🏆', 'completion', 30),
('Dermawan', 'Kumpulkan 500 poin', '💰', 'points', 500);
