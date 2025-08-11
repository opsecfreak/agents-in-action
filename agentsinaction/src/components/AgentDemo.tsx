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

  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [agentName, setAgentName] = useState('');
  const [agentInstructions, setAgentInstructions] = useState('');
  const [agentModel, setAgentModel] = useState('gpt-4o-mini');
  const [threadId, setThreadId] = useState('');
  const [messageContent, setMessageContent] = useState('');

  const handleCreateAgent = async () => {
    if (!agentName || !agentInstructions) {
      alert('Please provide agent name and instructions');
      return;
    }

    const agent = await createAgent({
      name: agentName,
      model: agentModel,
      instructions: agentInstructions,
      tools: [{ type: 'code_interpreter' }],
    });

    if (agent) {
      alert(`Agent created successfully!\nID: ${agent.id}\nModel: ${agent.model}`);
      setAgentName('');
      setAgentInstructions('');
      setAgentModel('gpt-4o-mini');
      // Refresh the agents list
      await listAgents();
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
    if (!threadId || !selectedAgent) {
      alert('Please create a thread and select an agent first');
      return;
    }

    const run = await createRun(threadId, selectedAgent.id);
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
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800">OpenAI Agent API Demo</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={clearError} 
            className="ml-2 text-red-900 hover:text-red-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center text-blue-600 font-semibold">
          Loading...
        </div>
      )}

      {/* Create Agent Section */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Agent</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Agent Name (e.g., 'Code Helper')"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder-gray-500"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Selection
            </label>
            <select
              value={agentModel}
              onChange={(e) => setAgentModel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800"
            >
              <option value="gpt-4o-mini">GPT-4o Mini (Recommended)</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">
              💡 If you get a "model not found" error, try GPT-4o Mini or GPT-3.5 Turbo
            </p>
          </div>
          
          <textarea
            placeholder="Agent Instructions (e.g., 'You are a helpful coding assistant that helps with programming questions.')"
            value={agentInstructions}
            onChange={(e) => setAgentInstructions(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded h-24 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder-gray-500"
          />
          <button
            onClick={handleCreateAgent}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Create Agent
          </button>
        </div>
      </div>

      {/* Agent List */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Agents</h2>
        <button
          onClick={listAgents}
          disabled={isLoading}
          className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed mb-4 font-semibold"
        >
          Refresh Agents
        </button>
        <div className="space-y-2">
          {agents.length === 0 ? (
            <p className="text-gray-600 italic">No agents found. Create one above to get started.</p>
          ) : (
            agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`p-4 border rounded cursor-pointer transition-colors ${
                  selectedAgent?.id === agent.id 
                    ? 'bg-blue-100 border-blue-500 text-blue-900' 
                    : 'border-gray-300 hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="font-medium">{agent.name}</div>
                <div className="text-sm text-gray-600">{agent.id}</div>
                <div className="text-sm text-gray-500 mt-1">Model: {agent.model}</div>
                {selectedAgent?.id === agent.id && (
                  <div className="text-xs text-blue-600 mt-1">✓ Selected</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Thread Section */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Thread</h2>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Thread ID (will be filled when you create a thread)"
              value={threadId}
              onChange={(e) => setThreadId(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder-gray-500"
            />
            <button
              onClick={handleCreateThread}
              disabled={isLoading}
              className="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Create Thread
            </button>
          </div>
          
          {threadId && (
            <div className="space-y-3 p-4 bg-white rounded border border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder-gray-500"
                />
                <button
                  onClick={handleAddMessage}
                  disabled={isLoading}
                  className="bg-indigo-500 text-white px-6 py-3 rounded hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  Add Message
                </button>
              </div>
              
              <button
                onClick={handleCreateRun}
                disabled={isLoading || !selectedAgent}
                className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold w-full"
              >
                {!selectedAgent ? 'Select an Agent First' : 'Run Agent'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Messages</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.reverse().map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-100 ml-8 border-l-4 border-blue-500' 
                    : 'bg-green-100 mr-8 border-l-4 border-green-500'
                }`}
              >
                <div className="font-medium capitalize text-gray-800 mb-2">
                  {message.role === 'user' ? '👤 User' : '🤖 Assistant'}
                </div>
                <div className="text-gray-700">
                  {message.content.map((content, idx) => (
                    <div key={idx}>
                      {content.type === 'text' && content.text && (
                        <p className="whitespace-pre-wrap">{content.text.value}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(message.created_at * 1000).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Run Status */}
      {currentRun && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Current Run Status</h2>
          <div className="space-y-3 bg-white p-4 rounded border border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">ID:</span>
              <span className="text-gray-600 font-mono text-sm">{currentRun.id}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentRun.status === 'completed' ? 'bg-green-200 text-green-800' :
                currentRun.status === 'failed' ? 'bg-red-200 text-red-800' :
                currentRun.status === 'in_progress' ? 'bg-blue-200 text-blue-800' :
                'bg-yellow-200 text-yellow-800'
              }`}>
                {currentRun.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Model:</span>
              <span className="text-gray-600">{currentRun.model}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Created:</span>
              <span className="text-gray-600">
                {new Date(currentRun.created_at * 1000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
