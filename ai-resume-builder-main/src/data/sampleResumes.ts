import { ResumeData } from '../types/resume';

export const techResume: ResumeData = {
  personalInfo: {
    fullName: 'Alex Vance',
    jobTitle: 'Senior Full Stack Software Architect',
    email: 'alex.vance@example.com',
    phone: '+1 (415) 892-4102',
    location: 'San Francisco, CA (Open to Remote)',
    website: 'https://alexvance.dev',
    linkedin: 'linkedin.com/in/alexvance-eng',
    github: 'github.com/alexvance',
    summary: 'Results-driven Software Architect with 7+ years of experience leading cross-functional teams and designing distributed cloud architectures. Specialized in high-throughput microservices, real-time data streaming, and scalable React/Node.js ecosystems. Proven track record of slashing infrastructure costs by 35% while sustaining 99.99% system availability.'
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'Nexus Cloud Systems',
      role: 'Staff Software Architect',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: 'Present',
      current: true,
      bullets: [
        'Architected and deployed event-driven data ingestion platform processing 45M+ daily requests using Node.js, Kafka, and Redis.',
        'Spearheaded multi-region AWS cloud migration that reduced p99 latency from 320ms to 48ms and cut annual infrastructure spend by $180,000.',
        'Mentored 12 mid-level engineers and established CI/CD pipeline automation reducing sprint deployment cycles by 60%.'
      ]
    },
    {
      id: 'exp-2',
      company: 'Velocity Fintech Labs',
      role: 'Senior Full Stack Engineer',
      location: 'Austin, TX',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      bullets: [
        'Engineered high-security customer transaction portal serving 650K+ active users using React, TypeScript, and Express.',
        'Implemented PCI-DSS compliant vault encryption and automated test suite achieving 94% test coverage across financial workflows.',
        'Collaborated with product designers to overhaul core onboarding UX, improving sign-up conversion rate by 28%.'
      ]
    },
    {
      id: 'exp-3',
      company: 'Aether Interactive',
      role: 'Software Engineer',
      location: 'Seattle, WA',
      startDate: '2017-08',
      endDate: '2019-05',
      current: false,
      bullets: [
        'Developed reusable UI component library in React/Tailwind adopted across 4 flagship company web applications.',
        'Optimized PostgreSQL query indexes and database connections, accelerating data retrieval times by 45%.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of Washington',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science & Software Engineering',
      location: 'Seattle, WA',
      startDate: '2013',
      endDate: '2017',
      gpa: '3.88 / 4.0',
      highlights: [
        'Magna Cum Laude Honors',
        'President of Association for Computing Machinery (ACM) Student Chapter',
        'Lead Author on undergraduate distributed consensus research project'
      ]
    }
  ],
  skills: [
    {
      category: 'Languages & Core',
      items: ['TypeScript', 'JavaScript (ESNext)', 'Python', 'Go', 'SQL', 'GraphQL', 'HTML5/CSS3']
    },
    {
      category: 'Frameworks & Libraries',
      items: ['React 19', 'Next.js', 'Node.js', 'Express', 'TailwindCSS', 'Redux Toolkit', 'Jest', 'Vite']
    },
    {
      category: 'Cloud & Infrastructure',
      items: ['AWS (ECS, S3, Lambda, RDS)', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'Kafka', 'Terraform', 'CI/CD Actions']
    },
    {
      category: 'Architecture & Leadership',
      items: ['Microservices', 'System Design', 'Event-Driven Architecture', 'Agile/Scrum', 'Technical Mentorship', 'API Security']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'PulseFlow - Distributed Metrics Platform',
      description: 'Open-source distributed telemetry stream visualizer',
      role: 'Creator & Maintainer',
      technologies: ['Go', 'TypeScript', 'React', 'TimescaleDB', 'Docker'],
      link: 'https://pulseflow.dev',
      github: 'https://github.com/alexvance/pulseflow',
      bullets: [
        'Grew open-source tool to 2,400+ GitHub stars with 15k+ monthly active container pulls.',
        'Engineered custom WebSocket protocol reducing real-time dashboard memory overhead by 40%.'
      ]
    },
    {
      id: 'proj-2',
      name: 'OmniAuth Proxy',
      description: 'Zero-trust enterprise single-sign-on microservice',
      role: 'Lead Developer',
      technologies: ['Node.js', 'OAuth2', 'JWT', 'Redis', 'Docker'],
      link: '',
      github: 'https://github.com/alexvance/omniauth-proxy',
      bullets: [
        'Built enterprise authentication gateway managing OAuth 2.0 and SAML flows for 100k+ sessions.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect - Professional',
      issuer: 'Amazon Web Services',
      issueDate: '2023',
      expiryDate: '2026',
      credentialUrl: 'https://aws.amazon.com/verification'
    },
    {
      id: 'cert-2',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      issueDate: '2022',
      expiryDate: '2025',
      credentialUrl: ''
    }
  ],
  languages: [
    { language: 'English', proficiency: 'Native / Bilingual' },
    { language: 'Spanish', proficiency: 'Professional Working' }
  ],
  customSections: [],
  design: {
    template: 'modern',
    colorTheme: '#2563eb', // royal blue
    fontFamily: 'inter',
    fontSize: 'md',
    margins: 'normal',
    paperSize: 'a4',
    sectionOrder: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'languages'],
    visibleSections: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
      languages: true,
      custom: true
    }
  }
};

export const executiveResume: ResumeData = {
  personalInfo: {
    fullName: 'Elena Rostova',
    jobTitle: 'VP of Product Marketing & Growth',
    email: 'elena.rostova@example.com',
    phone: '+1 (212) 555-0184',
    location: 'New York, NY',
    website: 'https://elenarostova.com',
    linkedin: 'linkedin.com/in/elenarostova',
    github: '',
    summary: 'Strategic B2B SaaS Growth Executive with 10+ years driving go-to-market execution, brand positioning, and demand generation. Scaled ARR from $8M to $65M across two venture-backed scaleups. Expert in product-led growth (PLG), customer acquisition economics, and building high-performing multinational marketing organizations.'
  },
  experiences: [
    {
      id: 'exp-exec-1',
      company: 'Synapse Enterprise AI',
      role: 'Vice President of Marketing',
      location: 'New York, NY',
      startDate: '2021-01',
      endDate: 'Present',
      current: true,
      bullets: [
        'Directed 24-person global marketing team spanning product marketing, demand gen, brand, and corporate comms, driving 140% YoY ARR expansion.',
        'Re-architected enterprise sales pipeline generation, delivering $32M in qualified pipeline in FY2023 at 3.4x CAC efficiency.',
        'Orchestrated tier-1 global product launch featured in Forbes and TechCrunch, capturing 4,200 enterprise inbound leads in month one.'
      ]
    },
    {
      id: 'exp-exec-2',
      company: 'Clarion Software',
      role: 'Senior Director of Product Marketing',
      location: 'Boston, MA',
      startDate: '2017-04',
      endDate: '2020-12',
      current: false,
      bullets: [
        'Formulated enterprise packaging and pricing tiers, lifting Average Contract Value (ACV) by 42% across Fortune 500 accounts.',
        'Built sales enablement program equipping 85 account executives, shrinking average deal closing cycle by 18 days.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-exec-1',
      school: 'Columbia Business School',
      degree: 'Master of Business Administration (MBA)',
      fieldOfStudy: 'Marketing & Strategic Management',
      location: 'New York, NY',
      startDate: '2015',
      endDate: '2017',
      gpa: '3.92',
      highlights: ['Dean’s List for Academic Excellence', 'President, Columbia Marketing Association']
    },
    {
      id: 'edu-exec-2',
      school: 'Georgetown University',
      degree: 'Bachelor of Arts',
      fieldOfStudy: 'Economics & International Relations',
      location: 'Washington, DC',
      startDate: '2011',
      endDate: '2015',
      gpa: '3.85',
      highlights: ['Summa Cum Laude']
    }
  ],
  skills: [
    {
      category: 'Executive Leadership',
      items: ['Go-to-Market (GTM) Strategy', 'Revenue Operations', 'P&L Management', 'Cross-Functional Team Building', 'Executive Board Reporting']
    },
    {
      category: 'Growth & Product Marketing',
      items: ['Product-Led Growth (PLG)', 'Enterprise Positioning', 'Pricing & Packaging', 'CAC/LTV Optimization', 'Competitive Intelligence']
    },
    {
      category: 'MarTech & Analytics',
      items: ['Salesforce', 'HubSpot', 'Marketo', 'Google Analytics 4', 'Mixpanel', 'Gong', 'Tableau']
    }
  ],
  projects: [],
  certifications: [
    {
      id: 'cert-exec-1',
      name: 'Reforge Advanced Growth Series',
      issuer: 'Reforge',
      issueDate: '2021',
      expiryDate: '',
      credentialUrl: ''
    }
  ],
  languages: [
    { language: 'English', proficiency: 'Native' },
    { language: 'French', proficiency: 'Fluent' }
  ],
  customSections: [],
  design: {
    template: 'executive',
    colorTheme: '#0f172a', // deep slate
    fontFamily: 'merriweather',
    fontSize: 'md',
    margins: 'normal',
    paperSize: 'letter',
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications', 'languages'],
    visibleSections: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: false,
      certifications: true,
      languages: true,
      custom: false
    }
  }
};

export const blankResume: ResumeData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: ''
  },
  experiences: [],
  education: [],
  skills: [
    { category: 'Technical Skills', items: [] },
    { category: 'Tools & Technologies', items: [] }
  ],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
  design: {
    template: 'modern',
    colorTheme: '#2563eb',
    fontFamily: 'inter',
    fontSize: 'md',
    margins: 'normal',
    paperSize: 'a4',
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages'],
    visibleSections: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
      languages: true,
      custom: true
    }
  }
};
