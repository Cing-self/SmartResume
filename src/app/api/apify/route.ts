// API route for Apify job search
import { NextRequest, NextResponse } from 'next/server';
import { appendFileSync } from 'fs';
import { join } from 'path';

// 日志文件路径
const logFilePath = join(process.cwd(), 'apify-api.log');

// 日志记录函数
function logToFile(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}${data ? `\n${JSON.stringify(data, null, 2)}` : ''}\n\n`;
  try {
    appendFileSync(logFilePath, logEntry);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 11);
  logToFile(`=== API Request Started [${requestId}] ===`);

  try {
    const requestBody = await request.json();
    const { title, location, companies, experienceLevel, employmentType, workArrangement, postingTime, jobsEntries } = requestBody;

    logToFile(`[${requestId}] Request body:`, requestBody);

    // Validate required parameters
    if (!title && (!companies || companies.length === 0 || companies.every((c: string) => !c.trim()))) {
      logToFile(`[${requestId}] Validation failed: No job title or company provided`);
      return NextResponse.json(
        { error: 'Please provide a job title or company name' },
        { status: 400 }
      );
    }

    // Get Apify API token
    const APIFY_API_TOKEN = process.env.APIFY_API_KEY;
    if (!APIFY_API_TOKEN) {
      logToFile(`[${requestId}] Error: Apify API token not configured`);
      return NextResponse.json(
        { error: 'Apify API token not configured' },
        { status: 500 }
      );
    }

    // Mapping functions for experience levels, job types, and work schedules
    const experienceLevelMapping: Record<string, string> = {
      'Intern': '1',
      'Assistant': '1',
      'Junior': '1',
      'Mid-Senior': '3',
      'Director': '5',
      'Executive': '6',
    };

    const jobTypeMapping: Record<string, string> = {
      'Full-time': 'F',
      'Part-time': 'P',
      'Contract': 'C',
      'Temporary': 'T',
      'Volunteer': 'V',
      'Internship': 'I',
      'Other': 'O',
    };

    const workScheduleMapping: Record<string, string> = {
      'On-site': '1',
      'Remote': '2',
      'Hybrid': '3',
    };

    const postingTimeMapping: Record<string, string> = {
      'Any Time': 'r86400',
      'Past 24 hours': 'r86400',
      'Past Week': 'r604800',
      'Past Month': 'r2592000',
    };

    // Prepare input for Apify Actor
    const input: Record<string, string | number> = {
      location: location || 'United States',
      jobs_entries: jobsEntries || 10,
      start_jobs: 0
    };

    // Filter out empty company names
    const validCompanies = companies.filter((company: string) => company.trim() !== '');
    if (validCompanies.length > 0) {
      input.company_names = validCompanies;
    }

    if (title) {
      input.job_title = title;
    }

    if (experienceLevel && experienceLevelMapping[experienceLevel]) {
      input.experience_level = experienceLevelMapping[experienceLevel];
    }

    if (employmentType && jobTypeMapping[employmentType]) {
      input.job_type = jobTypeMapping[employmentType];
    }

    if (workArrangement && workScheduleMapping[workArrangement]) {
      input.work_schedule = workScheduleMapping[workArrangement];
    }

    if (postingTime && postingTimeMapping[postingTime]) {
      input.job_post_time = postingTimeMapping[postingTime];
    }

    logToFile(`[${requestId}] Prepared input for Apify:`, input);

    // Call Apify API
    const apiUrl = `https://api.apify.com/v2/acts/JkfTWxtpgfvcRQn3p/runs?token=${APIFY_API_TOKEN}`;
    logToFile(`[${requestId}] Calling Apify API:`, { url: apiUrl, method: 'POST', input });

    const apifyResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    logToFile(`[${requestId}] Apify API response status:`, {
      status: apifyResponse.status,
      statusText: apifyResponse.statusText,
      ok: apifyResponse.ok,
      headers: Object.fromEntries(apifyResponse.headers.entries())
    });

    if (!apifyResponse.ok) {
      const errorText = await apifyResponse.text();
      logToFile(`[${requestId}] Apify API error details:`, {
        status: apifyResponse.status,
        statusText: apifyResponse.statusText,
        errorResponse: errorText
      });
      console.error('Apify API error response:', errorText);
      return NextResponse.json(
        { error: `Apify API error: ${apifyResponse.status} - ${apifyResponse.statusText}` },
        { status: apifyResponse.status }
      );
    }

    const runData = await apifyResponse.json();
    const runId = runData.data.id;
    logToFile(`[${requestId}] Apify run started successfully:`, { runId, runData });

    // Wait for the run to complete (polling)
    let runDetails;
    let attempts = 0;
    const maxAttempts = 30; // 30 * 2 = 60 seconds max wait time

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      attempts++;

      const statusUrl = `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_TOKEN}`;
      logToFile(`[${requestId}] Polling attempt ${attempts}/${maxAttempts}:`, { url: statusUrl });

      const detailsResponse = await fetch(statusUrl);

      if (detailsResponse.ok) {
        runDetails = await detailsResponse.json();
        const status = runDetails.data.status;
        logToFile(`[${requestId}] Run status:`, {
          attempt: attempts,
          status,
          runId,
          finishedAt: runDetails.data.finishedAt,
          usage: runDetails.data.usage
        });

        if (status === 'SUCCEEDED' || status === 'FAILED') {
          logToFile(`[${requestId}] Run completed with status:`, status);
          break;
        }
      } else {
        logToFile(`[${requestId}] Status check failed:`, {
          status: detailsResponse.status,
          statusText: detailsResponse.statusText,
          attempt: attempts
        });
      }
    }

    if (!runDetails || runDetails.data.status !== 'SUCCEEDED') {
      logToFile(`[${requestId}] Run failed or timed out:`, {
        finalStatus: runDetails?.data?.status || 'unknown',
        totalAttempts: attempts,
        maxAttempts
      });
      return NextResponse.json(
        { error: 'Job search timed out or failed' },
        { status: 500 }
      );
    }

    // Fetch results from the dataset
    const datasetId = runDetails.data.defaultDatasetId;
    logToFile(`[${requestId}] Fetching results from dataset:`, { datasetId, runId });

    const datasetUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}`;
    logToFile(`[${requestId}] Dataset fetch URL:`, { url: datasetUrl });

    const datasetResponse = await fetch(datasetUrl);

    logToFile(`[${requestId}] Dataset response status:`, {
      status: datasetResponse.status,
      statusText: datasetResponse.statusText,
      ok: datasetResponse.ok
    });

    if (!datasetResponse.ok) {
      const errorText = await datasetResponse.text();
      logToFile(`[${requestId}] Dataset fetch error:`, {
        status: datasetResponse.status,
        statusText: datasetResponse.statusText,
        errorText,
        datasetUrl
      });
      return NextResponse.json(
        { error: `Failed to fetch job results: ${datasetResponse.status} ${errorText}` },
        { status: 500 }
      );
    }

    const datasetData = await datasetResponse.json();
    const items = Array.isArray(datasetData) ? datasetData : [];
    logToFile(`[${requestId}] Successfully fetched ${items.length} job items`, {
      itemCount: items.length,
      firstItem: items[0] ? { title: items[0].job_title, company: items[0].company_name } : null
    });

    // Transform results to match our interface
    const jobs = items.map((item: Record<string, unknown>) => ({
      company_logo_url: (item.company_logo_url as string) || '',
      company_name: (item.company_name as string) || '',
      job_title: (item.job_title as string) || '',
      job_url: (item.job_url as string) || '',
      apply_url: (item.apply_url as string) || (item.job_url as string) || '',
      company_url: (item.company_url as string) || '',
      location: (item.location as string) || '',
      time_posted: (item.time_posted as string) || '',
      num_applicants: (item.num_applicants as string) || '',
      job_description: (item.job_description as string) || '',
      job_id: (item.job_id as string) || '',
      seniority_level: (item.seniority_level as string) || '',
      job_function: (item.job_function as string) || '',
      industries: (item.industries as string) || '',
      employment_type: (item.employment_type as string) || '',
      salary_range: (item.salary_range as string) || null,
      easy_apply: Boolean(item.easy_apply),
      job_description_raw_html: (item.job_description_raw_html as string) || '',
    }));

    logToFile(`[${requestId}] Successfully transformed ${jobs.length} jobs for response`, {
      jobCount: jobs.length,
      sampleJobs: jobs.slice(0, 2).map(job => ({
        title: job.job_title,
        company: job.company_name,
        location: job.location
      }))
    });

    const response = NextResponse.json({
      success: true,
      data: jobs
    });

    logToFile(`[${requestId}] === API Request Completed Successfully [${requestId}] ===`, {
      jobCount: jobs.length,
      responseStatus: response.status
    });

    return response;

  } catch (error) {
    logToFile(`[${requestId}] === API Request Failed [${requestId}] ===`, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error,
      errorString: String(error)
    });

    console.error('Apify API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred during job search' },
      { status: 500 }
    );
  }
}