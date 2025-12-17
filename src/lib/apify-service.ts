// Apify job search service - client-side API calls
import type { ApifyJobResult } from '@/types/resume';

export interface JobSearchParams {
  title: string;
  location: string;
  companies: string[];
  experienceLevel: string;
  employmentType: string;
  workArrangement: string;
  postingTime: string;
  jobsEntries?: number;
}

export async function searchJobs(params: JobSearchParams): Promise<{
  success: boolean;
  data?: ApifyJobResult[];
  error?: string;
}> {
  try {
    const response = await fetch('/api/apify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Apify search error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred during job search'
    };
  }
}

export function formatExperienceLevel(level: string): string {
  const reverseMapping: Record<string, string> = {
    '1': 'Entry level',
    '2': 'Associate',
    '3': 'Mid-Senior level',
    '4': 'Senior level',
    '5': 'Director',
    '6': 'Executive',
  };
  return reverseMapping[level] || level;
}

export function formatEmploymentType(type: string): string {
  const reverseMapping: Record<string, string> = {
    'F': 'Full-time',
    'P': 'Part-time',
    'C': 'Contract',
    'T': 'Temporary',
    'V': 'Volunteer',
    'I': 'Internship',
  };
  return reverseMapping[type] || type;
}