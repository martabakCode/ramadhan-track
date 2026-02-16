export interface QuranVerse {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    audio: { [key: string]: string };
}

export interface QuranSurah {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    arti: string;
    deskripsi: string;
    audioFull: { [key: string]: string };
    ayat?: QuranVerse[];
}

export interface HadithData {
    number: number;
    arab: string;
    id: string; // translation
}

const QURAN_BASE_URL = 'https://equran.id/api/v2';
const HADITH_BASE_URL = 'https://api.hadith.gading.dev/books';

export const QuranAPI = {
    getSurah: async (surahNumber: number): Promise<QuranSurah | null> => {
        try {
            const res = await fetch(`${QURAN_BASE_URL}/surat/${surahNumber}`);
            if (!res.ok) throw new Error('Failed to fetch surah');
            const data = await res.json();
            return data.data; // equran returns { code: 200, message: "...", data: { ... } }
        } catch (error) {
            console.error('QuranAPI Error:', error);
            return null;
        }
    },

    getJuzInfo: (juz: number): { startSurah: number } => {
        const JUZ_START_SURAH: Record<number, number> = {
            1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8,
            11: 9, 12: 11, 13: 12, 14: 15, 15: 17, 16: 18, 17: 21, 18: 23, 19: 25, 20: 27,
            21: 29, 22: 33, 23: 36, 24: 39, 25: 41, 26: 46, 27: 51, 28: 58, 29: 67, 30: 78
        };
        return { startSurah: JUZ_START_SURAH[juz] || 1 };
    },
};

export const HadithAPI = {
    getHadith: async (source: string, number: number): Promise<HadithData | null> => {
        try {
            console.log(`[HadithAPI] Fetching: ${source}/${number}`);
            const url = `${HADITH_BASE_URL}/${source}/${number}`;
            console.log(`[HadithAPI] URL: ${url}`);

            const res = await fetch(url);
            console.log(`[HadithAPI] Response status: ${res.status}`);

            if (!res.ok) {
                console.warn(`[HadithAPI] Failed to fetch ${source}/${number}: ${res.status}`);

                // Fallback for Arbain-Nawawi (Mocking the first one for demo)
                if (source === 'arbain-nawawi' && number === 1) {
                    return {
                        number: 1,
                        arab: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوِ امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
                        id: "Sesungguhnya setiap amalan tergantung pada niatnya..."
                    };
                }

                return null;
            }
            const data = await res.json();
            return data.data.contents;
        } catch (error) {
            console.error('HadithAPI Error:', error);
            return null;
        }
    }
};
