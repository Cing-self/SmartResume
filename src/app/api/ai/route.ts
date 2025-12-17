// API 路由用于处理 AI 请求
// 由于静态导出不支持 Server Actions，改为使用 API 路由

import { NextRequest, NextResponse } from 'next/server';
import { generateContent, buildPrompt, buildLinkedInParsePrompt, DEFAULT_MODELS } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { type, profile, jobDescription, text } = await request.json();

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      );
    }

    let prompt = '';
    let model = DEFAULT_MODELS.writing;
    let responseFormat: 'text' | 'json' = 'text';

    switch (type) {
      case 'cover_letter':
        prompt = buildPrompt('cover_letter', profile, jobDescription);
        break;
      case 'tailored_summary':
        prompt = buildPrompt('tailored_summary', profile, jobDescription);
        break;
      case 'interview_prep':
        prompt = buildPrompt('interview_prep', profile, jobDescription);
        model = DEFAULT_MODELS.interview;
        responseFormat = 'json';
        break;
      case 'skills_analysis':
        prompt = buildPrompt('skills_analysis', profile, jobDescription);
        model = DEFAULT_MODELS.analysis;
        responseFormat = 'json';
        break;
      case 'resume_critique':
        prompt = buildPrompt('resume_critique', profile, jobDescription);
        model = DEFAULT_MODELS.analysis;
        responseFormat = 'json';
        break;
      case 'optimize_experience':
        prompt = buildPrompt('optimize_experience', text, '');
        responseFormat = 'json';
        break;
            case 'linkedin_parse':
        const htmlPrompt = `请从以下 LinkedIn 职位页面的 HTML 内容中提取关键信息，并以 JSON 格式返回：

HTML 内容：
${jobDescription || ''}

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

        prompt = htmlPrompt;
        model = DEFAULT_MODELS.analysis;
        responseFormat = 'json';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }

    const result = await generateContent(model, prompt, { responseFormat });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'AI service unavailable' },
        { status: 500 }
      );
    }

    // 对于 JSON 格式的响应，尝试解析
    let data = result.data;
    if (responseFormat === 'json') {
      try {
        data = JSON.parse(result.data || '{}');
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        // 返回原始文本，让客户端处理
      }
    }

    return NextResponse.json({
      success: true,
      data,
      type
    });

  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}