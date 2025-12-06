/*
  # Initial Database Schema for Course Conversion System

  ## Overview
  This migration creates the complete database structure for the academic course conversion system
  with multi-level approval workflow (Mahasiswa → Kaprodi → Dekan → BAA).

  ## New Tables

  ### 1. profiles
  Extended user profile linked to auth.users
  - `id` (uuid, FK to auth.users)
  - `full_name` (text)
  - `role` (text) - mahasiswa, kaprodi, dekan, baa
  - `email` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. universitas
  Master data for universities
  - `id` (uuid, PK)
  - `nama` (text)
  - `created_at` (timestamptz)

  ### 3. prodi
  Master data for study programs
  - `id` (uuid, PK)
  - `kode` (text)
  - `nama` (text)
  - `created_at` (timestamptz)

  ### 4. mata_kuliah
  Master course data for curriculum mapping
  - `id` (uuid, PK)
  - `kode` (text)
  - `nama` (text)
  - `sks` (integer)
  - `prodi_id` (uuid, FK to prodi)
  - `semester` (integer)
  - `created_at` (timestamptz)

  ### 5. pengajuan_konversi
  Main submission records
  - `id` (uuid, PK)
  - `mahasiswa_id` (uuid, FK to profiles)
  - `universitas_asal` (text)
  - `prodi_asal` (text)
  - `prodi_tujuan_id` (uuid, FK to prodi)
  - `transkrip_url` (text)
  - `total_sks_asal` (integer)
  - `total_sks_dikonversi` (integer)
  - `ipk_asal` (decimal)
  - `status` (text) - pending_kaprodi, approved_kaprodi, pending_mahasiswa, approved_mahasiswa, pending_dekan, approved_dekan, pending_baa, approved_baa, rejected
  - `current_approver_role` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. detail_transkrip
  Scanned course details from student transcript
  - `id` (uuid, PK)
  - `pengajuan_id` (uuid, FK to pengajuan_konversi)
  - `nama_matakuliah` (text)
  - `sks` (integer)
  - `nilai_huruf` (text)
  - `nilai_angka` (decimal)
  - `created_at` (timestamptz)

  ### 7. pemetaan_konversi
  Course mapping from source to target
  - `id` (uuid, PK)
  - `pengajuan_id` (uuid, FK to pengajuan_konversi)
  - `detail_transkrip_id` (uuid, FK to detail_transkrip)
  - `mata_kuliah_tujuan_id` (uuid, FK to mata_kuliah, nullable)
  - `sks_asal` (integer)
  - `sks_tujuan` (integer, nullable)
  - `nilai_huruf_asal` (text)
  - `nilai_angka_asal` (decimal)
  - `nilai_huruf_final` (text)
  - `nilai_angka_final` (decimal)
  - `can_convert` (boolean)
  - `keterangan` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 8. approval_history
  Approval tracking for each stage
  - `id` (uuid, PK)
  - `pengajuan_id` (uuid, FK to pengajuan_konversi)
  - `approver_id` (uuid, FK to profiles)
  - `approver_role` (text)
  - `action` (text) - approved, rejected, edited
  - `komentar` (text)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Policies for role-based access control
  - Users can only access data relevant to their role
*/

-- Create tables

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('mahasiswa', 'kaprodi', 'dekan', 'baa')),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS universitas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prodi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kode text NOT NULL UNIQUE,
  nama text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mata_kuliah (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kode text NOT NULL,
  nama text NOT NULL,
  sks integer NOT NULL CHECK (sks > 0),
  prodi_id uuid NOT NULL REFERENCES prodi(id) ON DELETE CASCADE,
  semester integer CHECK (semester >= 1 AND semester <= 8),
  created_at timestamptz DEFAULT now(),
  UNIQUE(kode, prodi_id)
);

CREATE TABLE IF NOT EXISTS pengajuan_konversi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mahasiswa_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  universitas_asal text NOT NULL,
  prodi_asal text NOT NULL,
  prodi_tujuan_id uuid NOT NULL REFERENCES prodi(id),
  transkrip_url text,
  total_sks_asal integer DEFAULT 0,
  total_sks_dikonversi integer DEFAULT 0,
  ipk_asal decimal(3,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'pending_kaprodi' CHECK (status IN ('pending_kaprodi', 'approved_kaprodi', 'pending_mahasiswa', 'approved_mahasiswa', 'pending_dekan', 'approved_dekan', 'pending_baa', 'approved_baa', 'rejected')),
  current_approver_role text DEFAULT 'kaprodi' CHECK (current_approver_role IN ('kaprodi', 'mahasiswa', 'dekan', 'baa')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS detail_transkrip (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pengajuan_id uuid NOT NULL REFERENCES pengajuan_konversi(id) ON DELETE CASCADE,
  nama_matakuliah text NOT NULL,
  sks integer NOT NULL CHECK (sks > 0),
  nilai_huruf text NOT NULL,
  nilai_angka decimal(3,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pemetaan_konversi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pengajuan_id uuid NOT NULL REFERENCES pengajuan_konversi(id) ON DELETE CASCADE,
  detail_transkrip_id uuid NOT NULL REFERENCES detail_transkrip(id) ON DELETE CASCADE,
  mata_kuliah_tujuan_id uuid REFERENCES mata_kuliah(id),
  sks_asal integer NOT NULL,
  sks_tujuan integer,
  nilai_huruf_asal text NOT NULL,
  nilai_angka_asal decimal(3,2) NOT NULL,
  nilai_huruf_final text NOT NULL,
  nilai_angka_final decimal(3,2) NOT NULL,
  can_convert boolean DEFAULT false,
  keterangan text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS approval_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pengajuan_id uuid NOT NULL REFERENCES pengajuan_konversi(id) ON DELETE CASCADE,
  approver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  approver_role text NOT NULL CHECK (approver_role IN ('kaprodi', 'dekan', 'baa', 'mahasiswa')),
  action text NOT NULL CHECK (action IN ('approved', 'rejected', 'edited')),
  komentar text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE universitas ENABLE ROW LEVEL SECURITY;
ALTER TABLE prodi ENABLE ROW LEVEL SECURITY;
ALTER TABLE mata_kuliah ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengajuan_konversi ENABLE ROW LEVEL SECURITY;
ALTER TABLE detail_transkrip ENABLE ROW LEVEL SECURITY;
ALTER TABLE pemetaan_konversi ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read their own profile, all authenticated users can read all profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Universitas: All authenticated users can read
CREATE POLICY "All authenticated users can read universitas"
  ON universitas FOR SELECT
  TO authenticated
  USING (true);

-- Prodi: All authenticated users can read
CREATE POLICY "All authenticated users can read prodi"
  ON prodi FOR SELECT
  TO authenticated
  USING (true);

-- Mata Kuliah: All authenticated users can read
CREATE POLICY "All authenticated users can read mata_kuliah"
  ON mata_kuliah FOR SELECT
  TO authenticated
  USING (true);

-- Pengajuan Konversi: Mahasiswa can CRUD their own, staff can read relevant ones
CREATE POLICY "Mahasiswa can insert own pengajuan"
  ON pengajuan_konversi FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = mahasiswa_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'mahasiswa')
  );

CREATE POLICY "Mahasiswa can read own pengajuan"
  ON pengajuan_konversi FOR SELECT
  TO authenticated
  USING (
    auth.uid() = mahasiswa_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kaprodi', 'dekan', 'baa'))
  );

CREATE POLICY "Mahasiswa can update own pending pengajuan"
  ON pengajuan_konversi FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = mahasiswa_id AND status = 'pending_mahasiswa'
  )
  WITH CHECK (
    auth.uid() = mahasiswa_id AND status = 'pending_mahasiswa'
  );

CREATE POLICY "Staff can update pengajuan in their scope"
  ON pengajuan_konversi FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (
        (role = 'kaprodi' AND pengajuan_konversi.current_approver_role = 'kaprodi') OR
        (role = 'dekan' AND pengajuan_konversi.current_approver_role = 'dekan') OR
        (role = 'baa' AND pengajuan_konversi.current_approver_role = 'baa')
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND (
        (role = 'kaprodi' AND pengajuan_konversi.current_approver_role = 'kaprodi') OR
        (role = 'dekan' AND pengajuan_konversi.current_approver_role = 'dekan') OR
        (role = 'baa' AND pengajuan_konversi.current_approver_role = 'baa')
      )
    )
  );

-- Detail Transkrip: Mahasiswa can CRUD their own, staff can read
CREATE POLICY "Mahasiswa can insert own detail_transkrip"
  ON detail_transkrip FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pengajuan_konversi 
      WHERE id = pengajuan_id AND mahasiswa_id = auth.uid()
    )
  );

CREATE POLICY "Users can read detail_transkrip of accessible pengajuan"
  ON detail_transkrip FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pengajuan_konversi 
      WHERE id = pengajuan_id 
      AND (
        mahasiswa_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kaprodi', 'dekan', 'baa'))
      )
    )
  );

-- Pemetaan Konversi: Similar to detail_transkrip
CREATE POLICY "Staff can insert pemetaan_konversi"
  ON pemetaan_konversi FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kaprodi', 'dekan', 'baa'))
  );

CREATE POLICY "Users can read pemetaan_konversi of accessible pengajuan"
  ON pemetaan_konversi FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pengajuan_konversi 
      WHERE id = pengajuan_id 
      AND (
        mahasiswa_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kaprodi', 'dekan', 'baa'))
      )
    )
  );

CREATE POLICY "Staff can update pemetaan_konversi"
  ON pemetaan_konversi FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kaprodi', 'dekan'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kaprodi', 'dekan'))
  );

-- Approval History: Staff can insert, all can read relevant ones
CREATE POLICY "Staff can insert approval_history"
  ON approval_history FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = approver_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kaprodi', 'dekan', 'baa', 'mahasiswa'))
  );

CREATE POLICY "Users can read approval_history of accessible pengajuan"
  ON approval_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pengajuan_konversi 
      WHERE id = pengajuan_id 
      AND (
        mahasiswa_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kaprodi', 'dekan', 'baa'))
      )
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pengajuan_mahasiswa ON pengajuan_konversi(mahasiswa_id);
CREATE INDEX IF NOT EXISTS idx_pengajuan_status ON pengajuan_konversi(status);
CREATE INDEX IF NOT EXISTS idx_pengajuan_current_approver ON pengajuan_konversi(current_approver_role);
CREATE INDEX IF NOT EXISTS idx_detail_transkrip_pengajuan ON detail_transkrip(pengajuan_id);
CREATE INDEX IF NOT EXISTS idx_pemetaan_pengajuan ON pemetaan_konversi(pengajuan_id);
CREATE INDEX IF NOT EXISTS idx_approval_pengajuan ON approval_history(pengajuan_id);
CREATE INDEX IF NOT EXISTS idx_mata_kuliah_prodi ON mata_kuliah(prodi_id);