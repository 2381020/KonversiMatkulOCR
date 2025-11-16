import { GoogleGenAI, Type } from "@google/genai";
import type { KonversiHasil } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const konversiTranskrip = async (image: File): Promise<KonversiHasil> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Anda adalah asisten akademik AI yang canggih dengan tugas spesifik.
    1.  Lakukan OCR (Optical Character Recognition) pada gambar transkrip nilai yang diberikan.
    2.  Untuk setiap mata kuliah yang teridentifikasi, ekstrak informasi berikut: Nama Mata Kuliah, Jumlah SKS (Satuan Kredit Semester), dan Nilai Huruf. Abaikan mata kuliah yang tidak memiliki SKS atau nilai (misalnya: Kerja Praktik, Skripsi jika belum dinilai).
    3.  Konversikan setiap Nilai Huruf ke Nilai Angka menggunakan skala standar berikut:
        - A = 4.0
        - AB = 3.5
        - B = 3.0
        - BC = 2.5
        - C = 2.0
        - CD = 1.5
        - D = 1.0
        - E = 0.0
        Jika ada nilai huruf lain (misal: T, K, atau lainnya), anggap Nilai Angka-nya adalah 0.
    4.  Hitung 'bobot' untuk setiap mata kuliah menggunakan rumus: bobot = SKS * Nilai Angka.
    5.  Hitung 'total_sks' (jumlah semua SKS), 'total_bobot' (jumlah semua bobot).
    6.  Hitung 'ipk' (Indeks Prestasi Kumulatif) menggunakan rumus: ipk = total_bobot / total_sks. Bulatkan hasil IPK ke dua angka desimal.
    7.  Sajikan semua hasil dalam format JSON yang terstruktur sesuai skema yang diminta. Pastikan semua angka (sks, nilai_angka, bobot, total_sks, total_bobot, ipk) adalah tipe number.
  `;
  
  const base64Image = await fileToBase64(image);
  const contentParts = [
    {
      inlineData: {
        mimeType: image.type,
        data: base64Image,
      },
    },
    { text: prompt },
  ];

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      daftar_matakuliah: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            nama_matakuliah: { type: Type.STRING },
            sks: { type: Type.NUMBER },
            nilai_huruf: { type: Type.STRING },
            nilai_angka: { type: Type.NUMBER },
            bobot: { type: Type.NUMBER },
          },
          required: ["nama_matakuliah", "sks", "nilai_huruf", "nilai_angka", "bobot"],
        },
      },
      total_sks: { type: Type.NUMBER },
      total_bobot: { type: Type.NUMBER },
      ipk: { type: Type.NUMBER },
    },
    required: ["daftar_matakuliah", "total_sks", "total_bobot", "ipk"],
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: contentParts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    const result: KonversiHasil = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Gagal berkomunikasi dengan layanan AI. Silakan periksa konsol untuk detail.");
  }
};
