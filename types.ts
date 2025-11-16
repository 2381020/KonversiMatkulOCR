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
