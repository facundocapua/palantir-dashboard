import { NextResponse } from 'next/server';
import { CodeMetricsService } from '@/services/codeMetricsService';

export async function GET() {
  try {
    const data = await CodeMetricsService.getCodeReportData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching code metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch code metrics' },
      { status: 500 }
    );
  }
}
