import React, { useState } from 'react';
import { Send, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { locales } from '../locales';
import './Contact.css';

export default function Contact({ language }) {
  const t = locales[language]?.contact || locales['UZ'].contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(window.API_BASE_URL + '/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowSuccessAlert(true);
        setFormData({
          name: '',
          email: '',
          company: '',
          role: '',
          message: ''
        });
      } else {
        setShowErrorAlert(true);
      }
    } catch (err) {
      console.error(err);
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="container contact-container">
        {/* Left Side: Glassmorphic Contact Form */}
        <div className="contact-form-wrap">

          <h2 className="contact-title">{t.title}</h2>
          <p className="contact-desc">{t.desc}</p>

          <form onSubmit={handleSubmit} className="contact-form">
            {/* Row 1: Name and Email */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-input-label">{t.fields.name}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Feruzxon"
                  className="contact-input"
                />
              </div>
              <div className="form-group">
                <label className="form-input-label">{t.fields.email}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="fmuxtorov6@gmail.com"
                  className="contact-input"
                />
              </div>
            </div>

            {/* Row 2: Company and Role */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-input-label">{t.fields.company}</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Media Up"
                  className="contact-input"
                />
              </div>
              <div className="form-group">
                <label className="form-input-label">{t.fields.role}</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Art Director"
                  className="contact-input"
                />
              </div>
            </div>

            {/* Row 3: Message */}
            <div className="form-group full-width">
              <label className="form-input-label">{t.fields.message}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="..."
                className="contact-textarea"
              />
            </div>

            {/* Glowing Send Button */}
            <button type="submit" className="contact-btn-submit" disabled={loading}>
              <Send size={16} />
              <span>{loading ? '...' : t.btnSend}</span>
            </button>
          </form>
        </div>


        {/* Right Side: Contact Info Cards */}
        <div className="contact-info-wrap">
          <h3 className="contacts-heading">{t.contactsTitle}</h3>

          <div className="contact-cards-list">
            {/* Telegram Card */}
            <a
              href="https://t.me/des_one"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-info-card"
            >
              <div className="contact-card-icon-wrap telegram-icon-bg">
                <Send size={18} className="contact-card-icon-svg" />
              </div>
              <div className="contact-card-text">
                <span className="contact-card-category">TELEGRAM</span>
                <span className="contact-card-value">@des_one</span>
              </div>
            </a>

            {/* Email Card */}
            <a
              href="mailto:fmuxtorov6@gmail.com"
              className="contact-info-card"
            >
              <div className="contact-card-icon-wrap email-icon-bg">
                <Mail size={18} className="contact-card-icon-svg" />
              </div>
              <div className="contact-card-text">
                <span className="contact-card-category">EMAIL</span>
                <span className="contact-card-value">fmuxtorov6@gmail.com</span>
              </div>
            </a>

            {/* LinkedIn Card */}
            <a
              href="https://linkedin.com/in/feruzxon-muxtarov"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-info-card"
            >
              <div className="contact-card-icon-wrap linkedin-icon-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="contact-card-icon-svg" style={{ width: '18px', height: '18px' }}>
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div className="contact-card-text">
                <span className="contact-card-category">LINKEDIN</span>
                <span className="contact-card-value">feruzxon-muxtarov</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Success Alert Modal */}
      {showSuccessAlert && (
        <div className="contact-alert-overlay" onClick={() => setShowSuccessAlert(false)}>
          <div className="contact-alert-card" onClick={(e) => e.stopPropagation()}>
            <div className="contact-alert-glow" />
            <div className="contact-alert-icon-wrap">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="contact-alert-title">
              {language === 'UZ' ? 'Murojaatingiz qabul qilindi!' : 'Message Received!'}
            </h3>
            <p className="contact-alert-message">
              {language === 'UZ' 
                ? 'Siz bilan tez orada bog\'lanamiz. E\'tiboringiz uchun rahmat!' 
                : 'Thank you for reaching out. We will get back to you shortly.'}
            </p>
            <button className="contact-alert-btn" onClick={() => setShowSuccessAlert(false)}>
              {language === 'UZ' ? 'Yopish' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Error Alert Modal */}
      {showErrorAlert && (
        <div className="contact-alert-overlay" onClick={() => setShowErrorAlert(false)}>
          <div className="contact-alert-card" onClick={(e) => e.stopPropagation()}>
            <div className="contact-alert-glow" style={{ background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.08) 0%, transparent 60%)' }} />
            <div className="contact-alert-icon-wrap error-alert">
              <AlertCircle size={32} />
            </div>
            <h3 className="contact-alert-title">
              {language === 'UZ' ? 'Xatolik yuz berdi' : 'An Error Occurred'}
            </h3>
            <p className="contact-alert-message">
              {language === 'UZ' 
                ? 'Xabarni yuborishda muammo yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.' 
                : 'Something went wrong while sending the message. Please try again later.'}
            </p>
            <button className="contact-alert-btn error-alert-btn" onClick={() => setShowErrorAlert(false)}>
              {language === 'UZ' ? 'Yopish' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
