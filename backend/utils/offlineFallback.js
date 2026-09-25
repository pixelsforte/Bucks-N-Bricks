import mongoose from 'mongoose';

/**
 * Utility to manage offline in-memory fallback data when MongoDB Atlas connection is disconnected
 * or blocked by IP whitelisting rules.
 */

export const isOffline = () => {
  return mongoose.connection.readyState !== 1;
};

export const initOfflineData = () => {
  if (global._offlineInitialized) return;
  global._offlineInitialized = true;

  if (!global.offlineJobs) {
    global.offlineJobs = [];
  }

  if (!global.offlineApplications || global.offlineApplications.length === 0) {
    global.offlineApplications = [
      {
        _id: 'offline-app-201',
        id: 'offline-app-201',
        job: global.offlineJobs[0],
        applicantName: 'Ahmed Raza Khan',
        email: 'ahmed.raza.dev@gmail.com',
        phone: '+92 300 1234567',
        coverLetter: 'I am a passionate full stack developer with 5 years of experience in React and Node.js. I have built scalable SaaS apps and would love to contribute to Bucks & Bricks Co.',
        resumeUrl: '/uploads/sample_resume_ahmed.pdf',
        resumeFileName: 'Ahmed_Raza_Resume.pdf',
        status: 'Shortlisted',
        atsScore: 88,
        appliedAt: new Date(Date.now() - 86400000 * 2),
        notes: [
          {
            text: 'Excellent technical background in TypeScript and React. Schedule technical interview next week.',
            addedBy: 'Super Admin',
            addedAt: new Date(Date.now() - 86400000 * 1)
          }
        ]
      },
      {
        _id: 'offline-app-202',
        id: 'offline-app-202',
        job: global.offlineJobs[1],
        applicantName: 'Sara Ahmed Malik',
        email: 'sara.malik.hr@yahoo.com',
        phone: '+92 321 7654321',
        coverLetter: 'With 6 years of talent acquisition experience across tech and finance, I am excited to apply for the AI Recruitment Lead position.',
        resumeUrl: '/uploads/sample_resume_sara.pdf',
        resumeFileName: 'Sara_Malik_HR_Resume.pdf',
        status: 'Interviewing',
        atsScore: 94,
        appliedAt: new Date(Date.now() - 86400000 * 1),
        notes: [
          {
            text: 'Top candidate! Exceptional communication during initial screening call.',
            addedBy: 'Super Admin',
            addedAt: new Date()
          }
        ]
      }
    ];
  }

  if (!global.offlineResumeChecks || global.offlineResumeChecks.length === 0) {
    global.offlineResumeChecks = [
      {
        _id: 'offline-check-301',
        id: 'offline-check-301',
        resumeFile: '/uploads/sample_resume_ahmed.pdf',
        resumeFileName: 'Ahmed_Raza_Resume.pdf',
        resumeFileSize: 245760,
        atsScore: 88,
        createdAt: new Date(Date.now() - 86400000 * 2)
      },
      {
        _id: 'offline-check-302',
        id: 'offline-check-302',
        resumeFile: '/uploads/sample_resume_sara.pdf',
        resumeFileName: 'Sara_Malik_HR_Resume.pdf',
        resumeFileSize: 189440,
        atsScore: 94,
        createdAt: new Date(Date.now() - 86400000 * 1)
      }
    ];
  }

  if (!global.offlineContacts) {
    global.offlineContacts = [
      {
        _id: 'offline-contact-1',
        id: 'offline-contact-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+92 300 1122334',
        subject: 'Inquiry about HR Solutions',
        message: 'Hello, we are interested in your AI recruitment portal and would like to schedule a demo.',
        createdAt: new Date(Date.now() - 3600000 * 5)
      },
      {
        _id: 'offline-contact-2',
        id: 'offline-contact-2',
        name: 'Sarah Jenkins',
        email: 's.jenkins@techcorp.io',
        phoneNumber: '+92 321 9988776',
        subject: 'Partnership Opportunity',
        message: 'We would love to discuss integrating our enterprise analytics tools with Bucks & Bricks.',
        createdAt: new Date(Date.now() - 3600000 * 1)
      }
    ];
  }

  if (!global.offlineTeamMembers || global.offlineTeamMembers.length === 0) {
    global.offlineTeamMembers = [
      {
        _id: 'offline-team-1',
        id: 'offline-team-1',
        name: 'Mohsin',
        role: 'Director Operations',
        qualification: 'MBA in Marketing',
        image: '/assets/team-mohsin.jpeg',
        bgColor: 'bg-gradient-to-b from-blue-500/90 to-blue-700/95',
        bio: 'Overseeing operations and client partnerships with a focus on delivering high-impact recruitment and executive search solutions. We bridge the gap between organizational ambitions and exceptional leadership talent across diverse industries.',
        company: 'Bucks n Bricks',
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: 'Mohsin',
        designation: 'Director Operations',
        quote: 'Overseeing operations and client partnerships with a focus on delivering high-impact recruitment and executive search solutions. We bridge the gap between organizational ambitions and exceptional leadership talent across diverse industries.',
        avatar: '/assets/team-mohsin.jpeg',
      },
      {
        _id: 'offline-team-2',
        id: 'offline-team-2',
        name: 'Shoaib Ahmed Zafar',
        role: 'Sr Manager Technical Recruitment and Accounts',
        qualification: 'BSc Computer Science',
        image: '/assets/team-shoaib.jpeg',
        bgColor: 'bg-gradient-to-b from-indigo-500/90 to-indigo-700/95',
        bio: 'Leading specialized technical talent acquisition and strategic account management. We help businesses build robust engineering and technology teams that accelerate innovation and organizational growth.',
        company: 'Bucks n Bricks',
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: 'Shoaib Ahmed Zafar',
        designation: 'Sr Manager Technical Recruitment and Accounts',
        quote: 'Leading specialized technical talent acquisition and strategic account management. We help businesses build robust engineering and technology teams that accelerate innovation and organizational growth.',
        avatar: '/assets/team-shoaib.jpeg',
      },
      {
        _id: 'offline-team-3',
        id: 'offline-team-3',
        name: 'Saima Yasir',
        role: 'Manager Business Operations',
        qualification: 'Masters in Human Resource Management',
        image: '/assets/Team-1-1.jpeg',
        bgColor: 'bg-gradient-to-b from-cyan-500/90 to-cyan-700/95',
        bio: 'Optimizing business operations and streamlining recruitment workflows to drive organizational growth. Committed to delivering seamless management and high-quality outcomes for our clients and team.',
        company: 'Bucks n Bricks',
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: 'Saima Yasir',
        designation: 'Manager Business Operations',
        quote: 'Optimizing business operations and streamlining recruitment workflows to drive organizational growth. Committed to delivering seamless management and high-quality outcomes for our clients and team.',
        avatar: '/assets/Team-1-1.jpeg',
      },
      {
        _id: 'offline-team-4',
        id: 'offline-team-4',
        name: 'Amna Jamal',
        role: 'HR Officer',
        qualification: 'BBA in Human Resources',
        image: '/assets/Team-2-1.jpeg',
        bgColor: 'bg-gradient-to-b from-rose-400/90 to-rose-600/95',
        bio: 'Passionate about connecting exceptional talent with the right opportunities. Being part of Bucks n Bricks has strengthened my expertise in recruitment, talent management, and delivering meaningful solutions for both clients and candidates.',
        company: 'Bucks n Bricks',
        order: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: 'Amna Jamal',
        designation: 'HR Officer',
        quote: 'Passionate about connecting exceptional talent with the right opportunities. Being part of Bucks n Bricks has strengthened my expertise in recruitment, talent management, and delivering meaningful solutions for both clients and candidates.',
        avatar: '/assets/Team-2-1.jpeg',
      },
      {
        _id: 'offline-team-5',
        id: 'offline-team-5',
        name: 'Aiman Farooqui',
        role: 'HR Officer',
        qualification: 'BS in Psychology',
        image: '/assets/Team-3-1.jpeg',
        bgColor: 'bg-gradient-to-b from-teal-400/90 to-teal-600/95',
        bio: 'Collaborating with diverse clients across multiple industries has strengthened my ability to understand unique hiring requirements and deliver quality talent within dynamic business environments.',
        company: 'Bucks n Bricks',
        order: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: 'Aiman Farooqui',
        designation: 'HR Officer',
        quote: 'Collaborating with diverse clients across multiple industries has strengthened my ability to understand unique hiring requirements and deliver quality talent within dynamic business environments.',
        avatar: '/assets/Team-3-1.jpeg',
      }
    ];
  }
};

export const getOfflineJobsResult = (queryParams, isPublic = false) => {
  initOfflineData();
  const { search, workplaceType, employmentType, status, page = 1, limit = 10, sort } = queryParams;
  let filtered = [...global.offlineJobs];

  if (isPublic) {
    filtered = filtered.filter(j => j.status === 'Published');
  } else if (status && status.toUpperCase() !== 'ALL') {
    filtered = filtered.filter(j => j.status.toLowerCase() === status.toLowerCase());
  }

  if (workplaceType && workplaceType.toUpperCase() !== 'ALL') {
    filtered = filtered.filter(j => j.workplaceType.toLowerCase() === workplaceType.toLowerCase());
  }

  if (employmentType && employmentType.toUpperCase() !== 'ALL') {
    filtered = filtered.filter(j => j.employmentType.toLowerCase() === employmentType.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(j =>
      (j.jobTitle && j.jobTitle.toLowerCase().includes(q)) ||
      (j.companyName && j.companyName.toLowerCase().includes(q)) ||
      (j.city && j.city.toLowerCase().includes(q)) ||
      (j.category && j.category.toLowerCase().includes(q)) ||
      (j.description && j.description.toLowerCase().includes(q))
    );
  }

  if (sort === 'oldest') {
    filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + limitNum);

  return {
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasNextPage: pageNum * limitNum < total,
      hasPrevPage: pageNum > 1,
    },
    jobs: paginated,
  };
};

export const getOfflineApplicationsResult = (queryParams) => {
  initOfflineData();
  const { jobId, status, search, page = 1, limit = 10, sort } = queryParams;
  let filtered = [...global.offlineApplications];

  if (jobId) {
    filtered = filtered.filter(a => String(a.job?._id || a.job?.id || a.job) === String(jobId));
  }

  if (status && status.toUpperCase() !== 'ALL') {
    filtered = filtered.filter(a => a.status.toLowerCase() === status.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(a =>
      (a.applicantName && a.applicantName.toLowerCase().includes(q)) ||
      (a.email && a.email.toLowerCase().includes(q)) ||
      (a.job?.jobTitle && a.job.jobTitle.toLowerCase().includes(q))
    );
  }

  if (sort === 'oldest') {
    filtered.sort((a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime());
  } else {
    filtered.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + limitNum);

  return {
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasNextPage: pageNum * limitNum < total,
      hasPrevPage: pageNum > 1,
    },
    applications: paginated,
  };
};

export const getOfflineDashboardStatsResult = () => {
  initOfflineData();
  const jobs = global.offlineJobs || [];
  const apps = global.offlineApplications || [];

  const totalJobs = jobs.length;
  const publishedJobs = jobs.filter(j => j.status === 'Published').length;
  const draftJobs = jobs.filter(j => j.status === 'Draft').length;
  const closedJobs = jobs.filter(j => j.status === 'Closed').length;

  const totalApplications = apps.length;
  const newApplications = apps.filter(a => a.status === 'New').length;
  const underReviewApplications = apps.filter(a => a.status === 'Under Review').length;
  const shortlistedApplications = apps.filter(a => a.status === 'Shortlisted').length;
  const interviewingApplications = apps.filter(a => a.status === 'Interviewing').length;
  const rejectedApplications = apps.filter(a => a.status === 'Rejected').length;
  const hiredApplications = apps.filter(a => a.status === 'Hired').length;

  const recentApplications = apps.slice(0, 5);

  return {
    overview: {
      totalJobs,
      publishedJobs,
      draftJobs,
      closedJobs,
      totalApplications,
      newApplications,
      underReviewApplications,
      shortlistedApplications,
      interviewingApplications,
      rejectedApplications,
      hiredApplications,
    },
    recentApplications,
  };
};

export const getOfflineJobById = (id) => {
  initOfflineData();
  let job = global.offlineJobs.find(j => String(j._id || j.id) === String(id));
  if (!job && id) {
    const idStr = String(id).replace(/^(job-|offline-job-)/, '');
    const idx = parseInt(idStr, 10);
    if (!isNaN(idx) && idx >= 1) {
      const mapped = global.offlineJobs[(idx - 1) % global.offlineJobs.length] || global.offlineJobs[0];
      if (mapped) {
        job = { ...mapped, _id: String(id), id: String(id) };
      }
    } else if (global.offlineJobs.length > 0) {
      job = { ...global.offlineJobs[0], _id: String(id), id: String(id) };
    }
  }
  return job || null;
};

export const createOfflineJob = (body, admin) => {
  initOfflineData();
  const newJob = {
    _id: 'offline-job-' + Date.now(),
    id: 'offline-job-' + Date.now(),
    companyName: body.companyName,
    jobTitle: body.jobTitle,
    category: body.category || 'General',
    city: body.city,
    country: body.country || '',
    workplaceType: body.workplaceType || 'On-Site',
    employmentType: body.employmentType || 'Full Time',
    description: body.description,
    responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities : [],
    requirements: Array.isArray(body.requirements) ? body.requirements : [],
    perksAndBenefits: Array.isArray(body.perksAndBenefits) ? body.perksAndBenefits : [],
    experienceRequired: body.experienceRequired,
    education: body.education || '',
    salary: body.salary || '',
    applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : null,
    status: body.status || 'Draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: admin || { _id: 'offline-1785085105862', name: 'Super Admin', email: 'admin@bucksnbricks.com', role: 'SUPER_ADMIN' }
  };
  global.offlineJobs.unshift(newJob);
  return newJob;
};

export const updateOfflineJob = (id, body) => {
  initOfflineData();
  const job = getOfflineJobById(id);
  if (!job) return null;
  const allowedUpdates = [
    'companyName', 'jobTitle', 'category', 'city', 'country',
    'workplaceType', 'employmentType', 'description', 'responsibilities',
    'requirements', 'perksAndBenefits', 'experienceRequired', 'education',
    'salary', 'applicationDeadline', 'status'
  ];
  allowedUpdates.forEach(field => {
    if (body[field] !== undefined) {
      if (field === 'applicationDeadline') {
        job[field] = body[field] ? new Date(body[field]) : null;
      } else {
        job[field] = body[field];
      }
    }
  });
  job.updatedAt = new Date();
  return job;
};

export const deleteOfflineJob = (id) => {
  initOfflineData();
  const idx = global.offlineJobs.findIndex(j => String(j._id || j.id) === String(id));
  if (idx !== -1) {
    global.offlineJobs.splice(idx, 1);
    return true;
  }
  return false;
};

export const changeOfflineJobStatus = (id, status) => {
  initOfflineData();
  const job = getOfflineJobById(id);
  if (!job) return null;
  job.status = status;
  job.updatedAt = new Date();
  return job;
};

export const getOfflineApplicationById = (id) => {
  initOfflineData();
  return global.offlineApplications.find(a => String(a._id || a.id) === String(id)) || null;
};

export const createOfflineApplication = (job, body, resumeFile) => {
  initOfflineData();
  const firstName = body.firstName || (body.applicantName ? body.applicantName.split(' ')[0] : 'Candidate');
  const lastName = body.lastName || (body.applicantName ? body.applicantName.split(' ').slice(1).join(' ') : '');
  const candidateName = body.applicantName || `${firstName} ${lastName}`.trim() || 'Candidate';
  const atsScoreNum = body.atsScore ? (typeof body.atsScore === 'string' ? parseInt(body.atsScore, 10) : body.atsScore) : 85;

  const newApp = {
    _id: 'offline-app-' + Date.now(),
    id: 'offline-app-' + Date.now(),
    job,
    firstName,
    lastName,
    applicantName: candidateName,
    email: body.email || 'candidate@example.com',
    phone: body.phoneNumber || body.phone || '+92 300 0000000',
    phoneNumber: body.phoneNumber || body.phone || '+92 300 0000000',
    country: body.country || 'Pakistan',
    currentCity: body.currentCity || '',
    employmentStatus: body.employmentStatus || 'Employed',
    currentJobTitle: body.currentJobTitle || '',
    yearsOfExperience: body.yearsOfExperience || '3',
    currentSalary: body.currentSalary || '',
    expectedSalary: body.expectedSalary || '',
    academicQualification: body.academicQualification || '',
    university: body.university || '',
    primaryLanguage: body.primaryLanguage || 'English',
    additionalLanguage: body.additionalLanguage || '',
    coverLetter: body.coverLetter || '',
    resumeUrl: resumeFile ? `/uploads/${resumeFile.filename}` : '/uploads/sample_resume.pdf',
    resumeFile: resumeFile ? `/uploads/${resumeFile.filename}` : '/uploads/sample_resume.pdf',
    resumeFileName: resumeFile ? resumeFile.originalname : 'resume.pdf',
    resumeFileSize: resumeFile ? resumeFile.size : 150000,
    resumeMimeType: resumeFile ? resumeFile.mimetype : 'application/pdf',
    status: 'Pending',
    atsScore: isNaN(atsScoreNum) ? 85 : atsScoreNum,
    appliedAt: new Date(),
    createdAt: new Date(),
    notes: []
  };
  global.offlineApplications.unshift(newApp);
  return newApp;
};

export const updateOfflineApplicationStatus = (id, status) => {
  initOfflineData();
  const app = getOfflineApplicationById(id);
  if (!app) return null;
  app.status = status;
  return app;
};

export const addOfflineApplicationNote = (id, text, adminName) => {
  initOfflineData();
  const app = getOfflineApplicationById(id);
  if (!app) return null;
  const newNote = {
    _id: 'offline-note-' + Date.now(),
    text,
    addedBy: adminName || 'Admin',
    addedAt: new Date()
  };
  app.notes.push(newNote);
  return app;
};

export const deleteOfflineApplication = (id) => {
  initOfflineData();
  const idx = global.offlineApplications.findIndex(a => String(a._id || a.id) === String(id));
  if (idx !== -1) {
    global.offlineApplications.splice(idx, 1);
    return true;
  }
  return false;
};

export const getOfflineResumeChecksResult = (queryParams) => {
  initOfflineData();
  const { page = 1, limit = 10 } = queryParams;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  const total = global.offlineResumeChecks.length;
  const paginated = global.offlineResumeChecks.slice(skip, skip + limitNum);
  return {
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasNextPage: pageNum * limitNum < total,
      hasPrevPage: pageNum > 1
    },
    records: paginated
  };
};

export const getOfflineResumeCheckById = (id) => {
  initOfflineData();
  return global.offlineResumeChecks.find(r => String(r._id || r.id) === String(id)) || null;
};

export const deleteOfflineResumeCheck = (id) => {
  initOfflineData();
  const idx = global.offlineResumeChecks.findIndex(r => String(r._id || r.id) === String(id));
  if (idx !== -1) {
    global.offlineResumeChecks.splice(idx, 1);
    return true;
  }
  return false;
};

export const getOfflineAdminsList = () => {
  global.offlineAdmins = global.offlineAdmins || [
    {
      _id: 'offline-1785085105862',
      id: 'offline-1785085105862',
      name: 'Super Admin',
      email: 'admin@gmail.com',
      password: 'AdminPassword123!',
      role: 'SUPER_ADMIN',
      isActive: true,
      createdAt: new Date(),
    },
    {
      _id: 'offline-1785085105863',
      id: 'offline-1785085105863',
      name: 'Super Admin',
      email: 'admin@bucksnbricks.com',
      password: 'AdminPassword123!',
      role: 'SUPER_ADMIN',
      isActive: true,
      createdAt: new Date(),
    }
  ];
  return global.offlineAdmins;
};

export const createOfflineSecondaryAdmin = (body) => {
  const list = getOfflineAdminsList();
  const newAdmin = {
    _id: 'offline-admin-' + Date.now(),
    id: 'offline-admin-' + Date.now(),
    name: body.name,
    email: body.email.toLowerCase().trim(),
    password: body.password || 'AdminPassword123!',
    role: body.role || 'SECONDARY_ADMIN',
    isActive: true,
    createdAt: new Date(),
  };
  list.unshift(newAdmin);
  return newAdmin;
};

export const updateOfflineAdminStatus = (id, isActive) => {
  const list = getOfflineAdminsList();
  const admin = list.find(a => String(a._id || a.id) === String(id));
  if (!admin) return null;
  admin.isActive = isActive;
  return admin;
};

export const deleteOfflineAdmin = (id) => {
  const list = getOfflineAdminsList();
  const idx = list.findIndex(a => String(a._id || a.id) === String(id));
  if (idx !== -1) {
    list.splice(idx, 1);
    return true;
  }
  return false;
};

export const getOfflineContactsResult = (queryParams = {}) => {
  initOfflineData();
  const { search, page = 1, limit = 10 } = queryParams;
  let filtered = [...global.offlineContacts];

  if (search) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(c =>
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.subject && c.subject.toLowerCase().includes(q)) ||
      (c.message && c.message.toLowerCase().includes(q))
    );
  }

  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + limitNum);

  return {
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      hasNextPage: pageNum * limitNum < total,
      hasPrevPage: pageNum > 1
    },
    messages: paginated
  };
};

export const getOfflineContactById = (id) => {
  initOfflineData();
  return global.offlineContacts.find(c => String(c._id || c.id) === String(id)) || null;
};

export const createOfflineContact = (body) => {
  initOfflineData();
  const newContact = {
    _id: 'offline-contact-' + Date.now(),
    id: 'offline-contact-' + Date.now(),
    name: body.name || body.fullName || 'Anonymous',
    email: (body.email || '').toLowerCase().trim(),
    phoneNumber: body.phoneNumber || body.phone || '+92 300 0000000',
    subject: body.subject || 'General Inquiry',
    message: body.message || '',
    createdAt: new Date()
  };
  global.offlineContacts.unshift(newContact);
  return newContact;
};

export const deleteOfflineContact = (id) => {
  initOfflineData();
  const idx = global.offlineContacts.findIndex(c => String(c._id || c.id) === String(id));
  if (idx !== -1) {
    global.offlineContacts.splice(idx, 1);
    return true;
  }
  return false;
};

// -------------------------------------------------------------
// Team Members Offline Storage & Operations
// -------------------------------------------------------------
export const getOfflineTeamMembers = (queryParams = {}) => {
  initOfflineData();
  if (!global.offlineTeamMembers) global.offlineTeamMembers = [];
  let members = [...global.offlineTeamMembers];
  
  if (queryParams.search) {
    const q = queryParams.search.toLowerCase().trim();
    members = members.filter(
      (m) =>
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.role && m.role.toLowerCase().includes(q)) ||
        (m.bio && m.bio.toLowerCase().includes(q)) ||
        (m.company && m.company.toLowerCase().includes(q))
    );
  }

  // Sort by order ascending, then by createdAt descending
  members.sort((a, b) => {
    const orderDiff = (a.order || 0) - (b.order || 0);
    if (orderDiff !== 0) return orderDiff;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return members;
};

export const getOfflineTeamMemberById = (id) => {
  initOfflineData();
  if (!global.offlineTeamMembers) global.offlineTeamMembers = [];
  return global.offlineTeamMembers.find((m) => String(m._id || m.id) === String(id)) || null;
};

export const createOfflineTeamMember = (data) => {
  initOfflineData();
  if (!global.offlineTeamMembers) global.offlineTeamMembers = [];
  const id = 'offline-team-' + Date.now();
  const newMember = {
    _id: id,
    id,
    name: data.name || data.fullName || 'Team Member',
    role: data.role || data.designation || 'Specialist',
    bio: data.bio || data.description || data.quote || '',
    image: data.image || data.picture || data.avatar || '',
    company: data.company || 'Bucks n Bricks',
    order: Number(data.order) || 0,
    isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    createdBy: data.createdBy || null,
    createdAt: new Date(),
    updatedAt: new Date(),
    // Presentation compatibility
    author: data.name || data.fullName || 'Team Member',
    designation: data.role || data.designation || 'Specialist',
    quote: data.bio || data.description || data.quote || '',
    avatar: data.image || data.picture || data.avatar || '',
  };
  global.offlineTeamMembers.push(newMember);
  return newMember;
};

export const updateOfflineTeamMember = (id, updates) => {
  initOfflineData();
  if (!global.offlineTeamMembers) global.offlineTeamMembers = [];
  const index = global.offlineTeamMembers.findIndex((m) => String(m._id || m.id) === String(id));
  if (index === -1) return null;

  const existing = global.offlineTeamMembers[index];
  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date(),
  };

  if (updates.name) {
    updated.author = updates.name;
  }
  if (updates.role) {
    updated.designation = updates.role;
  }
  if (updates.bio) {
    updated.quote = updates.bio;
  }
  if (updates.image !== undefined) {
    updated.avatar = updates.image;
  }

  global.offlineTeamMembers[index] = updated;
  return updated;
};

export const deleteOfflineTeamMember = (id) => {
  initOfflineData();
  if (!global.offlineTeamMembers) global.offlineTeamMembers = [];
  const index = global.offlineTeamMembers.findIndex((m) => String(m._id || m.id) === String(id));
  if (index !== -1) {
    const deleted = global.offlineTeamMembers.splice(index, 1);
    return deleted[0];
  }
  return null;
};


