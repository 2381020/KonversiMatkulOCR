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
  id?: string;
  name: string;
  email?: string;
  role: 'mahasiswa' | 'kaprodi' | 'baa' | 'dekan';
  study_program_id?: string;
}

export interface StudyProgram {
  id: string;
  code: string;
  name: string;
  faculty: string;
  level: string;
}

export interface Curriculum {
  id: string;
  study_program_id: string;
  course_code: string;
  course_name: string;
  sks: number;
  semester: number;
  is_active: boolean;
}

export interface ConversionRequest {
  id: string;
  request_number: string;
  student_id: string;
  student_name: string;
  origin_university: string;
  origin_program: string;
  target_program_id: string;
  target_program?: StudyProgram;
  transcript_url?: string;
  total_sks: number;
  total_converted_sks: number;
  ipk: number;
  current_stage: 'pending_student' | 'pending_kaprodi' | 'pending_student_confirmation' | 'pending_dean' | 'pending_baa' | 'approved' | 'rejected';
  final_status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ConversionDetail {
  id: string;
  request_id: string;
  origin_course_name: string;
  origin_sks: number;
  origin_grade_letter: string;
  origin_grade_number: number;
  target_course_id?: string;
  target_course_name?: string;
  target_sks?: number;
  converted_grade_letter?: string;
  converted_grade_number?: number;
  is_convertible: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowApproval {
  id: string;
  request_id: string;
  stage: 'kaprodi' | 'student_confirmation' | 'dean' | 'baa';
  approver_id: string;
  action: 'approved' | 'rejected' | 'edited';
  notes?: string;
  approved_at: string;
  created_at: string;
}

export interface Submission {
  id: string;
  studentName: string;
  date: string;
  courses: number;
  status: 'Pending' | 'Disetujui' | 'Ditolak';
  detail: KonversiHasil;
}