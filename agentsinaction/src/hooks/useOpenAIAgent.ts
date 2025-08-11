'use client';

import { useState, useCallback } from 'react';
import { AgentConfig, AgentResponse, MessageResponse, RunResponse } from '@/types/openai-agent';

export interface UseOpenAIAgentReturn {
  // State
  agents: AgentResponse[];
  currentAgent: AgentResponse | null;
  messages: MessageResponse[];
  currentRun: RunResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  createAgent: (config: AgentConfig) => Promise<AgentResponse | null>;
  getAgent: (agentId: string) => Promise<AgentResponse | null>;
  updateAgent: (agentId: string, config: Partial<AgentConfig>) => Promise<AgentResponse | null>;
  deleteAgent: (agentId: string) => Promise<boolean>;
  listAgents: () => Promise<AgentResponse[]>;
  
  createThread: () => Promise<string | null>;
  addMessage: (threadId: string, content: string, role?: 'user' | 'assistant') => Promise<MessageResponse | null>;
  getMessages: (threadId: string) => Promise<MessageResponse[]>;
  
  createRun: (threadId: string, agentId: string, additionalInstructions?: string) => Promise<RunResponse | null>;
  getRun: (threadId: string, runId: string) => Promise<RunResponse | null>;
  
  clearError: () => void;
}

export function useOpenAIAgent(): UseOpenAIAgentReturn {
  const [agents, setAgents] = useState<AgentResponse[]>([]);
  const [currentAgent, setCurrentAgent] = useState<AgentResponse | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [currentRun, setCurrentRun] = useState<RunResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: any, defaultMessage: string) => {
    console.error(error);
    setError(error?.message || defaultMessage);
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createAgent = useCallback(async (config: AgentConfig): Promise<AgentResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentAgent(data.agent);
      setIsLoading(false);
      return data.agent;
    } catch (error) {
      handleError(error, 'Failed to create agent');
      return null;
    }
  }, [handleError]);

  const getAgent = useCallback(async (agentId: string): Promise<AgentResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/agents/${agentId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentAgent(data.agent);
      setIsLoading(false);
      return data.agent;
    } catch (error) {
      handleError(error, 'Failed to get agent');
      return null;
    }
  }, [handleError]);

  const updateAgent = useCallback(async (agentId: string, config: Partial<AgentConfig>): Promise<AgentResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentAgent(data.agent);
      setIsLoading(false);
      return data.agent;
    } catch (error) {
      handleError(error, 'Failed to update agent');
      return null;
    }
  }, [handleError]);

  const deleteAgent = useCallback(async (agentId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setCurrentAgent(null);
      setAgents(prev => prev.filter(agent => agent.id !== agentId));
      setIsLoading(false);
      return true;
    } catch (error) {
      handleError(error, 'Failed to delete agent');
      return false;
    }
  }, [handleError]);

  const listAgents = useCallback(async (): Promise<AgentResponse[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/agents');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAgents(data.agents);
      setIsLoading(false);
      return data.agents;
    } catch (error) {
      handleError(error, 'Failed to list agents');
      return [];
    }
  }, [handleError]);

  const createThread = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsLoading(false);
      return data.thread.id;
    } catch (error) {
      handleError(error, 'Failed to create thread');
      return null;
    }
  }, [handleError]);

  const addMessage = useCallback(async (
    threadId: string, 
    content: string, 
    role: 'user' | 'assistant' = 'user'
  ): Promise<MessageResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, role }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsLoading(false);
      return data.message;
    } catch (error) {
      handleError(error, 'Failed to add message');
      return null;
    }
  }, [handleError]);

  const getMessages = useCallback(async (threadId: string): Promise<MessageResponse[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/threads/${threadId}/messages`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data.messages);
      setIsLoading(false);
      return data.messages;
    } catch (error) {
      handleError(error, 'Failed to get messages');
      return [];
    }
  }, [handleError]);

  const createRun = useCallback(async (
    threadId: string, 
    agentId: string, 
    additionalInstructions?: string
  ): Promise<RunResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          agent_id: agentId, 
          additional_instructions: additionalInstructions 
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentRun(data.run);
      setIsLoading(false);
      return data.run;
    } catch (error) {
      handleError(error, 'Failed to create run');
      return null;
    }
  }, [handleError]);

  const getRun = useCallback(async (threadId: string, runId: string): Promise<RunResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/threads/${threadId}/runs?runId=${runId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentRun(data.run);
      setIsLoading(false);
      return data.run;
    } catch (error) {
      handleError(error, 'Failed to get run');
      return null;
    }
  }, [handleError]);

  return {
    // State
    agents,
    currentAgent,
    messages,
    currentRun,
    isLoading,
    error,

    // Actions
    createAgent,
    getAgent,
    updateAgent,
    deleteAgent,
    listAgents,
    createThread,
    addMessage,
    getMessages,
    createRun,
    getRun,
    clearError,
  };
}
