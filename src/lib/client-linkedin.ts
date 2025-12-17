// Client-side LinkedIn scraping - bypasses server restrictions
export interface LinkedInJobData {
  title: string;
  company: string;
  description: string;
  location: string;
  employmentType?: string;
  seniorityLevel?: string;
  industries?: string[];
}

/**
 * Client-side approach to fetch LinkedIn job data
 * This bypasses server-side restrictions by using browser fetch
 */
export async function fetchLinkedInJobDataClient(url: string): Promise<LinkedInJobData> {
  // First validate and extract job ID
  const jobId = extractLinkedInJobId(url);
  if (!jobId) {
    throw new Error('Invalid LinkedIn job URL');
  }

  try {
    // Try to fetch job data directly using browser's session
    const response = await fetch(`https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
        'Cache-Control': 'max-age=0',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
      },
      credentials: 'include', // Include browser cookies
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status} - ${response.statusText}`);
    }

    const htmlContent = await response.text();

    if (!htmlContent || htmlContent.length < 100) {
      throw new Error('Received empty or invalid HTML content from LinkedIn');
    }

    // Extract data using simple regex patterns first
    const jobData = extractJobDataFromHTML(htmlContent);

    if (!jobData.title && !jobData.company) {
      throw new Error('Could not extract job information from LinkedIn. This might be due to access restrictions.');
    }

    return jobData;
  } catch (error) {
    console.error('Client-side LinkedIn fetch error:', error);
    throw new Error(`Failed to fetch LinkedIn job data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract Job ID from LinkedIn URL - supports all formats
 */
export function extractLinkedInJobId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /linkedin\.com\/jobs\/view\/(\d+)/,
    /linkedin\.com\/jobs\/view\/\?currentJobId=(\d+)/,
    /linkedin\.com\/jobs\/search\/\?[^\"]*currentJobId=(\d+)/,
    /linkedin\.com\/jobs\/view\/(\d+)\/[^\"]*/,
    /linkedin\.com\/jobs\/collections\/[^?]*\?currentJobId=(\d+)/,
    /linkedin\.com\/jobs\/[^?]*\?currentJobId=(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract job information from HTML content using regex patterns
 */
function extractJobDataFromHTML(html: string): LinkedInJobData {
  const extractField = (regex: RegExp): string => {
    const match = html.match(regex);
    return match ? match[1].trim() : '';
  };

  // Try multiple patterns for title
  const title =
    extractField(/<title[^>]*>([^<]+)<\/title>/).split(' | ')[0] ||
    extractField(/"title":\s*"([^"]+)"/) ||
    extractField(/<h1[^>]*>([^<]+)<\/h1>/);

  // Try multiple patterns for company
  const company =
    extractField(/"companyName":\s*"([^"]+)"/) ||
    extractField(/"name":\s*"([^"]+)"/) ||
    extractField(/data-ghost-job-id[^>]*>[^<]*<[^>]*>([^<]+)<\/[^>]*>/);

  // Try multiple patterns for location
  const location =
    extractField(/"formattedLocation":\s*"([^"]+)"/) ||
    extractField(/"location":\s*"([^"]+)"/);

  // Extract description - take the largest text block
  const description =
    extractField(/"description":\s*"([^"]+)"/) ||
    extractField(/<div[^>]*class[^>]*description[^>]*>([\s\S]*?)<\/div>/) ||
    extractJobDescriptionFromTextBlocks(html);

  // Extract employment type and seniority
  const employmentType = extractField(/"employmentType":\s*"([^"]+)"/);
  const seniorityLevel = extractField(/"seniorityLevel":\s*"([^"]+)"/);

  // Extract industries
  const industries = extractIndustries(html);

  return {
    title: cleanText(title),
    company: cleanText(company),
    description: cleanText(description),
    location: cleanText(location),
    employmentType: cleanText(employmentType),
    seniorityLevel: cleanText(seniorityLevel),
    industries: industries.map(industry => cleanText(industry)).filter(Boolean)
  };
}

/**
 * Extract job description from the largest text block
 */
function extractJobDescriptionFromTextBlocks(html: string): string {
  // Find all div elements with substantial text content
  const divs = html.match(/<div[^>]*>([\s\S]{200,})<\/div>/g) || [];

  let largestBlock = '';
  let maxLength = 0;

  for (const div of divs) {
    // Remove HTML tags and get clean text
    const text = div.replace(/<[^>]*>/g, '').trim();

    // Skip if it looks like navigation, footer, or other non-description content
    if (text.length > maxLength &&
        !text.toLowerCase().includes('linkedin') &&
        !text.toLowerCase().includes('cookie') &&
        !text.toLowerCase().includes('privacy') &&
        text.length > 100) {
      maxLength = text.length;
      largestBlock = text;
    }
  }

  return largestBlock;
}

/**
 * Extract industries from HTML
 */
function extractIndustries(html: string): string[] {
  const industries: string[] = [];

  // Try to find industries in different formats
  const industryMatches = html.match(/"industries":\s*\[([\s\S]*?)\]/);
  if (industryMatches) {
    const industryArray = industryMatches[1];
    const industryStrings = industryArray.match(/"([^"]+)"/g);
    if (industryStrings) {
      industries.push(...industryStrings.map(s => s.replace(/"/g, '')));
    }
  }

  return industries;
}

/**
 * Clean and normalize extracted text
 */
function cleanText(text: string): string {
  if (!text) return '';

  return text
    .replace(/\\n/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\\u[0-9a-fA-F]{4}/g, '')
    .trim();
}

/**
 * Create a fallback job parser for when direct extraction fails
 */
export function createFallbackJobParser(): (url: string) => Promise<LinkedInJobData> {
  return async (url: string): Promise<LinkedInJobData> => {
    // This is a simple fallback that extracts basic info from the URL structure
    // In a real implementation, you might want to integrate with other job APIs

    const jobId = extractLinkedInJobId(url);
    if (!jobId) {
      throw new Error('Invalid LinkedIn job URL');
    }

    // Return minimal data structure
    return {
      title: `Position ${jobId}`,
      company: 'Company Name',
      description: 'Job description not available due to LinkedIn access restrictions. Please enter the job details manually.',
      location: 'Location not available',
      employmentType: 'Not specified',
      seniorityLevel: 'Not specified',
      industries: []
    };
  };
}