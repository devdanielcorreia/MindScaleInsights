-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('psychologist', 'company', 'employee');

-- Create enum for assessment status
CREATE TYPE assessment_status AS ENUM ('pending', 'in_progress', 'completed', 'expired');

-- Create enum for trait category levels
CREATE TYPE trait_level AS ENUM ('low', 'medium', 'high');

-- Create enum for supported languages
CREATE TYPE supported_language AS ENUM ('pt', 'es', 'en');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  preferred_language supported_language DEFAULT 'pt',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  plan TEXT DEFAULT 'basic',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company users (RH/managers)
CREATE TABLE company_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  position TEXT,
  UNIQUE(profile_id, company_id)
);

-- Psychologists table
CREATE TABLE psychologists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  license_number TEXT,
  specialization TEXT,
  bio TEXT
);

-- Psychologist-Company associations
CREATE TABLE psychologist_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  psychologist_id UUID REFERENCES psychologists(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(psychologist_id, company_id)
);

-- Employees table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  position TEXT,
  preferred_language supported_language DEFAULT 'pt',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, email)
);

-- Psychological traits
CREATE TABLE psychological_traits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  psychologist_id UUID REFERENCES psychologists(id) ON DELETE CASCADE,
  name_pt TEXT NOT NULL,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_pt TEXT,
  description_es TEXT,
  description_en TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quizzes
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  psychologist_id UUID REFERENCES psychologists(id) ON DELETE CASCADE,
  trait_id UUID REFERENCES psychological_traits(id) ON DELETE SET NULL,
  title_pt TEXT NOT NULL,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_pt TEXT,
  description_es TEXT,
  description_en TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions (10 per quiz)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  order_number INTEGER NOT NULL CHECK (order_number >= 1 AND order_number <= 10),
  text_pt TEXT NOT NULL,
  text_es TEXT NOT NULL,
  text_en TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(quiz_id, order_number)
);

-- Alternatives (4 per question, weights 1-4)
CREATE TABLE alternatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  order_number INTEGER NOT NULL CHECK (order_number >= 1 AND order_number <= 4),
  text_pt TEXT NOT NULL,
  text_es TEXT NOT NULL,
  text_en TEXT NOT NULL,
  weight INTEGER NOT NULL CHECK (weight >= 1 AND weight <= 4),
  UNIQUE(question_id, order_number)
);

-- Assessments (groups of quizzes)
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  psychologist_id UUID REFERENCES psychologists(id) ON DELETE CASCADE,
  title_pt TEXT NOT NULL,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_pt TEXT,
  description_es TEXT,
  description_en TEXT,
  estimated_time_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment-Quiz associations
CREATE TABLE assessment_quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  order_number INTEGER NOT NULL,
  UNIQUE(assessment_id, quiz_id)
);

-- Assessment applications (instances sent to employees)
CREATE TABLE assessment_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  access_token UUID UNIQUE DEFAULT uuid_generate_v4(),
  status assessment_status DEFAULT 'pending',
  language supported_language DEFAULT 'pt',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee responses
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES assessment_applications(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  alternative_id UUID REFERENCES alternatives(id) ON DELETE CASCADE,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, question_id)
);

-- Quiz results
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES assessment_applications(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  raw_score INTEGER NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  level trait_level,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, quiz_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychologists ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychologist_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychological_traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alternatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for Companies
CREATE POLICY "Company users can view their company"
  ON companies FOR SELECT
  USING (
    id IN (
      SELECT company_id FROM company_users WHERE profile_id = auth.uid()
    )
    OR
    id IN (
      SELECT company_id FROM psychologist_companies 
      WHERE psychologist_id IN (
        SELECT id FROM psychologists WHERE profile_id = auth.uid()
      )
    )
  );

-- RLS Policies for Employees
CREATE POLICY "Company users can view their employees"
  ON employees FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM company_users WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Psychologists can view employees from authorized companies"
  ON employees FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM psychologist_companies 
      WHERE psychologist_id IN (
        SELECT id FROM psychologists WHERE profile_id = auth.uid()
      )
    )
  );

-- RLS Policies for Psychological Traits
CREATE POLICY "Psychologists can manage their traits"
  ON psychological_traits FOR ALL
  USING (
    psychologist_id IN (
      SELECT id FROM psychologists WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Companies can view active traits"
  ON psychological_traits FOR SELECT
  USING (is_active = true);

-- RLS Policies for Quizzes
CREATE POLICY "Psychologists can manage their quizzes"
  ON quizzes FOR ALL
  USING (
    psychologist_id IN (
      SELECT id FROM psychologists WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Companies can view active quizzes"
  ON quizzes FOR SELECT
  USING (is_active = true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_psychological_traits_updated_at BEFORE UPDATE ON psychological_traits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();