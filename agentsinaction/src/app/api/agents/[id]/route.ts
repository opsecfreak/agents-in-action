import { NextRequest, NextResponse } from 'next/server';
import OpenAIAgentService from '@/lib/openai-agent';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await OpenAIAgentService.getAgent(params.id);
    return NextResponse.json({ agent });
  } catch (error) {
    console.error('Error retrieving agent:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve agent' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const agent = await OpenAIAgentService.updateAgent(params.id, body);
    return NextResponse.json({ agent });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await OpenAIAgentService.deleteAgent(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
}
