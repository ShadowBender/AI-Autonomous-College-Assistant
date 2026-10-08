# API Integration Guide

## Current status

The supplied project material describes **features**, but does not contain backend endpoint paths, request/response contracts, authentication requirements, or concrete entity schemas.

Therefore, the frontend does **not** pretend that any specific endpoint exists. Each API below is marked **BACKEND API REQUIRED** until the actual completed-backend contract is supplied.

All endpoint paths are read from `.env` so the frontend can adapt to the existing backend without backend changes.

---

## Shared client configuration

**Base URL environment variable**

```env
VITE_API_BASE_URL=http://localhost:8000
```

**Common headers used by the frontend**

```http
Accept: application/json
Content-Type: application/json
```

**Authentication**

No authentication mechanism was provided. The frontend currently sends no token or credential header. If the backend uses JWT/session authentication, the actual mechanism must be supplied before it is added.

---

## 1. Academic Q&A

**Status:** BACKEND API REQUIRED  
**Environment variable:** `VITE_API_QA_ENDPOINT`  
**Frontend service:** `askAcademicQuestion()`  
**Used in:** `src/pages/AcademicQAPage.jsx`

**Purpose**  
Query approved college documents such as syllabi, exam rules, lab manuals, and fee schedules using the backend RAG system.

**HTTP method expected by current service adapter**  
`POST`

**Endpoint**  
Not supplied. Configure the backend's real route in `VITE_API_QA_ENDPOINT`.

**Frontend request model currently sent**

```json
{
  "question": "What are the exam eligibility rules?",
  "simplify": true,
  "language": "Hindi"
}
```

`language` is omitted when left blank.

**Expected response**  
Not supplied. The UI can render structured JSON generically. For the best Q&A presentation, the backend should ideally return the answer plus source attribution/document references.

**Error handling**  
400/401/403/404/409/422/500, timeout, network failure, and missing route configuration are converted to user-readable messages.

**Notes**  
If your backend uses different request field names, update only `askAcademicQuestion()` or add a small adapter inside `academicService.js`.

---

## 2. Generate Personalized Study Plan

**Status:** BACKEND API REQUIRED  
**Environment variable:** `VITE_API_STUDY_PLAN_ENDPOINT`  
**Frontend service:** `generateStudyPlan()`  
**Used in:** `src/pages/StudyPlannerPage.jsx`

**Purpose**  
Generate a daily/weekly study schedule from subjects, available hours, exam dates, and additional constraints.

**HTTP method expected by current service adapter**  
`POST`

**Endpoint**  
Not supplied.

**Frontend request model currently sent**

```json
{
  "subjects": ["Computer Networks", "DBMS"],
  "hoursPerDay": 3,
  "examDate": "2026-11-10",
  "notes": "DBMS is the weaker subject"
}
```

Optional values may be omitted.

**Expected response**  
Not supplied. The page renders the backend response generically.

**Error handling**  
Standard centralized error handling.

---

## 3. Adaptive Study Progress Update

**Status:** BACKEND API REQUIRED  
**Environment variable:** `VITE_API_STUDY_PROGRESS_ENDPOINT`  
**Frontend service:** `updateStudyProgress()`  
**Used in:** `src/pages/StudyPlannerPage.jsx`

**Purpose**  
Allow the backend to adjust upcoming study tasks when a student falls behind or marks topics as difficult.

**HTTP method expected by current service adapter**  
`POST`

**Endpoint**  
Not supplied.

**Frontend request model currently sent**

```json
{
  "planId": "backend-plan-id",
  "completed": ["Unit 1", "Unit 2"],
  "hardTopics": ["Subnetting"]
}
```

**Expected response**  
Not supplied.

---

## 4. Exam Revision Checklist

**Status:** BACKEND API REQUIRED  
**Environment variable:** `VITE_API_REVISION_ENDPOINT`  
**Frontend service:** `generateRevisionChecklist()`  
**Used in:** `src/pages/StudyPlannerPage.jsx`

**Purpose**  
Generate a focused revision checklist leading up to a mid-term or semester exam.

**HTTP method expected by current service adapter**  
`POST`

**Frontend request model currently sent**

```json
{
  "subjects": ["Computer Networks"],
  "examDate": "2026-11-10",
  "notes": "Focus on routing and subnetting"
}
```

**Expected response**  
Not supplied.

---

## 5. List Academic Tasks

**Status:** BACKEND API REQUIRED  
**Environment variable:** `VITE_API_TASKS_LIST_ENDPOINT`  
**Frontend service:** `listTasks()`  
**Used in:** `src/pages/TasksPage.jsx`

**Purpose**  
Retrieve assignments, labs, project milestones, exams, and other academic tasks.

**HTTP method expected by current service adapter**  
`GET`

**Endpoint**  
Not supplied.

**Request**  
No query parameters are sent by default. `listTasks(params)` supports backend query parameters when added later.

**Compatible response shapes**  
The frontend can currently extract a task array from any of these response forms:

```json
[]
```

```json
{ "tasks": [] }
```

```json
{ "items": [] }
```

```json
{ "results": [] }
```

For display, the frontend recognizes common task aliases such as `title/name`, `deadline/dueDate/due_date`, `status/completed`, and `priority/urgency/difficulty`. This is compatibility logic, not an assertion about the backend schema.

---

## 6. Create Academic Task

**Status:** BACKEND API REQUIRED  
**Environment variable:** `VITE_API_TASKS_CREATE_ENDPOINT`  
**Frontend service:** `createTask()`  
**Used in:** `src/pages/TasksPage.jsx`

**Purpose**  
Create an academic assignment, lab, project milestone, exam, or other task.

**HTTP method expected by current service adapter**  
`POST`

**Frontend request model currently sent**

```json
{
  "title": "Submit DBMS lab assignment",
  "type": "Lab",
  "deadline": "2026-10-20T18:00",
  "difficulty": "Medium",
  "notes": "Optional context"
}
```

**Expected response**  
Not supplied.

---

## 7. Update Academic Task

**Status:** BACKEND API REQUIRED  
**Environment variable:** `VITE_API_TASK_UPDATE_ENDPOINT_TEMPLATE`  
**Frontend service:** `updateTask(taskId, payload)`  
**Used in:** `src/pages/TasksPage.jsx`

**Purpose**  
Update task status or other backend-supported task fields.

**HTTP method expected by current service adapter**  
`PATCH`

**Endpoint template**  
Not supplied. Configure a real route template containing `{id}` if your backend uses a task identifier in the path.

Example format only:

```env
VITE_API_TASK_UPDATE_ENDPOINT_TEMPLATE=/your-real-route/{id}
```

**Current status-toggle request**

```json
{
  "status": "Completed"
}
```

If the backend uses `PUT`, a different status field, or a different route structure, update `taskService.js` to match it.

---

## 8. Delete Academic Task

**Status:** BACKEND API REQUIRED  
**Environment variable:** `VITE_API_TASK_DELETE_ENDPOINT_TEMPLATE`  
**Frontend service:** `deleteTask(taskId)`  
**Used in:** `src/pages/TasksPage.jsx`

**Purpose**  
Delete an academic task after user confirmation.

**HTTP method expected by current service adapter**  
`DELETE`

**Endpoint template**  
Not supplied. Must use the backend's actual route.

---

## 9. Skill-Gap Analysis

**Status:** BACKEND API REQUIRED  
**Environment variable:** `VITE_API_CAREER_SKILL_GAP_ENDPOINT`  
**Frontend service:** `analyzeSkillGap()`  
**Used in:** `src/pages/CareerAdvisorPage.jsx`

**Purpose**  
Suggest technical skills, certifications, or electives based on the student's domain interest and current abilities.

**HTTP method expected by current service adapter**  
`POST`

**Frontend request model currently sent**

```json
{
  "domainInterest": "Machine Learning",
  "currentSkills": ["Python", "SQL"],
  "targetRole": "ML Engineer",
  "context": "Optional additional context"
}
```

**Expected response**  
Not supplied.

---

## 10. Placement & Interview Preparation

**Status:** BACKEND API REQUIRED  
**Environment variable:** `VITE_API_CAREER_INTERVIEW_ENDPOINT`  
**Frontend service:** `generateInterviewPrep()`  
**Used in:** `src/pages/CareerAdvisorPage.jsx`

**Purpose**  
Generate interview questions, aptitude breakdowns, or targeted placement preparation material.

**HTTP method expected by current service adapter**  
`POST`

**Frontend request model currently sent**

```json
{
  "domainInterest": "Web Development",
  "currentSkills": ["JavaScript", "React"],
  "targetRole": "Frontend Developer",
  "context": "Upcoming campus recruitment drive"
}
```

**Expected response**  
Not supplied.

---

## Optional health endpoint

**Status:** BACKEND API REQUIRED / OPTIONAL  
**Environment variable:** `VITE_API_HEALTH_ENDPOINT`  
**Frontend service:** `checkBackendHealth()`  
**Used in:** service layer only; not required for the core UI

The backend health route was not provided, so the frontend does not assume `/health`, `/api/health`, or any framework-specific path.

---

# Backend APIs still required for complete integration

The frontend is complete at the UI/service-layer level, but these concrete backend details are still required before claiming end-to-end integration:

1. Actual route for Academic Q&A
2. Actual route for study-plan generation
3. Actual route for adaptive study progress
4. Actual route for revision checklist generation
5. Actual task list route and response schema
6. Actual task creation route and request schema
7. Actual task update method/route/schema
8. Actual task delete route
9. Actual skill-gap analysis route/schema
10. Actual placement/interview preparation route/schema
11. Authentication mechanism, if any
12. Backend base URL and CORS configuration

No backend changes are required merely because this information is missing from the supplied brief. Once the actual contract is provided, the React service adapters can be aligned to it directly.
