import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { locales } from '../locales';
import './Experience.css';

export default function Experience({ language }) {
  const t = locales[language]?.experience || locales['UZ'].experience;
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(window.API_BASE_URL + '/api/experiences/')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error('Error fetching experiences:', err));
  }, []);

  const displayLang = language.toLowerCase() === 'eng' ? 'en' : language.toLowerCase();

  return (
    <section className="experience-section" id="experience">
      <div className="container">
        {/* Section Header */}
        <div className="experience-header">
          <h2 className="experience-title">{t.title}</h2>
        </div>

        {/* Timeline */}
        {jobs.length > 0 && (
          <div className="experience-timeline">
            {jobs.map((job, index) => {
              const displayRole = job[`role_${displayLang}`] || job.role;
              const displayCompany = job[`company_${displayLang}`] || job.company;
              const displayDesc = job[`desc_${displayLang}`] || job.desc;
              return (
                <div
                  key={job.id || index}
                  className={`timeline-item timeline-item-${index % 2 === 0 ? 'right' : 'left'}`}
                >
                  {/* Icon badge centered on the vertical line */}
                  <div className="timeline-badge">
                    <Briefcase size={16} />
                  </div>

                  <div className="timeline-card">
                    <div className="timeline-card-header">
                      {job.logo && (
                        <div className="timeline-logo-wrapper">
                          <img src={job.logo} alt={displayCompany} className="timeline-company-logo" />
                        </div>
                      )}
                      <div className="timeline-header-text">
                        {/* Period */}
                        <span className="timeline-period">{job.period.replace("Hozirgi vaqtgacha", "hozir davom etyapti")}</span>

                        {/* Role */}
                        <h3 className="timeline-role">{displayRole}</h3>

                        {/* Company */}
                        <span className="timeline-company">{displayCompany}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="timeline-desc">{displayDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
