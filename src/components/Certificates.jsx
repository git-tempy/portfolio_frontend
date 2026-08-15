import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, X, ZoomIn, ZoomOut, Download, FileText } from 'lucide-react';
import { locales } from '../locales';
import './Certificates.css';

const Certificates = ({ language }) => {
  const t = locales[language];
  const [selectedCert, setSelectedCert] = useState(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (selectedCert) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [selectedCert]);

  const [certsList, setCertsList] = useState([]);

  useEffect(() => {
    fetch(window.API_BASE_URL + '/api/certificates/')
      .then(res => res.json())
      .then(data => setCertsList(data))
      .catch(err => console.error('Error loading certificates:', err));
  }, []);

  const getTranslatedTitle = (cert) => {
    if (!cert) return '';
    const lang = language.toUpperCase();
    if (lang === 'UZ') return cert.title_uz || cert.title;
    if (lang === 'RU') return cert.title_ru || cert.title;
    if (lang === 'ENG') return cert.title_en || cert.title;
    if (lang === 'JP') return cert.title_jp || cert.title;
    return cert.title;
  };

  return (
    <section id="certificates" className="certificates-section">
      <div className="container">
        {/* Section Heading */}
        <h2 className="section-title">{t.certificates.title}</h2>

        {/* Certificates Grid (3 columns) */}
        <div className="certs-grid">
          {certsList.map((cert, index) => {
            const displayTitle = getTranslatedTitle(cert);
            return (
              <div key={cert.id} className={`cert-card cert-card-${index + 1}`}>
                {/* Image / Placeholder Container */}
                <div className="cert-img-container">
                  {cert.image ? (
                    <img src={cert.image} alt={displayTitle} className="cert-img" />
                  ) : cert.file && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cert.file) ? (
                    <img src={cert.file} alt={displayTitle} className="cert-img" />
                  ) : (
                    <div className="cert-placeholder">
                      {/* Glowing Award Emblem */}
                      <Award className="cert-placeholder-badge" />
                      
                      {/* Abstract Dummy Lines representing certificate text */}
                      <div className="cert-placeholder-line-lg"></div>
                      <div className="cert-placeholder-line-md"></div>
                      <div className="cert-placeholder-line-sm"></div>
                      
                      {/* Dashed Circular Seal Stamp */}
                      <div className="cert-placeholder-seal"></div>
                    </div>
                  )}
                </div>

                {/* Title & Icon */}
                <div className="cert-info">
                  <Award />
                  <span>{displayTitle}</span>
                </div>

                {/* Action Button (View Only) */}
                <div className="cert-actions">
                  <button
                    onClick={() => {
                      setSelectedCert(cert);
                      setZoom(100);
                    }}
                    className="cert-btn-view"
                  >
                    <span>{t.certificates.view}</span>
                    <ExternalLink />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedCert && (() => {
        const displayTitle = getTranslatedTitle(selectedCert);
        return (
          <div className="pdf-modal-overlay" onClick={() => setSelectedCert(null)}>
            <div className="pdf-modal-container" onClick={(e) => e.stopPropagation()}>
              {/* Toolbar */}
              <div className="pdf-modal-toolbar">
                <div className="pdf-modal-fileinfo">
                  <FileText className="pdf-icon" />
                  <span className="pdf-filename">{displayTitle}</span>
                </div>
                
                <div className="pdf-modal-zoom-controls">
                  <button 
                    onClick={() => setZoom(prev => Math.max(50, prev - 10))}
                    className="zoom-btn"
                    title="Zoom Out"
                  >
                    <ZoomOut />
                  </button>
                  <span className="zoom-text">{zoom}%</span>
                  <button 
                    onClick={() => setZoom(prev => Math.min(150, prev + 10))}
                    className="zoom-btn"
                    title="Zoom In"
                  >
                    <ZoomIn />
                  </button>
                </div>
                
                <div className="pdf-modal-actions">
                  <button 
                    onClick={() => setSelectedCert(null)}
                    className="pdf-action-btn close-btn"
                    title="Close"
                  >
                    <X />
                  </button>
                </div>
              </div>
              
              {/* Canvas Area */}
              <div className="pdf-modal-canvas" onContextMenu={(e) => e.preventDefault()}>
                <div 
                  className="pdf-page-container" 
                  style={{ 
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center'
                  }}
                >
                  <div className="pdf-page-wrapper">
                    {selectedCert.image ? (
                      <img 
                        src={selectedCert.image} 
                        alt={displayTitle} 
                        className="pdf-page-image" 
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : selectedCert.file && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(selectedCert.file) ? (
                      <img 
                        src={selectedCert.file} 
                        alt={displayTitle} 
                        className="pdf-page-image" 
                        onContextMenu={(e) => e.preventDefault()}
                      />
                    ) : selectedCert.file ? (
                      <iframe 
                        src={`${selectedCert.file}#toolbar=0&navpanes=0`} 
                        style={{ width: '100%', height: '100%', minHeight: '550px', border: 'none' }} 
                        title={displayTitle}
                      />
                    ) : (
                      /* High Fidelity Ornate Certificate Mockup */
                      <div className="pdf-page-fallback">
                        <div className="fallback-border-outer">
                          <div className="fallback-border-inner">
                            <Award className="fallback-badge" />
                            <h3 className="fallback-cert-type">CERTIFICATE OF ACHIEVEMENT</h3>
                            <p className="fallback-presented">This certificate is proudly presented to</p>
                            <h4 className="fallback-recipient">Feruzxon Muxtarov</h4>
                            <div className="fallback-line"></div>
                            <p className="fallback-course-desc">for successfully completing the professional course of study in</p>
                            <h5 className="fallback-course-title">{displayTitle}</h5>
                            <p className="fallback-issuer">Issued by Google UX Design Program</p>
                            <div className="fallback-signatures">
                              <div className="signature-block">
                                <span className="sig-line">____________________</span>
                                <span className="sig-label">Instructor</span>
                              </div>
                              <div className="signature-block">
                                <span className="sig-line">____________________</span>
                                <span className="sig-label">Program Director</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Security Overlay to block dragging and context menus - only for images */}
                    {(selectedCert.image || (selectedCert.file && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(selectedCert.file))) && (
                      <div className="pdf-security-overlay" onContextMenu={(e) => e.preventDefault()}></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
};

export default React.memo(Certificates);
