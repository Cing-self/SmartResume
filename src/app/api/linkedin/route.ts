// LinkedIn 职位信息解析 API 路由
// 从 LinkedIn 链接中提取职位信息

import { NextRequest, NextResponse } from 'next/server';
import { extractLinkedInJobId, fetchLinkedInJobDetails, parseLinkedInJobData } from '@/lib/ai';
import { generateContent } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'LinkedIn job URL is required' },
        { status: 400 }
      );
    }

    // 验证是否为 LinkedIn 职位链接
    if (!url.includes('linkedin.com/jobs')) {
      return NextResponse.json(
        { error: 'Please provide a valid LinkedIn job URL' },
        { status: 400 }
      );
    }

    // 提取 Job ID
    const jobId = extractLinkedInJobId(url);
    if (!jobId) {
      return NextResponse.json(
        { error: 'Could not extract job ID from the LinkedIn URL. Please check the URL format.' },
        { status: 400 }
      );
    }

    // 获取职位详情 HTML
    const htmlContent = await fetchLinkedInJobDetails(jobId);

    // 如果 LinkedIn API 不可用，直接暴露问题
    if (!htmlContent) {
      return NextResponse.json(
        {
          error: `LinkedIn API 不可用。Job ID: ${jobId} 无法获取职位详情。`,
          details: {
            jobId,
            error: 'Failed to fetch job details from LinkedIn API',
            possibleCauses: [
              'LinkedIn API 在当前地区受限 (HTTP 451)',
              '职位已过期或被移除',
              '网络连接问题'
            ],
            recommendation: '请尝试其他 LinkedIn 职位链接或手动输入职位信息'
          }
        },
        { status: 503 }
      );
    }

    // 使用 AI 解析 HTML 内容
    try {
      const aiResult = await generateContent('claude-3.5-sonnet', htmlContent, { responseFormat: 'json' });

      if (!aiResult.success) {
        throw new Error(aiResult.error || 'AI parsing failed');
      }

      // 尝试解析 AI 返回的 JSON
      let parsedData = null;
      try {
        parsedData = JSON.parse(aiResult.data || '{}');
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        // 如果 JSON 解析失败，尝试直接使用 AI 返回的内容
        parsedData = {
          title: '职位解析成功',
          company: '未知公司',
          description: aiResult.data || 'AI 解析成功但格式异常',
          location: '未知地点',
          employmentType: '',
          seniorityLevel: '',
          industries: []
        };
      }

      // 确保数据结构正确
      const finalData = {
        title: parsedData.title || '职位信息获取成功',
        company: parsedData.company || '未知公司',
        description: parsedData.description || '职位描述解析成功',
        location: parsedData.location || '未知地点',
        employmentType: parsedData.employmentType || '',
        seniorityLevel: parsedData.seniorityLevel || '',
        industries: Array.isArray(parsedData.industries) ? parsedData.industries : [],
        originalUrl: url,
        jobId,
      };

      return NextResponse.json({
        success: true,
        data: finalData,
      });
    } catch (aiError) {
      console.error('AI parsing error:', aiError);

      // AI 解析失败时直接暴露问题
      return NextResponse.json(
        {
          error: `AI 解析失败。成功获取到 Job ID: ${jobId} 和 HTML 内容，但 Mulerun AI 解析时出现错误。`,
          details: {
            jobId,
            htmlLength: htmlContent.length,
            aiError: aiError instanceof Error ? aiError.message : 'Unknown AI error',
            possibleCauses: [
              'Mulerun API 密钥未配置',
              'Mulerun API 服务不可用',
              'AI 解析请求超时',
              'HTML 内容格式异常'
            ],
            recommendation: '请检查 Mulerun API 配置或手动输入职位信息'
          }
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('LinkedIn API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching LinkedIn job data' },
      { status: 500 }
    );
  }
}