import { NextRequest, NextResponse } from 'next/server';
import OpenAIAgentService from '@/lib/openai-agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, metadata } = body;

    const thread = await OpenAIAgentService.createThread({
      messages,
      metadata,
    });

    return NextResponse.json({ thread });
  } catch (error) {
    console.error('Error creating thread:', error);
    return NextResponse.json(
      { error: 'Failed to create thread' },
      { status: 500 }
    );
  }
}
