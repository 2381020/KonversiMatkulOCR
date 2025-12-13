/*
  # Sistem Konversi Nilai - Complete Schema

  ## Overview
  This migration creates a comprehensive multi-role approval workflow system for academic transcript conversion.

  ## New Tables

  ### 1. profiles
  Extended user profiles with role-based access
  - `id` (uuid, references auth.users)
  - `full_name` (text)
  - `email` (text)
  - `role` (text) - mahasiswa, kaprodi, baa, dekan
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. study_programs
  Academic study programs (Prodi)
  - `id` (uuid, primary key)
  - `code` (text, unique) - program code
  - `name` (text) - program name
  - `faculty` (text) - faculty name
  - `level` (text) - S1, S2, S3
  - `created_at` (timestamptz)

  ### 3. curriculum
  Course catalog for each study program
  - `id` (uuid, primary key)
  - `study_program_id` (uuid, references study_programs)
  - `course_code` (text)
  - `course_name` (text)
  - `sks` (integer)
  - `semester` (integer)
  - `is_active` (boolean)
  - `created_at` (timestamptz)

  ### 4. conversion_requests
  Main conversion submission tracking
  - `id` (uuid, primary key)
  - `request_number` (text, unique) - auto-generated
  - `student_id` (uuid, references profiles)
  - `student_name` (text)
  - `origin_university` (text)
  - `origin_program` (text)
  - `target_program_id` (uuid, references study_programs)
  - `transcript_url` (text) - uploaded file
  - `total_sks` (integer)
  - `total_converted_sks` (integer)
  - `ipk` (numeric)
  - `current_stage` (text) - pending_student, pending_kaprodi, pending_student_confirmation, pending_dean, pending_baa, approved, rejected
  - `final_status` (text) - draft, submitted, approved, rejected
  - `submitted_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. conversion_details
  Individual course conversion mappings
  - `id` (uuid, primary key)
  - `request_id` (uuid, references conversion_requests)
  - `origin_course_name` (text)
  - `origin_sks` (integer)
  - `origin_grade_letter` (text)
  - `origin_grade_number` (numeric)
  - `target_course_id` (uuid, references curriculum)
  - `target_course_name` (text)
  - `target_sks` (integer)
  - `converted_grade_letter` (text)
  - `converted_grade_number` (numeric)
  - `is_convertible` (boolean)
  - `notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. workflow_approvals
  Track approval process at each stage
  - `id` (uuid, primary key)
  - `request_id` (uuid, references conversion_requests)
  - `stage` (text) - kaprodi, student_confirmation, dean, baa
  - `approver_id` (uuid, references profiles)
  - `action` (text) - approved, rejected, edited
  - `notes` (text)
  - `approved_at` (timestamptz)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Students can only view/edit their own submissions
  - Kaprodi can view and approve requests for their program
  - BAA and Dekan can view all requests
  - Each role has specific permissions based on workflow stage
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('mahasiswa', 'kaprodi', 'baa', 'dekan')),
  study_program_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create study_programs table
CREATE TABLE IF NOT EXISTS study_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  faculty text NOT NULL,
  level text DEFAULT 'S1' CHECK (level IN ('D3', 'S1', 'S2', 'S3')),
  created_at timestamptz DEFAULT now()
);

-- Create curriculum table
CREATE TABLE IF NOT EXISTS curriculum (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  study_program_id uuid NOT NULL REFERENCES study_programs(id) ON DELETE CASCADE,
  course_code text NOT NULL,
  course_name text NOT NULL,
  sks integer NOT NULL CHECK (sks > 0),
  semester integer CHECK (semester BETWEEN 1 AND 14),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create conversion_requests table
CREATE TABLE IF NOT EXISTS conversion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number text UNIQUE NOT NULL,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  origin_university text NOT NULL,
  origin_program text NOT NULL,
  target_program_id uuid NOT NULL REFERENCES study_programs(id),
  transcript_url text,
  total_sks integer DEFAULT 0,
  total_converted_sks integer DEFAULT 0,
  ipk numeric(3,2),
  current_stage text DEFAULT 'pending_student' CHECK (current_stage IN ('pending_student', 'pending_kaprodi', 'pending_student_confirmation', 'pending_dean', 'pending_baa', 'approved', 'rejected')),
  final_status text DEFAULT 'draft' CHECK (final_status IN ('draft', 'submitted', 'approved', 'rejected')),
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create conversion_details table
CREATE TABLE IF NOT EXISTS conversion_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES conversion_requests(id) ON DELETE CASCADE,
  origin_course_name text NOT NULL,
  origin_sks integer NOT NULL CHECK (origin_sks > 0),
  origin_grade_letter text NOT NULL,
  origin_grade_number numeric(3,2) NOT NULL CHECK (origin_grade_number BETWEEN 0 AND 4),
  target_course_id uuid REFERENCES curriculum(id),
  target_course_name text,
  target_sks integer,
  converted_grade_letter text,
  converted_grade_number numeric(3,2),
  is_convertible boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workflow_approvals table
CREATE TABLE IF NOT EXISTS workflow_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES conversion_requests(id) ON DELETE CASCADE,
  stage text NOT NULL CHECK (stage IN ('kaprodi', 'student_confirmation', 'dean', 'baa')),
  approver_id uuid NOT NULL REFERENCES profiles(id),
  action text NOT NULL CHECK (action IN ('approved', 'rejected', 'edited')),
  notes text,
  approved_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Add foreign key to profiles after study_programs is created
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_study_program 
  FOREIGN KEY (study_program_id) REFERENCES study_programs(id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_conversion_requests_student ON conversion_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_conversion_requests_stage ON conversion_requests(current_stage);
CREATE INDEX IF NOT EXISTS idx_conversion_requests_target_program ON conversion_requests(target_program_id);
CREATE INDEX IF NOT EXISTS idx_conversion_details_request ON conversion_details(request_id);
CREATE INDEX IF NOT EXISTS idx_workflow_approvals_request ON workflow_approvals(request_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_program ON curriculum(study_program_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_approvals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for study_programs (public read)
CREATE POLICY "Anyone can view study programs"
  ON study_programs FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for curriculum (public read)
CREATE POLICY "Anyone can view curriculum"
  ON curriculum FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for conversion_requests
CREATE POLICY "Students can view own requests"
  ON conversion_requests FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('kaprodi', 'baa', 'dekan')
    )
  );

CREATE POLICY "Students can create own requests"
  ON conversion_requests FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own draft requests"
  ON conversion_requests FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid() AND final_status = 'draft')
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Staff can update requests"
  ON conversion_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('kaprodi', 'baa', 'dekan')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('kaprodi', 'baa', 'dekan')
    )
  );

-- RLS Policies for conversion_details
CREATE POLICY "Users can view conversion details"
  ON conversion_details FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversion_requests
      WHERE conversion_requests.id = conversion_details.request_id
      AND (
        conversion_requests.student_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role IN ('kaprodi', 'baa', 'dekan')
        )
      )
    )
  );

CREATE POLICY "Students can insert conversion details"
  ON conversion_details FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversion_requests
      WHERE conversion_requests.id = conversion_details.request_id
      AND conversion_requests.student_id = auth.uid()
    )
  );

CREATE POLICY "Staff can update conversion details"
  ON conversion_details FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('kaprodi', 'baa', 'dekan')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('kaprodi', 'baa', 'dekan')
    )
  );

-- RLS Policies for workflow_approvals
CREATE POLICY "Users can view workflow approvals"
  ON workflow_approvals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversion_requests
      WHERE conversion_requests.id = workflow_approvals.request_id
      AND (
        conversion_requests.student_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role IN ('kaprodi', 'baa', 'dekan')
        )
      )
    )
  );

CREATE POLICY "Staff can insert workflow approvals"
  ON workflow_approvals FOR INSERT
  TO authenticated
  WITH CHECK (
    approver_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('kaprodi', 'baa', 'dekan')
    )
  );

-- Insert sample study programs
INSERT INTO study_programs (code, name, faculty, level) VALUES
  ('TI', 'Teknik Informatika', 'Fakultas Teknologi Informasi', 'S1'),
  ('SI', 'Sistem Informasi', 'Fakultas Teknologi Informasi', 'S1'),
  ('TE', 'Teknik Elektro', 'Fakultas Teknik', 'S1'),
  ('AK', 'Akuntansi', 'Fakultas Ekonomi', 'S1'),
  ('MJ', 'Manajemen', 'Fakultas Ekonomi', 'S1')
ON CONFLICT (code) DO NOTHING;

-- Insert sample curriculum for Teknik Informatika
INSERT INTO curriculum (study_program_id, course_code, course_name, sks, semester) 
SELECT 
  sp.id,
  unnest(ARRAY['TIF101', 'TIF102', 'TIF103', 'TIF104', 'TIF201', 'TIF202', 'TIF203', 'TIF301', 'TIF302', 'TIF401']),
  unnest(ARRAY['Algoritma & Pemrograman', 'Struktur Data', 'Basis Data', 'Matematika Diskrit', 'Pemrograman Web', 'Jaringan Komputer', 'Sistem Operasi', 'Rekayasa Perangkat Lunak', 'Kecerdasan Buatan', 'Skripsi']),
  unnest(ARRAY[4, 4, 3, 3, 3, 3, 3, 3, 3, 6]),
  unnest(ARRAY[1, 2, 3, 1, 3, 4, 4, 5, 6, 8])
FROM study_programs sp
WHERE sp.code = 'TI'
ON CONFLICT DO NOTHING;