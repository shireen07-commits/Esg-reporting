# ESG Copilot MVP

## Overview
AI-powered ESG assistant providing contextual guidance, compliance explanations, and data validation for sustainable reporting. Built following the technical documentation specifications for MCP LLM integration.

## Purpose
Democratize ESG expertise and accelerate user productivity through natural language interaction with the Sweep sustainability platform.

## Current State
**Status:** MVP Complete ✅
- Fully functional chat-based ESG Copilot
- Mock MCP LLM integration with intelligent responses
- Real-time streaming support via WebSocket
- Context-aware suggestions based on user role and page type
- Beautiful, production-ready UI with dark mode support

## Recent Changes
*October 15, 2025*
- ✅ Implemented complete schema for chat sessions, messages, user contexts, and ESG data
- ✅ Built collapsible chat widget with streaming responses and rich markdown rendering
- ✅ Created dashboard with metric cards, anomaly detection, and facility breakdown
- ✅ Implemented REST API endpoints (POST /api/v1/copilot/chat, GET /api/v1/copilot/sessions/:id)
- ✅ Added WebSocket support for real-time message streaming
- ✅ Created mock MCP LLM service with context-aware ESG responses
- ✅ Integrated JWT token verification for authentication
- ✅ Seeded sample data: emission anomalies, audit logs, compliance contexts
- ✅ Configured ESG-themed design system with sustainability colors
- ✅ Added dark mode support with theme toggle

## Project Architecture

### Frontend (React + TypeScript)
- **Chat Widget**: Collapsible interface with real-time streaming, conversation history
- **Dashboard**: ESG metrics, emissions tracking, anomaly detection
- **Components**: MetricCard, ThemeToggle, RoleSwitcher
- **Design System**: Tailwind CSS + Shadcn UI with custom ESG color palette
- **State Management**: TanStack Query for API state, React hooks for local state

### Backend (Node.js + Express)
- **API Routes**: RESTful endpoints following technical spec
  - `POST /api/v1/copilot/chat` - Send query and receive response
  - `GET /api/v1/copilot/sessions/:id` - Retrieve conversation history
  - `GET /api/v1/copilot/sessions` - List all user sessions
- **WebSocket Server**: Real-time message streaming at `/ws`
- **Services**:
  - `mcpLlmService.ts` - Mock LLM with intelligent ESG responses
  - `authService.ts` - JWT token verification
  - `seedData.ts` - Initialize demo data
- **Storage**: In-memory storage for sessions, messages, contexts

### Data Model
```typescript
// Core entities
- ChatSession: Manages conversation context
- ChatMessage: Stores user/assistant messages
- UserContext: Enriched user information with role & permissions
- ESGDataContext: Sample emission and anomaly data

// User Roles
- ESG_ANALYST: Data analysis and reporting
- AUDITOR: Read-only access to audit logs
- SUPPLIER: Submit and view own data
- SUSTAINABILITY_MANAGER: Full visibility

// Page Types for Context
- dashboard, report, data_entry, audit, settings
```

## User Preferences

### Design Choices
- **Color Scheme**: ESG sustainability theme with deep charcoal backgrounds, emerald green primary, AI purple accents
- **Typography**: Inter for UI, JetBrains Mono for code/data
- **Dark Mode**: Default theme with light mode support
- **Animations**: Subtle typing indicators, smooth message fade-ins, chat expansion

### Key Features
1. **Compliance Guidance**: Explains CSRD, SFDR, GRI, ISSB requirements
2. **Data Validation**: Interprets anomaly flags and quality scores
3. **Dashboard Summarization**: Natural language insights from metrics
4. **Audit Trail**: Explains data lineage and approval workflows
5. **Onboarding**: Guides new users through platform features
6. **Navigation**: Context-aware feature discovery

## Technical Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, TypeScript, WebSocket (ws)
- **State**: TanStack Query, React hooks
- **Validation**: Zod schemas with Drizzle-Zod
- **Storage**: In-memory (MemStorage) for MVP
- **Authentication**: Mock JWT tokens

## Sample Data
- **Emission Anomalies**: Dubai HQ facility with 6.8σ outlier
- **Audit Logs**: Recent changes, approvals, imports
- **Compliance Contexts**: CSRD, GRI, SFDR, ISSB frameworks
- **User Contexts**: Analyst, Auditor, Supplier personas

## Demo Scenarios

### 1. Anomaly Explanation
**Query**: "Why was this emission flagged as anomalous?"
**Response**: Explains statistical outlier (6.8σ above mean), AI confidence, impact assessment, and recommended actions

### 2. CSRD Compliance
**Query**: "What is CSRD and do we need to comply?"
**Response**: Framework overview, applicability criteria, reporting requirements, current status

### 3. Dashboard Summary
**Query**: "Summarize this dashboard"
**Response**: Key metrics, trends, facility breakdown, action items

### 4. Audit Trail
**Query**: "Who changed this data?"
**Response**: User details, timestamp, changes made, verification status

## Environment Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## API Integration
Mock MCP LLM responses demonstrate:
- Intent detection (explain, summarize, navigate, guide, validate)
- Context enrichment with user role and page state
- Suggested follow-up prompts
- Data source attribution
- Confidence scoring

## Next Steps (Future Phases)
1. **Real LLM Integration**: Replace mock with actual MCP protocol
2. **Persistent Database**: PostgreSQL for sessions and history
3. **Advanced Intent Detection**: ML-based query routing
4. **Real ESG Data**: Integration with actual Sweep services
5. **Analytics Dashboard**: Query resolution rates, user engagement
6. **Voice Interaction**: Audio input/output
7. **Mobile App**: iOS/Android support

## Known Limitations (MVP)
- Mock LLM responses (not connected to real AI service)
- In-memory storage (data lost on restart)
- Simple JWT verification (no real auth)
- No rate limiting enforcement
- No persistent conversation history

## Architecture Consistency
Implementation follows the technical documentation:
- ✅ MCP LLM integration pattern
- ✅ Context enrichment pipeline
- ✅ Session management architecture
- ✅ API contract specification
- ✅ Security headers and JWT structure
- ✅ Data privacy and scoping
- ✅ Streaming response support
