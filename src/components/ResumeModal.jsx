import { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, FileText, Download, Printer, User, Phone, Mail, FileQuestion } from 'lucide-react';
import './ResumeModal.css';

const localizedResume = {
  UZ: {
    filename: "Feruzxon_Muxtarov_Rezyume.pdf",
    page: "Sahifa",
    profileTitle: "PROFIL",
    profileText: "Ijodkor dizayner va art direktor. 5 yildan ortiq vaqt davomida brendlar uchun vizual identitet, raqamli mahsulotlar va marketing materiallarini yarataman. Maqsadim — har bir loyihaga estetika, ma'no va aniqlik kiritish.",
    experienceTitle: "ISH TAJRIBASI",
    educationTitle: "TA'LIM",
    edu1: "Toshkent Axborot Texnologiyalari Universiteti",
    edu1Sub: "Kompyuter muhandisligi | 2017 - 2021",
    edu2: "Google UX Design Professional Certificate",
    edu2Sub: "Coursera | 2022",
    skillsTitle: "KO'NIKMALAR",
    contactTitle: "BOG'LANISH",
    jobs: [
      {
        role: "Art Director",
        company: "Media Up Agency",
        period: "2023 - Hozirgacha",
        achievements: [
          "15 dan ortiq yirik brendlar uchun vizual strategiya va brending loyihalarini boshqarish.",
          "Dizaynerlar jamoasini boshqarish, topshiriqlarni taqsimlash va ijodiy yo'nalishni nazorat qilish.",
          "Ijtimoiy tarmoqlar va reklama kampaniyalari uchun yuqori darajadagi kontent dizaynlarini yaratish."
        ]
      },
      {
        role: "Senior UI/UX Designer",
        company: "Casy Studio",
        period: "2021 - 2023",
        achievements: [
          "Fintech va SaaS mahsulotlari uchun qulay interfeys (UI/UX) loyihalarini tayyorlash.",
          "Foydalanuvchilar o'rtasida tadqiqotlar o'tkazish, prototiplar va wireframe'lar yaratish.",
          "Loyiha konversiyasini yaxshilash maqsadida interfeyslarni A/B testdan o'tkazish."
        ]
      },
      {
        role: "Junior Graphic Designer",
        company: "Freelance",
        period: "2019 - 2021",
        achievements: [
          "Logo dizayni, brending elementlari va poligrafiya (vizitka, broshyura) ishlarini yaratish.",
          "Mijozlar bilan bevosita muzokaralar olib borish va talablarni shakllantirish."
        ]
      }
    ],
    downloadTitle: "Yuklab olish so'rovi",
    downloadSubtitle: "Rezyumeni yuklab olish uchun quyidagi shaklni to'ldiring",
    fieldName: "Ism va Familya",
    fieldPhone: "Telefon raqami",
    fieldEmail: "Email manzili",
    fieldPurpose: "Yuklab olish maqsadi",
    placeholderName: "Feruzxon Muxtarov",
    placeholderPhone: "+998 90 123 45 67",
    placeholderEmail: "misol@gmail.com",
    placeholderPurpose: "Masalan: Ishga taklif qilish",
    btnSubmit: "Tasdiqlash va yuklab olish",
    btnCancel: "Bekor qilish",
    submitting: "Yuklab olinmoqda...",
  },
  ENG: {
    filename: "Feruzxon_Muxtarov_Resume.pdf",
    page: "Page",
    profileTitle: "PROFILE",
    profileText: "Creative designer and art director with over 5 years of experience in creating visual identity, digital products, and marketing assets for brands. Dedicated to bringing aesthetics, meaning, and precision to every project.",
    experienceTitle: "WORK EXPERIENCE",
    educationTitle: "EDUCATION",
    edu1: "Tashkent University of Information Technologies",
    edu1Sub: "Computer Engineering | 2017 - 2021",
    edu2: "Google UX Design Professional Certificate",
    edu2Sub: "Coursera | 2022",
    skillsTitle: "SKILLS",
    contactTitle: "CONTACT",
    jobs: [
      {
        role: "Art Director",
        company: "Media Up Agency",
        period: "2023 - Present",
        achievements: [
          "Led visual strategy and branding campaigns for 15+ major corporate clients.",
          "Managed a design team, delegated tasks, and oversaw overall creative direction.",
          "Created top-tier marketing designs and visual graphics for social campaigns."
        ]
      },
      {
        role: "Senior UI/UX Designer",
        company: "Casy Studio",
        period: "2021 - 2023",
        achievements: [
          "Designed comprehensive user interfaces (UI/UX) for Fintech and SaaS portals.",
          "Conducted user research, defined personas, and built interactive wireframes.",
          "Improved checkout conversions by 18% through targeted interface A/B testing."
        ]
      },
      {
        role: "Junior Graphic Designer",
        company: "Freelance",
        period: "2019 - 2021",
        achievements: [
          "Designed logos, vector branding assets, and print catalogs (brochures, business cards).",
          "Managed freelance projects, negotiated contracts, and gathered detailed requirements."
        ]
      }
    ],
    downloadTitle: "Download Request",
    downloadSubtitle: "Please fill in the form below to download the CV",
    fieldName: "Full Name",
    fieldPhone: "Phone Number",
    fieldEmail: "Email Address",
    fieldPurpose: "Download Purpose",
    placeholderName: "John Doe",
    placeholderPhone: "+1 234 567 8900",
    placeholderEmail: "example@gmail.com",
    placeholderPurpose: "e.g., Job offer / Recruitment",
    btnSubmit: "Confirm & Download",
    btnCancel: "Cancel",
    submitting: "Downloading...",
  },
  RU: {
    filename: "Feruzxon_Muxtarov_Резюме.pdf",
    page: "Страница",
    profileTitle: "ПРОФИЛЬ",
    profileText: "Креативный дизайнер и арт-директор с более чем 5-летним опытом разработки визуального стиля, цифровых продуктов и маркетинговых материалов. Моя цель — привносить эстетику, смысл и точность в каждый проект.",
    experienceTitle: "ОПЫТ РАБОТЫ",
    educationTitle: "ОБРАЗОВАНИЕ",
    edu1: "Ташкентский Университет Информационных Технологий",
    edu1Sub: "Компьютерная инженерия | 2017 - 2021",
    edu2: "Google UX Design Professional Certificate",
    edu2Sub: "Coursera | 2022",
    skillsTitle: "НАВЫКИ",
    contactTitle: "КОНТАКТЫ",
    jobs: [
      {
        role: "Арт-директор",
        company: "Media Up Agency",
        period: "2023 - н.в.",
        achievements: [
          "Руководство визуальной стратегией и брендингом для 15+ крупных корпоративных клиентов.",
          "Управление командой дизайнеров, распределение задач и контроль креативного направления.",
          "Разработка высококачественного графического контента для социальных медиа."
        ]
      },
      {
        role: "Senior UI/UX Дизайнер",
        company: "Casy Studio",
        period: "2021 - 2023",
        achievements: [
          "Создание пользовательских интерфейсов (UI/UX) для Fintech и SaaS систем.",
          "Проведение пользовательских исследований, создание интерактивных прототипов.",
          "Повышение конверсии интерфейсов благодаря проведению A/B-тестирования."
        ]
      },
      {
        role: "Junior Графический Дизайнер",
        company: "Freelance",
        period: "2019 - 2021",
        achievements: [
          "Разработка логотипов, фирменного стиля и полиграфии (визитки, буклеты).",
          "Работа напрямую с заказчиками, формирование технических заданий."
        ]
      }
    ],
    downloadTitle: "Запрос на скачивание",
    downloadSubtitle: "Заполните форму ниже, чтобы скачать резюме",
    fieldName: "Имя и Фамилия",
    fieldPhone: "Номер телефона",
    fieldEmail: "Email адрес",
    fieldPurpose: "Цель скачивания",
    placeholderName: "Иван Иванов",
    placeholderPhone: "+7 999 123 45 67",
    placeholderEmail: "example@mail.ru",
    placeholderPurpose: "Например: Предложение о работе",
    btnSubmit: "Подтвердить и скачать",
    btnCancel: "Отмена",
    submitting: "Скачивание...",
  },
  JP: {
    filename: "Feruzxon_Muxtarov_履歴書.pdf",
    page: "ページ",
    profileTitle: "プロフィール",
    profileText: "5年以上のデザイン制作及びアートディレクション経験を持つデザイナー。ブランドの魅力を最大化するビジュアルアイデンティティ、デジタル製品、マーケティングクリエイティブを作成。細部にまでこだわり、美学と機能性を兼ね備えた設計を提供します。",
    experienceTitle: "職歴",
    educationTitle: "学歴",
    edu1: "タシュケント情報技術大学",
    edu1Sub: "コンピュータ工学科卒 | 2017 - 2021",
    edu2: "Google UX Design Professional Certificate",
    edu2Sub: "Coursera | 2022",
    skillsTitle: "スキル",
    contactTitle: "連絡先",
    jobs: [
      {
        role: "アートディレクター",
        company: "Media Up Agency",
        period: "2023 - 現在",
        achievements: [
          "15社以上の主要クライアントのビジュアル戦略及びブランディングを統括。",
          "デザイナーチーム of マネジメント、進捗管理、及び制作物の最終審査を実施。",
          "SNS及び広告キャンペーン向けに高品質なクリエイティブ及びグラフィックを制作。"
        ]
      },
      {
        role: "シニア UI/UX デザイナー",
        company: "Casy Studio",
        period: "2021 - 2023",
        achievements: [
          "フィンテック及びSaaS製品向けのUI/UX画面設計を担当。",
          "ユーザーリサーチ、ペルソナ策定、及びプロトタイプ作成プロセスの実行。",
          "インターフェース of A/Bテストを実施し、コンバージョン率を18%改善。"
        ]
      },
      {
        role: "ジュニア グラフィックデザイナー",
        company: "フリーランス",
        period: "2019 - 2021",
        achievements: [
          "ロゴ、名刺、パンフレットなどのDTP・グラフィックデザインの制作。",
          "直接クライアントと要件定義やヒアリング交渉を実施。"
        ]
      }
    ],
    downloadTitle: "ダウンロード申請",
    downloadSubtitle: "履歴書をダウンロードするには、以下のフォームをご入力ください",
    fieldName: "氏名（フルネーム）",
    fieldPhone: "電話番号",
    fieldEmail: "メールアドレス",
    fieldPurpose: "ダウンロードの目的",
    placeholderName: "山田 太郎",
    placeholderPhone: "090-1234-5678",
    placeholderEmail: "example@gmail.com",
    placeholderPurpose: "例：求人オファー・採用検討のため",
    btnSubmit: "確認してダウンロード",
    btnCancel: "キャンセル",
    submitting: "ダウンロード中...",
  }
};

export default function ResumeModal({ language, onClose, resumeUrl }) {
  const t = localizedResume[language] || localizedResume['UZ'];
  const [zoom, setZoom] = useState(100);
  const [showDownloadForm, setShowDownloadForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', purpose: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lock background scroll on mount
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Auto-fit height logic
  useEffect(() => {
    const handleResize = () => {
      const workspace = document.querySelector('.pdf-document-workspace');
      if (workspace) {
        // Subtract workspace padding (2.5rem top/bottom = 80px)
        const workspaceHeight = workspace.clientHeight - 80;
        // Base sheet height is 1130px
        const fitZoom = Math.floor((workspaceHeight / 1130) * 100);
        // Clamp default fit zoom between 45% and 100%
        setZoom(Math.max(45, Math.min(100, fitZoom)));
      }
    };

    const timer = setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(150, prev + 10));
  const handleZoomOut = () => setZoom(prev => Math.max(40, prev - 10));

  const handleDownloadSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(window.API_BASE_URL + '/api/resume-downloads/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        throw new Error('Server error logging the resume download request.');
      }
      
      // Trigger the real file download from the public assets or uploaded PDF
      const link = document.createElement('a');
      link.href = resumeUrl || '/Feruzxon_Muxtarov_CV.pdf';
      link.download = resumeUrl ? resumeUrl.split('/').pop() : 'Feruzxon_Muxtarov_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset form fields
      setFormData({ name: '', phone: '', email: '', purpose: '' });
      setShowDownloadForm(false);
    } catch (err) {
      console.error(err);
      alert(language === 'UZ' ? 'Tizimda xatolik yuz berdi. Iltimos qayta urinib ko\'ring.' : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="resume-modal-overlay">
      {/* Dark PDF Viewer Frame Container */}
      <div className="pdf-viewer-window">
        
        {/* PDF Top Bar Toolbar */}
        <header className="pdf-viewer-header">
          <div className="pdf-header-left">
            <FileText size={18} className="pdf-icon" />
            <span className="pdf-filename">{t.filename}</span>
          </div>

          <div className="pdf-header-center">
            <span className="page-counter">{t.page} 1 / 1</span>
            <div className="zoom-controls">
              <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out">
                <ZoomOut size={16} />
              </button>
              <span className="zoom-percentage">{zoom}%</span>
              <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In">
                <ZoomIn size={16} />
              </button>
            </div>
          </div>

          <div className="pdf-header-right">
            {/* Active download button */}
            <button 
              className="header-action-icon active-download-action" 
              onClick={() => setShowDownloadForm(true)} 
              title="Download PDF"
            >
              <Download size={16} />
            </button>
            <button className="header-action-icon disabled-action" title="Print Disabled">
              <Printer size={16} />
            </button>
            <button className="header-close-btn" onClick={onClose} title="Close PDF">
              <X size={18} />
            </button>
          </div>
        </header>

        {/* PDF Body Container */}
        <div className="pdf-viewer-body">
          {/* Sidebar Thumbnail */}
          <aside className="pdf-sidebar-thumbnails">
            <div className="thumbnail-card active-thumb">
              <div className="thumbnail-mini-page">
                <div className="mini-line header-mini"></div>
                <div className="mini-line body-mini"></div>
                <div className="mini-line body-mini"></div>
              </div>
              <span className="thumb-page-num">1</span>
            </div>
          </aside>

          {/* Main Document Workspace */}
          <div className="pdf-document-workspace" style={resumeUrl ? { padding: 0, overflow: 'hidden' } : {}}>
            {resumeUrl ? (
              <iframe 
                src={`${resumeUrl}#toolbar=0&navpanes=0`} 
                style={{ width: '100%', height: '100%', border: 'none', background: '#323639' }}
                title="Resume PDF"
              />
            ) : (
              <div 
                className="pdf-page-scale-wrapper"
                style={{
                  width: `${800 * (zoom / 100)}px`,
                  height: `${1130 * (zoom / 100)}px`,
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start'
                }}
              >
                <div 
                  className="pdf-page-canvas" 
                  style={{ 
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                    width: '800px',
                    height: '1130px',
                    margin: 0
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {/* Overlay blocking text drag and right click save */}
                  <div className="pdf-security-overlay"></div>

                  {/* Styled Vector CV/Resume Layout */}
                  <div className="resume-sheet">
                    
                    {/* CV Header */}
                    <header className="resume-sheet-header">
                      <div className="header-main-info">
                        <h1 className="resume-name">Feruzxon Muxtarov</h1>
                        <h2 className="resume-role">Art Director & Senior UI/UX Designer</h2>
                      </div>
                      <div className="header-contacts">
                        <span>Tashkent, Uzbekistan</span>
                        <span>fmuxtorov6@gmail.com</span>
                        <span>t.me/des_one</span>
                        <span>www.behance.net/desone</span>
                      </div>
                    </header>

                    <div className="resume-sheet-divider"></div>

                    {/* CV Body Columns */}
                    <div className="resume-sheet-body">
                      
                      {/* Left Column: Profile & Skills */}
                      <div className="resume-left-col">
                        <section className="resume-section">
                          <h3 className="resume-sec-title">{t.profileTitle}</h3>
                          <p className="resume-profile-desc">{t.profileText}</p>
                        </section>

                        <section className="resume-section">
                          <h3 className="resume-sec-title">{t.skillsTitle}</h3>
                          <ul className="resume-bullets-list">
                            <li>Figma (UI/UX, prototyping, design systems)</li>
                            <li>Adobe Creative Suite (Illustrator, Photoshop, InDesign)</li>
                            <li>Brand Identity & Guideline Development</li>
                            <li>Web Design (Responsive Layouts, Landing Pages)</li>
                            <li>Team Leadership & Creative Direction</li>
                            <li>Typography & Print Graphics</li>
                          </ul>
                        </section>

                        <section className="resume-section">
                          <h3 className="resume-sec-title">{t.educationTitle}</h3>
                          <div className="education-block">
                            <h4 className="edu-name">{t.edu1}</h4>
                            <span className="edu-sub">{t.edu1Sub}</span>
                          </div>
                          <div className="education-block" style={{ marginTop: '0.75rem' }}>
                            <h4 className="edu-name">{t.edu2}</h4>
                            <span className="edu-sub">{t.edu2Sub}</span>
                          </div>
                        </section>
                      </div>

                      {/* Right Column: Experience */}
                      <div className="resume-right-col">
                        <section className="resume-section">
                          <h3 className="resume-sec-title">{t.experienceTitle}</h3>
                          
                          <div className="experience-timeline">
                            {t.jobs.map((job, index) => (
                              <div className="timeline-item" key={index}>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                  <div className="timeline-header">
                                    <h4 className="timeline-job-title">{job.role}</h4>
                                    <span className="timeline-job-period">{job.period}</span>
                                  </div>
                                  <span className="timeline-job-company">{job.company}</span>
                                  <ul className="timeline-achievements">
                                    {job.achievements.map((ach, achIndex) => (
                                      <li key={achIndex}>{ach}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>

                    </div>

                    {/* Secure Watermark Footer */}
                    <footer className="resume-sheet-footer">
                      <span>Feruzxon Muxtarov — Art Director & Designer Portfolio CV</span>
                      <span>Generated Securely via desone portal</span>
                    </footer>

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Floating Glassmorphic Download Form Modal */}
      {showDownloadForm && (
        <div className="resume-download-form-overlay" onClick={() => setShowDownloadForm(false)}>
          <div className="resume-download-form-card" onClick={(e) => e.stopPropagation()}>
            <button className="form-close-btn" onClick={() => setShowDownloadForm(false)}>
              <X size={16} />
            </button>

            <div className="form-card-header">
              <div className="form-icon-orb">
                <Download size={22} className="download-icon-glow" />
              </div>
              <h3>{t.downloadTitle}</h3>
              <p>{t.downloadSubtitle}</p>
            </div>

            <form onSubmit={handleDownloadSubmit} className="download-form-fields">
              {/* Full Name */}
              <div className="form-input-field-group">
                <label><User size={14} /> <span>{t.fieldName}</span></label>
                <input 
                  type="text" 
                  required 
                  placeholder={t.placeholderName}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              {/* Phone Number */}
              <div className="form-input-field-group">
                <label><Phone size={14} /> <span>{t.fieldPhone}</span></label>
                <input 
                  type="tel" 
                  required 
                  placeholder={t.placeholderPhone}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              {/* Email Address */}
              <div className="form-input-field-group">
                <label><Mail size={14} /> <span>{t.fieldEmail}</span></label>
                <input 
                  type="email" 
                  required 
                  placeholder={t.placeholderEmail}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              {/* Purpose of download */}
              <div className="form-input-field-group">
                <label><FileQuestion size={14} /> <span>{t.fieldPurpose}</span></label>
                <textarea 
                  required 
                  rows={3}
                  placeholder={t.placeholderPurpose}
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              {/* Buttons */}
              <div className="form-buttons-row">
                <button 
                  type="button" 
                  className="cancel-btn-form" 
                  onClick={() => setShowDownloadForm(false)}
                  disabled={isSubmitting}
                >
                  {t.btnCancel}
                </button>
                <button 
                  type="submit" 
                  className="submit-btn-form" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="form-spinner"></div>
                      <span>{t.submitting}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.btnSubmit}</span>
                      <Download size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
