import type { AssistantTool } from 'openai/resources/beta/assistants';
import type { Assistant } from 'openai/resources/beta/assistants';
import type { Thread } from 'openai/resources/beta/threads/threads';
import type { Message } from 'openai/resources/beta/threads/messages';
import type { Run } from 'openai/resources/beta/threads/runs/runs';

// OpenAI Agent API Types
export interface AgentConfig {
  name: string;
  model: string;
  instructions: string;
  tools?: AssistantTool[];
  file_ids?: string[];
  metadata?: Record<string, string>;
}

export interface FunctionTool {
  name: string;
  description?: string;
  parameters: Record<string, any>;
}

export type AgentResponse = Assistant;
export type ThreadResponse = Thread;
export type MessageResponse = Message;
export type RunResponse = Run;

export interface ThreadConfig {
  messages?: ThreadMessage[];
  metadata?: Record<string, string>;
}

export interface ThreadMessage {
  role: 'user' | 'assistant';
  content: string;
  file_ids?: string[];
  metadata?: Record<string, string>;
}

export interface RunConfig {
  agent_id: string;
  thread_id?: string;
  model?: string;
  instructions?: string;
  additional_instructions?: string;
  tools?: AssistantTool[];
  metadata?: Record<string, string>;
}
