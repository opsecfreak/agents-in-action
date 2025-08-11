import { NextRequest, NextResponse } from 'next/server';
import OpenAIAgentService from '@/lib/openai-agent';

export async function GET() {
  try {
    const agents = await OpenAIAgentService.listAgents();
    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Error listing agents:', error);
    return NextResponse.json(
      { error: 'Failed to list agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, model, instructions, tools, file_ids, metadata } = body;

    if (!name || !model || !instructions) {
      return NextResponse.json(
        { error: 'Missing required fields: name, model, instructions' },
        { status: 400 }
      );
    }

    const agent = await OpenAIAgentService.createAgent({
      name,
      model,
      instructions,
      tools,
      file_ids,
      metadata,
    });

    return NextResponse.json({ agent });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
