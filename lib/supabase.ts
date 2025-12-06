import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  role: 'mahasiswa' | 'kaprodi' | 'dekan' | 'baa';
  email: string;
  created_at: string;
  updated_at: string;
};

export type Prodi = {
  id: string;
  kode: string;
  nama: string;
  created_at: string;
};

export type MataKuliah = {
  id: string;
  kode: string;
  nama: string;
  sks: number;
  prodi_id: string;
  semester: number;
  created_at: string;
};

export type PengajuanKonversi = {
  id: string;
  mahasiswa_id: string;
  universitas_asal: string;
  prodi_asal: string;
  prodi_tujuan_id: string;
  transkrip_url: string | null;
  total_sks_asal: number;
  total_sks_dikonversi: number;
  ipk_asal: number;
  status: 'pending_kaprodi' | 'approved_kaprodi' | 'pending_mahasiswa' | 'approved_mahasiswa' | 'pending_dekan' | 'approved_dekan' | 'pending_baa' | 'approved_baa' | 'rejected';
  current_approver_role: 'kaprodi' | 'mahasiswa' | 'dekan' | 'baa';
  created_at: string;
  updated_at: string;
};

export type DetailTranskrip = {
  id: string;
  pengajuan_id: string;
  nama_matakuliah: string;
  sks: number;
  nilai_huruf: string;
  nilai_angka: number;
  created_at: string;
};

export type PemetaanKonversi = {
  id: string;
  pengajuan_id: string;
  detail_transkrip_id: string;
  mata_kuliah_tujuan_id: string | null;
  sks_asal: number;
  sks_tujuan: number | null;
  nilai_huruf_asal: string;
  nilai_angka_asal: number;
  nilai_huruf_final: string;
  nilai_angka_final: number;
  can_convert: boolean;
  keterangan: string | null;
  created_at: string;
  updated_at: string;
};

export type ApprovalHistory = {
  id: string;
  pengajuan_id: string;
  approver_id: string;
  approver_role: 'kaprodi' | 'dekan' | 'baa' | 'mahasiswa';
  action: 'approved' | 'rejected' | 'edited';
  komentar: string | null;
  created_at: string;
};
