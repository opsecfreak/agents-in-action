'use client';

import { useState } from 'react';
import { useOpenAIAgent } from '@/hooks/useOpenAIAgent';

export default function AgentDemo() {
  const {
    agents,
    currentAgent,
    messages,
    currentRun,
    isLoading,
    error,
    createAgent,
    listAgents,
    createThread,
    addMessage,
    getMessages,
    createRun,
    getRun,
    clearError,
  } = useOpenAIAgent();

  const [agentName, setAgentName] = useState('');
  const [agentInstructions, setAgentInstructions] = useState('');
  const [threadId, setThreadId] = useState('');
  const [messageContent, setMessageContent] = useState('');

  const handleCreateAgent = async () => {
    if (!agentName || !agentInstructions) {
      alert('Please provide agent name and instructions');
      return;
    }

    const agent = await createAgent({
      name: agentName,
      model: 'gpt-4',
      instructions: agentInstructions,
      tools: [{ type: 'code_interpreter' }],
    });

    if (agent) {
      alert(`Agent created: ${agent.id}`);
      setAgentName('');
      setAgentInstructions('');
    }
  };

  const handleCreateThread = async () => {
    const newThreadId = await createThread();
    if (newThreadId) {
      setThreadId(newThreadId);
      alert(`Thread created: ${newThreadId}`);
    }
  };

  const handleAddMessage = async () => {
    if (!threadId || !messageContent) {
      alert('Please provide thread ID and message content');
      return;
    }

    const message = await addMessage(threadId, messageContent);
    if (message) {
      setMessageContent('');
      await getMessages(threadId);
    }
  };

  const handleCreateRun = async () => {
    if (!threadId || !currentAgent) {
      alert('Please create a thread and select an agent first');
      return;
    }

    const run = await createRun(threadId, currentAgent.id);
    if (run) {
      // Poll for run completion
      const pollRun = async () => {
        const updatedRun = await getRun(threadId, run.id);
        if (updatedRun && updatedRun.status === 'completed') {
          await getMessages(threadId);
        } else if (updatedRun && ['failed', 'cancelled', 'expired'].includes(updatedRun.status)) {
          alert(`Run ${updatedRun.status}`);
        } else {
          setTimeout(pollRun, 1000); // Poll every second
        }
      };
      pollRun();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">OpenAI Agent API Demo</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={clearError} 
            className="ml-2 text-red-900 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center text-blue-600">
          Loading...
        </div>
      )}

      {/* Create Agent Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create Agent</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Agent Name"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            placeholder="Agent Instructions"
            value={agentInstructions}
            onChange={(e) => setAgentInstructions(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-24"
          />
          <button
            onClick={handleCreateAgent}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Create Agent
          </button>
        </div>
      </div>

      {/* Agent List */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Agents</h2>
        <button
          onClick={listAgents}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 mb-4"
        >
          Refresh Agents
        </button>
        <div className="space-y-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`p-3 border rounded cursor-pointer ${
                currentAgent?.id === agent.id ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
              }`}
            >
              <div className="font-medium">{agent.name}</div>
              <div className="text-sm text-gray-600">{agent.id}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Thread Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Thread</h2>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Thread ID"
              value={threadId}
              onChange={(e) => setThreadId(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleCreateThread}
              disabled={isLoading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Create Thread
            </button>
          </div>
          
          {threadId && (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Message content"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={handleAddMessage}
                  disabled={isLoading}
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
                >
                  Add Message
                </button>
              </div>
              
              <button
                onClick={handleCreateRun}
                disabled={isLoading || !currentAgent}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
              >
                Create Run
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <div className="space-y-3">
            {messages.reverse().map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded ${
                  message.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-green-100 mr-8'
                }`}
              >
                <div className="font-medium capitalize">{message.role}</div>
                <div className="mt-1">
                  {message.content.map((content, idx) => (
                    <div key={idx}>
                      {content.type === 'text' && content.text && (
                        <p>{content.text.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Run Status */}
      {currentRun && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Current Run</h2>
          <div className="space-y-2">
            <p><strong>ID:</strong> {currentRun.id}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                currentRun.status === 'completed' ? 'bg-green-200 text-green-800' :
                currentRun.status === 'failed' ? 'bg-red-200 text-red-800' :
                'bg-yellow-200 text-yellow-800'
              }`}>
                {currentRun.status}
              </span>
            </p>
            <p><strong>Model:</strong> {currentRun.model}</p>
          </div>
        </div>
      )}
    </div>
  );
}
