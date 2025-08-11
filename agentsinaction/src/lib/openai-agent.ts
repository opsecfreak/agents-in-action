import OpenAI from 'openai';
import { 
  AgentConfig, 
  ThreadConfig, 
  RunConfig, 
  AgentResponse, 
  ThreadMessage, 
  RunResponse,
  MessageResponse 
} from '@/types/openai-agent';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

export class OpenAIAgentService {
  // Create a new agent
  static async createAgent(config: AgentConfig): Promise<AgentResponse> {
    try {
      const agent = await openai.beta.assistants.create({
        name: config.name,
        instructions: config.instructions,
        model: config.model,
        tools: config.tools || [],
        metadata: config.metadata || {},
      });
      
      return agent;
    } catch (error) {
      console.error('Error creating agent:', error);
      throw new Error('Failed to create agent');
    }
  }

  // Get an agent by ID
  static async getAgent(agentId: string): Promise<AgentResponse> {
    try {
      const agent = await openai.beta.assistants.retrieve(agentId);
      return agent;
    } catch (error) {
      console.error('Error retrieving agent:', error);
      throw new Error('Failed to retrieve agent');
    }
  }

  // Update an agent
  static async updateAgent(agentId: string, config: Partial<AgentConfig>): Promise<AgentResponse> {
    try {
      const agent = await openai.beta.assistants.update(agentId, {
        name: config.name,
        instructions: config.instructions,
        model: config.model,
        tools: config.tools,
        metadata: config.metadata,
      });
      
      return agent;
    } catch (error) {
      console.error('Error updating agent:', error);
      throw new Error('Failed to update agent');
    }
  }

  // Delete an agent
  static async deleteAgent(agentId: string): Promise<boolean> {
    try {
      await openai.beta.assistants.delete(agentId);
      return true;
    } catch (error) {
      console.error('Error deleting agent:', error);
      throw new Error('Failed to delete agent');
    }
  }

  // Create a new thread
  static async createThread(config?: ThreadConfig): Promise<{ id: string }> {
    try {
      const thread = await openai.beta.threads.create({
        messages: config?.messages || [],
        metadata: config?.metadata || {},
      });
      
      return { id: thread.id };
    } catch (error) {
      console.error('Error creating thread:', error);
      throw new Error('Failed to create thread');
    }
  }

  // Add a message to a thread
  static async addMessage(
    threadId: string, 
    content: string, 
    role: 'user' | 'assistant' = 'user',
    fileIds?: string[]
  ): Promise<MessageResponse> {
    try {
      const message = await openai.beta.threads.messages.create(threadId, {
        role,
        content,
        attachments: fileIds?.map(file_id => ({ file_id, tools: [] })) || [],
      });
      
      return message;
    } catch (error) {
      console.error('Error adding message:', error);
      throw new Error('Failed to add message');
    }
  }

  // Get messages from a thread
  static async getMessages(threadId: string): Promise<MessageResponse[]> {
    try {
      const messages = await openai.beta.threads.messages.list(threadId);
      return messages.data;
    } catch (error) {
      console.error('Error retrieving messages:', error);
      throw new Error('Failed to retrieve messages');
    }
  }

  // Create and run
  static async createRun(config: RunConfig): Promise<RunResponse> {
    try {
      const run = await openai.beta.threads.runs.create(
        config.thread_id || '',
        {
          assistant_id: config.agent_id,
          model: config.model,
          instructions: config.instructions,
          additional_instructions: config.additional_instructions,
          tools: config.tools,
          metadata: config.metadata || {},
        }
      );
      
      return run;
    } catch (error) {
      console.error('Error creating run:', error);
      throw new Error('Failed to create run');
    }
  }

  // Get run status
  static async getRun(threadId: string, runId: string): Promise<RunResponse> {
    try {
      const run = await openai.beta.threads.runs.retrieve(threadId, runId);
      return run;
    } catch (error) {
      console.error('Error retrieving run:', error);
      throw new Error('Failed to retrieve run');
    }
  }

  // Submit tool outputs
  static async submitToolOutputs(
    threadId: string, 
    runId: string, 
    toolOutputs: Array<{ tool_call_id: string; output: string }>
  ): Promise<RunResponse> {
    try {
      const run = await openai.beta.threads.runs.submitToolOutputs(
        threadId,
        runId,
        {
          tool_outputs: toolOutputs,
        }
      );
      
      return run;
    } catch (error) {
      console.error('Error submitting tool outputs:', error);
      throw new Error('Failed to submit tool outputs');
    }
  }

  // Cancel a run
  static async cancelRun(threadId: string, runId: string): Promise<RunResponse> {
    try {
      const run = await openai.beta.threads.runs.cancel(threadId, runId);
      return run;
    } catch (error) {
      console.error('Error cancelling run:', error);
      throw new Error('Failed to cancel run');
    }
  }

  // List all agents
  static async listAgents(): Promise<AgentResponse[]> {
    try {
      const agents = await openai.beta.assistants.list();
      return agents.data;
    } catch (error) {
      console.error('Error listing agents:', error);
      throw new Error('Failed to list agents');
    }
  }
}

export default OpenAIAgentService;
