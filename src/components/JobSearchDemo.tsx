'use client';

import React, { useState } from 'react';
import {
  Search,
  Briefcase,
  Building,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  Loader2,
  Monitor,
  Award,
  CheckCircle2,
  ArrowRight,
  XCircle
} from 'lucide-react';
import { searchJobs } from '@/lib/apify-service';
import type { ApifyJobResult } from '@/types/resume';

interface JobSearchParams {
  title: string;
  location: string;
  companies: string[];
  experienceLevel: string;
  employmentType: string;
  workArrangement: string;
  postingTime: string;
}

interface JobSearchDemoProps {
  onJobSelect: (job: ApifyJobResult) => void;
  searchParams: JobSearchParams;
  onSearchParamsChange: (params: JobSearchParams) => void;
}

export const JobSearchDemo: React.FC<JobSearchDemoProps> = ({
  onJobSelect,
  searchParams,
  onSearchParamsChange
}) => {
  const [searchResults, setSearchResults] = useState<ApifyJobResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isJobSelected, setIsJobSelected] = useState(false);

  const handleInputChange = (field: keyof JobSearchParams, value: string | string[]) => {
    onSearchParamsChange({
      ...searchParams,
      [field]: value
    });
  };

  const addCompany = () => {
    handleInputChange('companies', [...searchParams.companies, '']);
  };

  const updateCompany = (index: number, value: string) => {
    const newCompanies = [...searchParams.companies];
    newCompanies[index] = value;
    handleInputChange('companies', newCompanies);
  };

  const removeCompany = (index: number) => {
    const newCompanies = searchParams.companies.filter((_, i) => i !== index);
    handleInputChange('companies', newCompanies);
  };

  const handleSearch = async () => {
    if (!searchParams.title && searchParams.companies.every(c => !c.trim())) {
      setSearchError('Please enter a job title or company name');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setHasSearched(true);

    try {
      const result = await searchJobs(searchParams);

      if (result.success && result.data) {
        setSearchResults(result.data);
        if (result.data.length === 0) {
          setSearchError('No jobs found matching your criteria');
        }
      } else {
        setSearchError(result.error || 'Failed to search jobs');
      }
    } catch (error) {
      setSearchError('An unexpected error occurred');
      console.error('Job search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectJob = (job: ApifyJobResult) => {
    onJobSelect(job);
    setIsJobSelected(true);
  };

  const resetJobSelection = () => {
    setIsJobSelected(false);
    setSearchResults([]);
  };

  const InputField = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    multiline = false,
    className = "",
    icon: Icon
  }: {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    multiline?: boolean;
    className?: string;
    icon?: any;
  }) => (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-1.5 text-gray-400" />}
        {label}
      </label>
      {multiline ? (
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] bg-gray-50 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );

  const SelectField = ({
    label,
    value,
    onChange,
    options,
    icon: Icon
  }: {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
    icon?: any;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-1.5 text-gray-400" />}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full px-3 py-2 text-sm border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-gray-50"
      >
        <option value="">Any / 不限</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  if (isJobSelected) {
    return (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-800 flex items-center">
            <CheckCircle2 className="text-green-500 w-5 h-5 mr-2" />
            搜索完成
          </h3>
          <button
            onClick={resetJobSelection}
            className="text-xs text-indigo-600 hover:underline"
          >
            重新搜索
          </button>
        </div>
        <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">职位名称</label>
              <p className="font-medium">{searchResults[0]?.job_title}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">公司名称</label>
              <p className="font-medium">{searchResults[0]?.company_name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!isJobSelected ? (
        <>
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                搜寻您的目标职位
              </h3>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-20 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50"
                  placeholder="e.g. Frontend Engineer, Software Developer"
                  value={searchParams.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <button
                  onClick={handleSearch}
                  disabled={isSearching || (!searchParams.title && searchParams.companies.every(c => !c.trim()))}
                  className="absolute right-2 top-1.5 bottom-1.5 bg-indigo-600 text-white px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-300 transition-colors"
                >
                  {isSearching ? '...' : '搜索'}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <InputField
                  label="职位名称"
                  value={searchParams.title}
                  onChange={(v) => handleInputChange('title', v)}
                  icon={Briefcase}
                  className="mb-3"
                />
                <InputField
                  label="工作地点"
                  value={searchParams.location}
                  onChange={(v) => handleInputChange('location', v)}
                  icon={MapPin}
                  className="mb-3"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Building className="w-4 h-4 mr-1.5 text-gray-400" />
                    公司名称
                  </label>
                  <button
                    onClick={addCompany}
                    className="text-xs text-indigo-600 font-medium hover:bg-indigo-50 px-2 py-1 rounded border border-indigo-200"
                  >
                    + 添加
                  </button>
                </div>
                <div className="space-y-2">
                  {searchParams.companies.map((company, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                        placeholder="公司名称"
                        value={company}
                        onChange={(e) => updateCompany(index, e.target.value)}
                      />
                      {searchParams.companies.length > 1 && (
                        <button
                          onClick={() => removeCompany(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-md text-sm"
                        >
                          删除
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="经验水平"
                  value={searchParams.experienceLevel}
                  onChange={(v) => handleInputChange('experienceLevel', v)}
                  options={[
                    'Intern',
                    'Assistant',
                    'Junior',
                    'Mid-Senior',
                    'Director',
                    'Executive'
                  ]}
                  icon={Award}
                />
                <SelectField
                  label="工作类型"
                  value={searchParams.employmentType}
                  onChange={(v) => handleInputChange('employmentType', v)}
                  options={[
                    'Full-time',
                    'Part-time',
                    'Contract',
                    'Temporary',
                    'Volunteer',
                    'Internship',
                    'Other'
                  ]}
                  icon={Briefcase}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="工作安排"
                  value={searchParams.workArrangement}
                  onChange={(v) => handleInputChange('workArrangement', v)}
                  options={[
                    'On-site',
                    'Remote',
                    'Hybrid'
                  ]}
                  icon={Monitor}
                />
                <SelectField
                  label="发布时间"
                  value={searchParams.postingTime}
                  onChange={(v) => handleInputChange('postingTime', v)}
                  options={[
                    'Any Time',
                    'Past 24 hours',
                    'Past Week',
                    'Past Month'
                  ]}
                  icon={Clock}
                />
              </div>
            </div>
          </div>

          {searchResults.length > 0 && !isSearching && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-medium px-1">
                找到 {searchResults.length} 个相关职位
              </p>
              {searchResults.map((job, index) => (
                <div
                  key={`${job.job_id}-${index}`}
                  onClick={() => selectJob(job)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-sm cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                      {job.job_title}
                    </h4>
                    <ArrowRight className="text-gray-400 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                  </div>

                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <Building className="w-3 h-3 mr-1 text-gray-400" />
                        {job.company_name}
                      </div>
                      {job.location && (
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                          {job.location}
                        </div>
                      )}
                    </div>

                    {(job.employment_type || job.time_posted) && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {job.employment_type && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                            {job.employment_type}
                          </span>
                        )}
                        {job.time_posted && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                            {job.time_posted}
                          </span>
                        )}
                        {job.salary_range && (
                          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs">
                            {job.salary_range}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && !isSearching && hasSearched && (
            <div className="text-center pt-4">
              <p className="text-gray-400 mb-2">未找到匹配的职位</p>
              <p className="text-sm text-gray-400">请尝试调整搜索条件</p>
            </div>
          )}

          {searchError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700 text-sm">{searchError}</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700 text-sm font-medium">
                已选择职位: {searchResults[0]?.job_title} @ {searchResults[0]?.company_name}
              </p>
            </div>
          </div>
          <button
            onClick={resetJobSelection}
            className="w-full py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center"
          >
            重新搜索职位
          </button>
        </div>
      )}
    </div>
  );
};