import { NextRequest, NextResponse } from 'next/server';
import { extractResumeData } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No resume file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported at this time.' },
        { status: 400 }
      );
    }

    // Read the file into a buffer and convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    
    // Extract structured data using Gemini directly from the PDF
    // This function retries automatically on rate limits
    const extractedData = await extractResumeData(base64Data, file.type);

    return NextResponse.json({ data: extractedData });
  } catch (error) {
    console.error('Extract Resume API Error:', error);
    const rawError = error instanceof Error ? error.message : 'Unknown error';

    // Return the actual error message — extractResumeData already provides
    // user-friendly messages for rate limits
    return NextResponse.json(
      {
        error: rawError,
        details: rawError,
      },
      { status: 500 }
    );
  }
}
