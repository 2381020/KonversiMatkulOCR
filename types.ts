export interface MataKuliah {
  nama_matakuliah: string;
  sks: number;
  nilai_huruf: string;
  nilai_angka: number;
  bobot: number;
}

export interface KonversiHasil {
  daftar_matakuliah: MataKuliah[];
  total_sks: number;
  total_bobot: number;
  ipk: number;
}

export interface User {
  name: string;
  role: 'mahasiswa' | 'dosen' | 'admin';
}

export interface Submission {
  id: string;
  studentName: string;
  date: string;
  courses: number;
  status: 'Pending' | 'Disetujui' | 'Ditolak';
  detail: KonversiHasil;
}