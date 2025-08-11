# Agents in Action - OpenAI Agent API Demo

A Next.js application demonstrating how to integrate with the OpenAI Agent API (formerly Assistants API) to create, manage, and interact with AI agents.

## Features

- 🤖 Create and manage OpenAI Agents
- 💬 Thread-based conversations
- 🔄 Real-time run execution
- 🎯 Tool integration support
- 📱 Responsive web interface
- 🛡️ TypeScript support

## Prerequisites

- Node.js 18+ 
- OpenAI API account and API key
- npm or yarn package manager

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd agents-in-action/agentsinaction
npm install
```

### 2. Environment Configuration

Copy the example environment file and add your OpenAI API key:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI credentials:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORG_ID=your_org_id_here  # Optional
OPENAI_PROJECT_ID=your_project_id_here  # Optional

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── agents/          # Agent management endpoints
│   │   └── threads/         # Thread and message endpoints
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── AgentDemo.tsx        # Main demo interface
├── hooks/
│   └── useOpenAIAgent.ts    # React hook for agent interactions
├── lib/
│   └── openai-agent.ts      # OpenAI service wrapper
└── types/
    └── openai-agent.ts      # TypeScript definitions
```

## API Endpoints

### Agents
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/[id]` - Get specific agent
- `PUT /api/agents/[id]` - Update agent
- `DELETE /api/agents/[id]` - Delete agent

### Threads & Messages
- `POST /api/threads` - Create new thread
- `GET /api/threads/[threadId]/messages` - Get thread messages
- `POST /api/threads/[threadId]/messages` - Add message to thread
- `POST /api/threads/[threadId]/runs` - Create run
- `GET /api/threads/[threadId]/runs?runId=<id>` - Get run status

## Usage Example

### Creating an Agent

```typescript
import { useOpenAIAgent } from '@/hooks/useOpenAIAgent';

const { createAgent } = useOpenAIAgent();

const agent = await createAgent({
  name: 'My Assistant',
  model: 'gpt-4',
  instructions: 'You are a helpful assistant.',
  tools: [{ type: 'code_interpreter' }]
});
```

### Starting a Conversation

```typescript
const { createThread, addMessage, createRun } = useOpenAIAgent();

// Create thread
const threadId = await createThread();

// Add user message
await addMessage(threadId, 'Hello, how can you help me?');

// Create and run
const run = await createRun(threadId, agent.id);
```

## OpenAI Agent API Features Supported

- ✅ Agent creation and management
- ✅ Thread-based conversations
- ✅ Message handling
- ✅ Run execution and monitoring
- ✅ Code interpreter tool
- ✅ File attachments (API ready)
- ✅ Function calling (API ready)
- ✅ Retrieval/search (API ready)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `OPENAI_ORG_ID` | OpenAI organization ID | No |
| `OPENAI_PROJECT_ID` | OpenAI project ID | No |
| `NEXTAUTH_SECRET` | Secret for session encryption | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI SDK** - API integration
- **React Hooks** - State management

## Getting Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your OpenAI API key is correctly set in `.env.local`
2. **Module Not Found**: Run `npm install` to ensure all dependencies are installed
3. **Build Errors**: Check TypeScript errors and ensure all types are properly imported

### Debug Mode

Enable verbose logging by adding to your `.env.local`:

```env
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the [OpenAI API documentation](https://platform.openai.com/docs)
- Review the [Next.js documentation](https://nextjs.org/docs)
- Open an issue in this repository
