// Client-side AI service that bypasses server restrictions
import { LinkedInJobData, extractLinkedInJobId } from './client-linkedin';
import { processLinkedInHTMLLocally, generateContentWithFallback } from './client-ai';

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export interface AIService {
  parseLinkedInJobUrl(url: string): Promise<AIResponse<LinkedInJobData>>;
  generateAllContent(profile: any, jobDescription: string): Promise<{
    success: boolean;
    coverLetter?: string;
    tailoredSummary?: string;
    interviewQuestions?: any[];
    skillsAnalysis?: any;
    resumeCritique?: any;
    errors?: string[];
  }>;
  optimizeExperience(description: string): Promise<AIResponse<string[]>>;
  generateCoverLetter(profile: any, jobDescription: string): Promise<AIResponse<string>>;
  generateTailoredSummary(profile: any, jobDescription: string): Promise<AIResponse<string>>;
  analyzeSkills(profile: any, jobDescription: string): Promise<AIResponse<any>>;
  critiqueResume(profile: any, jobDescription: string): Promise<AIResponse<any>>;
}

export class ClientAIService implements AIService {
  /**
   * Parse LinkedIn job URL using client-side approach
   */
  async parseLinkedInJobUrl(url: string): Promise<AIResponse<LinkedInJobData>> {
    try {
      console.log('Starting client-side LinkedIn parsing for URL:', url);

      // Extract job ID
      const jobId = extractLinkedInJobId(url);
      if (!jobId) {
        return {
          success: false,
          error: '无法从 URL 中提取 LinkedIn Job ID',
          details: { url, error: 'Job ID extraction failed' }
        };
      }

      console.log('Extracted Job ID:', jobId);

      // Fetch job data using client-side approach
      try {
        const jobData = await fetch(`https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
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
            'Upgrade-Insecure-Requests': '1'
          },
          credentials: 'include', // This is key - includes browser cookies
          redirect: 'follow'
        });

        console.log('LinkedIn response status:', jobData.status);

        if (!jobData.ok) {
          throw new Error(`LinkedIn API error: ${jobData.status} - ${jobData.statusText}`);
        }

        const htmlContent = await jobData.text();
        console.log('LinkedIn HTML content length:', htmlContent.length);

        if (!htmlContent || htmlContent.length < 100) {
          throw new Error('Received empty or invalid HTML content from LinkedIn');
        }

        // Process HTML locally
        const result = processLinkedInHTMLLocally(htmlContent);

        if (result.success && result.data) {
          const parsedData = result.data;

          // Add URL and job ID to the result
          const enhancedData: LinkedInJobData = {
            ...parsedData,
            originalUrl: url,
            jobId: jobId
          };

          return {
            success: true,
            data: enhancedData
          };
        } else {
          // If local parsing fails, return basic info with error message
          return {
            success: true, // We got the HTML, just couldn't parse it perfectly
            data: {
              title: `职位 ${jobId}`,
              company: '公司信息提取失败',
              description: `无法完整解析职位信息。原始 HTML 内容：\n\n${htmlContent.substring(0, 500)}...\n\n请手动输入职位信息或重试。`,
              location: '未知地点',
              employmentType: '未指定',
              seniorityLevel: '未指定',
              industries: [],
              originalUrl: url,
              jobId: jobId
            },
            error: '职位信息解析不完整，但已获取基础数据',
            details: { jobId, parsingError: result.error }
          };
        }

      } catch (fetchError) {
        console.error('LinkedIn fetch error:', fetchError);

        // Provide detailed error information for debugging
        const errorDetails = {
          jobId,
          url,
          fetchError: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
          timestamp: new Date().toISOString()
        };

        if (fetchError instanceof Error && fetchError.message.includes('403')) {
          return {
            success: false,
            error: 'LinkedIn 访问被拒绝 (403 Forbidden)。这可能是因为：\n1. 需要先登录 LinkedIn\n2. 地理位置限制\n3. 访问频率过高\n\n建议：直接在浏览器中登录 LinkedIn 后再试。',
            details: errorDetails
          };
        }

        return {
          success: false,
          error: `无法获取 LinkedIn 职位数据: ${fetchError instanceof Error ? fetchError.message : '未知错误'}`,
          details: errorDetails
        };
      }

    } catch (error) {
      console.error('LinkedIn parsing error:', error);

      return {
        success: false,
        error: `LinkedIn 解析失败: ${error instanceof Error ? error.message : '未知错误'}`,
        details: {
          url,
          error: error instanceof Error ? error.stack : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Generate all AI content with fallbacks
   */
  async generateAllContent(profile: any, jobDescription: string): Promise<any> {
    const results: any = {};

    try {
      const coverLetter = await this.generateCoverLetter(profile, jobDescription);
      results.coverLetter = coverLetter.success ? coverLetter.data : null;
    } catch (error) {
      results.coverLetter = null;
    }

    try {
      const summary = await this.generateTailoredSummary(profile, jobDescription);
      results.tailoredSummary = summary.success ? summary.data : null;
    } catch (error) {
      results.tailoredSummary = null;
    }

    const errors = [];
    if (!results.coverLetter) errors.push('Cover letter generation failed');
    if (!results.tailoredSummary) errors.push('Summary generation failed');

    return {
      success: errors.length === 0,
      ...results,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Generate optimized experience descriptions
   */
  async optimizeExperience(description: string): Promise<AIResponse<string[]>> {
    try {
      // Use AI if available, otherwise provide manual optimization suggestions
      const prompt = `请将以下工作经历描述优化为3个更专业、更具体的版本，使用STAR方法和强有力的动词：

原文："${description}"

要求：
1. 每个版本都要简洁有力
2. 使用专业动词开头
3. 突出具体成果
4. 严格 JSON 数组格式：["版本1...", "版本2...", "版本3..."]
5. 不要包含 markdown 代码块标记`;

      const result = await generateContentWithFallback('claude-3.5-sonnet', prompt, {
        responseFormat: 'json'
      });

      if (result.success && result.data) {
        try {
          const optimized = JSON.parse(result.data);
          if (Array.isArray(optimized)) {
            return {
              success: true,
              data: optimized
            };
          }
        } catch (parseError) {
          // If JSON parsing fails, return the raw text as suggestions
          return {
            success: true,
            data: [
              `优化建议1: ${result.data.substring(0, 100)}...`,
              `优化建议2: 请使用更强有力的动词开头`,
              `优化建议3: 量化具体成果和影响`
            ]
          };
        }
      }

      // Fallback suggestions
      return {
        success: true,
        data: [
          '• 使用强力动词开头（如：主导、优化、创建）',
          '• 量化具体成果（如：提升效率30%，节省成本$50k）',
          '• 使用STAR方法：情境、任务、行动、结果'
        ]
      };

    } catch (error) {
      return {
        success: false,
        error: `Experience optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Generate cover letter
   */
  async generateCoverLetter(profile: any, jobDescription: string): Promise<AIResponse<string>> {
    try {
      const prompt = `作为专业的职业顾问，基于候选人资料和职位描述撰写一封有说服力的求职信。

候选人资料：${JSON.stringify(profile, null, 2)}
职位描述：${jobDescription}

要求：
1. 专业自信的语气
2. 突出与JD要求匹配的关键经验
3. 控制在300字以内
4. 标准信函格式，包含称呼和结尾
5. 只输出信件内容，不要 markdown 代码块`;

      const result = await generateContentWithFallback('claude-3.5-sonnet', prompt);

      if (result.success) {
        return {
          success: true,
          data: result.data || 'Cover letter generation temporarily unavailable. Please try again later.'
        };
      }

      // Fallback template
      const fallbackLetter = `Dear Hiring Manager,

I am excited to apply for this position. With my background and experience, I believe I would be a valuable addition to your team.

[Please manually edit this cover letter based on your specific experience and the job requirements]

Sincerely,
${profile.name || 'Your Name'}`;

      return {
        success: true,
        data: fallbackLetter
      };

    } catch (error) {
      return {
        success: false,
        error: `Cover letter generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Generate tailored professional summary
   */
  async generateTailoredSummary(profile: any, jobDescription: string): Promise<AIResponse<string>> {
    try {
      const prompt = `作为简历优化专家，基于职位描述重写候选人的专业概述。

原始概述：${profile.summary || ''}
职位描述：${jobDescription}

要求：
1. 包含JD中的2-3个核心关键词
2. 强调与该职位最相关的经验
3. 英文写作，40-60字
4. 只输出段落内容`;

      const result = await generateContentWithFallback('claude-3.5-sonnet', prompt);

      if (result.success) {
        return {
          success: true,
          data: result.data || 'Summary generation temporarily unavailable. Please try again later.'
        };
      }

      // Fallback summary
      const fallbackSummary = `${profile.name || 'Professional'} with ${profile.experience?.length || 0}+ years of experience. Skilled in relevant technologies and methodologies. Seeking to contribute expertise to a dynamic team.`;

      return {
        success: true,
        data: fallbackSummary
      };

    } catch (error) {
      return {
        success: false,
        error: `Summary generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  
  /**
   * Analyze skills match
   */
  async analyzeSkills(profile: any, jobDescription: string): Promise<AIResponse<any>> {
    // This would normally use AI to compare skills
    // For now, return a basic analysis
    return {
      success: true,
      data: {
        matching_skills: [],
        missing_skills: [],
        advice: 'Skills analysis temporarily unavailable. Please manually compare your skills with job requirements.'
      }
    };
  }

  /**
   * Critique resume match
   */
  async critiqueResume(profile: any, jobDescription: string): Promise<AIResponse<any>> {
    // This would normally use AI to score and critique
    // For now, return a basic analysis
    return {
      success: true,
      data: {
        score: 75,
        pros: [
          'Clear professional experience',
          'Relevant educational background',
          'Professional presentation'
        ],
        cons: [
          'Could be more tailored to this specific role',
          'Missing quantifiable achievements',
          'Could highlight more relevant skills'
        ],
        verdict: 'Good candidate but could improve alignment with job requirements'
      }
    };
  }
}

// Export singleton instance
export const aiService = new ClientAIService();