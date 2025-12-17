// Client-side AI integration - bypasses server restrictions
export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Simple fallback HTML parser when AI is not available
 */
export function parseLinkedInHTMLLocally(htmlContent: string): AIResponse<{
  title: string;
  company: string;
  description: string;
  location: string;
  employmentType?: string;
  seniorityLevel?: string;
  industries?: string[];
}> {
  try {
    const extractField = (regex: RegExp): string => {
      const match = htmlContent.match(regex);
      return match ? match[1].trim() : '';
    };

    // Extract title - try multiple patterns
    const title =
      extractField(/<title[^>]*>([^<]+)<\/title>/).split(' | ')[0] ||
      extractField(/"title":\s*"([^"]+)"/) ||
      extractField(/<h1[^>]*class[^>]*top-card-layout__title[^>]*>([^<]+)<\/h1>/) ||
      extractField(/<h1[^>]*>([^<]+)<\/h1>/);

    // Extract company - try multiple patterns
    const company =
      extractField(/"companyName":\s*"([^"]+)"/) ||
      extractField(/"name":\s*"([^"]+)"/) ||
      extractField(/<span[^>]*class[^>]*top-card-layout__company[^>]*>([^<]+)<\/span>/) ||
      extractField(/<a[^>]*class[^>]*top-card-layout__company[^>]*>([^<]+)<\/a>/);

    // Extract location - try multiple patterns
    const location =
      extractField(/"formattedLocation":\s*"([^"]+)"/) ||
      extractField(/"location":\s*"([^"]+)"/) ||
      extractField(/<span[^>]*class[^>]*top-card-layout__location[^>]*>([^<]+)<\/span>/) ||
      extractField(/<span[^>]*class[^>]*job-result-card__location[^>]*>([^<]+)<\/span>/);

    // Extract description - comprehensive approach
    const description = extractJobDescription(htmlContent);

    // Extract employment type
    const employmentType = extractField(/"employmentType":\s*"([^"]+)"/) ||
                           extractField(/<span[^>]*class[^>]*employment-type[^>]*>([^<]+)<\/span>/);

    // Extract seniority level
    const seniorityLevel = extractField(/"seniorityLevel":\s*"([^"]+)"/) ||
                          extractField(/<span[^>]*class[^>]*seniority-level[^>]*>([^<]+)<\/span>/);

    // Extract industries
    const industries = extractIndustries(htmlContent);

    const result = {
      title: cleanText(title),
      company: cleanText(company),
      description: cleanText(description),
      location: cleanText(location),
      employmentType: cleanText(employmentType),
      seniorityLevel: cleanText(seniorityLevel),
      industries: industries.map(industry => cleanText(industry)).filter(Boolean)
    };

    // Validate that we have at least some basic info
    if (!result.title && !result.company) {
      return {
        success: false,
        error: 'Could not extract job information. The page structure might have changed or access is restricted.'
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Local HTML parsing error:', error);
    return {
      success: false,
      error: `Failed to parse LinkedIn HTML: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Extract job description using multiple strategies
 */
function extractJobDescription(html: string): string {
  // Strategy 1: Try JSON field
  const jsonDesc = html.match(/"description":\s*"([^"]+)"/)?.[1];
  if (jsonDesc && jsonDesc.length > 100) {
    return jsonDesc;
  }

  // Strategy 2: Look for description sections
  const descriptionPatterns = [
    /<div[^>]*class[^>]*description[^>]*>([\s\S]*?)<\/div>/,
    /<div[^>]*class[^>]*job-description[^>]*>([\s\S]*?)<\/div>/,
    /<section[^>]*class[^>]*description[^>]*>([\s\S]*?)<\/section>/,
    /<div[^>]*data-section="description"[^>]*>([\s\S]*?)<\/div>/
  ];

  for (const pattern of descriptionPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const cleanDesc = cleanText(match[1]);
      if (cleanDesc.length > 100) {
        return cleanDesc;
      }
    }
  }

  // Strategy 3: Find the largest text block that looks like a job description
  return findLargestTextBlock(html);
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

  // Look for industry in spans
  const industrySpans = html.match(/<span[^>]*class[^>]*industry[^>]*>([^<]+)<\/span>/g);
  if (industrySpans) {
    industries.push(...industrySpans.map(span => span.replace(/<[^>]*>/g, '')));
  }

  return [...new Set(industries)]; // Remove duplicates
}

/**
 * Find the largest text block that could be a job description
 */
function findLargestTextBlock(html: string): string {
  // Remove script and style elements
  const cleanHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
                      .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');

  // Find all text blocks
  const textBlocks = cleanHtml.match(/<[^>]*>([\s\S]{100,})<\/[^>]*>/g) || [];

  let largestBlock = '';
  let maxLength = 0;

  for (const block of textBlocks) {
    const text = cleanText(block);

    // Skip if it looks like navigation, footer, or other non-description content
    if (text.length > maxLength &&
        !text.toLowerCase().includes('linkedin') &&
        !text.toLowerCase().includes('cookie') &&
        !text.toLowerCase().includes('privacy') &&
        !text.toLowerCase().includes('terms of service') &&
        !text.toLowerCase().includes('sign in') &&
        text.length > 100) {
      maxLength = text.length;
      largestBlock = text;
    }
  }

  return largestBlock;
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
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Generate content using AI (when available)
 * Falls back to local processing if AI is not available
 */
export async function generateContentWithFallback(
  model: string,
  prompt: string,
  options: {
    temperature?: number;
    maxTokens?: number;
    responseFormat?: 'text' | 'json';
  } = {}
): Promise<AIResponse<string>> {
  try {
    // Try AI API first (if it becomes available)
    const MULERUN_API_BASE = process.env.MULERUN_API_BASE || 'https://api.mulerun.ai';
    const MULERUN_API_KEY = process.env.MULERUN_API_KEY;

    if (MULERUN_API_KEY) {
      const response = await fetch(`${MULERUN_API_BASE}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MULERUN_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000,
          ...(options.responseFormat === 'json' && { response_format: { type: 'json_object' } })
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return {
            success: true,
            data: content
          };
        }
      }
    }

    // Fallback to local processing
    throw new Error('AI service not available');
  } catch (error) {
    console.log('AI service not available, using fallback processing');

    // For LinkedIn HTML parsing, use local parser
    if (prompt.includes('LinkedIn 职位页面的 HTML 内容')) {
      const htmlMatch = prompt.match(/HTML 内容：\s*(<[\s\S]*>)/);
      if (htmlMatch) {
        return parseLinkedInHTMLLocally(htmlMatch[1]);
      }
    }

    // For other content generation, return a helpful message
    return {
      success: false,
      error: 'AI service is currently unavailable. This appears to be a configuration or network issue. Please check your MULERUN_API_KEY and MULERUN_API_BASE environment variables.'
    };
  }
}

/**
 * Process LinkedIn HTML locally (client-side alternative to AI processing)
 */
export function processLinkedInHTMLLocally(htmlContent: string): AIResponse<{
  title: string;
  company: string;
  description: string;
  location: string;
  employmentType?: string;
  seniorityLevel?: string;
  industries?: string[];
}> {
  const result = parseLinkedInHTMLLocally(htmlContent);

  if (result.success && result.data) {
    // Add some validation and enhancement
    const data = result.data;

    // Ensure we have meaningful content
    if (!data.description || data.description.length < 50) {
      data.description = 'Job description could not be extracted. Please enter the job details manually or try refreshing the LinkedIn page.';
    }

    if (!data.company) {
      data.company = 'Company name not found';
    }

    if (!data.title) {
      data.title = 'Job title not found';
    }

    if (!data.location) {
      data.location = 'Location not specified';
    }

    return {
      success: true,
      data
    };
  }

  return result;
}