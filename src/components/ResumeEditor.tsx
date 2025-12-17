'use client';

import React from 'react';
import {
  Briefcase,
  User,
  FileText,
  Send,
  Download,
  Sparkles,
  ChevronRight,
  Plus,
  Trash2,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  BrainCircuit,
  MessageSquare,
  Target,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Wand2,
    Copy,
  Link as LinkIcon
} from 'lucide-react';

import { InputField } from './ui/InputField';
import { useResume } from '@/hooks/useResume';
import { aiService } from '@/lib/ai-client';
import { copyToClipboard, generateResumePDF } from '@/lib/utils';
import { JobSearchDemo } from './JobSearchDemo';

export const ResumeEditor: React.FC = () => {
  const {
    activeTab,
    profile,
    jobData,
    generatedContent,
    aiStatus,
    optimizingField,
    suggestionsMap,
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
    updateGeneratedContent
  } = useResume();

  const handleGenerate = async () => {
    if (!jobData.description) {
      alert('请先在"目标职位"页面输入职位描述');
      setActiveTab('job');
      return;
    }

    updateAIStatus({ isGenerating: true });
    setActiveTab('preview');

    try {
      const result = await aiService.generateAllContent(profile, jobData.description);

      if (result.success) {
        updateGeneratedContent({
          coverLetter: result.coverLetter || '',
          tailoredSummary: result.tailoredSummary || ''
        });
      } else {
        console.error('Generation failed:', result.errors);
        alert('生成失败，请重试');
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('生成失败，请重试');
    } finally {
      updateAIStatus({ isGenerating: false });
    }
  };

  const handleOptimizeExperience = async (id: number, text: string) => {
    const key = `exp-${id}`;
    setOptimizing(key);

    try {
      const result = await aiService.optimizeExperience(text);
      if (result.success && result.data) {
        setSuggestions(key, result.data);
      } else {
        alert('润色失败，请重试');
      }
    } catch (error) {
      console.error('Optimization failed:', error);
      alert('润色失败，请重试');
    } finally {
      setOptimizing(null);
    }
  };

  const handleGenerateInterview = async () => {
    if (!jobData.description) {
      alert('请先输入职位描述');
      setActiveTab('job');
      return;
    }

    updateAIStatus({ isInterviewLoading: true });

    try {
      const result = await aiService.generateInterviewQuestions(profile, jobData.description);
      if (result.success && result.data) {
        updateGeneratedContent({ interviewQuestions: result.data });
      }
    } catch (error) {
      console.error('Interview generation failed:', error);
    } finally {
      updateAIStatus({ isInterviewLoading: false });
    }
  };

  const handleAnalyzeSkills = async () => {
    if (!jobData.description) return;

    updateAIStatus({ isAnalyzing: { ...aiStatus.isAnalyzing, skills: true } });

    try {
      const result = await aiService.analyzeSkillsGap(profile, jobData.description);
      if (result.success && result.data) {
        updateGeneratedContent({ skillsAnalysis: result.data });
      }
    } catch (error) {
      console.error('Skills analysis failed:', error);
    } finally {
      updateAIStatus({ isAnalyzing: { ...aiStatus.isAnalyzing, skills: false } });
    }
  };

  const handleResumeCritique = async () => {
    if (!jobData.description) return;

    updateAIStatus({ isAnalyzing: { ...aiStatus.isAnalyzing, critique: true } });

    try {
      const result = await aiService.critiqueResume(profile, jobData.description);
      if (result.success && result.data) {
        updateGeneratedContent({ resumeCritique: result.data });
      }
    } catch (error) {
      console.error('Resume critique failed:', error);
    } finally {
      updateAIStatus({ isAnalyzing: { ...aiStatus.isAnalyzing, critique: false } });
    }
  };

  
  
  const handlePrint = () => {
    generateResumePDF();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans print:bg-white">
      {/* 顶部导航栏 - 打印时隐藏 */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-indigo-600 mr-2" />
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  智简简历 SmartResume
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                   LINKEDIN JOB MATCHER
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <BrainCircuit className="w-3 h-3 mr-1" />
                Mulerun AI Connected
              </div>
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Download className="w-4 h-4 mr-2" />
                导出 PDF
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">

          {/* 左侧：编辑区 (打印时隐藏) */}
          <div className="hidden lg:block lg:col-span-4 space-y-6 print:hidden">
            {/* 步骤导航 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-shrink-0 py-3 px-3 text-sm font-medium text-center whitespace-nowrap ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  1. 我的资料
                </button>
                <button
                  onClick={() => setActiveTab('job')}
                  className={`flex-shrink-0 py-3 px-3 text-sm font-medium text-center whitespace-nowrap ${activeTab === 'job' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  2. 目标职位
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`flex-shrink-0 py-3 px-3 text-sm font-medium text-center whitespace-nowrap flex items-center justify-center ${activeTab === 'analysis' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  智能分析
                </button>
                <button
                  onClick={() => setActiveTab('interview')}
                  className={`flex-shrink-0 py-3 px-3 text-sm font-medium text-center whitespace-nowrap flex items-center justify-center ${activeTab === 'interview' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  面试辅导
                </button>
                              </div>

              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                {activeTab === 'profile' && (
                  <div className="space-y-6 animate-fadeIn">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2" /> 个人基础信息
                    </h3>
                    <InputField label="姓名" value={profile.name} onChange={(v) => handleProfileChange('name', v)} />
                    <InputField label="当前头衔" value={profile.role} onChange={(v) => handleProfileChange('role', v)} />
                    <InputField label="邮箱" value={profile.email} onChange={(v) => handleProfileChange('email', v)} type="email" />
                    <InputField label="电话" value={profile.phone} onChange={(v) => handleProfileChange('phone', v)} type="tel" />
                    <InputField label="地址" value={profile.location} onChange={(v) => handleProfileChange('location', v)} />
                    <InputField label="LinkedIn" value={profile.linkedin} onChange={(v) => handleProfileChange('linkedin', v)} type="url" />
                    <InputField label="GitHub" value={profile.github} onChange={(v) => handleProfileChange('github', v)} type="url" />

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">个人总结 (Summary)</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm min-h-[80px]"
                        value={profile.summary}
                        onChange={(e) => handleProfileChange('summary', e.target.value)}
                        placeholder="简单介绍一下自己..."
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                        <Briefcase className="w-5 h-5 mr-2" /> 工作经历
                      </h3>
                      {profile.experience.map((exp) => (
                        <div key={exp.id} className="bg-gray-50 p-4 rounded-lg mb-4 relative group">
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <InputField label="公司" value={exp.company} onChange={(v) => updateExperience(exp.id, 'company', v)} />
                          <InputField label="职位" value={exp.role} onChange={(v) => updateExperience(exp.id, 'role', v)} />
                          <InputField label="时间段" value={exp.period} onChange={(v) => updateExperience(exp.id, 'period', v)} />
                          <InputField
                            label="工作内容 (点击 'AI 润色' 优化)"
                            multiline
                            value={exp.description}
                            onChange={(v) => updateExperience(exp.id, 'description', v)}
                            onOptimize={() => handleOptimizeExperience(exp.id, exp.description)}
                            isOptimizing={optimizingField === `exp-${exp.id}`}
                            suggestions={suggestionsMap[`exp-${exp.id}`]}
                          />
                        </div>
                      ))}
                      <button
                        onClick={addExperience}
                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center text-sm font-medium"
                      >
                        <Plus className="w-4 h-4 mr-1" /> 添加经历
                      </button>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">技能列表 (逗号分隔)</h3>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        value={profile.skills.join(', ')}
                        onChange={(e) => handleProfileChange('skills', e.target.value.split(',').map(s => s.trim()))}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'job' && (
                  <div className="space-y-6 animate-fadeIn">
                     <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-lg border border-indigo-100 shadow-sm">
                       <h3 className="font-bold text-indigo-900 mb-2 flex items-center">
                         <Target className="w-4 h-4 mr-2" />
                         职位详细信息
                       </h3>
                       <p className="text-sm text-indigo-700 mb-0">
                         填写目标职位的详细信息，AI 将为您**重写简历摘要**并**生成求职信**，最大化匹配度。
                       </p>
                     </div>

                     {/* 职位基本信息 */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <InputField
                         label="职位名称"
                         value={jobData.title}
                         onChange={(v) => handleJobDataChange('title', v)}
                         placeholder="e.g. Senior Frontend Engineer"
                       />
                       <InputField
                         label="工作地点"
                         value={jobData.location}
                         onChange={(v) => handleJobDataChange('location', v)}
                         placeholder="e.g. San Francisco, CA"
                       />
                     </div>

                     {/* 公司名称（支持多个） */}
                     <div className="mb-4">
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         公司名称 <span className="text-gray-400 text-xs">（可添加多个）</span>
                       </label>
                       {jobData.companies.map((company, index) => (
                         <div key={index} className="flex gap-2 mb-2">
                           <input
                             type="text"
                             className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                             value={company}
                             onChange={(e) => updateCompany(index, e.target.value)}
                             placeholder="e.g. Google, Microsoft, etc."
                           />
                           {jobData.companies.length > 1 && (
                             <button
                               onClick={() => removeCompany(index)}
                               className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           )}
                         </div>
                       ))}
                       <button
                         onClick={addCompany}
                         className="w-full py-2 px-4 border border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-800 flex items-center justify-center"
                       >
                         <Plus className="w-4 h-4 mr-2" />
                         添加更多公司
                       </button>
                     </div>

                     {/* 职位选项 */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="mb-4">
                         <label className="block text-sm font-medium text-gray-700 mb-1">经验水平</label>
                         <select
                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                           value={jobData.experienceLevel}
                           onChange={(e) => handleJobDataChange('experienceLevel', e.target.value)}
                         >
                           <option value="Intern">Intern</option>
                           <option value="Assistant">Assistant</option>
                           <option value="Junior">Junior</option>
                           <option value="Mid-Senior">Mid-Senior</option>
                           <option value="Director">Director</option>
                           <option value="Executive">Executive</option>
                         </select>
                       </div>

                       <div className="mb-4">
                         <label className="block text-sm font-medium text-gray-700 mb-1">工作类型</label>
                         <select
                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                           value={jobData.employmentType}
                           onChange={(e) => handleJobDataChange('employmentType', e.target.value)}
                         >
                           <option value="Full-time">Full-time</option>
                           <option value="Part-time">Part-time</option>
                           <option value="Contract">Contract</option>
                           <option value="Temporary">Temporary</option>
                           <option value="Volunteer">Volunteer</option>
                           <option value="Internship">Internship</option>
                           <option value="Other">Other</option>
                         </select>
                       </div>

                       <div className="mb-4">
                         <label className="block text-sm font-medium text-gray-700 mb-1">工作安排</label>
                         <select
                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                           value={jobData.workArrangement}
                           onChange={(e) => handleJobDataChange('workArrangement', e.target.value)}
                         >
                           <option value="On-site">On-site</option>
                           <option value="Remote">Remote</option>
                           <option value="Hybrid">Hybrid</option>
                         </select>
                       </div>
                     </div>

                     <div className="mb-4">
                       <label className="block text-sm font-medium text-gray-700 mb-1">职位发布时间</label>
                       <select
                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                         value={jobData.postingTime}
                         onChange={(e) => handleJobDataChange('postingTime', e.target.value)}
                       >
                         <option value="Any Time">Any Time</option>
                         <option value="Past 24 hours">Past 24 hours</option>
                         <option value="Past Week">Past Week</option>
                         <option value="Past Month">Past Month</option>
                       </select>
                     </div>

                     {/* Selected Job Display */}
                    {jobData.selectedJob ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-green-900 mb-1">Selected Job</h4>
                            <p className="text-green-800 font-medium">{jobData.selectedJob.job_title}</p>
                            <p className="text-green-700 text-sm">{jobData.selectedJob.company_name} • {jobData.selectedJob.location}</p>
                          </div>
                          <button
                            onClick={clearSelectedJob}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Clear Selection
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-blue-700 text-sm">
                          Search for jobs below to find positions that match your criteria. Select a job to automatically fill in the details and generate tailored content.
                        </p>
                      </div>
                    )}

                    {/* Job Search Component */}
                    <JobSearchDemo
                      searchParams={{
                        title: jobData.title,
                        location: jobData.location,
                        companies: jobData.companies,
                        experienceLevel: jobData.experienceLevel,
                        employmentType: jobData.employmentType,
                        workArrangement: jobData.workArrangement,
                        postingTime: jobData.postingTime,
                      }}
                      onSearchParamsChange={(params) => {
                        handleJobDataChange('title', params.title);
                        handleJobDataChange('location', params.location);
                        handleJobDataChange('companies', params.companies);
                        handleJobDataChange('experienceLevel', params.experienceLevel);
                        handleJobDataChange('employmentType', params.employmentType);
                        handleJobDataChange('workArrangement', params.workArrangement);
                        handleJobDataChange('postingTime', params.postingTime);
                      }}
                      onJobSelect={selectJob}
                    />

                    <button
                      onClick={handleGenerate}
                      disabled={aiStatus.isGenerating || !jobData.description}
                      className={`w-full py-4 px-4 rounded-xl shadow-lg text-white font-bold text-lg flex items-center justify-center transition-all transform
                        ${aiStatus.isGenerating || !jobData.description ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] hover:shadow-xl'}
                      `}
                    >
                      {aiStatus.isGenerating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          AI 正在深度分析匹配度...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          生成求职信 & 优化简历
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* 其他标签页内容... */}
                {activeTab === 'analysis' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 mb-4 border border-blue-100">
                      <p className="font-semibold mb-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> 深度诊断</p>
                      Mulerun AI 将全方位分析您的竞争力，找出技能缺口并给予专业评分。
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-blue-600" />
                        技能差距分析
                      </h3>
                      {!generatedContent.skillsAnalysis ? (
                        <button
                          onClick={handleAnalyzeSkills}
                          disabled={!jobData.description || aiStatus.isAnalyzing.skills}
                          className="w-full py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 disabled:opacity-50"
                        >
                          {aiStatus.isAnalyzing.skills ? '分析中...' : '开始技能匹配'}
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs text-green-600 font-semibold uppercase flex items-center mb-1">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Matching
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {generatedContent.skillsAnalysis.matching_skills.map((s, i) => (
                                <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">{s}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-red-500 font-semibold uppercase flex items-center mb-1">
                              <XCircle className="w-3 h-3 mr-1" /> Missing / To Improve
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {generatedContent.skillsAnalysis.missing_skills.map((s, i) => (
                                <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">{s}</span>
                              ))}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 italic mt-2 bg-gray-50 p-2 rounded">
                            "{generatedContent.skillsAnalysis.advice}"
                          </div>
                          <button onClick={handleAnalyzeSkills} className="text-xs text-blue-500 hover:underline mt-1">重新分析</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'interview' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-purple-50 p-4 rounded-lg text-sm text-purple-700 mb-4 border border-purple-100">
                      <p className="font-semibold mb-1 flex items-center"><BrainCircuit className="w-3 h-3 mr-1" /> AI 面试教练</p>
                      Mulerun AI 将分析您的简历和 JD，预测可能的面试题并给出回答建议。
                    </div>

                    {!generatedContent.interviewQuestions.length && !aiStatus.isInterviewLoading && (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-4">暂无数据，请先输入 JD</p>
                        <button
                          onClick={handleGenerateInterview}
                          disabled={!jobData.description}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          生成面试预测
                        </button>
                      </div>
                    )}

                    {aiStatus.isInterviewLoading && (
                      <div className="text-center py-12">
                         <svg className="animate-spin h-8 w-8 text-purple-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-purple-600">正在分析职位要求...</p>
                      </div>
                    )}

                    {generatedContent.interviewQuestions.length > 0 && (
                      <div className="space-y-4">
                         {generatedContent.interviewQuestions.map((item, idx) => (
                           <div key={idx} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                             <h4 className="font-bold text-gray-800 mb-2 flex items-start">
                               <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded mr-2 mt-0.5">Q{idx+1}</span>
                               {item.question}
                             </h4>
                             <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                               <span className="font-semibold text-gray-500 block mb-1 uppercase text-xs">AI Tip:</span>
                               {item.tip}
                             </div>
                           </div>
                         ))}
                         <button
                          onClick={handleGenerateInterview}
                          className="w-full mt-4 py-2 text-sm text-purple-600 border border-purple-200 rounded hover:bg-purple-50"
                        >
                          重新生成问题
                        </button>
                      </div>
                    )}
                  </div>
                )}

                              </div>
            </div>
          </div>

          {/* 右侧：预览区 */}
          <div className="col-span-12 lg:col-span-8 print:col-span-12 print:w-full">
            {/* 预览控制栏 (打印时隐藏) */}
            <div className="lg:hidden mb-4 print:hidden">
              <button
                 onClick={() => setActiveTab(activeTab === 'profile' || activeTab === 'job' ? 'preview' : 'profile')}
                 className="w-full bg-white border border-gray-300 py-2 px-4 rounded-md text-sm font-medium text-gray-700 shadow-sm"
              >
                {activeTab === 'preview' ? '返回编辑' : '查看预览'}
              </button>
            </div>

            <div className={`bg-white shadow-2xl print:shadow-none min-h-[1123px] w-full max-w-[210mm] mx-auto print:max-w-none print:mx-0 p-[15mm] print:p-0 ${activeTab !== 'preview' && 'hidden lg:block'}`}>

              {/* === 简历主体 (A4 样式) === */}
              <div id="resume-preview" className="space-y-6 text-gray-800">

                {/* Header */}
                <header className="border-b-2 border-gray-800 pb-6 mb-6">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 uppercase mb-2">{profile.name}</h1>
                  <p className="text-xl text-gray-600 mb-4">{profile.role}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {profile.email && <div className="flex items-center"><Mail className="w-4 h-4 mr-1" /> {profile.email}</div>}
                    {profile.phone && <div className="flex items-center"><Phone className="w-4 h-4 mr-1" /> {profile.phone}</div>}
                    {profile.location && <div className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {profile.location}</div>}
                    {profile.linkedin && <div className="flex items-center"><Linkedin className="w-4 h-4 mr-1" /> {profile.linkedin}</div>}
                    {profile.github && <div className="flex items-center"><Github className="w-4 h-4 mr-1" /> {profile.github}</div>}
                  </div>
                </header>

                {/* AI Generated Section Alert (只在生成后显示) */}
                {generatedContent.tailoredSummary ? (
                   <section className="mb-6 group relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity print:hidden" title="AI Tailored Content"></div>
                    <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-indigo-700 flex items-center justify-between">
                      Professional Summary
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full lowercase font-normal print:hidden flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" /> tailored for {jobData.companies.filter(c => c).join(', ') || 'Job'}
                      </span>
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {generatedContent.tailoredSummary}
                    </p>
                  </section>
                ) : (
                  <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">Professional Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
                  </section>
                )}

                {/* Experience */}
                <section className="mb-6">
                  <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-4">Experience</h2>
                  <div className="space-y-5">
                    {profile.experience.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-base font-bold text-gray-900">{exp.role}</h3>
                          <span className="text-sm font-medium text-gray-600">{exp.period}</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-700 mb-2">{exp.company}</div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Skills */}
                <section className="mb-6">
                  <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 print:bg-transparent print:border print:border-gray-300 px-3 py-1 rounded text-sm font-medium text-gray-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                 {/* Education */}
                 <section className="mb-6">
                  <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">Education</h2>
                  {profile.education.map(edu => (
                    <div key={edu.id} className="mb-2">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-base font-bold text-gray-900">{edu.school}</h3>
                        <span className="text-sm font-medium text-gray-600">{edu.period}</span>
                      </div>
                      <div className="text-sm text-gray-700">{edu.degree}</div>
                    </div>
                  ))}
                </section>

                {/* Cover Letter Page Break (如果有内容) */}
                {generatedContent.coverLetter && (
                  <>
                    <div className="print:break-before-page mt-12 pt-12 border-t-4 border-gray-200 print:border-none"></div>
                    <div className="min-h-[1000px]">
                      <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Cover Letter</h2>
                      <div className="text-base leading-7 text-gray-800 whitespace-pre-line font-serif">
                        {generatedContent.coverLetter}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 text-center text-gray-400 text-sm print:hidden pb-8">
              Tip: 使用 Ctrl+P (或 Cmd+P) 并选择 "保存为 PDF" 即可导出高清晰度简历。
              <br/>
              系统会自动移除编辑栏和按钮。
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media print {
          @page { margin: 0; }
          body { background: white; }
          /* 隐藏不需要打印的元素 */
          nav, button, .print\\:hidden { display: none !important; }
          /* 确保预览区占满全宽 */
          .print\\:w-full { width: 100% !important; max-width: none !important; }
          .print\\:col-span-12 { grid-column: span 12 / span 12 !important; }
          /* 移除阴影 */
          .shadow-2xl { box-shadow: none !important; }
          /* 移除背景色和边框以适应黑白打印 */
          .bg-indigo-50 { background-color: transparent !important; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};