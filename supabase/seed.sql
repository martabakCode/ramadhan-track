-- Seed data for Challenges
-- Run this in Supabase SQL Editor AFTER running schema.sql

-- Clear existing data if needed (optional)
-- DELETE FROM public.challenges;

INSERT INTO public.challenges (day_number, title, description, category, difficulty, reward_points, challenge_date, icon, tips) VALUES
(1, 'Niat dan Doa Awal Ramadhan', 'Perbaiki niat puasa dan baca doa menyambut Ramadhan. Jadikan momen ini sebagai awal perubahan positif.', 'doa', 'easy', 10, CURRENT_DATE, '🤲', 'Baca doa: "Allahumma ahillahu alaina bil amni wal iman..."'),
(2, 'Shalat Tarawih Berjamaah', 'Laksanakan shalat Tarawih berjamaah di masjid terdekat.', 'ibadah', 'easy', 10, CURRENT_DATE + 1, '🕌', 'Usahakan datang lebih awal dan ikuti hingga witir.'),
(3, 'Baca 1 Juz Al-Quran', 'Mulai target khatam dengan membaca minimal 1 juz Al-Qur''an hari ini.', 'quran', 'medium', 20, CURRENT_DATE + 2, '📖', 'Bagi bacaan: setelah Subuh, Dzuhur, dan setelah Tarawih.'),
(4, 'Sedekah untuk Tetangga', 'Berikan sesuatu kepada tetangga, bisa berupa makanan atau minuman.', 'sedekah', 'easy', 10, CURRENT_DATE + 3, '💝', 'Siapkan takjil atau makanan berbuka untuk tetangga.'),
(5, 'Puasa Tanpa Mengeluh', 'Jaga lisan sepanjang hari, hindari mengeluh dan berkata negatif.', 'akhlak', 'medium', 20, CURRENT_DATE + 4, '🤝', 'Ganti keluhan dengan dzikir atau istighfar.'),
(6, 'Doa Sebelum Berbuka', 'Hafal dan amalkan doa berbuka puasa dengan penuh kekhusyukan.', 'doa', 'easy', 10, CURRENT_DATE + 5, '🤲', 'Doa berbuka: "Allahumma laka sumtu wa ala rizqika aftartu..."'),
(7, 'Shalat Dhuha', 'Tunaikan shalat Dhuha minimal 2 rakaat di pagi hari.', 'ibadah', 'easy', 10, CURRENT_DATE + 6, '🕌', 'Waktu terbaik: sekitar 15-30 menit setelah matahari terbit.'),
(8, 'Baca Surah Al-Kahfi', 'Jika hari Jumat, baca Surah Al-Kahfi. Jika tidak, lanjutkan target 1 juz.', 'quran', 'medium', 20, CURRENT_DATE + 7, '📖', 'Pahami makna dan tadabbur ayat yang dibaca.'),
(9, 'Infaq Online', 'Sisihkan sebagian rezeki untuk berinfaq melalui platform donasi.', 'sedekah', 'easy', 10, CURRENT_DATE + 8, '💝', 'Sedekah terbaik adalah yang konsisten, meski sedikit.'),
(10, 'Sahur Sebelum Imsak', 'Bangun untuk sahur dan makan sebelum imsak, jangan skip sahur!', 'puasa', 'easy', 10, CURRENT_DATE + 9, '🌙', 'Makan makanan bergizi dan perbanyak air putih saat sahur.'),
(11, 'Tilawah Bersama Keluarga', 'Ajak keluarga untuk tilawah Al-Qur''an bersama setelah Maghrib.', 'quran', 'medium', 20, CURRENT_DATE + 10, '📖', 'Bergantian membaca dan saling koreksi tajwid.'),
(12, 'Berbagi Takjil', 'Siapkan takjil dan bagikan kepada orang-orang di sekitarmu.', 'sedekah', 'easy', 10, CURRENT_DATE + 11, '💝', 'Bisa berupa kurma, es buah, atau gorengan sederhana.'),
(13, 'Istighfar 100 Kali', 'Perbanyak istighfar minimal 100 kali sepanjang hari.', 'doa', 'easy', 10, CURRENT_DATE + 12, '🤲', 'Baca: "Astaghfirullahal adzim" di sela-sela aktivitas.'),
(14, 'Silaturahmi ke Saudara', 'Kunjungi atau hubungi saudara/kerabat untuk mempererat silaturahmi.', 'akhlak', 'medium', 20, CURRENT_DATE + 13, '🤝', 'Jika tidak bisa bertemu, kirim pesan atau telepon.'),
(15, 'Evaluasi Setengah Ramadhan', 'Evaluasi ibadah 15 hari pertama dan tingkatkan untuk 15 hari ke depan.', 'ilmu', 'medium', 20, CURRENT_DATE + 14, '📚', 'Catat pencapaian dan target yang belum tercapai.'),
(16, 'Shalat Tahajud', 'Bangun sebelum sahur untuk shalat Tahajud minimal 2 rakaat.', 'ibadah', 'hard', 30, CURRENT_DATE + 15, '🕌', 'Waktu terbaik: sepertiga malam terakhir.'),
(17, 'Belajar Ilmu Agama', 'Ikuti kajian atau tonton ceramah untuk menambah ilmu agama.', 'ilmu', 'medium', 20, CURRENT_DATE + 16, '📚', 'Catat poin-poin penting dari kajian yang dipelajari.'),
(18, 'Maafkan Seseorang', 'Buka hati untuk memaafkan seseorang yang pernah menyakitimu.', 'akhlak', 'hard', 30, CURRENT_DATE + 17, '🤝', 'Mulai dengan mendoakan kebaikan untuk orang tersebut.'),
(19, 'Bersihkan Masjid', 'Bantu membersihkan masjid atau mushola di lingkunganmu.', 'ibadah', 'medium', 20, CURRENT_DATE + 18, '🕌', 'Ajak teman atau tetangga untuk gotong royong.'),
(20, 'Zakat Fitrah', 'Tunaikan zakat fitrah untuk diri sendiri dan keluarga.', 'sedekah', 'easy', 10, CURRENT_DATE + 19, '💝', 'Bayar sebelum shalat Ied agar lebih afdhal.'),
(21, 'Iktikaf di Masjid', 'Luangkan waktu untuk iktikaf di masjid, meski hanya beberapa jam.', 'ibadah', 'hard', 30, CURRENT_DATE + 20, '🕌', 'Manfaatkan untuk membaca Quran, dzikir, dan berdoa.'),
(22, 'Malam Lailatul Qadr', 'Perbanyak ibadah di malam ganjil 10 hari terakhir Ramadhan.', 'ibadah', 'hard', 30, CURRENT_DATE + 21, '🕌', 'Baca doa: "Allahumma innaka afuwwun tuhibbul afwa fa''fu anni."'),
(23, 'Tadabbur Al-Quran', 'Baca tafsir dari ayat yang sering kamu baca dalam Al-Qur''an.', 'quran', 'medium', 20, CURRENT_DATE + 22, '📖', 'Gunakan aplikasi Quran dengan tafsir bahasa Indonesia.'),
(24, 'Bantu Anak Yatim', 'Berikan bantuan atau perhatian kepada anak yatim di sekitarmu.', 'sedekah', 'medium', 20, CURRENT_DATE + 23, '💝', 'Bisa berupa donasi, hadiah, atau waktu bermain bersama.'),
(25, 'Puasa Sunnah Dawud', 'Pelajari tentang puasa sunnah Dawud sebagai bekal pasca-Ramadhan.', 'puasa', 'hard', 30, CURRENT_DATE + 24, '🌙', 'Puasa sehari, berbuka sehari — puasa paling dicintai Allah.'),
(26, 'Shalawat 1000 Kali', 'Perbanyak shalawat minimal 1000 kali sepanjang hari.', 'doa', 'medium', 20, CURRENT_DATE + 25, '🤲', 'Baca shalawat singkat di sela-sela aktivitas.'),
(27, 'Surat untuk Orang Tua', 'Tulis pesan apresiasi atau doa untuk orang tua.', 'akhlak', 'medium', 20, CURRENT_DATE + 26, '🤝', 'Sampaikan langsung atau kirim via pesan/surat.'),
(28, 'Bersih-bersih Rumah', 'Bersihkan rumah dan rapikan barang sebagai persiapan Lebaran.', 'kesehatan', 'easy', 10, CURRENT_DATE + 27, '💪', 'Libatkan seluruh anggota keluarga.'),
(29, 'Persiapan Idul Fitri', 'Siapkan baju, takbiran, dan mental menyambut Idul Fitri.', 'ibadah', 'easy', 10, CURRENT_DATE + 28, '🕌', 'Potong kuku, mandi, dan pakai wangi-wangian.'),
(30, 'Refleksi & Komitmen', 'Refleksikan perjalanan 30 hari dan buat komitmen untuk melanjutkan kebiasaan baik.', 'ilmu', 'medium', 20, CURRENT_DATE + 29, '📚', 'Tulis 3 kebiasaan baik yang ingin kamu pertahankan.');

-- Insert Badges
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value) VALUES
('Pemula', 'Selesaikan tantangan pertama', '🌟', 'completion', 1),
('Konsisten', 'Streak 7 hari berturut-turut', '🔥', 'streak', 7),
('Tekun', 'Streak 14 hari berturut-turut', '⭐', 'streak', 14),
('Istiqomah', 'Streak 21 hari berturut-turut', '💎', 'streak', 21),
('Juara Ramadhan', 'Selesaikan semua 30 tantangan', '🏆', 'completion', 30),
('Dermawan', 'Kumpulkan 500 poin', '💰', 'points', 500);
