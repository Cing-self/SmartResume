// 简历相关类型定义

export interface Profile {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: number;
  degree: string;
  school: string;
  period: string;
}

export interface JobData {
  title: string;
  company: string;
  location: string;
  type: string;
  workMode: string;
  level: string;
  salary: string;
  description: string;
  selectedJob?: ApifyJobResult;
}

export interface ApifyJobResult {
  company_logo_url: string;
  company_name: string;
  job_title: string;
  job_url: string;
  apply_url: string;
  company_url: string;
  location: string;
  time_posted: string;
  num_applicants: string;
  job_description: string;
  job_id: string;
  seniority_level: string;
  job_function: string;
  industries: string;
  employment_type: string;
  salary_range: string | null;
  easy_apply: boolean;
  job_description_raw_html: string;
}

export interface GeneratedContent {
  coverLetter: string;
  tailoredSummary: string;
  interviewQuestions: InterviewQuestion[];
  skillsAnalysis: SkillsAnalysis | null;
  resumeCritique: ResumeCritique | null;
}

export interface InterviewQuestion {
  question: string;
  tip: string;
}

export interface SkillsAnalysis {
  matching_skills: string[];
  missing_skills: string[];
  advice: string;
}

export interface ResumeCritique {
  score: number;
  pros: string[];
  cons: string[];
  verdict: string;
}

export interface AIStatus {
  isGenerating: boolean;
  isInterviewLoading: boolean;
  isJobSearching: boolean;
  isAnalyzing: {
    skills: boolean;
    critique: boolean;
  };
}