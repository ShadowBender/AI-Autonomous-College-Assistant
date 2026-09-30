-- Netlify DB / PostgreSQL Relational Database Schema
-- Project: AI-Autonomous-College-Assistant

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Accounts
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    university_name VARCHAR(150),
    major_department VARCHAR(100),
    academic_year INT CHECK (academic_year BETWEEN 1 AND 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Document Knowledge Base (RAG Ingestion Tracker)
CREATE TABLE documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) DEFAULT 'pdf',
    course_code VARCHAR(20),
    department VARCHAR(100),
    parsed_status VARCHAR(20) CHECK (parsed_status IN ('pending', 'processing', 'indexed', 'failed')) DEFAULT 'pending',
    total_chunks INT DEFAULT 0,
    uploaded_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. AI Generated Study Roadmaps
CREATE TABLE study_plans (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_code VARCHAR(20) NOT NULL,
    course_title VARCHAR(200) NOT NULL,
    target_completion_date DATE,
    roadmap_data JSONB NOT NULL,
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'archived')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Student Task Board & Schedule
CREATE TABLE tasks (
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    plan_id UUID REFERENCES study_plans(plan_id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) CHECK (category IN ('academic', 'career', 'exam', 'assignment')) DEFAULT 'academic',
    status VARCHAR(20) CHECK (status IN ('todo', 'in_progress', 'completed')) DEFAULT 'todo',
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Speed Optimization
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_docs_course ON documents(course_code);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_study_plans_user ON study_plans(user_id);