'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  User,
  FileText,
  Send,
  Download,
  Settings,
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
  Target,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Wand2,
  Search,
  Building,
  ArrowRight,
  RefreshCw,
  Upload,
  FileJson,
  Zap,
  Lightbulb,
  Clock,
  Globe,
  DollarSign,
  Briefcase as WorkIcon,
  Filter,
  Monitor,
  Award,
  Type,
  Palette,
  Layout,
  ZoomIn,
  ZoomOut,
  Eye,
  FileText as FileIcon,
  Scissors,
  RotateCcw,
  GraduationCap,
  Gauge,
  ExternalLink
} from 'lucide-react';
import { searchJobs } from '@/lib/apify-service';
import type { ApifyJobResult, JobData } from '@/types/resume';

// Helper Components
const FloatingStepper = ({ currentStep, setStep, steps }: { currentStep: number; setStep: (step: number) => void; steps: any[] }) => {
  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 print:hidden">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Steps</h3>
        {steps.map((step, index) => (
          <button
            key={index + 1}
            onClick={() => setStep(index + 1)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentStep === index + 1
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                : currentStep > index + 1
                ? 'text-green-600 hover:bg-gray-50'
                : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep > index + 1
                ? 'bg-green-100 text-green-600'
                : currentStep === index + 1
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {currentStep > index + 1 ? '✓' : index + 1}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{step.label}</div>
              <div className="text-xs text-gray-500">{step.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const CollapsibleSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  action
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  defaultOpen?: boolean;
  action?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-gray-400" />
          <h3 className="font-bold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {action}
          <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform ${
            isOpen ? 'rotate-90' : ''
          }`} />
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};

const SimpleInputField = ({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) => {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{label}</label>
      {multiline ? (
        <textarea
          className="w-full p-4 bg-gray-50 border-gray-200 rounded-xl text-sm"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className="w-full p-4 bg-gray-50 border-gray-200 rounded-xl text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};

const AnalysisDashboard = ({ analysis, isAnalyzing, onProceed }: { analysis: any; isAnalyzing: boolean; onProceed: () => void }) => {
  return (
    <div className="w-full max-w-2xl space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Analysis</h3>

        {isAnalyzing ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your resume against the job description...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-bold text-green-800 mb-2">Skills Match Analysis</h4>
              <p className="text-green-700 text-sm">Your resume matches 85% of the required skills</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">Recommendations</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Add more quantifiable achievements</li>
                <li>• Include keywords for ATS optimization</li>
                <li>• Highlight relevant experience</li>
              </ul>
            </div>

            <button onClick={onProceed} className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors">
              Generate Tailored Resume
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Analysis results will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ResumePreview = ({ profile, jobData, visualConfig, generatedContent }: { profile: any; jobData: any; visualConfig: any; generatedContent: any }) => {
  return (
    <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg">
      <div className="p-8">
        <header className="border-b pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name || 'Your Name'}</h1>
          <p className="text-xl text-gray-600 mb-4">{profile.role || 'Your Role'}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>{profile.email || 'email@example.com'}</span>
            <span>{profile.phone || '(555) 123-4567'}</span>
            <span>{profile.location || 'City, State'}</span>
          </div>
        </header>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">
            {generatedContent?.tailoredSummary || profile.summary || 'Your professional summary will appear here...'}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Experience</h2>
          {profile.experience?.map((exp: any) => (
            <div key={exp.id} className="mb-4">
              <h3 className="font-bold text-gray-900">{exp.role}</h3>
              <p className="text-gray-600">{exp.company} • {exp.period}</p>
              <p className="text-gray-700 mt-2">{exp.description}</p>
            </div>
          )) || <p className="text-gray-500">Experience will be shown here</p>}
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills?.map((skill: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {skill}
              </span>
            )) || <p className="text-gray-500">Skills will be shown here</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Mulerun AI Integration ---
const generateAIContent = async (prompt: string): Promise<string> => {
  const API_BASE = process.env.NEXT_PUBLIC_MULERUN_API_BASE || 'https://api.mulerun.ai';
  const API_KEY = process.env.NEXT_PUBLIC_MULERUN_API_KEY;

  if (!API_KEY) {
    return `[Demo Mode - API Key Required]\n\nMulerun AI service unavailable. Please configure API key.`;
  }

  try {
    const response = await fetch(`${API_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    return text || "AI service temporarily unavailable.";
  } catch (error) {
    console.error("Mulerun AI Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `[Demo Mode - API Limited]\n\nAI service unavailable: ${errorMessage}`;
  }
};

// Helper: Build Prompts
const buildPrompt = (type: string, data: any, context?: any): string => {
  const dataStr = typeof data === 'string' ? data : JSON.stringify(data);

  if (type === 'parse_resume') {
    return `You are a professional resume parser. Analyze the following resume text and extract key information into strict JSON format.

    Resume Text:
    "${dataStr}"

    Extract the following fields (return empty string or empty array if not found):
    - name (string)
    - role (string): Current or most recent job title
    - email (string)
    - phone (string)
    - location (string)
    - linkedin (string): URL
    - github (string): URL
    - summary (string): Professional summary
    - skills (array of strings)
    - experience (array of objects): { "id": 1, "company": "...", "role": "...", "period": "...", "description": "..." }. Keep description detailed; if it's a list, separate by newlines.
    - education (array of objects): { "id": 1, "school": "...", "degree": "...", "period": "..." }

    Requirements:
    1. Return ONLY pure JSON string. No Markdown code blocks (e.g., \`\`\`json).
    2. Ensure valid JSON format.`;
  }

  if (type === 'tailored_summary') {
    return `You are an expert Resume Writer. Rewrite the candidate's Professional Summary to target the specific Job Description (JD).

    Original Summary: ${data.summary}
    Target JD: ${JSON.stringify(context)}

    Requirements:
    1. Incorporate 2-3 core keywords from the JD.
    2. Emphasize experience most relevant to the role.
    3. Keep it professional, impactful, and between 40-60 words.
    4. Output the text directly.`;
  }

  if (type === 'tailored_experience') {
    return `You are a Senior Technical Recruiter. Optimize the candidate's work experience to match the Target JD.

    Target JD: ${JSON.stringify(context)}
    Candidate Experience: ${JSON.stringify(data.experience)}

    Requirements:
    1. Retain the original truth but swap generic terms for JD-specific keywords (e.g., change "Backend Scaling" to "Distributed Systems Scaling" if JD emphasizes it).
    2. Use the STAR method (Situation, Task, Action, Result) to make bullets punchy.
    3. Return a JSON array with the same structure, containing only "id" and "description" fields.
    4. Strict JSON format only.`;
  }

  if (type === 'skills_analysis') {
    return `Perform a Skills Gap Analysis comparing the resume to the JD.

    Resume: ${dataStr}
    JD Description: ${context.description}

    Requirements:
    1. "matching_skills": Skills the candidate has that are in the JD.
    2. "missing_skills": Key skills in the JD that are missing from the resume.
    3. "advice": A one-sentence actionable tip.
    4. Output strict JSON: {"matching_skills": [], "missing_skills": [], "advice": ""}
    5. No Markdown.`;
  }

  if (type === 'optimize_experience') {
    return `You are a professional Resume Writer. Optimize the following work experience description to be more impactful, using strong action verbs and the STAR method.

    Original Description: "${dataStr}"

    Requirements:
    1. Provide 3 different optimized versions.
    2. Keep them concise but powerful.
    3. Output as a JSON string array: ["Version 1...", "Version 2...", "Version 3..."]
    4. No Markdown tags.`;
  }

  return "";
};

// --- Components ---

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline = false,
  onOptimize,
  isOptimizing,
  suggestions,
  className,
  icon: Icon
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  onOptimize?: () => void;
  isOptimizing?: boolean;
  suggestions?: string[];
  className?: string;
  icon?: any;
}) => (
  <div className={`mb-4 ${className || ''}`}>
    <div className="flex justify-between items-center mb-1">
      <label className="block text-sm font-medium text-gray-700 flex items-center">
        {Icon && <Icon className="w-3.5 h-3.5 mr-1.5 text-gray-400" />}
        {label}
      </label>
      {onOptimize && value && value.length > 10 && (
        <button
          onClick={onOptimize}
          disabled={isOptimizing}
          className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded transition-colors"
          title="Polish with AI"
        >
          {isOptimizing ? <span className="animate-spin mr-1">⏳</span> : <Wand2 className="w-3 h-3 mr-1" />}
          AI Polish
        </button>
      )}
    </div>
    {multiline ? (
      <div className="space-y-2">
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {suggestions && suggestions.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3 animate-fadeIn">
            <p className="text-xs font-bold text-indigo-700 mb-2 flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> Select a version to replace:
            </p>
            <div className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => onChange(suggestion)}
                  className="block w-full text-left text-xs text-gray-700 hover:bg-white p-2 rounded border border-transparent hover:border-indigo-200 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    ) : (
      <input
        type={type}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        value={value}
        onChange={e => onChange(e.target.value)}
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
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
      {Icon && <Icon className="w-3.5 h-3.5 mr-1.5 text-gray-400" />}
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    >
      <option value="">Any</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

// Page Break Indicator
const PageBreakIndicator = ({ pageNum }: { pageNum: number }) => (
  <div
    className="absolute left-0 right-0 border-b border-red-300 border-dashed print:hidden flex items-center justify-end pr-2 pointer-events-none z-10"
    style={{ top: `${pageNum * 297}mm` }} // A4 height is approx 297mm
  >
    <span className="text-[10px] text-red-400 bg-white px-1 flex items-center">
      <Scissors className="w-3 h-3 mr-1" /> Page {pageNum + 1} Start
    </span>
  </div>
);

// Match Score Gauge
const MatchScoreGauge = ({ keywords = 0, isOptimized }: { keywords?: number; isOptimized?: boolean }) => {
  const score = isOptimized ? Math.min(98, 70 + keywords * 3) : 65;

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-30 print:hidden animate-fadeIn flex items-center space-x-3">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="24" cy="24" r="20" stroke="#f3f4f6" strokeWidth="4" fill="none" />
          <circle
            cx="24" cy="24" r="20"
            stroke={score > 85 ? '#22c55e' : score > 70 ? '#3b82f6' : '#eab308'}
            strokeWidth="4"
            fill="none"
            strokeDasharray="125.6"
            strokeDashoffset={125.6 - (score / 100) * 125.6}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-xs font-bold text-gray-800">{score}</span>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Match Score</p>
        <p className={`text-sm font-semibold ${score > 85 ? 'text-green-600' : 'text-blue-600'}`}>
          {isOptimized ? 'High Match' : 'Potential'}
        </p>
      </div>
    </div>
  );
};

export default function SmartResume() {
  // --- State Management ---
  const [appState, setAppState] = useState('landing'); // landing, app
  const [activeTab, setActiveTab] = useState('profile'); // profile, job, analysis
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState({ skills: false });

  // Step-based workflow state
  const [currentStep, setCurrentStep] = useState(1);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzingStep, setIsAnalyzingStep] = useState(false);

  // Steps configuration
  const steps = [
    { label: 'Profile', description: 'Your information' },
    { label: 'Target Job', description: 'Job details' },
    { label: 'AI Analysis', description: 'Review & optimize' },
    { label: 'Final Result', description: 'Download resume' }
  ];

  // Visual Settings
  const [visualConfig, setVisualConfig] = useState({
    template: 'modern', // modern, classic
    color: '#4F46E5', // indigo-600
    fontSize: 'normal', // small, normal, large
    zoom: 1,
    showAtsHighlights: true, // Default to true
    showOriginal: false
  });

  // Import & Search State
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    type: '',
    workMode: '',
    level: '',
    postingTime: 'Any Time',
    companies: ['']
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ApifyJobResult[]>([]);
  const [searchError, setSearchError] = useState('');
  const [isJobSelected, setIsJobSelected] = useState(false);
  const [showSearchSettings, setShowSearchSettings] = useState(true);
  const [useAdvancedLocation, setUseAdvancedLocation] = useState(false);
  const [useAdvancedCompany, setUseAdvancedCompany] = useState(false);

  // Advanced location state
  const [locationData, setLocationData] = useState({
    country: '',
    region: '',
    city: ''
  });

  // Advanced company state
  const [companyData, setCompanyData] = useState({
    industry: '',
    company: ''
  });

  // Location and company data
  const locationConfig = {
    'United States': {
      regions: [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
        'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
        'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
        'Wisconsin', 'Wyoming', 'District of Columbia', 'Puerto Rico', 'Guam', 'U.S. Virgin Islands'
      ],
      cities: {
        'California': ['San Francisco', 'Los Angeles', 'San Diego', 'San Jose', 'Sacramento'],
        'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany'],
        'Texas': ['Houston', 'Austin', 'Dallas', 'San Antonio'],
        'Washington': ['Seattle', 'Spokane', 'Tacoma'],
        'Illinois': ['Chicago', 'Springfield', 'Peoria'],
        'Massachusetts': ['Boston', 'Worcester', 'Springfield']
      }
    },
    'China': {
      regions: [
        'Beijing', 'Shanghai', 'Guangdong', 'Jiangsu', 'Zhejiang', 'Sichuan', 'Hubei', 'Shandong',
        'Henan', 'Hunan', 'Anhui', 'Hebei', 'Jiangxi', 'Chongqing', 'Liaoning', 'Fujian',
        'Shaanxi', 'Shanxi', 'Jilin', 'Heilongjiang', 'Inner Mongolia', 'Guangxi', 'Hainan',
        'Guizhou', 'Yunnan', 'Gansu', 'Qinghai', 'Tibet', 'Ningxia', 'Xinjiang', 'Tianjin'
      ],
      cities: {
        'Beijing': ['Beijing'],
        'Shanghai': ['Shanghai'],
        'Guangdong': ['Guangzhou', 'Shenzhen', 'Dongguan', 'Foshan'],
        'Jiangsu': ['Nanjing', 'Suzhou', 'Wuxi', 'Changzhou'],
        'Zhejiang': ['Hangzhou', 'Ningbo', 'Wenzhou', 'Jiaxing'],
        'Sichuan': ['Chengdu', 'Mianyang', 'Deyang']
      }
    },
    'United Kingdom': {
      regions: [
        'England', 'Scotland', 'Wales', 'Northern Ireland'
      ],
      cities: {
        'England': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Bristol'],
        'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'],
        'Wales': ['Cardiff', 'Swansea', 'Newport'],
        'Northern Ireland': ['Belfast', 'Derry', 'Armagh']
      }
    },
    'Canada': {
      regions: [
        'Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan',
        'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island',
        'Northwest Territories', 'Yukon', 'Nunavut'
      ],
      cities: {
        'Ontario': ['Toronto', 'Ottawa', 'Hamilton', 'London'],
        'Quebec': ['Montreal', 'Quebec City', 'Laval'],
        'British Columbia': ['Vancouver', 'Victoria', 'Surrey'],
        'Alberta': ['Calgary', 'Edmonton', 'Red Deer']
      }
    },
    'Australia': {
      regions: [
        'New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia',
        'Tasmania', 'Australian Capital Territory', 'Northern Territory'
      ],
      cities: {
        'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
        'Victoria': ['Melbourne', 'Geelong', 'Ballarat'],
        'Queensland': ['Brisbane', 'Gold Coast', 'Sunshine Coast'],
        'Western Australia': ['Perth', 'Fremantle', 'Bunbury']
      }
    }
  };

  const companyConfig = {
    'Technology': {
      'United States': [
        'Google', 'Apple', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Tesla', 'Intel', 'NVIDIA',
        'Adobe', 'Salesforce', 'Oracle', 'IBM', 'Cisco', 'HP', 'Dell', 'Uber', 'Lyft', 'Airbnb',
        'Spotify', 'Twitter', 'Snap', 'Pinterest', 'Reddit', 'Discord', 'Slack', 'Zoom'
      ],
      'China': [
        'Alibaba', 'Tencent', 'Baidu', 'Huawei', 'Xiaomi', 'ByteDance', 'Meituan', 'Didi',
        'JD.com', 'NetEase', 'Sohu', 'Weibo', 'Pinduoduo', 'Kuaishou', 'Vivo', 'Oppo'
      ],
      'Europe': [
        'SAP', 'ASML', 'Siemens', 'Ericsson', 'Nokia', 'Spotify', 'Booking.com', 'Zalando',
        'Adyen', 'Klarna', 'Revolut', 'Wise', 'Unity', 'Supercell', 'Rovio'
      ]
    },
    'Finance': {
      'United States': [
        'JPMorgan Chase', 'Bank of America', 'Wells Fargo', 'Citigroup', 'Goldman Sachs',
        'Morgan Stanley', 'American Express', 'Visa', 'Mastercard', 'PayPal', 'Stripe',
        'BlackRock', 'Fidelity', 'Charles Schwab', 'Robinhood', 'Square', 'Intuit'
      ],
      'China': [
        'ICBC', 'China Construction Bank', 'Agricultural Bank of China', 'Bank of China',
        'Alipay', 'WeChat Pay', 'Ant Group', 'Ping An', 'China Merchants Bank'
      ],
      'Europe': [
        'HSBC', 'Barclays', 'Deutsche Bank', 'BNP Paribas', 'Credit Suisse', 'UBS',
        'Santander', 'ING Group', 'Nordea', 'Svenska Handelsbanken', 'Danske Bank'
      ]
    },
    'Healthcare': {
      'United States': [
        'Johnson & Johnson', 'Pfizer', 'UnitedHealth Group', 'CVS Health', 'McKesson',
        'AmerisourceBergen', 'Cardinal Health', 'Express Scripts', 'Centene', 'Humana'
      ],
      'China': [
        'Jiangsu Hengrui', 'WuXi AppTec', 'China Resources Pharmaceutical', 'Shanghai Pharma',
        'Sinopharm Group', 'Tongrentang', 'Yunnan Baiyao'
      ],
      'Europe': [
        'Roche', 'Novartis', 'Sanofi', 'GlaxoSmithKline', 'AstraZeneca', 'Bayer',
        'Novo Nordisk', 'Siemens Healthineers'
      ]
    },
    'Manufacturing': {
      'United States': [
        'Boeing', 'General Electric', '3M', 'Caterpillar', 'Honeywell', 'Lockheed Martin',
        'Raytheon Technologies', 'Ford', 'General Motors', 'Tesla', 'Dow Chemical'
      ],
      'China': [
        'BYD', 'Geely', 'SAIC Motor', 'Great Wall Motors', 'Li Auto', 'NIO', 'XPeng',
        'CATL', 'Midea', 'Haier', 'Gree', 'Foxconn', 'Foxconn Industrial Internet'
      ],
      'Europe': [
        'Volkswagen', 'BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Renault', 'Peugeot',
        'Airbus', 'Siemens', 'Bosch', 'Schneider Electric', 'Philips', 'ASML'
      ]
    },
    'Retail': {
      'United States': [
        'Walmart', 'Amazon', 'Costco', 'Home Depot', 'Target', 'Lowe\'s', 'Best Buy',
        'Kroger', 'Walgreens', 'CVS', 'Starbucks', 'McDonald\'s', 'Nike', 'Adidas'
      ],
      'China': [
        'Alibaba', 'JD.com', 'Pinduoduo', 'Meituan', 'Suning', 'Gome', 'Belle International',
        'Anta Sports', 'Li Ning', 'Xtep International'
      ],
      'Europe': [
        'Carrefour', 'Tesco', 'Aldi', 'Lidl', 'IKEA', 'Zara', 'H&M', 'ASOS', 'Boohoo',
        'Ocado', 'Deliveroo', 'Just Eat Takeaway'
      ]
    }
  };

  // Detect user's country (in a real app, this would use geolocation API)
  const getUserCountry = (): string => {
    return 'United States'; // Default fallback
  };

  // Load search results from localStorage on component mount
  useEffect(() => {
    const savedResults = localStorage.getItem('jobSearchResults');
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setSearchResults(parsedResults);
      } catch (error) {
        console.error('Failed to load saved search results:', error);
      }
    }
  }, []);

  // Save search results to localStorage whenever they change
  useEffect(() => {
    if (searchResults.length > 0) {
      localStorage.setItem('jobSearchResults', JSON.stringify(searchResults));
    }
  }, [searchResults]);
  const [optimizingField, setOptimizingField] = useState<string | null>(null);
  const [suggestionsMap, setSuggestionsMap] = useState({});

  // Data
  const [profile, setProfile] = useState({
    name: 'Alex Chen',
    role: 'Full Stack Developer',
    email: 'alex.chen@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexc',
    github: 'github.com/alexc',
    summary: 'Passionate developer with 5+ years of experience in building scalable web applications. Expert in React and Node.js.',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'TypeScript'],
    experience: [
      {
        id: 1,
        role: 'Senior Developer',
        company: 'Tech Solutions Inc.',
        period: '2021 - Present',
        description: 'Led a team of 5 developers to build a SaaS platform. Improved performance by 40% using React and Node.js.\nImplemented CI/CD pipelines.\nOptimized database queries.'
      },
      {
        id: 2,
        role: 'Web Developer',
        company: 'Creative Agency',
        period: '2019 - 2021',
        description: 'Developed responsive websites for 20+ clients using modern frontend technologies.\nCollaborated with designers to ensure pixel-perfect implementation.'
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
  });

  // Module collapse states
  const [collapsedModules, setCollapsedModules] = useState({
    basicInfo: false,
    experience: false,
    education: false,
    skills: false
  });

  const toggleModule = (module: keyof typeof collapsedModules) => {
    setCollapsedModules(prev => ({
      ...prev,
      [module]: !prev[module]
    }));
  };

  const [jobData, setJobData] = useState<JobData>({
    title: '',
    company: '',
    location: '',
    type: '',
    workMode: '',
    level: '',
    salary: '',
    description: '',
    experienceLevel: '',
    employmentType: '',
    workArrangement: '',
    postingTime: '',
    companies: ['']
  });

  const [generatedContent, setGeneratedContent] = useState({
    tailoredSummary: '',
    tailoredExperience: [],
    skillsAnalysis: null
  });

  // --- Handlers ---
  const handleProfileChange = (field: string, value: any) => setProfile(prev => ({ ...prev, [field]: value }));
  const addExperience = () => setProfile(prev => ({...prev, experience: [...prev.experience, { id: Date.now(), role: '', company: '', period: '', description: '' }]}));
  const updateExperience = (id: number, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
    if (field === 'description') {
      setSuggestionsMap(prev => { const next = { ...prev } as any; delete next[`exp-${id}`]; return next; });
    }
  };
  const removeExperience = (id: number) => setProfile(prev => ({...prev, experience: prev.experience.filter(exp => exp.id !== id)}));

  const handleImportResume = async () => {
    if (!importText) return;
    setIsImporting(true);
    try {
      const rawJson = await generateAIContent(buildPrompt('parse_resume', importText, ''));
      const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);
      setProfile(prev => ({ ...prev, ...parsedData, skills: parsedData.skills || [], experience: parsedData.experience || [], education: parsedData.education || [] }));
      setShowImport(false);
      alert("Resume parsed successfully!");
    } catch (e) { console.error("Parse failed", e); alert("Parse failed, please try again."); } finally { setIsImporting(false); }
  };

  const handleOptimizeExperience = async (id: number, text: string) => {
    const key = `exp-${id}`;
    setOptimizingField(key);
    try {
      const rawJson = await generateAIContent(buildPrompt('optimize_experience', text, ''));
      const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      const suggestions = JSON.parse(cleanJson);
      setSuggestionsMap(prev => ({ ...prev, [key]: suggestions }));
    } catch (e) { console.error("Optimization failed", e); alert("Polish failed, please try again."); } finally { setOptimizingField(null); }
  };

  const handleGenerate = async () => {
    if (!jobData.description) { alert("Please select or enter a Job Description first."); return; }
    setIsGenerating(true);
    try {
      const [summary, expRaw] = await Promise.all([
        generateAIContent(buildPrompt('tailored_summary', profile, jobData)),
        generateAIContent(buildPrompt('tailored_experience', profile, jobData))
      ]);

      let optimizedExp = [];
      try {
        const cleanExp = expRaw.replace(/```json/g, '').replace(/```/g, '').trim();
        optimizedExp = JSON.parse(cleanExp);
      } catch(e) {
        console.error("Exp parsing failed", e);
      }

      setGeneratedContent(prev => ({
        ...prev,
        tailoredSummary: summary,
        tailoredExperience: optimizedExp
      }));
    } catch (error) { console.error("Gen failed", error); alert("Generation failed"); } finally { setIsGenerating(false); }
  };

  const handleAnalyzeSkills = async () => {
    if (!jobData.description) return;
    setIsAnalyzing(prev => ({ ...prev, skills: true }));
    try {
      const rawJson = await generateAIContent(buildPrompt('skills_analysis', profile, jobData));
      const cleanJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      setGeneratedContent(prev => ({ ...prev, skillsAnalysis: JSON.parse(cleanJson) }));
    } catch (e) { console.error(e); } finally { setIsAnalyzing(prev => ({ ...prev, skills: false })); }
  };

  // Helper functions for advanced location and company features
  const updateLocationData = (field: string, value: string) => {
    setLocationData(prev => ({
      ...prev,
      [field]: value
    }));

    // Update searchFilters.location to reflect the complete location
    const updatedLocation = {
      ...locationData,
      [field]: value
    };

    const locationString = [
      updatedLocation.city,
      updatedLocation.region,
      updatedLocation.country
    ].filter(Boolean).join(', ');

    setSearchFilters(prev => ({
      ...prev,
      location: locationString
    }));
  };

  const updateCompanyData = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));

    // Update companies array when company is selected from the dropdown
    if (field === 'company' && value) {
      setSearchFilters(prev => ({
        ...prev,
        companies: [value]
      }));
    }
  };

  const getAvailableRegions = (): string[] => {
    if (!locationData.country || !(locationConfig as any)[locationData.country]) {
      return [];
    }
    return (locationConfig as any)[locationData.country].regions;
  };

  const getAvailableCities = (): string[] => {
    if (!locationData.country || !locationData.region ||
        !(locationConfig as any)[locationData.country] ||
        !(locationConfig as any)[locationData.country].cities[locationData.region]) {
      return [];
    }
    return (locationConfig as any)[locationData.country].cities[locationData.region];
  };

  const getAvailableCompanies = (): string[] => {
    if (!companyData.industry || !locationConfig || !locationData.country) {
      return [];
    }

    const companies = (companyConfig as any)[companyData.industry];
    if (!companies) {
      return [];
    }

    // Get companies for the selected country or default to "Europe" for non-US/China
    if (companies[locationData.country]) {
      return companies[locationData.country];
    } else if (companies['Europe']) {
      return companies['Europe'];
    }

    return [];
  };

  // Company management functions
  const addCompany = () => {
    setSearchFilters(prev => ({
      ...prev,
      companies: [...prev.companies, '']
    }));
  };

  const updateCompany = (index: number, value: string) => {
    setSearchFilters(prev => {
      const newCompanies = [...prev.companies];
      newCompanies[index] = value;
      return {
        ...prev,
        companies: newCompanies
      };
    });
  };

  const removeCompany = (index: number) => {
    setSearchFilters(prev => ({
      ...prev,
      companies: prev.companies.filter((_, i) => i !== index)
    }));
  };

  const handleJobSearch = async () => {
    if (!searchQuery && searchFilters.companies.every(c => !c.trim())) {
      alert("Please enter a job title or company name");
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      // Map search filters to Apify format
      const apifyParams = {
        title: searchQuery,
        location: searchFilters.location || '',
        companies: searchFilters.companies.filter(c => c.trim() !== ''),
        experienceLevel: searchFilters.level || '',
        employmentType: searchFilters.type || '',
        workArrangement: searchFilters.workMode || '',
        postingTime: searchFilters.postingTime || 'Any Time'
      };

      const result = await searchJobs(apifyParams);

      if (result.success && result.data) {
        setSearchResults(result.data);
        if (result.data.length === 0) {
          setSearchError('No jobs found matching your criteria');
        } else {
          // Auto-collapse search settings when we get results
          setShowSearchSettings(false);
        }
      } else {
        setSearchError(result.error || 'Failed to search jobs');
      }
    } catch (error) {
      console.error('Job search error:', error);
      setSearchError('An unexpected error occurred during job search');
    } finally {
      setIsSearching(false);
    }
  };

  const selectJob = (job: ApifyJobResult) => {
    setJobData({
      title: job.job_title,
      company: job.company_name,
      location: job.location || '',
      type: job.employment_type || '',
      workMode: '', // Apify doesn't provide this directly
      level: job.seniority_level || '',
      salary: job.salary_range || '',
      description: job.job_description || '',
      experienceLevel: '',
      employmentType: job.employment_type || '',
      workArrangement: '',
      postingTime: '',
      companies: [''],
      selectedJob: job
    });
    setIsJobSelected(true);
  };

  const resetJobSelection = () => {
    setIsJobSelected(false);
    // Load previous search results from localStorage instead of clearing them
    const savedResults = localStorage.getItem('jobSearchResults');
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setSearchResults(parsedResults);
      } catch (error) {
        console.error('Failed to load saved search results:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
    setJobData({
      title: '',
      company: '',
      location: '',
      type: '',
      workMode: '',
      level: '',
      salary: '',
      description: '',
      experienceLevel: '',
      employmentType: '',
      workArrangement: '',
      postingTime: '',
      companies: ['']
    });
    setSearchQuery('');
  };

  const handlePrint = () => { window.print(); };

  // --- Landing Page Handlers ---
  const handleLandingImport = async (resumeText: string) => {
    if (!resumeText.trim()) return;

    setIsImporting(true);
    try {
      const aiResponse = await generateAIContent(buildPrompt('parse_resume', resumeText));
      let parsed = {};
      try {
        parsed = JSON.parse(aiResponse);
      } catch (e) {
        const match = aiResponse.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }
      setProfile(prev => ({
        name: (parsed as any).name || prev.name,
        role: (parsed as any).role || prev.role,
        email: (parsed as any).email || prev.email,
        phone: (parsed as any).phone || prev.phone,
        location: (parsed as any).location || prev.location,
        linkedin: (parsed as any).linkedin || prev.linkedin,
        github: (parsed as any).github || prev.github,
        summary: (parsed as any).summary || prev.summary,
        skills: (parsed as any).skills || prev.skills,
        experience: (parsed as any).experience || prev.experience,
        education: (parsed as any).education || prev.education,
      }));
      setImportText('');
      setAppState('app');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please check your resume text and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleStart = (mode: string) => {
    if (mode === 'demo') {
      const demoProfile = {
        name: 'Alex Chen',
        role: 'Senior Software Engineer',
        email: 'alex.chen@email.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/alexchen',
        github: 'https://github.com/alexchen',
        summary: 'Experienced software engineer with 5+ years developing scalable web applications and leading cross-functional teams.',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'TypeScript', 'MongoDB', 'Docker'],
        experience: [
          {
            id: 1,
            role: 'Senior Software Engineer',
            company: 'TechCorp',
            period: '2021 - Present',
            description: 'Led development of microservices architecture serving 1M+ users. Mentored junior developers and improved system performance by 40%.'
          },
          {
            id: 2,
            role: 'Software Engineer',
            company: 'StartupXYZ',
            period: '2019 - 2021',
            description: 'Built full-stack applications using React and Node.js. Implemented CI/CD pipelines and reduced deployment time by 60%.'
          }
        ],
        education: [
          {
            id: 1,
            degree: 'Bachelor of Science in Computer Science',
            school: 'University of California, Berkeley',
            period: '2015 - 2019'
          }
        ]
      };
      setProfile(demoProfile);
    }
    setAppState('app');
  };

  const selectJob = (job: ApifyJobResult) => {
    setJobData({
      ...jobData,
      title: job.job_title,
      company: job.company_name,
      location: job.location,
      description: job.job_description,
      selectedJob: job
    });
    setIsJobSelected(true);
  };

  const resetJobSelection = () => {
    setIsJobSelected(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  if (appState === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">SmartResume</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Stop sending generic resumes. Tailor your CV to any job description in seconds using AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50 hover:border-indigo-200 transition-all hover:-translate-y-1 group">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform"><Upload className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Import Resume</h3>
              <p className="text-sm text-gray-500 mb-6">Paste your existing resume text. AI will parse it.</p>
              {!isImporting ? (
                <textarea className="w-full p-3 border border-gray-200 rounded-lg text-xs mb-3 h-24 focus:ring-blue-500 focus:border-blue-500" placeholder="Paste text here..." value={importText} onChange={(e) => setImportText(e.target.value)} />
              ) : (
                <div className="h-24 flex items-center justify-center text-blue-600 text-sm mb-3"><div className="animate-spin mr-2">⏳</div> Parsing...</div>
              )}
              <button onClick={() => handleLandingImport(importText)} disabled={!importText || isImporting} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">Start with Import</button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50 hover:border-indigo-200 transition-all hover:-translate-y-1 group">
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform"><Plus className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fill Manually</h3>
              <p className="text-sm text-gray-500 mb-6">Start from a clean slate using our template.</p>
              <div className="h-24"></div>
              <button onClick={() => handleStart('manual')} className="w-full py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-green-500 hover:text-green-600 transition-colors">Create New</button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-50 hover:border-indigo-200 transition-all hover:-translate-y-1 group">
              <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform"><Layout className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Try Demo</h3>
              <p className="text-sm text-gray-500 mb-6">See how it works with pre-filled data.</p>
              <div className="h-24"></div>
              <button onClick={() => handleStart('demo')} className="w-full py-2.5 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors">Load Example</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans print:bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden h-16 shadow-sm">
        <div className="w-full max-w-[1800px] mx-auto px-4 h-full flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-indigo-600 mr-2" />
            <div className="flex flex-col">
              <button
                onClick={() => setAppState('landing')}
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors cursor-pointer"
                title="Back to Landing"
              >
                SmartResume
              </button>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide flex items-center">
                 <Target className="w-3 h-3 mr-1" /> Tailor Your Resume, Land the Job
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden lg:flex items-center text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <BrainCircuit className="w-3 h-3 mr-1" />
                Mulerun AI
              </div>
            <button onClick={handlePrint} className="flex items-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md shadow-sm transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row h-[calc(100vh-64px)] print:h-auto">

        {/* Left: Editor (40%) */}
        <div className="w-full lg:w-2/5 flex flex-col border-r border-gray-200 bg-white print:hidden h-full z-10">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide flex-shrink-0 bg-gray-50">
             {[
               { id: 'profile', icon: User, label: '1. Profile' },
               { id: 'job', icon: Search, label: '2. Target Job' },
               { id: 'analysis', icon: TrendingUp, label: '3. AI Analysis' },
             ].map(tab => (
               <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center py-4 px-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-700 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                {tab.label}
              </button>
             ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-gray-50/30">

            {/* TAB 1: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fadeIn pb-10">
                 {/* Import */}
                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 shadow-sm">
                    <button
                      onClick={() => setShowImport(!showImport)}
                      className="flex items-center justify-between w-full text-indigo-800 font-medium"
                    >
                      <span className="flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Resume (Paste Text)
                      </span>
                      {showImport ? <ChevronRight className="w-4 h-4 rotate-90 transition-transform" /> : <ChevronRight className="w-4 h-4 transition-transform" />}
                    </button>
                    {showImport && (
                      <div className="mt-3 animate-fadeIn">
                        <textarea
                          className="w-full p-3 border border-indigo-200 rounded-md text-xs h-32 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Paste your full resume text here (PDF/Word copy)..."
                          value={importText}
                          onChange={(e) => setImportText(e.target.value)}
                        />
                        <button
                          onClick={handleImportResume}
                          disabled={isImporting || !importText}
                          className="mt-2 w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center justify-center"
                        >
                          {isImporting ? <span className="animate-spin mr-2">⏳</span> : <FileJson className="w-4 h-4 mr-2" />} Smart Parse
                        </button>
                      </div>
                    )}
                 </div>

                 <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h3 className="font-bold text-gray-800 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Basic Info
                      </h3>
                      <button
                        onClick={() => toggleModule('basicInfo')}
                        className="text-indigo-600 hover:text-indigo-700 p-1 rounded transition-colors"
                        title={collapsedModules.basicInfo ? 'Expand' : 'Collapse'}
                      >
                        {collapsedModules.basicInfo ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {!collapsedModules.basicInfo && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="Full Name" value={profile.name} onChange={(v) => handleProfileChange('name', v)} />
                          <InputField label="Current Job Title" value={profile.role} onChange={(v) => handleProfileChange('role', v)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="Email" value={profile.email} onChange={(v) => handleProfileChange('email', v)} />
                          <InputField label="Phone" value={profile.phone} onChange={(v) => handleProfileChange('phone', v)} />
                        </div>
                        <InputField label="Location" value={profile.location} onChange={(v) => handleProfileChange('location', v)} />
                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="LinkedIn" value={profile.linkedin} onChange={(v) => handleProfileChange('linkedin', v)} />
                          <InputField label="GitHub" value={profile.github} onChange={(v) => handleProfileChange('github', v)} />
                        </div>
                        <InputField label="Professional Summary" multiline value={profile.summary} onChange={(v) => handleProfileChange('summary', v)} />
                      </div>
                    )}
                 </div>

                 <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                       <h3 className="font-bold text-gray-800 flex items-center">
                         <Briefcase className="w-4 h-4 mr-2" />
                         Work Experience
                       </h3>
                       <div className="flex items-center gap-2">
                         <button
                           onClick={() => toggleModule('experience')}
                           className="text-indigo-600 hover:text-indigo-700 p-1 rounded transition-colors"
                           title={collapsedModules.experience ? 'Expand' : 'Collapse'}
                         >
                           {collapsedModules.experience ? (
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                             </svg>
                           ) : (
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                             </svg>
                           )}
                         </button>
                         <button onClick={addExperience} className="text-xs text-indigo-600 font-medium hover:bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
                           + Add Experience
                         </button>
                       </div>
                    </div>
                    {!collapsedModules.experience && (
                      <div className="space-y-6 animate-fadeIn">
                      {profile.experience.map((exp) => (
                        <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200 hover:border-indigo-300 transition-colors group">
                          <button onClick={() => removeExperience(exp.id)} className="absolute right-0 top-0 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="grid grid-cols-2 gap-3 mb-2">
                             <input className="font-bold text-gray-800 bg-transparent border-none p-0 focus:ring-0 placeholder-gray-400" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} />
                             <input className="text-right text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 placeholder-gray-400" placeholder="Duration (e.g. 2020 - Present)" value={exp.period} onChange={(e) => updateExperience(exp.id, 'period', e.target.value)} />
                          </div>
                          <input className="block w-full text-sm font-medium text-indigo-600 bg-transparent border-none p-0 mb-2 focus:ring-0 placeholder-indigo-300" placeholder="Job Title" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} />
                           <InputField label="Description (AI Polish Available)" multiline value={exp.description} onChange={(v) => updateExperience(exp.id, 'description', v)} onOptimize={() => handleOptimizeExperience(exp.id, exp.description)} isOptimizing={optimizingField === `exp-${exp.id}`} suggestions={(suggestionsMap as any)[`exp-${exp.id}`]} className="mb-0 text-sm" />
                        </div>
                      ))}
                      </div>
                    )}
                 </div>

                 {/* Education Module */}
                 <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h3 className="font-bold text-gray-800 flex items-center">
                        <Gauge className="w-4 h-4 mr-2" />
                        Education
                      </h3>
                      <button
                        onClick={() => toggleModule('education')}
                        className="text-indigo-600 hover:text-indigo-700 p-1 rounded transition-colors"
                        title={collapsedModules.education ? 'Expand' : 'Collapse'}
                      >
                        {collapsedModules.education ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {!collapsedModules.education && (
                      <div className="space-y-6 animate-fadeIn">
                        {profile.education.map((edu) => (
                          <div key={edu.id} className="relative pl-4 border-l-2 border-gray-200 hover:border-indigo-300 transition-colors">
                            <button
                              onClick={() => {
                                setProfile(prev => ({
                                  ...prev,
                                  education: prev.education.filter(e => e.id !== edu.id)
                                }));
                              }}
                              className="absolute right-0 top-0 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove Education"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-2 gap-3 mb-2">
                              <input
                                className="font-bold text-gray-800 bg-transparent border-none p-0 focus:ring-0 placeholder-gray-400"
                                placeholder="Degree"
                                value={edu.degree}
                                onChange={(e) => {
                                  setProfile(prev => ({
                                    ...prev,
                                    education: prev.education.map(item =>
                                      item.id === edu.id ? { ...item, degree: e.target.value } : item
                                    )
                                  }));
                                }}
                              />
                              <input
                                className="text-right text-sm text-gray-500 bg-transparent border-none p-0 focus:ring-0 placeholder-gray-400"
                                placeholder="Duration (e.g. 2020 - Present)"
                                value={edu.period}
                                onChange={(e) => {
                                  setProfile(prev => ({
                                    ...prev,
                                    education: prev.education.map(item =>
                                      item.id === edu.id ? { ...item, period: e.target.value } : item
                                    )
                                  }));
                                }}
                              />
                            </div>
                            <input
                              className="block w-full font-semibold text-gray-700 mb-2 bg-transparent border-none p-0 focus:ring-0 placeholder-gray-400"
                              placeholder="School"
                              value={edu.school}
                              onChange={(e) => {
                                setProfile(prev => ({
                                  ...prev,
                                  education: prev.education.map(item =>
                                    item.id === edu.id ? { ...item, school: e.target.value } : item
                                  )
                                }));
                              }}
                            />
                          </div>
                        ))}
                        {profile.education.length === 0 && (
                          <div className="text-center py-8 text-gray-400">
                            <Gauge className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No education added yet</p>
                          </div>
                        )}
                        <button
                          onClick={() => {
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
                          }}
                          className="w-full bg-indigo-50 text-indigo-700 py-3 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center border border-indigo-200"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Education
                        </button>
                      </div>
                    )}
                 </div>

                 {/* Skills Module */}
                 <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h3 className="font-bold text-gray-800 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        Skills
                      </h3>
                      <button
                        onClick={() => toggleModule('skills')}
                        className="text-indigo-600 hover:text-indigo-700 p-1 rounded transition-colors"
                        title={collapsedModules.skills ? 'Expand' : 'Collapse'}
                      >
                        {collapsedModules.skills ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {!collapsedModules.skills && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {profile.skills.map((skill, index) => (
                            <div
                              key={index}
                              className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center group"
                            >
                              {skill}
                              <button
                                onClick={() => {
                                  setProfile(prev => ({
                                    ...prev,
                                    skills: prev.skills.filter((_, i) => i !== index)
                                  }));
                                }}
                                className="ml-2 text-indigo-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-colors"
                                title="Remove skill"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <input
                            type="text"
                            className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
                            placeholder="Add a skill..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                                setProfile(prev => ({
                                  ...prev,
                                  skills: [...prev.skills, (e.target as HTMLInputElement).value.trim()]
                                }));
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                 </div>

                 <button onClick={() => setActiveTab('job')} className="w-full py-3 bg-gray-900 text-white rounded-lg shadow hover:bg-black transition-all flex items-center justify-center font-medium">
                    Next: Select Target Job <ArrowRight className="w-4 h-4 ml-2" />
                 </button>
              </div>
            )}

            {/* TAB 2: JOB SEARCH */}
            {activeTab === 'job' && (
              <div className="space-y-6 animate-fadeIn pb-10">
                 {!isJobSelected ? (
                   <div className="space-y-6">
                      <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="border-b border-gray-200 px-6 py-4">
                          <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Find Your Next Opportunity</h2>
                            <button
                              onClick={() => setShowSearchSettings(!showSearchSettings)}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center"
                            >
                              <Filter className="w-4 h-4 mr-1" />
                              {showSearchSettings ? 'Hide Filters' : 'Show Filters'}
                            </button>
                          </div>
                        </div>
                        {showSearchSettings && (
                          <>
                            <div className="p-6 border-b border-gray-200">
                              <div className="max-w-2xl mx-auto">
                                <div className="relative">
                                  <input
                                    type="text"
                                    className="w-full px-4 py-3 pl-12 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                                    placeholder="Job title, keywords, or company"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleJobSearch()}
                                  />
                                  <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                                  <button
                                    onClick={handleJobSearch}
                                    disabled={isSearching || (!searchQuery && searchFilters.companies.every(c => !c.trim()))}
                                    className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {isSearching ? 'Searching...' : 'Search'}
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="p-6 bg-gray-50">
                              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Filters</h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Location Input */}
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                      <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                                      Location
                                    </label>
                                    <button
                                      onClick={() => setUseAdvancedLocation(!useAdvancedLocation)}
                                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                      {useAdvancedLocation ? 'Simple' : 'Advanced'}
                                    </button>
                                  </div>

                                {!useAdvancedLocation ? (
                                  <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                    placeholder="e.g. San Francisco, New York, Remote"
                                    value={searchFilters.location}
                                    onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                                  />
                                ) : (
                                  <div className="space-y-3">
                                    <select
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                      value={locationData.country}
                                      onChange={(e) => {
                                        updateLocationData('country', e.target.value);
                                        setLocationData(prev => ({
                                          ...prev,
                                          region: '',
                                          city: ''
                                        }));
                                      }}
                                    >
                                      <option value="">Select Country</option>
                                      {Object.keys(locationConfig).map(country => (
                                        <option key={country} value={country}>{country}</option>
                                      ))}
                                    </select>

                                    {locationData.country && (
                                      <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                        value={locationData.region}
                                        onChange={(e) => {
                                          updateLocationData('region', e.target.value);
                                          setLocationData(prev => ({
                                            ...prev,
                                            city: ''
                                          }));
                                        }}
                                      >
                                        <option value="">Select Region/State</option>
                                        {getAvailableRegions().map(region => (
                                          <option key={region} value={region}>{region}</option>
                                        ))}
                                      </select>
                                    )}

                                    {locationData.region && getAvailableCities().length > 0 && (
                                      <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                        value={locationData.city}
                                        onChange={(e) => updateLocationData('city', e.target.value)}
                                      >
                                        <option value="">Select City</option>
                                        {getAvailableCities().map(city => (
                                          <option key={city} value={city}>{city}</option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Company Names */}
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                      <Building className="w-4 h-4 mr-1.5 text-gray-400" />
                                      Company
                                    </label>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => setUseAdvancedCompany(!useAdvancedCompany)}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                      >
                                        {useAdvancedCompany ? 'Manual' : 'Suggested'}
                                      </button>
                                      {!useAdvancedCompany && (
                                        <button
                                          onClick={addCompany}
                                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                          + Add
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                {!useAdvancedCompany ? (
                                  <div className="space-y-2">
                                    {searchFilters.companies.map((company, index) => (
                                      <div key={index} className="flex gap-2">
                                        <input
                                          type="text"
                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                          placeholder="Company name"
                                          value={company}
                                          onChange={(e) => updateCompany(index, e.target.value)}
                                        />
                                        {searchFilters.companies.length > 1 && (
                                          <button
                                            onClick={() => removeCompany(index)}
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-md text-sm transition-colors"
                                          >
                                            Remove
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                                      💡 To use suggested companies, please select a location first.
                                    </div>
                                    <select
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                      value={companyData.industry}
                                      onChange={(e) => {
                                        updateCompanyData('industry', e.target.value);
                                        setCompanyData(prev => ({ ...prev, company: '' }));
                                      }}
                                    >
                                      <option value="">Select Industry</option>
                                      {Object.keys(companyConfig).map(industry => (
                                        <option key={industry} value={industry}>{industry}</option>
                                      ))}
                                    </select>

                                    {companyData.industry && (
                                      <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                        value={companyData.company}
                                        onChange={(e) => updateCompanyData('company', e.target.value)}
                                      >
                                        <option value="">Select Company</option>
                                        {getAvailableCompanies().map(company => (
                                          <option key={company} value={company}>{company}</option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                )}
                              </div>
                              </div> {/* End grid */}

                              {/* Additional Filters */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                                  <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                    value={searchFilters.level}
                                    onChange={(e) => setSearchFilters({...searchFilters, level: e.target.value})}
                                  >
                                    <option value="">Any level</option>
                                    {['Intern', 'Assistant', 'Junior', 'Mid-Senior', 'Director', 'Executive'].map(level => (
                                      <option key={level} value={level}>{level}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                                  <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                    value={searchFilters.type}
                                    onChange={(e) => setSearchFilters({...searchFilters, type: e.target.value})}
                                  >
                                    <option value="">Any type</option>
                                    {['Full-time', 'Part-time', 'Contract', 'Temporary', 'Volunteer', 'Internship', 'Other'].map(type => (
                                      <option key={type} value={type}>{type}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode</label>
                                  <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                    value={searchFilters.workMode}
                                    onChange={(e) => setSearchFilters({...searchFilters, workMode: e.target.value})}
                                  >
                                    <option value="">Any mode</option>
                                    {['On-site', 'Remote', 'Hybrid'].map(mode => (
                                      <option key={mode} value={mode}>{mode}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Posted</label>
                                  <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                    value={searchFilters.postingTime}
                                    onChange={(e) => setSearchFilters({...searchFilters, postingTime: e.target.value})}
                                  >
                                    {['Any Time', 'Past 24 hours', 'Past Week', 'Past Month'].map(time => (
                                      <option key={time} value={time}>{time}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {searchResults.length > 0 && !isSearching && (
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold text-gray-900">{searchResults.length}</span> job{searchResults.length !== 1 ? 's' : ''} found
                            </p>
                          </div>
                          <div className="divide-y divide-gray-200">
                            {searchResults.map((job, index) => (
                              <div
                                key={`${job.job_id}-${index}`}
                                onClick={() => selectJob(job)}
                                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                      {job.job_title}
                                    </h3>
                                    <p className="text-sm font-medium text-blue-600 mb-2">
                                      {job.company_name}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      {job.location && (
                                        <div className="flex items-center">
                                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                          {job.location}
                                        </div>
                                      )}
                                      {job.employment_type && (
                                        <span className="text-gray-500">• {job.employment_type}</span>
                                      )}
                                      {job.time_posted && (
                                        <span className="text-gray-500">• {job.time_posted}</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end ml-4">
                                    {job.salary_range && (
                                      <span className="text-sm font-medium text-green-600 mb-2">
                                        {job.salary_range}
                                      </span>
                                    )}
                                    <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.length === 0 && !isSearching && searchError && (
                        <div className="text-center pt-4">
                          <p className="text-gray-400 mb-2">{searchError}</p>
                          <p className="text-sm text-gray-400">Please try adjusting your search criteria</p>
                        </div>
                      )}

                      <div className="text-center pt-4">
                         <button onClick={() => setIsJobSelected(true)} className="text-sm text-indigo-600 hover:underline">Or, manually enter job details</button>
                       </div>
                   </div>
                 ) : (
                   <div className="space-y-6 animate-slideUp">
                      {/* Fixed Action Button */}
                      <div className="sticky top-0 z-10 bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-3 mb-6">
                        <div className="flex items-center justify-between max-w-4xl mx-auto">
                          <div className="flex items-center">
                            <CheckCircle2 className="text-green-500 w-5 h-5 mr-3" />
                            {jobData.selectedJob && (
                              <span className="font-semibold text-gray-900">{jobData.selectedJob.job_title} @ {jobData.selectedJob.company_name}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={resetJobSelection}
                              className="text-sm text-indigo-600 hover:underline"
                            >
                              Reselect
                            </button>
                            <button
                              onClick={handleGenerate}
                              disabled={isGenerating || !jobData.selectedJob}
                              className={`px-6 py-2 rounded-lg font-medium text-sm flex items-center transition-all ${
                                isGenerating || !jobData.selectedJob
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                              }`}
                            >
                              {isGenerating ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                  Optimizing...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3 mr-2" />
                                  Tailor Resume
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="border-b border-gray-200 px-6 py-4">
                          <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
                        </div>

                        {jobData.selectedJob ? (
                          <div className="p-6">
                            {/* Job Header Section */}
                            <div className="flex items-start gap-4 mb-6">
                              {jobData.selectedJob.company_logo_url && (
                                <img
                                  src={jobData.selectedJob.company_logo_url}
                                  alt={jobData.selectedJob.company_name}
                                  className="w-16 h-16 rounded-lg object-contain bg-gray-50 border border-gray-200 p-2"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                  {jobData.selectedJob.job_title}
                                </h3>
                                <div className="flex items-center gap-4 text-lg text-gray-700 mb-3">
                                  <span className="font-semibold text-blue-600">{jobData.selectedJob.company_name}</span>
                                  {jobData.selectedJob.location && (
                                    <div className="flex items-center text-gray-600">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      {jobData.selectedJob.location}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-3 text-sm">
                                  {jobData.selectedJob.employment_type && (
                                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                      {jobData.selectedJob.employment_type}
                                    </span>
                                  )}
                                  {jobData.selectedJob.seniority_level && (
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                      {jobData.selectedJob.seniority_level}
                                    </span>
                                  )}
                                  {jobData.selectedJob.salary_range && (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                      {jobData.selectedJob.salary_range}
                                    </span>
                                  )}
                                  {jobData.selectedJob.job_function && (
                                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                                      {jobData.selectedJob.job_function}
                                    </span>
                                  )}
                                  {jobData.selectedJob.industries && (
                                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                                      {jobData.selectedJob.industries}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Job Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                              <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Job Type</p>
                                <p className="text-sm font-medium text-gray-900">{jobData.selectedJob.employment_type || 'Not specified'}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Posted</p>
                                <p className="text-sm font-medium text-gray-900">{jobData.selectedJob.time_posted || 'Recently'}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Applicants</p>
                                <p className="text-sm font-medium text-gray-900">{jobData.selectedJob.num_applicants || 'Not disclosed'}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Apply</p>
                                <p className="text-sm font-medium text-green-600">{jobData.selectedJob.easy_apply ? 'Easy Apply' : 'External'}</p>
                              </div>
                            </div>

                            {/* Job Description */}
                            <div className="border-t border-gray-200 pt-6">
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h4>
                              <div
                                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: jobData.selectedJob.job_description_raw_html ||
                                          jobData.selectedJob.job_description?.replace(/\n/g, '<br />') ||
                                          'No description available'
                                }}
                              />
                            </div>

                            {/* Action Links */}
                            <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
                              <a
                                href={jobData.selectedJob.apply_url || jobData.selectedJob.job_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                              >
                                Apply Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </a>
                              {jobData.selectedJob.company_url && (
                                <a
                                  href={jobData.selectedJob.company_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                                >
                                  View Company
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-6">
                            <p className="text-gray-500 text-center">No job selected. Please go back and select a job.</p>
                          </div>
                        )}
                      </div>
                   </div>
                 )}
              </div>
            )}

            {/* TAB 3: ANALYSIS */}
            {activeTab === 'analysis' && (
              <div className="space-y-6 animate-fadeIn">
                 {!jobData.description ? (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                       <p className="text-gray-400">Please select a job in the 'Target Job' step first.</p>
                       <button onClick={() => setActiveTab('job')} className="mt-2 text-indigo-600 hover:underline">Go to Select Job</button>
                    </div>
                 ) : (
                   <>
                      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                         <div className="flex justify-between items-center mb-4">
                           <h3 className="font-bold text-gray-800 flex items-center"><Target className="w-5 h-5 mr-2 text-blue-500" /> Skill Match</h3>
                           <button onClick={handleAnalyzeSkills} disabled={isAnalyzing.skills} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100">
                             {isAnalyzing.skills ? 'Analyzing...' : 'Start Analysis'}
                           </button>
                         </div>
                         {generatedContent.skillsAnalysis && (
                           <div className="space-y-4">
                              <div>
                                <span className="text-xs font-bold text-green-600 uppercase">Matching Skills</span>
                                <div className="flex flex-wrap gap-2 mt-1">{(generatedContent.skillsAnalysis as any)?.matching_skills?.map((s: string, i: number) => <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">{s}</span>)}</div>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-red-500 uppercase">Missing / To Improve</span>
                                <div className="flex flex-wrap gap-2 mt-1">{(generatedContent.skillsAnalysis as any)?.missing_skills?.map((s: string, i: number) => <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">{s}</span>)}</div>
                              </div>
                              <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 italic">"{(generatedContent.skillsAnalysis as any)?.advice}"</div>
                           </div>
                         )}
                      </div>
                   </>
                 )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview (60%) */}
        <div className="w-full lg:w-3/5 bg-gray-100 flex flex-col h-full overflow-hidden print:w-full print:h-auto">
          {/* Visual Toolbar */}
          <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 print:hidden flex-shrink-0 z-20">
             {/* Left */}
             <div className="flex items-center text-sm font-medium text-gray-700">
               <FileText className="w-4 h-4 mr-2 text-indigo-600" /> Resume Preview
               <span className="ml-2 text-xs text-gray-400 font-normal border-l pl-2 border-gray-300 hidden md:inline">
                 Auto-pagination supported
               </span>
             </div>

             {/* Right */}
             <div className="flex items-center space-x-4">
               {/* Show Original Toggle */}
               <label className="flex items-center cursor-pointer select-none">
                 <div className="relative">
                   <input type="checkbox" className="sr-only" checked={visualConfig.showOriginal} onChange={(e) => setVisualConfig({...visualConfig, showOriginal: e.target.checked})} />
                   <div className={`block w-9 h-5 rounded-full ${visualConfig.showOriginal ? 'bg-gray-400' : 'bg-indigo-600'}`}></div>
                   <div className={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition ${visualConfig.showOriginal ? 'transform translate-x-4' : ''}`}></div>
                 </div>
                 <div className="ml-2 text-xs font-medium text-gray-600 flex items-center w-20 justify-end">
                   {visualConfig.showOriginal ? <span className="flex items-center"><RotateCcw className="w-3 h-3 mr-1" /> Original</span> : <span className="flex items-center text-indigo-600"><Sparkles className="w-3 h-3 mr-1" /> Tailored</span>}
                 </div>
               </label>

               <div className="w-px h-4 bg-gray-300"></div>

               <div className="flex items-center text-sm text-gray-600">
                 <Layout className="w-4 h-4 mr-2" />
                 <select value={visualConfig.template} onChange={(e) => setVisualConfig({...visualConfig, template: e.target.value})} className="border-none bg-transparent focus:ring-0 cursor-pointer p-0 text-gray-800 font-medium"><option value="modern">Modern</option><option value="classic">Classic</option></select>
               </div>

               <div className="w-px h-4 bg-gray-300"></div>

               <label className="flex items-center cursor-pointer select-none" title="Highlight JD keywords">
                 <div className="relative">
                   <input type="checkbox" className="sr-only" checked={visualConfig.showAtsHighlights} onChange={(e) => setVisualConfig({...visualConfig, showAtsHighlights: e.target.checked})} />
                   <div className={`block w-9 h-5 rounded-full ${visualConfig.showAtsHighlights ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                   <div className={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition ${visualConfig.showAtsHighlights ? 'transform translate-x-4' : ''}`}></div>
                 </div>
                 <div className="ml-2 text-xs font-medium text-gray-600 flex items-center hidden xl:flex"><Eye className="w-3 h-3 mr-1" /> ATS X-Ray</div>
               </label>

               <div className="w-px h-4 bg-gray-300 hidden xl:block"></div>

               <div className="flex items-center space-x-1 hidden xl:flex">
                 <button onClick={() => setVisualConfig(prev => ({...prev, zoom: Math.max(0.5, prev.zoom - 0.1)}))} className="p-1 hover:bg-gray-200 rounded"><ZoomOut className="w-4 h-4 text-gray-600" /></button>
                 <span className="text-xs text-gray-500 w-8 text-center">{Math.round(visualConfig.zoom * 100)}%</span>
                 <button onClick={() => setVisualConfig(prev => ({...prev, zoom: Math.min(1.5, prev.zoom + 0.1)}))} className="p-1 hover:bg-gray-200 rounded"><ZoomIn className="w-4 h-4 text-gray-600" /></button>
               </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-100 print:p-0 print:overflow-visible custom-scrollbar relative">

            {/* Match Score Overlay */}
            {generatedContent.tailoredSummary && !visualConfig.showOriginal && (
              <MatchScoreGauge keywords={getHighlightKeywords().length} isOptimized={true} />
            )}

            <div
              className={`bg-white shadow-xl print:shadow-none min-h-[1123px] w-[210mm] p-[15mm] print:p-0 transition-transform origin-top duration-200 ${visualConfig.template === 'classic' ? 'font-serif' : 'font-sans'} relative`}
              style={{ transform: `scale(${visualConfig.zoom})`, fontSize: visualConfig.fontSize === 'small' ? '0.85rem' : visualConfig.fontSize === 'large' ? '1.05rem' : '0.95rem' }}
            >
              {/* Page Breaks */}
              <PageBreakIndicator pageNum={1} />
              <PageBreakIndicator pageNum={2} />

              {/* === RESUME VIEW === */}
              <div id="resume-preview">
                <ResumeHeader />

                <section className="mb-6 break-inside-avoid">
                  <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 flex justify-between items-center" style={{ color: visualConfig.color }}>
                    Professional Summary
                    {!visualConfig.showOriginal && generatedContent.tailoredSummary && (
                       <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full lowercase font-normal print:hidden border border-indigo-100">
                        <Sparkles className="w-3 h-3 mr-1 inline" /> tailored
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-justify">
                    <AtsHighlight text={(!visualConfig.showOriginal && generatedContent.tailoredSummary) ? generatedContent.tailoredSummary : (profile.summary || 'Summary goes here...')} />
                  </p>
                </section>

                <section className="mb-6">
                  <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-4" style={{ color: visualConfig.color }}>Experience</h2>
                  <div className="space-y-5">
                    {profile.experience.map(exp => {
                      const tailored = (generatedContent.tailoredExperience as any)?.find((t: any) => t.id === exp.id);
                      const displayDesc = (!visualConfig.showOriginal && tailored) ? tailored.description : exp.description;
                      const isTailored = !visualConfig.showOriginal && tailored;

                      return (
                        <div key={exp.id} className="break-inside-avoid relative group/exp">
                          {isTailored && (
                             <div className="absolute -left-4 top-1 w-1 h-full bg-indigo-300 rounded opacity-50 print:hidden" title="Optimized"></div>
                          )}
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="text-base font-bold text-gray-900 flex items-center">
                              {exp.role}
                              {isTailored && <Sparkles className="w-3 h-3 text-indigo-500 ml-2 print:hidden" />}
                            </h3>
                            <span className="text-sm font-medium text-gray-600">{exp.period}</span>
                          </div>
                          <div className="text-sm font-semibold text-gray-700 mb-2">{exp.company}</div>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                            <AtsHighlight text={displayDesc} />
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="mb-6 break-inside-avoid">
                  <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3" style={{ color: visualConfig.color }}>Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => <span key={index} className="bg-gray-100 print:bg-transparent print:border print:border-gray-300 px-3 py-1 rounded text-sm font-medium text-gray-700"><AtsHighlight text={skill} /></span>)}
                  </div>
                </section>

                <section className="mb-6 break-inside-avoid">
                  <h2 className="text-lg font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3" style={{ color: visualConfig.color }}>Education</h2>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
