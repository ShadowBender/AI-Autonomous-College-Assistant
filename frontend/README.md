# AI Autonomous College Assistant — Frontend

A clean, responsive React frontend for the **AI Autonomous College Assistant** project. The interface is based only on the supplied project specification: academic RAG Q&A, autonomous study planning, task/deadline tracking, and career/skill readiness support.

## Important integration note

The project information supplied for this frontend did **not** include the backend route names, request schemas, response schemas, authentication mechanism, or backend base URL.

To avoid inventing APIs, this frontend does **not** hard-code guessed backend endpoints. All backend routes are configured through environment variables. Until a real route is configured, the corresponding page remains usable as a presentation-ready UI and shows an explicit integration notice instead of silently failing.

## Frontend stack

- React 18
- Vite
- JavaScript (ES6+)
- React Router
- Axios
- Plain CSS with responsive layouts

No TypeScript, UI framework, chart library, or unnecessary animation dependency is used.

## Project modules

1. **Intelligent Academic Q&A (RAG)**
   - College document search
   - Source-aware responses
   - Simplified/multilingual response controls
2. **Autonomous Study Planner & Roadmap Generator**
   - Personalized timeline generation
   - Adaptive progress updates
   - Exam revision checklist mode
3. **Smart Task & Deadline Tracker**
   - Task creation and listing
   - Deadline/status presentation
   - Update/delete hooks
4. **Career & Skill Readiness Advisor**
   - Skill-gap analysis
   - Placement/interview practice generation

## Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm
- Existing backend running separately

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Vite will start on `http://localhost:5173` by default.

## Production build

```bash
npm run build
npm run preview
```

The production bundle is generated in `dist/`.

## Environment variables

Create `.env` from `.env.example`.

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT_MS=20000
```

Then fill **only the routes actually exposed by your backend**:

```env
VITE_API_QA_ENDPOINT=
VITE_API_STUDY_PLAN_ENDPOINT=
VITE_API_STUDY_PROGRESS_ENDPOINT=
VITE_API_REVISION_ENDPOINT=
VITE_API_TASKS_LIST_ENDPOINT=
VITE_API_TASKS_CREATE_ENDPOINT=
VITE_API_TASK_UPDATE_ENDPOINT_TEMPLATE=
VITE_API_TASK_DELETE_ENDPOINT_TEMPLATE=
VITE_API_CAREER_SKILL_GAP_ENDPOINT=
VITE_API_CAREER_INTERVIEW_ENDPOINT=
```

For path templates, use `{id}` where the task ID belongs, for example only if your backend really exposes such a route:

```env
VITE_API_TASK_UPDATE_ENDPOINT_TEMPLATE=/your-real-task-route/{id}
```

## Folder structure

```text
src/
├── components/        Reusable UI components
├── layouts/           Application shell / navigation
├── pages/             Route-level screens
├── services/          Axios client and backend service functions
├── styles/            Global responsive styling
├── utils/             Data formatting and response helpers
├── App.jsx
└── main.jsx
```

## Routes

- `/` — overview/dashboard
- `/ask` — academic Q&A
- `/planner` — study planner, adaptive progress, revision mode
- `/tasks` — smart task/deadline tracker
- `/career` — skill-gap and placement preparation
- any unknown route — 404 page

## API integration architecture

All network calls are isolated in `src/services/`:

- `academicService.js`
- `plannerService.js`
- `taskService.js`
- `careerService.js`
- `healthService.js`

The central Axios instance is in `src/services/apiClient.js`.

Backend integration details and missing contract information are documented in `API_INTEGRATION.md`.

## Authentication

Authentication was **not present in the provided project information**, so this frontend does not invent login, token storage, protected routes, or role-based access. If the backend has authentication, add the actual contract before connecting it.

## Error handling

The frontend provides user-friendly handling for common backend/network states including:

- 400 — bad request
- 401 — authentication required
- 403 — forbidden
- 404 — resource not found
- 409 — conflict
- 422 — validation error
- 500 — backend error
- timeout / network failure
- missing endpoint configuration

Raw stack traces are not displayed to the user.

## Deployment

1. Run `npm run build`.
2. Deploy `dist/` to Vercel, Netlify, or another static host.
3. Configure the same `VITE_*` environment variables in the deployment platform.
4. Make sure the backend allows requests from the deployed frontend origin (CORS).

## Integration handoff

To fully connect the completed backend, provide either:

- OpenAPI/Swagger JSON or URL,
- Postman collection,
- backend route/controller files, or
- endpoint list with request/response examples.

The existing backend does not need to be redesigned; only the service-layer mappings in this frontend need to be adjusted to match the real contract.
