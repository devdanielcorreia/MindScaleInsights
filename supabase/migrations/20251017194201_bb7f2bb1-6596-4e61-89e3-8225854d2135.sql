-- Fix RLS policies for missing tables

-- Company users policies
CREATE POLICY "Users can view their own company associations"
  ON company_users FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own company associations"
  ON company_users FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Psychologists policies
CREATE POLICY "Psychologists can view their own profile"
  ON psychologists FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Psychologists can update their own profile"
  ON psychologists FOR UPDATE
  USING (profile_id = auth.uid());

CREATE POLICY "Psychologists can insert their own profile"
  ON psychologists FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Psychologist-companies policies
CREATE POLICY "Psychologists can view their company associations"
  ON psychologist_companies FOR SELECT
  USING (
    psychologist_id IN (
      SELECT id FROM psychologists WHERE profile_id = auth.uid()
    )
  );

-- Questions policies (accessible through quizzes)
CREATE POLICY "Psychologists can manage questions for their quizzes"
  ON questions FOR ALL
  USING (
    quiz_id IN (
      SELECT id FROM quizzes 
      WHERE psychologist_id IN (
        SELECT id FROM psychologists WHERE profile_id = auth.uid()
      )
    )
  );

CREATE POLICY "Companies can view questions for active quizzes"
  ON questions FOR SELECT
  USING (
    quiz_id IN (
      SELECT id FROM quizzes WHERE is_active = true
    )
  );

-- Alternatives policies (accessible through questions)
CREATE POLICY "Psychologists can manage alternatives for their questions"
  ON alternatives FOR ALL
  USING (
    question_id IN (
      SELECT q.id FROM questions q
      JOIN quizzes qz ON q.quiz_id = qz.id
      WHERE qz.psychologist_id IN (
        SELECT id FROM psychologists WHERE profile_id = auth.uid()
      )
    )
  );

CREATE POLICY "Companies can view alternatives for active quizzes"
  ON alternatives FOR SELECT
  USING (
    question_id IN (
      SELECT q.id FROM questions q
      JOIN quizzes qz ON q.quiz_id = qz.id
      WHERE qz.is_active = true
    )
  );

-- Assessments policies
CREATE POLICY "Psychologists can manage their assessments"
  ON assessments FOR ALL
  USING (
    psychologist_id IN (
      SELECT id FROM psychologists WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Companies can view active assessments"
  ON assessments FOR SELECT
  USING (is_active = true);

-- Assessment-quizzes policies
CREATE POLICY "Psychologists can manage assessment-quiz associations"
  ON assessment_quizzes FOR ALL
  USING (
    assessment_id IN (
      SELECT id FROM assessments 
      WHERE psychologist_id IN (
        SELECT id FROM psychologists WHERE profile_id = auth.uid()
      )
    )
  );

CREATE POLICY "Companies can view assessment-quiz associations for active assessments"
  ON assessment_quizzes FOR SELECT
  USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE is_active = true
    )
  );

-- Assessment applications policies
CREATE POLICY "Companies can manage applications for their employees"
  ON assessment_applications FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM company_users WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Psychologists can view applications from authorized companies"
  ON assessment_applications FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM psychologist_companies 
      WHERE psychologist_id IN (
        SELECT id FROM psychologists WHERE profile_id = auth.uid()
      )
    )
  );

CREATE POLICY "Public access for employees via token"
  ON assessment_applications FOR SELECT
  USING (true);

-- Responses policies  
CREATE POLICY "Employees can submit responses for their applications"
  ON responses FOR INSERT
  WITH CHECK (
    application_id IN (
      SELECT id FROM assessment_applications WHERE access_token IS NOT NULL
    )
  );

CREATE POLICY "Companies can view responses for their applications"
  ON responses FOR SELECT
  USING (
    application_id IN (
      SELECT id FROM assessment_applications 
      WHERE company_id IN (
        SELECT company_id FROM company_users WHERE profile_id = auth.uid()
      )
    )
  );

CREATE POLICY "Psychologists can view responses from authorized companies"
  ON responses FOR SELECT
  USING (
    application_id IN (
      SELECT aa.id FROM assessment_applications aa
      JOIN psychologist_companies pc ON aa.company_id = pc.company_id
      WHERE pc.psychologist_id IN (
        SELECT id FROM psychologists WHERE profile_id = auth.uid()
      )
    )
  );

-- Quiz results policies
CREATE POLICY "Companies can view results for their applications"
  ON quiz_results FOR SELECT
  USING (
    application_id IN (
      SELECT id FROM assessment_applications 
      WHERE company_id IN (
        SELECT company_id FROM company_users WHERE profile_id = auth.uid()
      )
    )
  );

CREATE POLICY "Psychologists can view results from authorized companies"
  ON quiz_results FOR SELECT
  USING (
    application_id IN (
      SELECT aa.id FROM assessment_applications aa
      JOIN psychologist_companies pc ON aa.company_id = pc.company_id
      WHERE pc.psychologist_id IN (
        SELECT id FROM psychologists WHERE profile_id = auth.uid()
      )
    )
  );

-- Fix the trigger function to include search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;