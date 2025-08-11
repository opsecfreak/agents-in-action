import { NextRequest, NextResponse } from 'next/server';
import OpenAIAgentService from '@/lib/openai-agent';

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const body = await request.json();
    const { 
      agent_id, 
      model, 
      instructions, 
      additional_instructions, 
      tools, 
      metadata 
    } = body;

    if (!agent_id) {
      return NextResponse.json(
        { error: 'Missing required field: agent_id' },
        { status: 400 }
      );
    }

    const run = await OpenAIAgentService.createRun({
      agent_id,
      thread_id: params.threadId,
      model,
      instructions,
      additional_instructions,
      tools,
      metadata,
    });

    return NextResponse.json({ run });
  } catch (error) {
    console.error('Error creating run:', error);
    return NextResponse.json(
      { error: 'Failed to create run' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const url = new URL(request.url);
    const runId = url.searchParams.get('runId');

    if (!runId) {
      return NextResponse.json(
        { error: 'Missing required parameter: runId' },
        { status: 400 }
      );
    }

    const run = await OpenAIAgentService.getRun(params.threadId, runId);
    return NextResponse.json({ run });
  } catch (error) {
    console.error('Error retrieving run:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve run' },
      { status: 500 }
    );
  }
}
