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
    const extractedData = await extractResumeData(base64Data, file.type);

    if (!extractedData) {
      return NextResponse.json(
        { error: 'Failed to extract candidate information from the resume.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: extractedData });
  } catch (error) {
    console.error('Extract Resume API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process resume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
