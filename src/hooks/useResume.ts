'use client';

import { useState, useCallback } from 'react';
import {
  Profile,
  JobData,
  GeneratedContent,
  AIStatus,
  Experience
} from '@/types/resume';

const defaultProfile: Profile = {
  name: 'Alex Chen',
  role: 'Full Stack Developer',
  email: 'alex.chen@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/alexc',
  github: 'github.com/alexc',
  summary: 'Passionate developer with 5+ years of experience in building scalable web applications.',
  skills: ['React', 'Node.js', 'Python', 'AWS', 'TypeScript'],
  experience: [
    {
      id: 1,
      role: 'Senior Developer',
      company: 'Tech Solutions Inc.',
      period: '2021 - Present',
      description: 'Led a team of 5 developers to build a SaaS platform. Improved performance by 40%.'
    },
    {
      id: 2,
      role: 'Web Developer',
      company: 'Creative Agency',
      period: '2019 - 2021',
      description: 'Developed responsive websites for 20+ clients using modern frontend technologies.'
    }
  ],
  education: [
    {
      id: 1,
      degree: 'BS Computer Science',
      school: 'University of Technology',
      period: '2015 - 2019'
    }
  ]
};

const defaultJobData: JobData = {
  title: '',
  location: '',
  companies: [''],
  experienceLevel: 'Junior',
  employmentType: 'Full-time',
  workArrangement: 'On-site',
  postingTime: 'Any Time',
  description: ''
};

const defaultAIStatus: AIStatus = {
  isGenerating: false,
  isInterviewLoading: false,
  isJobSearching: false,
  isAnalyzing: {
    skills: false,
    critique: false
  }
};

const defaultGeneratedContent: GeneratedContent = {
  coverLetter: '',
  tailoredSummary: '',
  interviewQuestions: [],
  skillsAnalysis: null,
  resumeCritique: null
};

export const useResume = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'job' | 'preview' | 'interview' | 'analysis'>('profile');
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [jobData, setJobData] = useState<JobData>(defaultJobData);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>(defaultGeneratedContent);
  const [aiStatus, setAIStatus] = useState<AIStatus>(defaultAIStatus);

  // 润色状态
  const [optimizingField, setOptimizingField] = useState<string | null>(null);
  const [suggestionsMap, setSuggestionsMap] = useState<Record<string, string[]>>({});

  const handleProfileChange = useCallback((field: keyof Profile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleJobDataChange = useCallback((field: keyof JobData, value: string | string[]) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Companies management functions
  const addCompany = useCallback(() => {
    setJobData(prev => ({
      ...prev,
      companies: [...prev.companies, '']
    }));
  }, []);

  const updateCompany = useCallback((index: number, value: string) => {
    setJobData(prev => ({
      ...prev,
      companies: prev.companies.map((company, i) => i === index ? value : company)
    }));
  }, []);

  const removeCompany = useCallback((index: number) => {
    setJobData(prev => ({
      ...prev,
      companies: prev.companies.filter((_, i) => i !== index)
    }));
  }, []);

  // Job search related functions
  const selectJob = useCallback((job: any) => {
    setJobData(prev => ({
      ...prev,
      selectedJob: job,
      title: job.job_title,
      location: job.location,
      companies: [job.company_name],
      description: job.job_description
    }));
  }, []);

  const clearSelectedJob = useCallback(() => {
    setJobData(prev => ({
      ...prev,
      selectedJob: undefined,
      description: ''
    }));
  }, []);

  const addExperience = useCallback(() => {
    const newExperience: Experience = {
      id: Date.now(),
      role: '',
      company: '',
      period: '',
      description: ''
    };
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  }, []);

  const updateExperience = useCallback((id: number, field: keyof Experience, value: string) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));

    // 清除该字段的建议
    if (field === 'description') {
      setSuggestionsMap(prev => {
        const next = { ...prev };
        delete next[`exp-${id}`];
        return next;
      });
    }
  }, []);

  const removeExperience = useCallback((id: number) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  }, []);

  const addEducation = useCallback(() => {
    const newEducation = {
      id: Date.now(),
      degree: '',
      school: '',
      period: ''
    };
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  }, []);

  const updateEducation = useCallback((id: number, field: any, value: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  }, []);

  const removeEducation = useCallback((id: number) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  }, []);

  const setOptimizing = useCallback((field: string | null) => {
    setOptimizingField(field);
  }, []);

  const setSuggestions = useCallback((field: string, suggestions: string[]) => {
    setSuggestionsMap(prev => ({ ...prev, [field]: suggestions }));
  }, []);

  const updateAIStatus = useCallback((updates: Partial<AIStatus>) => {
    setAIStatus(prev => ({ ...prev, ...updates }));
  }, []);

  const updateGeneratedContent = useCallback((updates: Partial<GeneratedContent>) => {
    setGeneratedContent(prev => ({ ...prev, ...updates }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setProfile(defaultProfile);
    setJobData(defaultJobData);
    setGeneratedContent(defaultGeneratedContent);
    setAIStatus(defaultAIStatus);
    setOptimizingField(null);
    setSuggestionsMap({});
  }, []);

  return {
    // State
    activeTab,
    profile,
    jobData,
    generatedContent,
    aiStatus,
    optimizingField,
    suggestionsMap,

    // Actions
    setActiveTab,
    handleProfileChange,
    handleJobDataChange,
    addCompany,
    updateCompany,
    removeCompany,
    selectJob,
    clearSelectedJob,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    setOptimizing,
    setSuggestions,
    updateAIStatus,
    updateGeneratedContent,
    resetToDefaults
  };
};