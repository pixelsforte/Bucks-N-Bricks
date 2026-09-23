import { Admin } from './Admin.js';
import { Job } from './Job.js';
import { Application } from './Application.js';
import { ResumeChecker } from './ResumeChecker.js';
import { TeamMember } from './TeamMember.js';

export const MODELS = {
  ADMIN: 'Admin',
  JOB: 'Job',
  CANDIDATE: 'Candidate',
  APPLICATION: 'Application',
  RESUME_CHECKER: 'ResumeChecker',
  TEAM_MEMBER: 'TeamMember',
};

export { Admin, Job, Application, ResumeChecker, TeamMember };
export default { Admin, Job, Application, ResumeChecker, TeamMember, MODELS };
