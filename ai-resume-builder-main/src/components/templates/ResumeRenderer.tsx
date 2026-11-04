import React from 'react';
import { ResumeData, FontFamily, MarginsSize, FontSize } from '../../types/resume';
import { 
  Mail, Phone, MapPin, Globe, Linkedin, Github, 
  ExternalLink, Calendar, Award, BookOpen, Briefcase, 
  Code, Sparkles, CheckCircle2 
} from 'lucide-react';

interface ResumeRendererProps {
  data: ResumeData;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({ data }) => {
  const { personalInfo, experiences, education, skills, projects, certifications, languages, customSections, design } = data;

  // Font family class
  const getFontClass = (font: FontFamily) => {
    switch (font) {
      case 'jakarta': return 'font-jakarta';
      case 'merriweather': return 'font-merriweather';
      case 'playfair': return 'font-playfair';
      case 'code': return 'font-code';
      case 'inter':
      default: return 'font-inter';
    }
  };

  // Margins style
  const getPaddingClass = (margins: MarginsSize) => {
    switch (margins) {
      case 'compact': return 'p-6 sm:p-8';
      case 'spacious': return 'p-10 sm:p-14';
      case 'normal':
      default: return 'p-8 sm:p-10';
    }
  };

  // Font size scale
  const getFontSizeClass = (size: FontSize) => {
    switch (size) {
      case 'sm': return 'text-[12px] leading-relaxed';
      case 'lg': return 'text-[14px] leading-relaxed';
      case 'md':
      default: return 'text-[13px] leading-relaxed';
    }
  };

  const primaryColor = design.colorTheme || '#2563eb';

  // Helper to render sections according to design.sectionOrder
  const renderSection = (sectionKey: string, isSidebar = false) => {
    if (!design.visibleSections[sectionKey as keyof typeof design.visibleSections]) {
      return null;
    }

    switch (sectionKey) {
      case 'summary':
        if (!personalInfo.summary) return null;
        return (
          <div key="summary" className="mb-5 page-break-avoid">
            <h2 
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}33` }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">
              {personalInfo.summary}
            </p>
          </div>
        );

      case 'experience':
        if (!experiences || experiences.length === 0) return null;
        return (
          <div key="experience" className="mb-5 page-break-avoid">
            <h2 
              className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}33` }}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Work Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="page-break-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-1 mb-0.5">
                    <span className="font-bold text-slate-900 text-sm">
                      {exp.role || 'Role Title'}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {exp.startDate || 'Start'} – {exp.current ? 'Present' : exp.endDate || 'End'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
                    <span style={{ color: primaryColor }} className="font-semibold">
                      {exp.company}
                    </span>
                    {exp.location && <span className="text-slate-500">{exp.location}</span>}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="leading-snug">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (!education || education.length === 0) return null;
        return (
          <div key="education" className="mb-5 page-break-avoid">
            <h2 
              className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}33` }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="page-break-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </span>
                    <span className="text-xs text-slate-500">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span className="font-medium text-slate-700">{edu.school}</span>
                    {edu.location && <span>{edu.location}</span>}
                  </div>
                  {edu.gpa && (
                    <div className="text-xs text-slate-500 font-medium">
                      GPA: <span className="text-slate-800 font-semibold">{edu.gpa}</span>
                    </div>
                  )}
                  {edu.highlights && edu.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {edu.highlights.map((h, i) => (
                        <span key={i} className="text-[11px] text-slate-600 bg-slate-100 rounded px-1.5 py-0.5">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (!skills || skills.length === 0) return null;
        return (
          <div key="skills" className="mb-5 page-break-avoid">
            <h2 
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}33` }}
            >
              <Code className="w-3.5 h-3.5" />
              Skills & Expertise
            </h2>
            <div className="space-y-2">
              {skills.map((skillGroup, idx) => (
                <div key={idx} className={isSidebar ? 'text-xs' : 'flex flex-wrap items-baseline gap-1.5 text-xs'}>
                  <span className="font-semibold text-slate-800 min-w-32">
                    {skillGroup.category}:
                  </span>
                  <span className="text-slate-700">
                    {skillGroup.items.join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <div key="projects" className="mb-5 page-break-avoid">
            <h2 
              className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}33` }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Featured Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="page-break-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {proj.name}
                      </span>
                      {proj.role && (
                        <span className="text-xs text-slate-500 italic">
                          ({proj.role})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {proj.link && (
                        <a 
                          href={proj.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ color: primaryColor }}
                          className="hover:underline flex items-center gap-0.5"
                        >
                          Live <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                      {proj.github && (
                        <a 
                          href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`}
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-slate-600 hover:text-slate-900 flex items-center gap-0.5"
                        >
                          Code <Github className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  {proj.description && (
                    <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 my-1">
                      {proj.technologies.map((t, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700 text-xs mt-1">
                      {proj.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (!certifications || certifications.length === 0) return null;
        return (
          <div key="certifications" className="mb-5 page-break-avoid">
            <h2 
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}33` }}
            >
              <Award className="w-3.5 h-3.5" />
              Certifications & Credentials
            </h2>
            <div className="space-y-1.5">
              {certifications.map((c) => (
                <div key={c.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-semibold text-slate-800">{c.name}</span>
                    {c.issuer && <span className="text-slate-500"> — {c.issuer}</span>}
                  </div>
                  {c.issueDate && <span className="text-slate-400 text-[11px]">{c.issueDate}</span>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'languages':
        if (!languages || languages.length === 0) return null;
        return (
          <div key="languages" className="mb-4 page-break-avoid">
            <h2 
              className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-1 border-b flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}33` }}
            >
              <Globe className="w-3.5 h-3.5" />
              Languages
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700">
              {languages.map((l, i) => (
                <span key={i}>
                  <strong className="text-slate-900">{l.language}:</strong> {l.proficiency}
                </span>
              ))}
            </div>
          </div>
        );

      case 'custom':
        if (!customSections || customSections.length === 0) return null;
        return (
          <div key="custom" className="space-y-4">
            {customSections.map((sec) => (
              <div key={sec.id} className="mb-4 page-break-avoid">
                <h2 
                  className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
                  style={{ color: primaryColor, borderColor: `${primaryColor}33` }}
                >
                  {sec.title}
                </h2>
                <div className="space-y-2">
                  {sec.items.map((item) => (
                    <div key={item.id} className="text-xs">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{item.title}</span>
                        {item.date && <span className="text-slate-400 font-normal">{item.date}</span>}
                      </div>
                      {item.subtitle && <div className="text-slate-600 italic">{item.subtitle}</div>}
                      {item.description && <p className="text-slate-700 mt-0.5">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // 1. MODERN TEMPLATE (Default)
  const renderModernTemplate = () => (
    <div className="w-full">
      {/* Top accent strip */}
      <div 
        className="h-1.5 w-full rounded-t"
        style={{ backgroundColor: primaryColor }}
      />
      
      {/* Header */}
      <div className="mb-5 pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p 
            className="text-sm sm:text-base font-semibold tracking-wide mb-3"
            style={{ color: primaryColor }}
          >
            {personalInfo.jobTitle}
          </p>
        )}

        {/* Contact links */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" />
              {personalInfo.website.replace(/^https?:\/\//, '')}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3 text-slate-400" />
              {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3 h-3 text-slate-400" />
              {personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
        </div>
      </div>

      {/* Ordered sections */}
      {design.sectionOrder.map((sectionKey) => renderSection(sectionKey))}
    </div>
  );

  // 2. MINIMALIST ATS TEMPLATE (High Scanner Pass Rate)
  const renderMinimalistAtsTemplate = () => (
    <div className="w-full text-slate-900">
      {/* ATS Header - Centered & Standardized */}
      <div className="text-center mb-6 pb-3 border-b-2 border-slate-900">
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-slate-950 mb-1">
          {personalInfo.fullName || 'FULL NAME'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-700 mb-2">
            {personalInfo.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-slate-800">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && <span>• {personalInfo.email}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>

      {design.sectionOrder.map((sectionKey) => renderSection(sectionKey))}
    </div>
  );

  // 3. EXECUTIVE TEMPLATE (Serif Elegance)
  const renderExecutiveTemplate = () => (
    <div className="w-full text-slate-900 font-merriweather">
      {/* Executive Header */}
      <div className="text-center mb-6 pb-4 border-b border-slate-300">
        <h1 className="text-2xl sm:text-3xl font-normal tracking-wide text-slate-950 mb-1">
          {personalInfo.fullName || 'Full Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p 
            className="text-xs tracking-widest uppercase font-semibold mb-2"
            style={{ color: primaryColor }}
          >
            {personalInfo.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-600 font-sans">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.location && <span>| {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
        </div>
      </div>

      {design.sectionOrder.map((sectionKey) => renderSection(sectionKey))}
    </div>
  );

  // 4. TECH TEMPLATE (Code & Monospace touches)
  const renderTechTemplate = () => (
    <div className="w-full">
      {/* Modern Developer Header */}
      <div className="bg-slate-900 text-white p-5 rounded-lg mb-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono text-emerald-400 mb-0.5">$ cat candidate_profile.json</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {personalInfo.fullName || 'Alex Developer'}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-300 mt-0.5">
              {personalInfo.jobTitle || 'Software Engineer'}
            </p>
          </div>
          <div className="flex flex-col text-xs space-y-1 text-slate-300 font-mono">
            {personalInfo.email && <span>✉ {personalInfo.email}</span>}
            {personalInfo.github && <span>⌘ {personalInfo.github}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          </div>
        </div>
      </div>

      {design.sectionOrder.map((sectionKey) => renderSection(sectionKey))}
    </div>
  );

  // 5. TWO-COLUMN TEMPLATE
  const renderTwoColumnTemplate = () => (
    <div className="w-full">
      {/* Header spanning top */}
      <div className="mb-6 pb-3 border-b-2 border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-sm font-semibold" style={{ color: primaryColor }}>
          {personalInfo.jobTitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column (35%) */}
        <div className="md:col-span-4 bg-slate-50/70 p-4 rounded-lg space-y-4 border border-slate-200/60">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Contact Details
            </h3>
            <div className="space-y-1.5 text-xs text-slate-600">
              {personalInfo.email && <div className="break-all">{personalInfo.email}</div>}
              {personalInfo.phone && <div>{personalInfo.phone}</div>}
              {personalInfo.location && <div>{personalInfo.location}</div>}
              {personalInfo.website && <div className="break-all">{personalInfo.website}</div>}
              {personalInfo.linkedin && <div className="break-all">{personalInfo.linkedin}</div>}
              {personalInfo.github && <div className="break-all">{personalInfo.github}</div>}
            </div>
          </div>

          {renderSection('skills', true)}
          {renderSection('education', true)}
          {renderSection('certifications', true)}
          {renderSection('languages', true)}
        </div>

        {/* Right Column (65%) */}
        <div className="md:col-span-8 space-y-4">
          {renderSection('summary')}
          {renderSection('experience')}
          {renderSection('projects')}
          {renderSection('custom')}
        </div>
      </div>
    </div>
  );

  // 6. CREATIVE ACCENT TEMPLATE
  const renderCreativeTemplate = () => (
    <div className="w-full">
      {/* Creative Header Banner */}
      <div 
        className="text-white p-6 rounded-xl mb-6 shadow-md"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, #0f172a)` }}
      >
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        <p className="text-sm sm:text-base font-medium opacity-90 mb-3">
          {personalInfo.jobTitle || 'Creative Professional'}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-90">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website ? (
            <span>• {personalInfo.website}</span>
          ) : null}
        </div>
      </div>

      {design.sectionOrder.map((sectionKey) => renderSection(sectionKey))}
    </div>
  );

  const renderActiveTemplate = () => {
    switch (design.template) {
      case 'minimalist':
        return renderMinimalistAtsTemplate();
      case 'executive':
        return renderExecutiveTemplate();
      case 'tech':
        return renderTechTemplate();
      case 'twocolumn':
        return renderTwoColumnTemplate();
      case 'creative':
        return renderCreativeTemplate();
      case 'modern':
      default:
        return renderModernTemplate();
    }
  };

  return (
    <div 
      id="resume-document"
      className={`bg-white text-slate-800 transition-all duration-150 shadow-2xl rounded-sm ${getFontClass(design.fontFamily)} ${getPaddingClass(design.margins)} ${getFontSizeClass(design.fontSize)}`}
      style={{
        width: '100%',
        maxWidth: design.paperSize === 'letter' ? '8.5in' : '210mm',
        minHeight: design.paperSize === 'letter' ? '11in' : '297mm',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {renderActiveTemplate()}
    </div>
  );
};
