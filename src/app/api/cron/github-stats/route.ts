import { NextRequest, NextResponse } from 'next/server';
import { processAllGitHubStatistics } from '@/actions/githubStatistics';

export async function GET(request: NextRequest) {
  try {
    // Verify this is an internal request or has proper authorization
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }

    console.log('Starting GitHub statistics collection via API...');
    const result = await processAllGitHubStatistics();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GitHub stats API:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: (error as Error).message 
      }, 
      { status: 500 }
    );
  }
}
