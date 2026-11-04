export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  role: string;
  technologies: string[];
  link: string;
  github: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialUrl: string;
}

export interface LanguageItem {
  language: string;
  proficiency: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  bullets: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export type TemplateId = 'modern' | 'minimalist' | 'executive' | 'tech' | 'twocolumn' | 'creative';
export type FontFamily = 'inter' | 'jakarta' | 'merriweather' | 'playfair' | 'code';
export type MarginsSize = 'compact' | 'normal' | 'spacious';
export type FontSize = 'sm' | 'md' | 'lg';

export interface ResumeDesign {
  template: TemplateId;
  colorTheme: string;
  fontFamily: FontFamily;
  fontSize: FontSize;
  margins: MarginsSize;
  paperSize: 'a4' | 'letter';
  sectionOrder: string[];
  visibleSections: {
    summary: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    certifications: boolean;
    languages: boolean;
    custom: boolean;
  };
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  customSections: CustomSection[];
  design: ResumeDesign;
}
