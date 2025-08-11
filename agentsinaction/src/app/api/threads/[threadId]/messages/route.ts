import { NextRequest, NextResponse } from 'next/server';
import OpenAIAgentService from '@/lib/openai-agent';

export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const messages = await OpenAIAgentService.getMessages(params.threadId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const body = await request.json();
    const { content, role = 'user', file_ids } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Missing required field: content' },
        { status: 400 }
      );
    }

    const message = await OpenAIAgentService.addMessage(
      params.threadId,
      content,
      role,
      file_ids
    );

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    );
  }
}
