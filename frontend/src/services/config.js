export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL?.trim() || '',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 20000,
  endpoints: {
    health: import.meta.env.VITE_API_HEALTH_ENDPOINT?.trim() || '',
    qa: import.meta.env.VITE_API_QA_ENDPOINT?.trim() || '',
    studyPlan: import.meta.env.VITE_API_STUDY_PLAN_ENDPOINT?.trim() || '',
    studyProgress: import.meta.env.VITE_API_STUDY_PROGRESS_ENDPOINT?.trim() || '',
    revision: import.meta.env.VITE_API_REVISION_ENDPOINT?.trim() || '',
    taskList: import.meta.env.VITE_API_TASKS_LIST_ENDPOINT?.trim() || '',
    taskCreate: import.meta.env.VITE_API_TASKS_CREATE_ENDPOINT?.trim() || '',
    taskUpdateTemplate: import.meta.env.VITE_API_TASK_UPDATE_ENDPOINT_TEMPLATE?.trim() || '',
    taskDeleteTemplate: import.meta.env.VITE_API_TASK_DELETE_ENDPOINT_TEMPLATE?.trim() || '',
    careerSkillGap: import.meta.env.VITE_API_CAREER_SKILL_GAP_ENDPOINT?.trim() || '',
    careerInterview: import.meta.env.VITE_API_CAREER_INTERVIEW_ENDPOINT?.trim() || '',
  },
};

export const endpointLabels = {
  qa: 'Academic Q&A',
  studyPlan: 'Study plan generation',
  studyProgress: 'Adaptive progress update',
  revision: 'Revision checklist',
  taskList: 'Task listing',
  taskCreate: 'Task creation',
  taskUpdateTemplate: 'Task update',
  taskDeleteTemplate: 'Task deletion',
  careerSkillGap: 'Skill-gap analysis',
  careerInterview: 'Interview preparation',
};
