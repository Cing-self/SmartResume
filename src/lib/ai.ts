// Mulerun AI API 集成 - 统一模型调用平台
// 根据项目要求，所有 LLM 调用必须通过 Mulerun 平台

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Mulerun API 配置
const MULERUN_API_BASE = process.env.MULERUN_API_BASE || 'https://api.mulerun.ai';
const MULERUN_API_KEY = process.env.MULERUN_API_KEY;

/**
 * 调用 Mulerun AI 生成内容
 * @param model 模型名称 (如: 'gemini-2.5-flash-preview', 'claude-3.5-sonnet')
 * @param prompt 用户提示词
 * @param options 额外选项
 */
export async function generateContent(
  model: string,
  prompt: string,
  options: {
    temperature?: number;
    maxTokens?: number;
    responseFormat?: 'text' | 'json';
  } = {}
): Promise<AIResponse<string>> {
  try {
    if (!MULERUN_API_KEY) {
      return {
        success: false,
        error: 'Mulerun API key not configured'
      };
    }

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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `Mulerun API error: ${response.status} - ${errorData.error?.message || response.statusText}`
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: 'No content returned from Mulerun API'
      };
    }

    return {
      success: true,
      data: content
    };
  } catch (error) {
    console.error('Mulerun API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * 从 LinkedIn 职位链接中提取 Job ID
 */
export function extractLinkedInJobId(url: string): string | null {
  if (!url) return null;

  // LinkedIn 职位链接的多种格式
  const patterns = [
    /linkedin\.com\/jobs\/view\/(\d+)/,
    /linkedin\.com\/jobs\/view\/\?currentJobId=(\d+)/,
    /linkedin\.com\/jobs\/search\/\?[^"]*currentJobId=(\d+)/,
    /linkedin\.com\/jobs\/view\/(\d+)\/[^"]*/,
    /linkedin\.com\/jobs\/collections\/[^?]*\?currentJobId=(\d+)/,  // 新增：collections 格式
    /linkedin\.com\/jobs\/[^?]*\?currentJobId=(\d+)/,  // 通用格式：jobs/任意路径/?currentJobId=
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
 * 从 LinkedIn API 获取职位详情
 */
export async function fetchLinkedInJobDetails(jobId: string): Promise<string | null> {
  try {
    // 首先尝试标准的职位页面，可能更容易获取
    const standardUrl = `https://www.linkedin.com/jobs/view/${jobId}`;

    // 备选方案：尝试更宽松的 API 端点
    const apiUrl = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;

    // 使用标准 URL 优先，因为这通常是页面端点
    const response = await fetch(standardUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
        'Cache-Control': 'max-age=0',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
        'Sec-Ch-Ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Priority': 'u=0, i'
      },
      credentials: 'omit',
      redirect: 'follow', // 跟随重定向，看看能否到达目标页面
    });

    console.log('LinkedIn API Response Status:', response.status);
    console.log('LinkedIn API Response Headers:', Object.fromEntries(response.headers.entries()));

    // 检查响应状态
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location');
      console.log('LinkedIn redirect to:', location);

      // 如果被重定向，尝试 API 端点
      console.log('Trying API endpoint as fallback...');
      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
          'Cache-Control': 'max-age=0',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
          'Sec-Ch-Ua': '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"macOS"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'Upgrade-Insecure-Requests': '1',
          'Priority': 'u=0, i'
        },
        credentials: 'omit',
        redirect: 'manual',
      });

      console.log('API Response Status:', apiResponse.status);
      console.log('API Response Headers:', Object.fromEntries(apiResponse.headers.entries()));

      if (apiResponse.status === 302 || apiResponse.status === 301) {
        const apiLocation = apiResponse.headers.get('location');
        console.log('API redirect to:', apiLocation);
        return null;
      }

      if (!apiResponse.ok) {
        console.error(`LinkedIn API error: ${apiResponse.status} - ${apiResponse.statusText}`);
        console.error(`Job ID: ${jobId}`);
        return null;
      }

      const apiContent = await apiResponse.text();
      console.log('LinkedIn API HTML content length:', apiContent.length);
      return apiContent;
    }

    if (!response.ok) {
      console.error(`LinkedIn API error: ${response.status} - ${response.statusText}`);
      console.error(`Job ID: ${jobId}`);
      return null;
    }

    const htmlContent = await response.text();
    console.log('LinkedIn HTML content length:', htmlContent.length);
    return htmlContent;
  } catch (error) {
    console.error('Failed to fetch LinkedIn job details:', error);
    return null;
  }
}

/**
 * 构建 LinkedIn HTML 解析的 AI 提示词
 */
export function buildLinkedInParsePrompt(htmlContent: string): string {
  return `请从以下 LinkedIn 职位页面的 HTML 内容中提取关键信息，并以 JSON 格式返回：

HTML 内容：
${htmlContent}

请提取以下信息并以严格的 JSON 格式返回：
{
  "title": "职位名称",
  "company": "公司名称",
  "description": "职位描述（完整详细）",
  "location": "工作地点",
  "employmentType": "工作类型（如：Full-time, Part-time, Contract）",
  "seniorityLevel": "资历级别（如：Entry level, Mid-Senior level, Director, Executive）",
  "industries": ["行业1", "行业2"]
}

注意事项：
1. 如果某个字段无法找到，请设置为空字符串或空数组
2. 职位描述要尽可能完整和详细
3. 确保返回的是有效的 JSON 格式，不要包含 markdown 代码块标记
4. 提取中英文信息都可以，保持原文
5. 不要添加任何解释或说明，只返回 JSON 数据`;
}

/**
 * 解析 LinkedIn 职位数据
 */
export function parseLinkedInJobData(jobData: unknown): {
  title: string;
  company: string;
  description: string;
  location: string;
  employmentType?: string;
  seniorityLevel?: string;
  industries?: string[];
} | null {
  if (!jobData) return null;

  try {
    const data = jobData as Record<string, unknown>;
    const description = (data.description as string) || '';
    const title = (data.title as string) || '';
    const company = (data.companyName as string) || ((data.company as Record<string, unknown>)?.name as string) || '';
    const location = (data.formattedLocation as string) || (data.location as string) || '';
    const employmentType = (data.employmentType as string) || '';
    const seniorityLevel = (data.seniorityLevel as string) || '';
    const industries = ((data.industries as unknown[])?.map((ind: unknown) => (ind as Record<string, unknown>)?.name) as string[]) || [];

    return {
      title,
      company,
      description,
      location,
      employmentType,
      seniorityLevel,
      industries,
    };
  } catch (error) {
    console.error('Failed to parse LinkedIn job data:', error);
    return null;
  }
}

/**
 * 构建 AI 提示词
 */
export function buildPrompt(type: string, data: any, context: string = ''): string {
  const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  switch (type) {
    case 'cover_letter':
      return `As a professional career consultant, write a compelling cover letter in English based on the candidate profile and job description.

Candidate Profile: ${dataStr}
Job Description: ${context}

Requirements:
1. Professional and confident tone
2. Highlight key experiences that match the JD requirements
3. Keep it under 300 words
4. Standard letter format with salutation and closing
5. Output only the letter content, no markdown code blocks`;

    case 'tailored_summary':
      return `As a resume optimization expert, rewrite the candidate's Professional Summary based on this job description.

Original Summary: ${data.summary}
Job Description: ${context}

Requirements:
1. Include 2-3 core keywords from the JD
2. Emphasize most relevant experience for this position
3. Write in English, 40-60 words
4. Output only the paragraph content`;

    case 'interview_prep':
      return `As a senior hiring manager, predict the 3 most likely interview questions based on this resume and job description, and provide brief answer tips.

Resume: ${dataStr}
Job Description: ${context}

Requirements:
1. Output format: JSON array of objects with "question" and "tip" fields
2. Example: [{"question": "...", "tip": "..."}, ...]
3. Return only the JSON string, no markdown blocks
4. Use English for both questions and tips`;

    case 'skills_analysis':
      return `Compare this candidate's resume with the job description and perform a skills gap analysis.

Resume: ${dataStr}
Job Description: ${context}

Requirements:
1. Identify "matching_skills" (skills the candidate has that the JD requires)
2. Identify "missing_skills" (skills the JD requires but aren't shown in the resume)
3. Provide one-sentence improvement "advice" in English
4. Strict JSON format: {"matching_skills": [], "missing_skills": [], "advice": ""}
5. No markdown code blocks`;

    case 'resume_critique':
      return `As a strict hiring manager, score this resume's match for the position (0-100).

Resume: ${dataStr}
Job Description: ${context}

Requirements:
1. Provide a "score" (0-100)
2. List 3 "pros" (strengths in English)
3. List 3 "cons" (weaknesses in English)
4. Give an overall "verdict" (English)
5. Strict JSON format: {"score": 85, "pros": [], "cons": [], "verdict": ""}
6. No markdown code blocks`;

    case 'optimize_experience':
      return `As an expert resume writer, optimize this work experience description to make it more impactful and structured using STAR method and strong action verbs.

Original description: "${dataStr}"

Requirements:
1. Provide 3 different optimized versions in English
2. Each version should be concise but powerful
3. Strict JSON array format: ["Version 1...", "Version 2...", "Version 3..."]
4. No markdown code block markers`;

    
    default:
      return `Please process the following request: ${dataStr}`;
  }
}

/**
 * 默认模型配置
 */
export const DEFAULT_MODELS = {
  writing: 'claude-3.5-sonnet', // 适合写作和润色
  analysis: 'claude-3.5-sonnet', // 适合分析和数据处理
  interview: 'claude-3.5-sonnet', // 适合面试相关内容
} as const;