import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Cpu, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  Eye, 
  CheckCircle2, 
  Bell, 
  Sliders,
  Award,
  User,
  History,
  Download,
  Upload,
  ChevronDown,
  ChevronRight,
  Layers,
  Folder,
  FileText,
  GraduationCap,
  Menu, Sun, Moon, X
} from 'lucide-react';
import './AdminDashboard.css';
import { adminFetch } from '../lib/adminApi';
import ImageUpload from './ImageUpload';
import './AdminRefresh.css';
import AdminDialog from './AdminDialog';
import LanguagePicker from './LanguagePicker';
import { dashboardText, adminText } from '../lib/adminTranslations';

const localizedDashboard = {
  UZ: {
    title: "Boshqaruv paneli",
    logout: "Chiqish",
    sidebar: {
      dashboard: "Dashboard",
      portfolio: "Portfolio",
      subCategory: "Kategoriya",
      subProjects: "Loyihalar",
      about: "MEN HAQIMDA",
      education: "Ta'lim",
      certificates: "Sertifikatlar",
      skills: "Ko'nikmalar",
      experience: "Ish tajribasi",
      resumeDownloads: "Rezyume yuklanishlar",
      messages: "Murojaatlar"
    },
    overview: {
      stats: "Statistika",
      totalViews: "Ko'rishlar soni",
      totalProjects: "Jami loyihalar",
      messagesRecv: "Murojaatlar",
      skillsConfig: "Ko'nikmalar soni",
      recentActivity: "So'nggi harakatlar",
      activity1: "Yangi loyiha qo'shildi: 'Crypto Wallet Website'",
      activity2: "Yangi murojaat qabul qilindi: Asrorbek Alimov",
      activity3: "Skills yangilandi: 'Figma UI/UX' -> 95%",
    },
    about: {
      title: "Men haqimda bo'limini tahrirlash",
      labelName: "Ism va Familya",
      labelRole: "Kasb / Sarlavha",
      labelBio: "Tarjimai hol (Bio)",
      btnSave: "O'zgarishlarni saqlash",
      successMsg: "Ma'lumotlar muvaffaqiyatli saqlandi!"
    },
    education: {
      title: "Ta'lim muassasalari ro'yxati",
      addBtn: "Yangi ta'lim",
      colName: "Muassasa nomi",
      colPeriod: "Davomiyligi (Yil)",
      colActions: "Amallar"
    },
    categories: {
      title: "Portfolio kategoriyalari",
      addBtn: "Yangi kategoriya",
      colName: "Kategoriya nomi",
      colCount: "Loyihalar soni",
      colStatus: "Holat",
      colActions: "Amallar"
    },
    projects: {
      addBtn: "Yangi loyiha qo'shish",
      tableTitle: "Barcha loyihalar",
      colTitle: "Nomi",
      colCat: "Kategoriya",
      colType: "Turi",
      colActions: "Amallar"
    },
    certificates: {
      title: "Sertifikatlar ro'yxati",
      addBtn: "Yangi sertifikat",
      colName: "Nomi",
      colOrg: "Tashkilot",
      colYear: "Yili",
      colActions: "Amallar"
    },
    downloads: {
      title: "Rezyume yuklab olish so'rovlari logi",
      colName: "Foydalanuvchi",
      colPhone: "Telefon",
      colEmail: "Email",
      colPurpose: "Yuklab olish maqsadi",
      colTime: "Sana",
      colActions: "Amallar"
    },
    messages: {
      tableTitle: "Kelgan xabarlar",
      colName: "Ism",
      colEmail: "Email",
      colCompany: "Tashkilot",
      colRole: "Lavozim",
      colMessage: "Murojaat",
      colStatus: "Holat",
      statusRead: "O'qildi",
      statusNew: "Yangi"
    }
  },
  ENG: {
    title: "Admin Dashboard",
    logout: "Log Out",
    sidebar: {
      dashboard: "Dashboard",
      portfolio: "Portfolio",
      subCategory: "Kategoriya",
      subProjects: "Loyihalar",
      about: "MEN HAQIMDA",
      education: "Education",
      certificates: "Sertifikatlar",
      skills: "Ko'nikmalar",
      experience: "Ish tajribasi",
      resumeDownloads: "Rezyume yuklanishlar",
      messages: "Murojaatlar"
    },
    overview: {
      stats: "Statistics",
      totalViews: "Total Views",
      totalProjects: "Total Projects",
      messagesRecv: "Messages Received",
      skillsConfig: "Skills Configured",
      recentActivity: "Recent Activity",
      activity1: "New project added: 'Crypto Wallet Website'",
      activity2: "New message received from Asrorbek Alimov",
      activity3: "Skills updated: 'Figma UI/UX' -> 95%",
    },
    about: {
      title: "Edit About Section",
      labelName: "Full Name",
      labelRole: "Profession / Title",
      labelBio: "Biography (Bio)",
      btnSave: "Save Changes",
      successMsg: "Information successfully saved!"
    },
    education: {
      title: "Education Institutions List",
      addBtn: "New Education",
      colName: "Institution Name",
      colPeriod: "Duration (Years)",
      colActions: "Actions"
    },
    categories: {
      title: "Portfolio Categories",
      addBtn: "New Category",
      colName: "Category Name",
      colCount: "Projects Count",
      colStatus: "Status",
      colActions: "Actions"
    },
    projects: {
      addBtn: "Add New Project",
      tableTitle: "All Projects List",
      colTitle: "Title",
      colCat: "Category",
      colType: "Type",
      colActions: "Actions"
    },
    certificates: {
      title: "Certificates List",
      addBtn: "New Certificate",
      colName: "Name",
      colOrg: "Authority",
      colYear: "Year",
      colActions: "Actions"
    },
    downloads: {
      title: "Resume Download Requests Log",
      colName: "User",
      colPhone: "Phone",
      colEmail: "Email",
      colPurpose: "Download Purpose",
      colTime: "Date/Time",
      colActions: "Actions"
    },
    messages: {
      tableTitle: "Inbox Messages",
      colName: "Name",
      colEmail: "Email",
      colCompany: "Organization",
      colRole: "Job Title",
      colMessage: "Message",
      colStatus: "Status",
      statusRead: "Read",
      statusNew: "New"
    }
  }
};

export default function AdminDashboard({ language, setLanguage, theme, toggleTheme, onLogout, dbAbout, onAboutUpdate }) {
  const t = dashboardText(localizedDashboard, language);
  const tr = (uzbek,english) => adminText(language,uzbek,english);
  const [activeTab, setActiveTab] = useState('overview');
  const [requestError, setRequestError] = useState('');
  useEffect(()=>{const error=event=>setRequestError(event.detail);window.addEventListener('admin-request-error',error);return()=>window.removeEventListener('admin-request-error',error);},[]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [projectError, setProjectError] = useState('');
  const [portfolioSubmenuOpen, setPortfolioSubmenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  useEffect(()=>{
    if (!mobileSidebarOpen) return;
    const sidebar=document.getElementById('admin-navigation');
    const previous=document.activeElement;
    const oldOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    sidebar.querySelector('button')?.focus();
    const keydown=event=>{
      if(event.key==='Escape'){event.preventDefault();setMobileSidebarOpen(false);}
      if(event.key==='Tab'){
        const items=[...sidebar.querySelectorAll('button')].filter(item=>!item.disabled&&item.getClientRects().length);
        if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items.at(-1)?.focus();}
        else if(!event.shiftKey&&document.activeElement===items.at(-1)){event.preventDefault();items[0]?.focus();}
      }
    };
    document.addEventListener('keydown',keydown);
    return()=>{document.removeEventListener('keydown',keydown);document.body.style.overflow=oldOverflow;previous?.focus();};
  },[mobileSidebarOpen]);
  const [selectedResumeFile, setSelectedResumeFile] = useState(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  // Modal Overlays state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryNameUz, setNewCategoryNameUz] = useState('');
  const [newCategoryNameRu, setNewCategoryNameRu] = useState('');
  const [newCategoryNameEn, setNewCategoryNameEn] = useState('');
  const [newCategoryNameJp, setNewCategoryNameJp] = useState('');

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title_uz: '',
    title_ru: '',
    title_en: '',
    title_jp: '',
    category: 'UX_UI',
    type: 'image', // 'pdf' or 'image'
    file: null,
    fileName: '',
    coverImage: null,
    coverImageName: '',
    description_uz: '',
    description_ru: '',
    description_en: '',
    description_jp: '',
    mainHashtag: '',
    regularHashtags: ''
  });

  const [showCertModal, setShowCertModal] = useState(false);
  const [certForm, setCertForm] = useState({
    title_uz: '',
    title_ru: '',
    title_en: '',
    title_jp: '',
    coverImage: null,
    coverImageName: '',
    pdfFile: null,
    pdfFileName: '', organization: '', year: ''
  });

  // Professional Skills states
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillForm, setSkillForm] = useState({
    name_uz: '',
    name_ru: '',
    name_en: '',
    name_jp: '',
    level: 90,
    image: null,
    imageName: ''
  });

  // Personal Skill Modal states
  const [showPersonalSkillModal, setShowPersonalSkillModal] = useState(false);
  const [personalSkillForm, setPersonalSkillForm] = useState({
    name_uz: '',
    name_ru: '',
    name_en: '',
    name_jp: ''
  });

  // Strength Modal states
  const [showStrengthModal, setShowStrengthModal] = useState(false);
  const [strengthForm, setStrengthForm] = useState({
    text_uz: '',
    text_ru: '',
    text_en: '',
    text_jp: ''
  });

  // Weakness Modal states
  const [showWeaknessModal, setShowWeaknessModal] = useState(false);
  const [weaknessForm, setWeaknessForm] = useState({
    text_uz: '',
    text_ru: '',
    text_en: '',
    text_jp: ''
  });



  // Strengths list states
  const [strengths, setStrengths] = useState([]);

  // Weaknesses list states
  const [weaknesses, setWeaknesses] = useState([]);

  // Job Modal states
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({
    role_uz: '',
    role_ru: '',
    role_en: '',
    role_jp: '',
    company_uz: '',
    company_ru: '',
    company_en: '',
    company_jp: '',
    startYear: new Date().getFullYear().toString(),
    endYear: new Date().getFullYear().toString(),
    isCurrent: false,
    desc_uz: '',
    desc_ru: '',
    desc_en: '',
    desc_jp: '',
  });

  // Education states
  const [educations, setEducations] = useState([]);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [educationForm, setEducationForm] = useState({
    name_uz: '',
    name_ru: '',
    name_en: '',
    name_jp: '',
    period: '',
    description_uz: '',
    description_ru: '',
    description_en: '',
    description_jp: '',
    logo: null,
    logoName: ''
  });

  // Database content starts empty until the API loads it.
  const [categories, setCategories] = useState([]);

  const [projects, setProjects] = useState([]);

  const [aboutData, setAboutData] = useState({
    name_uz: '',
    name_ru: '',
    name_en: '',
    name_jp: '',
    bio_uz: '',
    bio_ru: '',
    bio_en: '',
    bio_jp: '',
    image: null,
    imageName: ""
  });

  const [aboutSaved, setAboutSaved] = useState(false);

  useEffect(() => {
    if (dbAbout) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAboutData({
        name_uz: dbAbout.name_uz || dbAbout.name || '',
        name_ru: dbAbout.name_ru || '',
        name_en: dbAbout.name_en || '',
        name_jp: dbAbout.name_jp || '',
        bio_uz: dbAbout.bio_uz || dbAbout.bio || '',
        bio_ru: dbAbout.bio_ru || '',
        bio_en: dbAbout.bio_en || '',
        bio_jp: dbAbout.bio_jp || '',
        image: null,
        imageName: dbAbout.image ? dbAbout.image.split('/').pop() : ''
      });
    }
  }, [dbAbout]);

  // State for certificates from backend
  const [certs, setCerts] = useState([]);
  const [editingCert, setEditingCert] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // Missing States
  const [skills, setSkills] = useState([]);

  const [jobs, setJobs] = useState([]);

  const [downloads, setDownloads] = useState([]);

  const [dashboardStats, setDashboardStats] = useState({
    total_views: 0,
    total_projects: 0,
    total_messages: 0,
    new_messages: 0,
    total_skills: 0,
    visitor_analytics: [],
    recent_activities: []
  });

  const [messages, setMessages] = useState([]);

  // Missing Handlers
  const handleAddCategory = () => {
    setShowCategoryModal(true);
  };

  const handleDeleteDownload = async (id) => {
    if (!window.confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return;
    try {
      const res = await adminFetch(`${window.API_BASE_URL}/api/resume-downloads/${id}/`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDownloads(prev => prev.filter(d => d.id !== id));
      } else {
        alert('O\'chirishda xatolik yuz berdi');
      }
    } catch (err) {
      console.error(err);
      alert('Tarmoq xatoligi');
    }
  };

  const handleResumeFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedResumeFile(e.target.files[0]);
    }
  };

  const handleResumeUploadSubmit = async () => {
    if (!selectedResumeFile) return;
    setIsUploadingResume(true);
    
    const formData = new FormData();
    formData.append('resume_pdf', selectedResumeFile);
    
    try {
      const res = await adminFetch(window.API_BASE_URL + '/api/about/', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        alert(tr("Rezyume muvaffaqiyatli yuklandi!","Resume uploaded successfully!"));
        setSelectedResumeFile(null);
        if (onAboutUpdate) {
          onAboutUpdate();
        }
      } else {
        alert(tr("Yuklashda xatolik yuz berdi.","Failed to upload resume."));
      }
    } catch (err) {
      console.error(err);
      alert(tr("Tarmoq xatoligi yuz berdi.","Network error occurred."));
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const res = await adminFetch(`${window.API_BASE_URL}/api/portfolio/categories/${id}/`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryNameUz.trim()) return;
    try {
      const res = await adminFetch(window.API_BASE_URL + '/api/portfolio/categories/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_uz: newCategoryNameUz.trim(),
          name_ru: newCategoryNameRu.trim(),
          name_en: newCategoryNameEn.trim(),
          name_jp: newCategoryNameJp.trim(),
          name: newCategoryNameUz.trim(), // fallback
          status: 'Active'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCategories([...categories, { ...data, count: 0 }]);
        setShowCategoryModal(false);
        setNewCategoryNameUz('');
        setNewCategoryNameRu('');
        setNewCategoryNameEn('');
        setNewCategoryNameJp('');
      }
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  const handleAddProject = () => {
    setProjectError(''); setUploadingImages(false); setUploadingCover(false);
    setEditingProject(null);
    setProjectForm({
      title_uz: '',
      title_ru: '',
      title_en: '',
      title_jp: '',
      category: categories[0]?.id || '',
      type: 'image',
      file: null,
      fileName: '',
      coverImage: null,
      coverImageName: '',
      description_uz: '',
      description_ru: '',
      description_en: '',
      description_jp: '',
      mainHashtag: '',
      regularHashtags: '',
      files: []
    });
    setShowProjectModal(true);
  };

  const handleEditProject = (proj) => {
    setProjectError(''); setUploadingImages(false); setUploadingCover(false);
    setEditingProject(proj);
    setProjectForm({
      title_uz: proj.title_uz || proj.title || '',
      title_ru: proj.title_ru || '',
      title_en: proj.title_en || '',
      title_jp: proj.title_jp || '',
      category: proj.category_id || categories.find(category=>category.name===proj.category)?.id || '',
      type: proj.type || 'pdf',
      file: null,
      fileName: proj.file ? proj.file.split('/').pop() : '',
      coverImage: null,
      coverImageName: proj.cover_image ? proj.cover_image.split('/').pop() : '',
      description_uz: proj.description_uz || proj.description || '',
      description_ru: proj.description_ru || '',
      description_en: proj.description_en || '',
      description_jp: proj.description_jp || '',
      mainHashtag: proj.main_hashtag || '',
      regularHashtags: proj.regular_hashtags || '',
      files: [],
      keptImages: proj.images || []
    });
    setShowProjectModal(true);
  };

  const handleDeleteProject = async (id) => {
    try {
      const res = await adminFetch(`${window.API_BASE_URL}/api/portfolio/projects/${id}/`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (uploadingImages || uploadingCover || savingProject) return;
    if (!projectForm.title_uz.trim()) return;
    setProjectError('');
    if (!editingProject && (!projectForm.coverImage || (projectForm.type === 'image' ? !projectForm.files?.length : !projectForm.file))) {
      setProjectError(tr("Muqova va loyiha fayllarini tanlang.","Choose a cover and project files.")); return;
    }
    setSavingProject(true);

    const formData = new FormData();
    formData.append('title_uz', projectForm.title_uz.trim());
    formData.append('title_ru', projectForm.title_ru.trim());
    formData.append('title_en', projectForm.title_en.trim());
    formData.append('title_jp', projectForm.title_jp.trim());
    formData.append('title', projectForm.title_uz.trim());
    formData.append('category', projectForm.category);
    formData.append('type', projectForm.type);
    if (editingProject && projectForm.type === 'image') formData.append('keep_image_ids', JSON.stringify((projectForm.keptImages||[]).map(image=>image.id)));
    formData.append('description_uz', projectForm.description_uz);
    formData.append('description_ru', projectForm.description_ru);
    formData.append('description_en', projectForm.description_en);
    formData.append('description_jp', projectForm.description_jp);
    formData.append('description', projectForm.description_uz);
    
    const formattedMainHashtag = projectForm.mainHashtag.startsWith('#') 
      ? projectForm.mainHashtag 
      : (projectForm.mainHashtag.trim() ? '#' + projectForm.mainHashtag.trim() : '');
    formData.append('main_hashtag', formattedMainHashtag);
    formData.append('regular_hashtags', projectForm.regularHashtags);

    if (projectForm.type === 'image' && projectForm.files && projectForm.files.length > 0) {
      projectForm.files.forEach(f => {
        formData.append('images', f);
      });
    } else if (projectForm.file) {
      formData.append('file', projectForm.file);
    }
    if (projectForm.coverImage) {
      formData.append('cover_image', projectForm.coverImage);
    }

    try {
      const url = editingProject 
        ? `${window.API_BASE_URL}/api/portfolio/projects/${editingProject.id}/` 
        : window.API_BASE_URL + '/api/portfolio/projects/';
      const method = editingProject ? 'PATCH' : 'POST';

      const res = await adminFetch(url, {
        method: method,
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (editingProject) {
          setProjects(projects.map(p => p.id === editingProject.id ? data : p));
        } else {
          setProjects([...projects, data]);
        }
        setShowProjectModal(false);
        setEditingProject(null);
        setProjectForm({
          title_uz: '',
          title_ru: '',
          title_en: '',
          title_jp: '',
          category: categories[0]?.id || '',
          type: 'image',
          file: null,
          fileName: '',
          coverImage: null,
          coverImageName: '',
          description_uz: '',
          description_ru: '',
          description_en: '',
          description_jp: '',
          mainHashtag: '',
          regularHashtags: ''
        });

        // Also refresh categories to update count
        adminFetch(window.API_BASE_URL + '/api/portfolio/categories/')
          .then(res => res.json())
          .then(data => setCategories(data.map(item => ({ ...item, count: item.projects_count }))))
          .catch(err => console.error('Error refreshing categories:', err));
      } else {
        const errData = await res.json();
        setProjectError('Could not save the project: ' + JSON.stringify(errData));
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setProjectError(tr("Saqlanmadi. Serverga ulanishni tekshiring.","Not saved. Please check the server connection."));
    } finally { setSavingProject(false); }
  };

  const handleAddJob = () => {
    setJobForm({
      role_uz: '',
      role_ru: '',
      role_en: '',
      role_jp: '',
      company_uz: '',
      company_ru: '',
      company_en: '',
      company_jp: '',
      startYear: new Date().getFullYear().toString(),
      endYear: new Date().getFullYear().toString(),
      isCurrent: false,
      desc_uz: '',
      desc_ru: '',
      desc_en: '',
      desc_jp: '',
      logo: null,
      logoName: ''
    });
    setShowJobModal(true);
  };

  const handleDeleteJob = async (id) => {
    try {
      const res = await adminFetch(`${window.API_BASE_URL}/api/experiences/${id}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setJobs(jobs.filter(j => j.id !== id));
      }
    } catch (err) {
      console.error('Error deleting experience:', err);
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    const period = jobForm.isCurrent ? `${jobForm.startYear} - hozir davom etyapti` : `${jobForm.startYear} - ${jobForm.endYear}`;
    const formData = new FormData();
    formData.append('role_uz', jobForm.role_uz);
    formData.append('role_ru', jobForm.role_ru);
    formData.append('role_en', jobForm.role_en);
    formData.append('role_jp', jobForm.role_jp);
    formData.append('role', jobForm.role_uz);
    formData.append('company_uz', jobForm.company_uz);
    formData.append('company_ru', jobForm.company_ru);
    formData.append('company_en', jobForm.company_en);
    formData.append('company_jp', jobForm.company_jp);
    formData.append('company', jobForm.company_uz);
    formData.append('period', period);
    formData.append('desc_uz', jobForm.desc_uz);
    formData.append('desc_ru', jobForm.desc_ru);
    formData.append('desc_en', jobForm.desc_en);
    formData.append('desc_jp', jobForm.desc_jp);
    formData.append('desc', jobForm.desc_uz);
    if (jobForm.logo) {
      formData.append('logo', jobForm.logo);
    }
    try {
      const res = await adminFetch(window.API_BASE_URL + '/api/experiences/', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const newJob = await res.json();
        setJobs([...jobs, newJob]);
        setShowJobModal(false);
        setJobForm({
          role_uz: '',
          role_ru: '',
          role_en: '',
          role_jp: '',
          company_uz: '',
          company_ru: '',
          company_en: '',
          company_jp: '',
          startYear: new Date().getFullYear().toString(),
          endYear: new Date().getFullYear().toString(),
          isCurrent: false,
          desc_uz: '',
          desc_ru: '',
          desc_en: '',
          desc_jp: '',
          logo: null,
          logoName: ''
        });
      }
    } catch (err) {
      console.error('Error creating experience:', err);
    }
  };

  const handleAddEducation = () => {
    setEditingEducation(null);
    setEducationForm({
      name_uz: '',
      name_ru: '',
      name_en: '',
      name_jp: '',
      period: '',
      description_uz: '',
      description_ru: '',
      description_en: '',
      description_jp: '',
      logo: null,
      logoName: ''
    });
    setShowEducationModal(true);
  };

  const handleEditEducation = (item) => {
    setEditingEducation(item);
    setEducationForm({
      name_uz: item.name_uz || item.name || '',
      name_ru: item.name_ru || '',
      name_en: item.name_en || '',
      name_jp: item.name_jp || '',
      period: item.period || '',
      description_uz: item.description_uz || item.description || '',
      description_ru: item.description_ru || '',
      description_en: item.description_en || '',
      description_jp: item.description_jp || '',
      logo: null,
      logoName: item.logo ? item.logo.split('/').pop() : ''
    });
    setShowEducationModal(true);
  };

  const handleDeleteEducation = async (id) => {
    try {
      const res = await adminFetch(`${window.API_BASE_URL}/api/education/${id}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEducations(educations.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error('Error deleting education:', err);
    }
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    if (!educationForm.name_uz.trim()) return;
    const formData = new FormData();
    formData.append('name_uz', educationForm.name_uz.trim());
    formData.append('name_ru', educationForm.name_ru.trim());
    formData.append('name_en', educationForm.name_en.trim());
    formData.append('name_jp', educationForm.name_jp.trim());
    formData.append('name', educationForm.name_uz.trim());
    formData.append('period', educationForm.period.trim());
    formData.append('description_uz', educationForm.description_uz.trim());
    formData.append('description_ru', educationForm.description_ru.trim());
    formData.append('description_en', educationForm.description_en.trim());
    formData.append('description_jp', educationForm.description_jp.trim());
    formData.append('description', educationForm.description_uz.trim());
    if (educationForm.logo) {
      formData.append('logo', educationForm.logo);
    }
    try {
      let res;
      if (editingEducation) {
        res = await adminFetch(`${window.API_BASE_URL}/api/education/${editingEducation.id}/`, {
          method: 'PATCH',
          body: formData,
        });
      } else {
        res = await adminFetch(window.API_BASE_URL + '/api/education/', {
          method: 'POST',
          body: formData,
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (editingEducation) {
          setEducations(prev => prev.map(e => e.id === editingEducation.id ? data : e));
        } else {
          setEducations(prev => [...prev, data]);
        }
        setShowEducationModal(false);
        setEditingEducation(null);
        setEducationForm({
          name_uz: '',
          name_ru: '',
          name_en: '',
          name_jp: '',
          period: '',
          description_uz: '',
          description_ru: '',
          description_en: '',
          description_jp: '',
          logo: null,
          logoName: ''
        });
      }
    } catch (err) {
      console.error('Error submitting education:', err);
    }
  };

  const handleAddCert = () => {
    setEditingCert(null);
    setCertForm({
      title_uz: '',
      title_ru: '',
      title_en: '',
      title_jp: '',
      coverImage: null,
      coverImageName: '',
      pdfFile: null,
      pdfFileName: '', organization: '', year: ''
    });
    setShowCertModal(true);
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name_uz', aboutData.name_uz || '');
    formData.append('name_ru', aboutData.name_ru || '');
    formData.append('name_en', aboutData.name_en || '');
    formData.append('name_jp', aboutData.name_jp || '');
    formData.append('name', aboutData.name_uz || '');
    formData.append('bio_uz', aboutData.bio_uz || '');
    formData.append('bio_ru', aboutData.bio_ru || '');
    formData.append('bio_en', aboutData.bio_en || '');
    formData.append('bio_jp', aboutData.bio_jp || '');
    formData.append('bio', aboutData.bio_uz || '');
    if (aboutData.image) {
      formData.append('image', aboutData.image);
    }
    try {
      const res = await adminFetch(window.API_BASE_URL + '/api/about/', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setAboutSaved(true);
        setTimeout(() => setAboutSaved(false), 3000);
        if (onAboutUpdate) {
          onAboutUpdate();
        }
      } else {
        console.error('Failed to update About Me data');
      }
    } catch (err) {
      console.error('Error updating About Me data:', err);
    }
  };

  // Load certificates, skills, traits, and experiences on mount or when activeTab changes
  useEffect(() => {
    if (activeTab === 'overview') {
      adminFetch(window.API_BASE_URL + '/api/dashboard/stats/')
        .then(res => res.json())
        .then(data => setDashboardStats(data))
        .catch(err => console.error('Error loading dashboard stats:', err));

      adminFetch(window.API_BASE_URL + '/api/messages/')
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error('Error loading messages:', err));

      adminFetch(window.API_BASE_URL + '/api/resume-downloads/')
        .then(res => res.json())
        .then(data => setDownloads(data))
        .catch(err => console.error('Error loading resume downloads:', err));
    }
    if (activeTab === 'messages') {
      adminFetch(window.API_BASE_URL + '/api/messages/')
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error('Error loading messages:', err));
    }
    if (activeTab === 'certificates') {
      adminFetch(window.API_BASE_URL + '/api/certificates/')
        .then(res => res.json())
        .then(data => setCerts(data))
        .catch(err => console.error('Error loading certificates:', err));
    }
    if (activeTab === 'skills') {
      adminFetch(window.API_BASE_URL + '/api/skills/')
        .then(res => res.json())
        .then(data => setSkills(data))
        .catch(err => console.error('Error loading skills:', err));

      adminFetch(window.API_BASE_URL + '/api/traits/')
        .then(res => res.json())
        .then(data => {
          setStrengths(data.filter(t => t.type === 'Strength'));
          setWeaknesses(data.filter(t => t.type === 'Weakness'));
        })
        .catch(err => console.error('Error loading traits:', err));
    }
    if (activeTab === 'experience') {
      adminFetch(window.API_BASE_URL + '/api/experiences/')
        .then(res => res.json())
        .then(data => setJobs(data))
        .catch(err => console.error('Error loading experiences:', err));
    }
    if (activeTab === 'education') {
      adminFetch(window.API_BASE_URL + '/api/education/')
        .then(res => res.json())
        .then(data => setEducations(data))
        .catch(err => console.error('Error loading education:', err));
    }
    if (activeTab === 'portfolio-categories' || activeTab === 'portfolio-projects') {
      adminFetch(window.API_BASE_URL + '/api/portfolio/categories/')
        .then(res => res.json())
        .then(data => setCategories(data.map(item => ({ ...item, count: item.projects_count }))))
        .catch(err => console.error('Error loading categories:', err));
      
      adminFetch(window.API_BASE_URL + '/api/portfolio/projects/')
        .then(res => res.json())
        .then(data => setProjects(data))
        .catch(err => console.error('Error loading projects:', err));
    }
    if (activeTab === 'resume-downloads') {
      adminFetch(window.API_BASE_URL + '/api/resume-downloads/')
        .then(res => res.json())
        .then(data => setDownloads(data))
        .catch(err => console.error('Error loading resume downloads:', err));
    }
  }, [activeTab]);

  const handleEditCert = (cert) => {
    setEditingCert(cert);
    setCertForm({
      title_uz: cert.title_uz || cert.title || '',
      title_ru: cert.title_ru || '',
      title_en: cert.title_en || '',
      title_jp: cert.title_jp || '',
      coverImage: null,
      coverImageName: cert.image ? cert.image.split('/').pop() : '',
      pdfFile: null,
      pdfFileName: cert.file ? cert.file.split('/').pop() : '', organization: cert.organization || '', year: cert.year || ''
    });
    setShowCertModal(true);
  };

  // Add or edit certificate via backend
  const handleCertSubmit = async (e) => {
    e.preventDefault();
    if (!certForm.title_uz.trim()) return;
    const formData = new FormData();
    formData.append('title_uz', certForm.title_uz.trim());
    formData.append('title_ru', certForm.title_ru.trim());
    formData.append('title_en', certForm.title_en.trim());
    formData.append('title_jp', certForm.title_jp.trim());
    formData.append('title', certForm.title_uz.trim());
              formData.append('organization', certForm.organization || '');
              formData.append('year', certForm.year || '');
    formData.append('organization', '');
    formData.append('year', new Date().getFullYear().toString());
    if (certForm.pdfFile) {
      formData.append('file', certForm.pdfFile);
    }
    if (certForm.coverImage) {
      formData.append('image', certForm.coverImage);
    }
    try {
      let res;
      if (editingCert) {
        res = await adminFetch(`${window.API_BASE_URL}/api/certificates/${editingCert.id}/`, {
          method: 'PATCH',
          body: formData,
        });
      } else {
        res = await adminFetch(window.API_BASE_URL + '/api/certificates/', {
          method: 'POST',
          body: formData,
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (editingCert) {
          setCerts(prev => prev.map(c => c.id === editingCert.id ? data : c));
        } else {
          setCerts(prev => [...prev, data]);
        }
        setShowCertModal(false);
        setEditingCert(null);
        setCertForm({
          title_uz: '',
          title_ru: '',
          title_en: '',
          title_jp: '',
          coverImage: null,
          coverImageName: '',
          pdfFile: null,
          pdfFileName: '', organization: '', year: ''
        });
      } else {
        console.error('Failed to submit certificate');
      }
    } catch (err) {
      console.error('Error submitting certificate:', err);
    }
  };

  // Delete certificate via backend
  const handleDeleteCert = async (id) => {
    try {
      const res = await adminFetch(`${window.API_BASE_URL}/api/certificates/${id}/`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCerts(prev => prev.filter(c => c.id !== id));
      } else {
        console.error('Failed to delete certificate');
      }
    } catch (err) {
      console.error('Error deleting certificate:', err);
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Side Navigation Bar */}
      {mobileSidebarOpen && (
        <div className="mobile-sidebar-overlay show" onClick={() => setMobileSidebarOpen(false)} />
      )}
      <aside id="admin-navigation" className={`admin-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
            <h1>{t.title}</h1>
            <span className="breadcrumbs">{t.sidebar[({overview:"dashboard","portfolio-categories":"subCategory","portfolio-projects":"subProjects","resume-downloads":"resumeDownloads"})[activeTab] || activeTab]}</span>
        </div>

        <nav className="sidebar-nav">
          {/* 1. Dashboard Link */}
          <button 
            className={`sidebar-link ${activeTab === 'overview' ? 'active-link' : ''}`}
            onClick={() => { setMobileSidebarOpen(false); setActiveTab('overview'); }}
          >
            <LayoutDashboard size={18} />
            <span>{t.sidebar.dashboard}</span>
          </button>
          
          {/* 2. Portfolio Expandable Tab */}
          <div className="sidebar-submenu-wrapper">
            <button 
              className={`sidebar-link ${(activeTab === 'portfolio-categories' || activeTab === 'portfolio-projects') ? 'active-link' : ''}`}
              onClick={() => setPortfolioSubmenuOpen(!portfolioSubmenuOpen)}
            >
              <Briefcase size={18} />
              <span>{t.sidebar.portfolio}</span>
              <span className="submenu-arrow-indicator">
                {portfolioSubmenuOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            </button>

            {/* Slide Down Submenu */}
            <div className={`sidebar-submenu-drawer ${portfolioSubmenuOpen ? 'submenu-expanded' : ''}`}>
              <button 
                className={`sidebar-sublink ${activeTab === 'portfolio-categories' ? 'active-sublink' : ''}`}
                onClick={() => { setMobileSidebarOpen(false); setActiveTab('portfolio-categories'); }}
              >
                <Layers size={14} />
                <span>{t.sidebar.subCategory}</span>
              </button>
              
              <button 
                className={`sidebar-sublink ${activeTab === 'portfolio-projects' ? 'active-sublink' : ''}`}
                onClick={() => { setMobileSidebarOpen(false); setActiveTab('portfolio-projects'); }}
              >
                <Folder size={14} />
                <span>{t.sidebar.subProjects}</span>
              </button>
            </div>
          </div>

          {/* 3. MEN HAQIMDA Link */}
          <button 
            className={`sidebar-link ${activeTab === 'about' ? 'active-link' : ''}`}
            onClick={() => { setMobileSidebarOpen(false); setActiveTab('about'); }}
          >
            <User size={18} />
            <span>{t.sidebar.about}</span>
          </button>

          {/* 3.1. Ta'lim Link */}
          <button 
            className={`sidebar-link ${activeTab === 'education' ? 'active-link' : ''}`}
            onClick={() => { setMobileSidebarOpen(false); setActiveTab('education'); }}
          >
            <GraduationCap size={18} />
            <span>{t.sidebar.education}</span>
          </button>

          {/* 4. Sertifikatlar Link */}
          <button 
            className={`sidebar-link ${activeTab === 'certificates' ? 'active-link' : ''}`}
            onClick={() => { setMobileSidebarOpen(false); setActiveTab('certificates'); }}
          >
            <Award size={18} />
            <span>{t.sidebar.certificates}</span>
          </button>

          {/* 5. Ko'nikmalar Link */}
          <button 
            className={`sidebar-link ${activeTab === 'skills' ? 'active-link' : ''}`}
            onClick={() => { setMobileSidebarOpen(false); setActiveTab('skills'); }}
          >
            <Cpu size={18} />
            <span>{t.sidebar.skills}</span>
          </button>

          {/* 6. Ish tajribasi Link */}
          <button 
            className={`sidebar-link ${activeTab === 'experience' ? 'active-link' : ''}`}
            onClick={() => { setMobileSidebarOpen(false); setActiveTab('experience'); }}
          >
            <History size={18} />
            <span>{t.sidebar.experience}</span>
          </button>

          {/* 7. Rezyume yuklanishlar Link */}
          <button 
            className={`sidebar-link ${activeTab === 'resume-downloads' ? 'active-link' : ''}`}
            onClick={() => { setMobileSidebarOpen(false); setActiveTab('resume-downloads'); }}
          >
            <Download size={18} />
            {downloads.length > 0 && (
              <span className="badge-downloads-count">{downloads.length}</span>
            )}
            <span>{t.sidebar.resumeDownloads}</span>
          </button>

          {/* 8. Murojaatlar Link */}
          <button 
            className={`sidebar-link ${activeTab === 'messages' ? 'active-link' : ''}`}
            onClick={() => { setMobileSidebarOpen(false); setActiveTab('messages'); }}
          >
            <MessageSquare size={18} />
            {messages.filter(m => m.status === 'new').length > 0 && (
              <span className="badge-new-messages">
                {messages.filter(m => m.status === 'new').length}
              </span>
            )}
            <span>{t.sidebar.messages}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="dashboard-logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="dashboard-workspace">
        {/* Workspace Top Header */}
        <header className="workspace-header">
          <div className="workspace-title-section">
<a className="admin-header-brand" href="/" aria-label="DesOne portfolio"><span className="admin-logo"><span className="brand-des">des</span><span className="brand-one">one</span></span></a>
          </div>

          <button 
            className="mobile-hamburger-btn" aria-label={mobileSidebarOpen ? tr("Menyuni yopish","Close navigation") : tr("Menyuni ochish","Open navigation")} aria-expanded={mobileSidebarOpen} aria-controls="admin-navigation"
            style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            {mobileSidebarOpen ? <X size={22}/> : <Menu size={22}/> }
          </button>

          <div className="workspace-header-actions">
            <button className="header-action-btn" aria-label={theme==='dark'?tr('Yorug‘ rejim','Light mode'):tr('Qorong‘i rejim','Dark mode')} onClick={toggleTheme}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button>
            <LanguagePicker language={language} onChange={setLanguage}/>
            <button className="header-action-btn notification-bell" aria-label={t.sidebar.messages} onClick={()=>setActiveTab('messages')}><Bell size={18}/>{messages.some(message=>message.status==='new')&&<span className="bell-dot"/>}</button>


          </div>
        </header>
        {requestError && <div className="admin-error-banner" role="alert"><span>{requestError}</span><button type="button" aria-label={tr("Xatoni yopish","Dismiss error")} onClick={()=>setRequestError('')}><X size={18}/></button></div>}

        {/* Dynamic Panel Content */}
        <div className="workspace-content">
          
          {/* 1. DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="overview-tab-content">
              {/* Stats Cards */}
              <div className="dashboard-stats-grid">
                <div className="stat-card">
                  <div className="stat-card-icon-wrap orb-pink">
                    <Eye size={22} className="pink-glow-icon" />
                  </div>
                  <div className="stat-card-text">
                    <span className="stat-label">{t.overview.totalViews}</span>
                    <h3 className="stat-value">{dashboardStats.total_views.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-card-icon-wrap orb-lime">
                    <Briefcase size={22} className="lime-glow-icon" />
                  </div>
                  <div className="stat-card-text">
                    <span className="stat-label">{t.overview.totalProjects}</span>
                    <h3 className="stat-value">{dashboardStats.total_projects}</h3>
                  </div>
                  <span className="stat-trend trend-static">{tr("Faol","Active")}</span>
                </div>

                <div className="stat-card">
                  <div className="stat-card-icon-wrap orb-cyan">
                    <MessageSquare size={22} className="cyan-glow-icon" />
                  </div>
                  <div className="stat-card-text">
                    <span className="stat-label">{t.overview.messagesRecv}</span>
                    <h3 className="stat-value">{dashboardStats.total_messages}</h3>
                  </div>
                  <span className="stat-trend trend-new">
                    {dashboardStats.new_messages} {t.messages.statusNew}
                  </span>
                </div>

                <div className="stat-card">
                  <div className="stat-card-icon-wrap orb-purple">
                    <Cpu size={22} className="purple-glow-icon" />
                  </div>
                  <div className="stat-card-text">
                    <span className="stat-label">{t.overview.skillsConfig}</span>
                    <h3 className="stat-value">{dashboardStats.total_skills}</h3>
                  </div>
                  <span className="stat-trend trend-static">{tr("Sozlangan","Verified")}</span>
                </div>
              </div>

              {/* Graphic Mock & Recent Activity */}
              <div className="overview-details-layout">
                {/* Analytics Mockup Chart */}
                <div className="dashboard-analytics-box glass-panel">
                  <div className="panel-header-with-action">
                    <h3>{tr("Oxirgi 7 kun tashriflari","Visitor Analytics (Past 7 Days)")}</h3>
                    <Sliders size={14} className="panel-icon-btn" />
                  </div>
                  <div className="mock-chart-visual">
                    <div className="chart-glow-glow"></div>
                    <div className="chart-bars-wrap">
                      {dashboardStats.visitor_analytics && dashboardStats.visitor_analytics.length > 0 ? (
                        (() => {
                          const maxCount = Math.max(...dashboardStats.visitor_analytics.map(d => d.count), 1);
                          return dashboardStats.visitor_analytics.map((d, index) => {
                            const pct = Math.round((d.count / maxCount) * 100);
                            return (
                              <div className="chart-column" key={index}>
                                <div className="chart-fill" style={{ height: `${pct}%` }} title={`${d.count} views`}></div>
                                <span className="chart-day">{d.day}</span>
                              </div>
                            );
                          });
                        })()
                      ) : (
                        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <div className="chart-column" key={day}>
                            <div className="chart-fill" style={{ height: '0%' }}></div>
                            <span className="chart-day">{day}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="dashboard-activities-box glass-panel">
                  <h3>{t.overview.recentActivity}</h3>
                  <ul className="activities-list">
                    {dashboardStats.recent_activities && dashboardStats.recent_activities.length > 0 ? (
                      dashboardStats.recent_activities.map((act, index) => (
                        <li key={index}>
                          <div className={`activity-dot ${act.dot_class}`}></div>
                          <div className="activity-info">
                            <p>{act.message}</p>
                            <span className="activity-time">{act.time}</span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li>
                        <div className="activity-dot dot-lime"></div>
                        <div className="activity-info">
                          <p>{tr("Hozircha harakatlar mavjud emas","No activity yet")}</p>
                          <span className="activity-time">-</span>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2. PORTFOLIO - KATEGORIYA */}
          {activeTab === 'portfolio-categories' && (
            <div className="categories-tab-content glass-panel">
              <div className="panel-toolbar-header">
                <h3>{t.categories.title}</h3>
                <button className="add-item-btn" onClick={handleAddCategory}>
                  <Plus size={16} />
                  <span>{t.categories.addBtn}</span>
                </button>
              </div>

              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>{t.categories.colName}</th>
                      <th>{t.categories.colCount}</th>
                      <th>{t.categories.colStatus}</th>
                      <th style={{ textAlign: 'right' }}>{t.categories.colActions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, idx) => (
                      <tr key={cat.id}>
                        <td className="col-id">#{idx + 1}</td>
                        <td className="col-title">{cat.name}</td>
                        <td className="col-type">{cat.count} ta loyiha</td>
                        <td className="col-status">
                          <span className="status-badge status-badge-new">{cat.status}</span>
                        </td>
                        <td className="col-actions">
                          <button className="action-icon-btn edit-btn" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="action-icon-btn delete-btn" 
                            title="Delete"
                            onClick={() => handleDeleteCategory(cat.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. PORTFOLIO - LOYIHALAR */}
          {activeTab === 'portfolio-projects' && (
            <div className="projects-tab-content glass-panel">
              <div className="panel-toolbar-header">
                <h3>{t.projects.tableTitle}</h3>
                <button className="add-item-btn" onClick={handleAddProject}>
                  <Plus size={16} />
                  <span>{t.projects.addBtn}</span>
                </button>
              </div>

              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>{t.projects.colTitle}</th>
                      <th>{t.projects.colCat}</th>
                      <th>{t.projects.colType}</th>
                      <th style={{ textAlign: 'right' }}>{t.projects.colActions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((proj, idx) => (
                      <tr key={proj.id}>
                        <td className="col-id">#{idx + 1}</td>
                        <td className="col-title">{proj.title}</td>
                        <td className="col-cat"><span className="category-tag-badge">{proj.category}</span></td>
                        <td className="col-type">{proj.type}</td>
                        <td className="col-actions">
                          <button 
                            className="action-icon-btn edit-btn" 
                            title="Edit"
                            onClick={() => handleEditProject(proj)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="action-icon-btn delete-btn" 
                            title="Delete"
                            onClick={() => handleDeleteProject(proj.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. MEN HAQIMDA EDITOR */}
          {activeTab === 'about' && (
            <div className="about-tab-content glass-panel">
              <h3>{t.about.title}</h3>
              
              {aboutSaved && (
                <div className="dashboard-success-alert-floating">
                  <CheckCircle2 size={16} />
                  <span>{t.about.successMsg}</span>
                </div>
              )}

              <form onSubmit={handleAboutSubmit} className="dashboard-form-editor">
                {/* 1. Profile Image Upload */}
                <div className="editor-input-group upload-input-group">
                  <label>{tr("Profil rasmi","Profile Image")}</label>
                  <div className="custom-file-upload-wrap">
                    <input 
                      type="file" 
                      id="about-image-input"
                      accept="image/*"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        if (selectedFile) {
                          setAboutData({ 
                            ...aboutData, 
                            image: selectedFile, 
                            imageName: selectedFile.name 
                          });
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                    <button 
                      type="button" 
                      className="custom-upload-trigger-btn"
                      onClick={() => document.getElementById('about-image-input').click()}
                    >
                      <Upload size={16} />
                      <span>
                        {aboutData.imageName 
                          ? aboutData.imageName 
                          : (tr("Profil rasmini tanlash","Choose profile image"))
                        }
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. Full Name */}
                <div className="form-row-grid-2">
                  <div className="editor-input-group">
                    <label>UZ {tr("Ism va Familya","Full Name")}</label>
                    <input 
                      type="text" 
                      value={aboutData.name_uz || ''}
                      onChange={(e) => setAboutData({ ...aboutData, name_uz: e.target.value })}
                      required
                    />
                  </div>
                  <div className="editor-input-group">
                    <label>RU {tr("Ism va Familya","Full Name")}</label>
                    <input 
                      type="text" 
                      value={aboutData.name_ru || ''}
                      onChange={(e) => setAboutData({ ...aboutData, name_ru: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-grid-2">
                  <div className="editor-input-group">
                    <label>ENG {tr("Ism va Familya","Full Name")}</label>
                    <input 
                      type="text" 
                      value={aboutData.name_en || ''}
                      onChange={(e) => setAboutData({ ...aboutData, name_en: e.target.value })}
                    />
                  </div>
                  <div className="editor-input-group">
                    <label>JP {tr("Ism va Familya","Full Name")}</label>
                    <input 
                      type="text" 
                      value={aboutData.name_jp || ''}
                      onChange={(e) => setAboutData({ ...aboutData, name_jp: e.target.value })}
                    />
                  </div>
                </div>

                {/* 3. Biography */}
                <div className="form-row-grid-2">
                  <div className="editor-input-group">
                    <label>UZ {tr("Tarjimai hol (Bio)","Biography (Bio)")}</label>
                    <textarea 
                      rows={4}
                      value={aboutData.bio_uz || ''}
                      onChange={(e) => setAboutData({ ...aboutData, bio_uz: e.target.value })}
                      required
                    />
                  </div>
                  <div className="editor-input-group">
                    <label>RU {tr("Tarjimai hol (Bio)","Biography (Bio)")}</label>
                    <textarea 
                      rows={4}
                      value={aboutData.bio_ru || ''}
                      onChange={(e) => setAboutData({ ...aboutData, bio_ru: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-grid-2">
                  <div className="editor-input-group">
                    <label>ENG {tr("Tarjimai hol (Bio)","Biography (Bio)")}</label>
                    <textarea 
                      rows={4}
                      value={aboutData.bio_en || ''}
                      onChange={(e) => setAboutData({ ...aboutData, bio_en: e.target.value })}
                    />
                  </div>
                  <div className="editor-input-group">
                    <label>JP {tr("Tarjimai hol (Bio)","Biography (Bio)")}</label>
                    <textarea 
                      rows={4}
                      value={aboutData.bio_jp || ''}
                      onChange={(e) => setAboutData({ ...aboutData, bio_jp: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="save-form-editor-btn">
                  <FileText size={16} />
                  <span>{t.about.btnSave}</span>
                </button>
              </form>
            </div>
          )}

          {/* 3.1. TA'LIM */}
          {activeTab === 'education' && (
            <div className="education-tab-content glass-panel">
              <div className="panel-toolbar-header">
                <h3>{t.education.title}</h3>
                <button className="add-item-btn" onClick={handleAddEducation}>
                  <Plus size={16} />
                  <span>{t.education.addBtn}</span>
                </button>
              </div>

              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Logo</th>
                      <th>{t.education.colName}</th>
                      <th>{t.education.colPeriod}</th>
                      <th style={{ textAlign: 'right' }}>{t.education.colActions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {educations.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="col-id">#{idx + 1}</td>
                        <td className="col-logo">
                          {item.logo ? (
                            <img src={item.logo} alt="Logo" className="table-img-preview" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }} />
                          ) : (
                            <span className="no-image-placeholder">No Logo</span>
                          )}
                        </td>
                        <td className="col-title">{item.name}</td>
                        <td className="col-type">{item.period}</td>
                        <td className="col-actions">
                          <button 
                            className="action-icon-btn edit-btn" 
                            title="Edit"
                            onClick={() => handleEditEducation(item)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="action-icon-btn delete-btn" 
                            title="Delete"
                            onClick={() => handleDeleteEducation(item.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. SERTIFIKATLAR */}
          {activeTab === 'certificates' && (
            <div className="certificates-tab-content glass-panel">
              <div className="panel-toolbar-header">
                <h3>{t.certificates.title}</h3>
                <button className="add-item-btn" onClick={handleAddCert}>
                  <Plus size={16} />
                  <span>{t.certificates.addBtn}</span>
                </button>
              </div>

              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>{t.certificates.colName}</th>
                      <th>{t.certificates.colOrg}</th>
                      <th>{t.certificates.colYear}</th>
                      <th style={{ textAlign: 'right' }}>{t.certificates.colActions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certs.map((cert, idx) => (
                      <tr key={cert.id}>
                        <td className="col-id">#{idx + 1}</td>
                        <td className="col-title">{cert.title}</td>
                        <td className="col-cat">{cert.organization}</td>
                        <td className="col-type">{cert.year}</td>
                        <td className="col-actions">
                          <button 
                            className="action-icon-btn edit-btn" 
                            title="Edit"
                            onClick={() => handleEditCert(cert)}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="action-icon-btn delete-btn" 
                            title="Delete"
                            onClick={() => handleDeleteCert(cert.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. KO'NIKMALAR */}
          {activeTab === 'skills' && (
            <div className="skills-tab-content glass-panel">
              {/* Header toolbar for software skills */}
              <div className="panel-toolbar-header">
                <h3>{tr("Kasbiy ko'nikmalar (Software Skills)","Professional Software Skills")}</h3>
                <button className="add-item-btn" onClick={() => {
                  setSkillForm({ name: '', level: 90, image: null, imageName: '' });
                  setShowSkillModal(true);
                }}>
                  <Plus size={16} />
                  <span>{tr("Yangi ko'nikma","New Skill")}</span>
                </button>
              </div>

              {/* Software Skills Grid */}
              <div className="dashboard-skills-grid">
                {skills.filter(s => s.type === 'Software').map((skill) => (
                  <div key={skill.id} className="dashboard-skill-row-card">
                    <div className="skill-row-meta">
                      <span className="skill-row-name">{skill.name}</span>
                      <span className="skill-row-level">{skill.level || 90}%</span>
                    </div>
                    <div className="skill-row-track">
                      <div className="skill-row-progress" style={{ width: `${skill.level || 90}%` }}></div>
                    </div>
                    <div className="skill-row-footer">
                      <span className="skill-type-tag">{skill.image ? skill.image.split('/').pop() : (skill.imageName || "icon.png")}</span>
                      <div className="skill-actions">
                        <button 
                          className="action-icon-btn delete-btn"
                          style={{ margin: 0 }}
                          title="Delete Skill"
                          onClick={async () => {
                            try {
                              const res = await adminFetch(`${window.API_BASE_URL}/api/skills/${skill.id}/`, {
                                method: 'DELETE',
                              });
                              if (res.ok) {
                                setSkills(skills.filter(s => s.id !== skill.id));
                              }
                            } catch (err) {
                              console.error('Error deleting skill:', err);
                            }
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shaxsiy Ko'nikmalar (Personal Skills) Section */}
              <div className="skills-section-separator"></div>
              
              <div className="personal-skills-management-box">
                <div className="panel-toolbar-header">
                  <h3>{tr("Shaxsiy ko'nikmalar","Personal Skills")}</h3>
                  <button 
                    type="button" 
                    className="add-item-btn"
                    onClick={() => {
                      setPersonalSkillForm({
                        name_uz: '',
                        name_ru: '',
                        name_en: '',
                        name_jp: ''
                      });
                      setShowPersonalSkillModal(true);
                    }}
                  >
                    <Plus size={16} />
                    <span>{tr("Ko'nikma qo'shish","Add Skill")}</span>
                  </button>
                </div>

                <div className="personal-skills-chips-wrapper">
                  {skills.filter(s => s.type === 'Personal').map((ps) => (
                    <div key={ps.id} className="personal-skill-chip-badge">
                      <span>{ps.name}</span>
                      <button 
                        type="button" 
                        className="chip-remove-btn"
                        onClick={async () => {
                          try {
                            const res = await adminFetch(`${window.API_BASE_URL}/api/skills/${ps.id}/`, {
                              method: 'DELETE',
                            });
                            if (res.ok) {
                              setSkills(skills.filter(s => s.id !== ps.id));
                            }
                          } catch (err) {
                            console.error('Error deleting personal skill:', err);
                          }
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kuchli & Zaif Tomonlar (Strengths & Weaknesses) Section */}
              <div className="skills-section-separator"></div>

              <div className="strengths-weaknesses-layout">
                {/* Kuchli tomonlar (Strengths) */}
                <div className="strengths-box glass-panel-inner">
                  <div className="panel-toolbar-header-inline">
                    <h3>{tr("Kuchli tomonlar","Strengths")}</h3>
                    <button 
                      type="button" 
                      className="add-bullet-btn" 
                      title="Add strength point"
                      onClick={() => {
                        setStrengthForm({
                          text_uz: '',
                          text_ru: '',
                          text_en: '',
                          text_jp: ''
                        });
                        setShowStrengthModal(true);
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="bullet-inputs-list">
                    {strengths.map((st, idx) => {
                      const displayLang = language.toLowerCase() === 'eng' ? 'en' : language.toLowerCase();
                      const displayText = st[`text_${displayLang}`] || st.text;
                      return (
                        <div key={st.id || idx} className="bullet-input-row">
                          <span className="bullet-indicator-num">{idx + 1}.</span>
                          <span className="bullet-text-display">{displayText}</span>
                          <button 
                            type="button" 
                            className="bullet-row-remove-btn"
                            onClick={async () => {
                              if (st.id) {
                                try {
                                  const res = await adminFetch(`${window.API_BASE_URL}/api/traits/${st.id}/`, {
                                    method: 'DELETE',
                                  });
                                  if (res.ok) {
                                    setStrengths(strengths.filter(item => item.id !== st.id));
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Zaif tomonlar (Weaknesses) */}
                <div className="weaknesses-box glass-panel-inner">
                  <div className="panel-toolbar-header-inline">
                    <h3>{tr("Zaif tomonlar","Weaknesses")}</h3>
                    <button 
                      type="button" 
                      className="add-bullet-btn" 
                      title="Add weakness point"
                      onClick={() => {
                        setWeaknessForm({
                          text_uz: '',
                          text_ru: '',
                          text_en: '',
                          text_jp: ''
                        });
                        setShowWeaknessModal(true);
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="bullet-inputs-list">
                    {weaknesses.map((wk, idx) => {
                      const displayLang = language.toLowerCase() === 'eng' ? 'en' : language.toLowerCase();
                      const displayText = wk[`text_${displayLang}`] || wk.text;
                      return (
                        <div key={wk.id || idx} className="bullet-input-row">
                          <span className="bullet-indicator-num">{idx + 1}.</span>
                          <span className="bullet-text-display">{displayText}</span>
                          <button 
                            type="button" 
                            className="bullet-row-remove-btn"
                            onClick={async () => {
                              if (wk.id) {
                                try {
                                  const res = await adminFetch(`${window.API_BASE_URL}/api/traits/${wk.id}/`, {
                                    method: 'DELETE',
                                  });
                                  if (res.ok) {
                                    setWeaknesses(weaknesses.filter(item => item.id !== wk.id));
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              }
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. ISH TAJRIBASI */}
          {activeTab === 'experience' && (
            <div className="experience-tab-content glass-panel">
              <div className="panel-toolbar-header">
                <h3>Ish tajribasi bo'limi</h3>
                <button className="add-item-btn" onClick={handleAddJob}>
                  <Plus size={16} />
                  <span>Yangi tajriba qo'shish</span>
                </button>
              </div>

              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Lavozim</th>
                      <th>Kompaniya</th>
                      <th>Davr</th>
                      <th style={{ textAlign: 'right' }}>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job, idx) => (
                      <tr key={job.id}>
                        <td className="col-id">#{idx + 1}</td>
                        <td className="col-title">{job.role}</td>
                        <td className="col-cat">{job.company}</td>
                        <td className="col-type">{job.period}</td>
                        <td className="col-actions">
                          <button className="action-icon-btn edit-btn" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="action-icon-btn delete-btn" 
                            title="Delete"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. REZYUME YUKLANISHLAR */}
          {activeTab === 'resume-downloads' && (
            <div className="downloads-tab-content glass-panel">
              <h3>{t.downloads.title}</h3>

              {/* PDF Resume Upload Section */}
              <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  <FileText size={18} style={{ color: 'var(--primary-lime)' }} />
                  <span>Asosiy Rezyume (PDF) yuklash</span>
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                  Ushbu PDF fayl portfolio asosiy sahifasidagi "Resume" tugmasi bosilganda ochiladi va foydalanuvchilar tomonidan yuklab olinadi.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    id="resume-pdf-upload-input"
                    style={{ display: 'none' }}
                    onChange={handleResumeFileChange}
                  />
                  <button 
                    className="add-item-btn"
                    onClick={() => document.getElementById('resume-pdf-upload-input').click()}
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    disabled={isUploadingResume}
                  >
                    <Upload size={14} />
                    <span>Faylni tanlash</span>
                  </button>
                  {selectedResumeFile && (
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                      {selectedResumeFile.name}
                    </span>
                  )}
                  {selectedResumeFile && (
                    <button 
                      className="add-item-btn"
                      onClick={handleResumeUploadSubmit}
                      style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem', background: 'var(--primary-lime)', color: '#000000' }}
                      disabled={isUploadingResume}
                    >
                      {isUploadingResume ? 'Yuklanmoqda...' : 'Yuklashni boshlash'}
                    </button>
                  )}
                </div>
                {/* Display Current Resume Link if exists */}
                {dbAbout?.resume_pdf && (
                  <div style={{ marginTop: '1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Hozirgi yuklangan rezyume:</span>
                    <a 
                      href={dbAbout.resume_pdf} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: 'var(--primary-lime)', textDecoration: 'underline', fontWeight: '600' }}
                    >
                      Ko'rish ({dbAbout.resume_pdf.split('/').pop()})
                    </a>
                  </div>
                )}
              </div>

              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>{t.downloads.colName}</th>
                      <th>{t.downloads.colPhone}</th>
                      <th>{t.downloads.colEmail}</th>
                      <th>{t.downloads.colPurpose}</th>
                      <th>{t.downloads.colTime}</th>
                      <th style={{ textAlign: 'right' }}>{t.downloads.colActions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {downloads.map(dl => (
                      <tr key={dl.id}>
                        <td className="col-title">{dl.name}</td>
                        <td className="col-cat" style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{dl.phone}</td>
                        <td className="col-email">{dl.email}</td>
                        <td className="col-msg-text" title={dl.purpose}>{dl.purpose}</td>
                        <td className="col-type" style={{ fontSize: '0.8rem' }}>
                          {new Date(dl.created_at).toLocaleString()}
                        </td>
                        <td className="col-actions">
                          <button 
                            className="action-icon-btn delete-btn" 
                            title="Delete Log"
                            onClick={() => handleDeleteDownload(dl.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. MUROJAATLAR kelgan xabarlar */}
          {activeTab === 'messages' && (
            <div className="messages-tab-content glass-panel">
              <h3>{t.messages.tableTitle}</h3>
              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>{t.messages.colName}</th>
                      <th>{t.messages.colEmail}</th>
                      <th>{t.messages.colCompany}</th>
                      <th>{t.messages.colRole}</th>
                      <th>{t.messages.colMessage}</th>
                      <th>{t.messages.colStatus}</th>
                      <th style={{ textAlign: 'right' }}>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map(msg => (
                      <tr key={msg.id} className={msg.status === 'new' ? 'unread-row' : ''}>
                        <td className="col-name">{msg.name}</td>
                        <td className="col-email">{msg.email}</td>
                        <td className="col-company">{msg.company || '-'}</td>
                        <td className="col-role">{msg.role || '-'}</td>
                        <td className="col-msg-text">{msg.message || msg.text}</td>
                        <td className="col-status">
                          <span className={`status-badge ${msg.status === 'new' ? 'status-badge-new' : 'status-badge-read'}`}>
                            {msg.status === 'new' ? t.messages.statusNew : t.messages.statusRead}
                          </span>
                        </td>
                        <td className="col-actions">
                          {msg.status === 'new' && (
                            <button 
                              className="action-icon-btn check-btn" 
                              title="Mark as read"
                              onClick={async () => {
                                try {
                                  const res = await adminFetch(`${window.API_BASE_URL}/api/messages/${msg.id}/`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'read' })
                                  });
                                  if (res.ok) {
                                    setMessages(messages.map(m => m.id === msg.id ? { ...m, status: 'read' } : m));
                                    // Update dashboard stats overview
                                    const statsRes = await adminFetch(window.API_BASE_URL + '/api/dashboard/stats/');
                                    if (statsRes.ok) {
                                      const newStats = await statsRes.json();
                                      setDashboardStats(newStats);
                                    }
                                  }
                                } catch (err) {
                                  console.error('Error updating message:', err);
                                }
                              }}
                            >
                              <CheckCircle2 size={14} />
                            </button>
                          )}
                          <button 
                            className="action-icon-btn delete-btn" 
                            title="Delete"
                            onClick={async () => {
                              try {
                                const res = await adminFetch(`${window.API_BASE_URL}/api/messages/${msg.id}/`, {
                                  method: 'DELETE'
                                });
                                if (res.ok) {
                                  setMessages(messages.filter(m => m.id !== msg.id));
                                  // Update dashboard stats overview
                                  const statsRes = await adminFetch(window.API_BASE_URL + '/api/dashboard/stats/');
                                  if (statsRes.ok) {
                                    const newStats = await statsRes.json();
                                    setDashboardStats(newStats);
                                  }
                                }
                              } catch (err) {
                                console.error('Error deleting message:', err);
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 1. ADD CATEGORY MODAL */}
      {showCategoryModal && (
        <AdminDialog label={tr("Kategoriya","Category")} onClose={()=>setShowCategoryModal(false)}>
          <div className="admin-modal-card glass-panel alert-style-modal">
            <div className="admin-modal-header">
              <h3>{tr("Yangi kategoriya qo'shish","Add New Category")}</h3>
            </div>
            <form onSubmit={handleCategorySubmit} className="admin-modal-form">
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>UZ {tr("Kategoriya nomi","Category Name")}</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Veb-saytlar"
                    value={newCategoryNameUz}
                    onChange={(e) => setNewCategoryNameUz(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="editor-input-group">
                  <label>RU {tr("Kategoriya nomi","Category Name")}</label>
                  <input 
                    type="text" 
                    placeholder="Например: Веб-сайты"
                    value={newCategoryNameRu}
                    onChange={(e) => setNewCategoryNameRu(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>ENG {tr("Kategoriya nomi","Category Name")}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Web Sites"
                    value={newCategoryNameEn}
                    onChange={(e) => setNewCategoryNameEn(e.target.value)}
                  />
                </div>
                <div className="editor-input-group">
                  <label>JP {tr("Kategoriya nomi","Category Name")}</label>
                  <input 
                    type="text" 
                    placeholder="例：ウェブサイト"
                    value={newCategoryNameJp}
                    onChange={(e) => setNewCategoryNameJp(e.target.value)}
                  />
                </div>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategoryNameUz('');
                  setNewCategoryNameRu('');
                  setNewCategoryNameEn('');
                  setNewCategoryNameJp('');
                }}>
                  {tr("Bekor qilish","Cancel")}
                </button>
                <button type="submit" className="submit-btn">
                  {tr("Qo'shish","Add")}
                </button>
              </div>
            </form>
          </div>
        </AdminDialog>
      )}

      {/* 2. ADD PROJECT MODAL */}
      {showProjectModal && (
        <AdminDialog label={tr("Loyiha","Title")} onClose={()=>setShowProjectModal(false)}>
          <div className="admin-modal-card glass-panel project-modal-card">
            <div className="admin-modal-header">
              <h3>{editingProject ? (tr("Loyihani tahrirlash","Edit Project")) : (tr("Yangi loyiha qo'shish","Add New Project"))}</h3>
            </div>
            <form onSubmit={handleProjectSubmit} className="admin-modal-form">
              
              {/* Project Name */}
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>UZ {tr("Loyiha nomi","Title")}</label>
                  <input 
                    type="text" 
                    placeholder="Loyiha nomini o'zbekcha kiriting"
                    value={projectForm.title_uz}
                    onChange={(e) => setProjectForm({ ...projectForm, title_uz: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="editor-input-group">
                  <label>RU {tr("Loyiha nomi","Title")}</label>
                  <input 
                    type="text" 
                    placeholder="Введите название проекта на русском"
                    value={projectForm.title_ru}
                    onChange={(e) => setProjectForm({ ...projectForm, title_ru: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>ENG {tr("Loyiha nomi","Title")}</label>
                  <input 
                    type="text" 
                    placeholder="Enter project title in English"
                    value={projectForm.title_en}
                    onChange={(e) => setProjectForm({ ...projectForm, title_en: e.target.value })}
                  />
                </div>
                <div className="editor-input-group">
                  <label>JP {tr("Loyiha nomi","Title")}</label>
                  <input 
                    type="text" 
                    placeholder="日本語でプロジェクト名を入力してください"
                    value={projectForm.title_jp}
                    onChange={(e) => setProjectForm({ ...projectForm, title_jp: e.target.value })}
                  />
                </div>
              </div>

              {/* Category Selector */}
              <div className="editor-input-group">
                <label>{tr("Kategoriya","Category")}</label>
                <select 
                  className="editor-select"
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Project Type selection (PDF or Image) */}
              <div className="editor-input-group">
                <label>{tr("Loyiha turi","Project Type")}</label>
                <div className="project-type-toggle-group">
                  <button 
                    type="button"
                    disabled={!!editingProject || uploadingImages || uploadingCover}
                    className={`type-toggle-btn ${projectForm.type === 'pdf' ? 'active-type' : ''}`}
                    onClick={() => setProjectForm({ ...projectForm, type: 'pdf', file: null, files: [], fileName: '' })}
                  >{tr("PDF hujjat","PDF Document")}</button>
                  <button 
                    type="button"
                    disabled={!!editingProject || uploadingImages || uploadingCover}
                    className={`type-toggle-btn ${projectForm.type === 'image' ? 'active-type' : ''}`}
                    onClick={() => setProjectForm({ ...projectForm, type: 'image', file: null, files: [], fileName: '' })}
                  >{tr("Rasm galereyasi","Image Gallery")}</button>
                </div>
              </div>

              <div className="editor-input-group upload-input-group">
                <label>{projectForm.type === 'pdf' ? tr('PDF hujjat','PDF document') : (tr("Loyiha rasmlari","Project images"))}</label>
                {projectForm.type === 'pdf' ? <input type="file" accept="application/pdf" onChange={e => { const file=e.target.files[0]; if(file && (file.type!=='application/pdf'||file.size>25*1024*1024)){setProjectError('Choose a PDF smaller than 25 MB.');e.target.value='';return;} setProjectError('');setProjectForm(p=>({...p,file:file||null,fileName:file?.name||''})); }} /> : <ImageUpload key="gallery" value={projectForm.files||[]} language={language} onBusy={setUploadingImages} onChange={files=>setProjectForm(p=>({...p,files,fileName:files.length+' images'}))}/>}
                {editingProject && projectForm.type==='image' && <div className="upload-previews">{(projectForm.keptImages||[]).map((image,index)=><div key={image.id} className="upload-preview"><img src={image.image} alt={'Image '+(index+1)}/><div><button type="button" aria-label={tr("Rasmni oldinga","Move image earlier")} disabled={index===0} onClick={()=>setProjectForm(form=>{const next=[...form.keptImages];[next[index-1],next[index]]=[next[index],next[index-1]];return {...form,keptImages:next};})}>←</button><button type="button" aria-label={tr("Rasmni keyinga","Move image later")} disabled={index===(projectForm.keptImages.length-1)} onClick={()=>setProjectForm(form=>{const next=[...form.keptImages];[next[index+1],next[index]]=[next[index],next[index+1]];return {...form,keptImages:next};})}>→</button><button type="button" aria-label={tr("Rasmni olib tashlash","Remove image")} onClick={()=>setProjectForm(form=>({...form,keptImages:form.keptImages.filter(item=>item.id!==image.id)}))}><X size={16}/></button></div></div>)}</div>}

              </div>
              <div className="editor-input-group upload-input-group">
                <label>{tr("Loyiha muqovasi","Cover image")}</label>
                <ImageUpload kind="cover" language={language} value={projectForm.coverImage?[projectForm.coverImage]:[]} existing={[editingProject?.cover_image]} onBusy={setUploadingCover} onChange={files=>setProjectForm(p=>({...p,coverImage:files[0]||null,coverImageName:files[0]?.name||''}))}/>
              </div>
              {projectError && <p className="upload-error" role="alert">{projectError}</p>}

              {/* Description */}
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>UZ {tr("Tavsif","Description")}</label>
                  <textarea 
                    rows={2}
                    placeholder="Loyiha tavsifini o'zbekcha yozing..."
                    value={projectForm.description_uz}
                    onChange={(e) => setProjectForm({ ...projectForm, description_uz: e.target.value })}
                    required
                  />
                </div>
                <div className="editor-input-group">
                  <label>RU {tr("Tavsif","Description")}</label>
                  <textarea 
                    rows={2}
                    placeholder="Описание проекта на русском..."
                    value={projectForm.description_ru}
                    onChange={(e) => setProjectForm({ ...projectForm, description_ru: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>ENG {tr("Tavsif","Description")}</label>
                  <textarea 
                    rows={2}
                    placeholder="Project description in English..."
                    value={projectForm.description_en}
                    onChange={(e) => setProjectForm({ ...projectForm, description_en: e.target.value })}
                  />
                </div>
                <div className="editor-input-group">
                  <label>JP {tr("Tavsif","Description")}</label>
                  <textarea 
                    rows={2}
                    placeholder="日本語のプロジェクト説明..."
                    value={projectForm.description_jp}
                    onChange={(e) => setProjectForm({ ...projectForm, description_jp: e.target.value })}
                  />
                </div>
              </div>

              {/* Hashtags split inputs */}
              <div className="hashtags-dual-inputs">
                <div className="editor-input-group">
                  <label>{tr("Asosiy Hashtag","Main Hashtag")}</label>
                  <input 
                    type="text" 
                    placeholder={tr("Masalan: presentation","e.g. presentation")}
                    value={projectForm.mainHashtag}
                    onChange={(e) => setProjectForm({ ...projectForm, mainHashtag: e.target.value })}
                    required
                  />
                </div>

                <div className="editor-input-group">
                  <label>{tr("Oddiy Hashtaglar","Regular Hashtags")}</label>
                  <input 
                    type="text" 
                    placeholder={tr("Masalan: #deck #powerpoint","e.g. #deck #powerpoint")}
                    value={projectForm.regularHashtags}
                    onChange={(e) => setProjectForm({ ...projectForm, regularHashtags: e.target.value })}
                    required
                  />
                </div>
              </div>

            {/* Action Buttons */}
            <div className="admin-modal-actions">
              <button type="button" className="cancel-btn" onClick={() => {
                setShowProjectModal(false);
                setEditingProject(null);
                setProjectForm({
                  title_uz: '',
                  title_ru: '',
                  title_en: '',
                  title_jp: '',
                  category: categories[0]?.id || '',
                  type: 'image',
                  file: null,
                  fileName: '',
                  coverImage: null,
                  coverImageName: '',
                  description_uz: '',
                  description_ru: '',
                  description_en: '',
                  description_jp: '',
                  mainHashtag: '',
                  regularHashtags: ''
                });
              }}>
                {tr("Bekor qilish","Cancel")}
                </button>
                <button type="submit" className="submit-btn" disabled={uploadingImages || uploadingCover || savingProject}>
                  {savingProject ? (tr("Saqlanmoqda…","Saving…")) : editingProject ? (tr("Saqlash","Save")) : (tr("Qo'shish","Add"))}
                </button>
              </div>
            </form>
          </div>
        </AdminDialog>
      )}

      {/* 3. ADD CERTIFICATE MODAL */}
      {showCertModal && (
        <AdminDialog label={tr("Sertifikat","Certificates")} onClose={()=>setShowCertModal(false)}>
          <div className="admin-modal-card glass-panel project-modal-card">
            <div className="admin-modal-header">
              <h3>{editingCert ? (tr("Sertifikatni tahrirlash","Edit Certificate")) : (tr("Yangi sertifikat qo'shish","Add New Certificate"))}</h3>
            </div>
            <form onSubmit={handleCertSubmit} className="admin-modal-form">
              
              {/* Cover Image Upload field */}
              <div className="editor-input-group upload-input-group">
                <label>{tr("Sertifikat muqovasi (Cover Image)","Certificate Cover Image")}</label>
                <div className="custom-file-upload-wrap">
                  <input 
                    type="file" 
                    id="cert-cover-input"
                    accept="image/*"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile) {
                        setCertForm({ 
                          ...certForm, 
                          coverImage: selectedFile, 
                          coverImageName: selectedFile.name 
                        });
                      }
                    }}
                    required={!editingCert}
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="custom-upload-trigger-btn"
                    onClick={() => document.getElementById('cert-cover-input').click()}
                  >
                    <Upload size={16} />
                    <span>
                      {certForm.coverImageName 
                        ? certForm.coverImageName 
                        : (tr("Muqova rasmini tanlash","Choose cover image"))
                      }
                    </span>
                  </button>
                </div>
              </div>

              {/* Certificate Name in 4 languages */}
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>UZ {tr("Sertifikat nomi","Title")}</label>
                  <input 
                    type="text" 
                    placeholder="Sertifikat nomini o'zbekcha kiriting"
                    value={certForm.title_uz || ''}
                    onChange={(e) => setCertForm({ ...certForm, title_uz: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="editor-input-group">
                  <label>RU {tr("Sertifikat nomi","Title")}</label>
                  <input 
                    type="text" 
                    placeholder="Введите название сертификата на русском"
                    value={certForm.title_ru || ''}
                    onChange={(e) => setCertForm({ ...certForm, title_ru: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>ENG {tr("Sertifikat nomi","Title")}</label>
                  <input 
                    type="text" 
                    placeholder="Enter certificate name in English"
                    value={certForm.title_en || ''}
                    onChange={(e) => setCertForm({ ...certForm, title_en: e.target.value })}
                  />
                </div>
                <div className="editor-input-group">
                  <label>JP {tr("Sertifikat nomi","Title")}</label>
                  <input 
                    type="text" 
                    placeholder="日本語で証明書名を入力してください"
                    value={certForm.title_jp || ''}
                    onChange={(e) => setCertForm({ ...certForm, title_jp: e.target.value })}
                  />
                </div>
              </div>

              {/* PDF File Upload field */}
              <div className="form-row-grid-2"><label className="editor-input-group">{t.certificates.colOrg}<input value={certForm.organization||''} maxLength={255} onChange={event=>setCertForm({...certForm,organization:event.target.value})}/></label><label className="editor-input-group">{t.certificates.colYear}<input value={certForm.year||''} inputMode="numeric" pattern="[0-9]{4}" maxLength={4} onChange={event=>setCertForm({...certForm,year:event.target.value})}/></label></div>
              <div className="editor-input-group upload-input-group">
                <label>{tr("PDF Fayli","PDF File")}</label>
                <div className="custom-file-upload-wrap">
                  <input 
                    type="file" 
                    id="cert-pdf-input"
                    accept="application/pdf"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile) {
                        setCertForm({ 
                          ...certForm, 
                          pdfFile: selectedFile, 
                          pdfFileName: selectedFile.name 
                        });
                      }
                    }}
                    required={!editingCert}
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="custom-upload-trigger-btn"
                    onClick={() => document.getElementById('cert-pdf-input').click()}
                  >
                    <Upload size={16} />
                    <span>
                      {certForm.pdfFileName 
                        ? certForm.pdfFileName 
                        : (tr("PDF faylini tanlash","Choose PDF file"))
                      }
                    </span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowCertModal(false);
                  setEditingCert(null);
                  setCertForm({
                    title_uz: '',
                    title_ru: '',
                    title_en: '',
                    title_jp: '',
                    coverImage: null,
                    coverImageName: '',
                    pdfFile: null,
                    pdfFileName: '', organization: '', year: ''
                  });
                }}>
                  {tr("Bekor qilish","Cancel")}
                </button>
                <button type="submit" className="submit-btn">
                  {editingCert ? (tr("Saqlash","Save")) : (tr("Qo'shish","Add"))}
                </button>
              </div>
            </form>
          </div>
        </AdminDialog>
      )}

      {/* 4. ADD SKILL MODAL */}
      {showSkillModal && (
        <AdminDialog label={tr("Ko‘nikma","Skills")} onClose={()=>setShowSkillModal(false)}>
          <div className="admin-modal-card glass-panel alert-style-modal project-modal-card">
            <div className="admin-modal-header">
              <h3>{tr("Yangi ko'nikma qo'shish","Add New Skill")}</h3>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!skillForm.name_uz.trim()) return;
              const formData = new FormData();
              formData.append('name_uz', skillForm.name_uz.trim());
              formData.append('name_ru', skillForm.name_ru.trim());
              formData.append('name_en', skillForm.name_en.trim());
              formData.append('name_jp', skillForm.name_jp.trim());
              formData.append('name', skillForm.name_uz.trim());
              formData.append('level', skillForm.level);
              formData.append('type', 'Software');
              if (skillForm.image) {
                formData.append('image', skillForm.image);
              }
              try {
                const res = await adminFetch(window.API_BASE_URL + '/api/skills/', {
                  method: 'POST',
                  body: formData,
                });
                if (res.ok) {
                  const data = await res.json();
                  setSkills([...skills, data]);
                  setShowSkillModal(false);
                  setSkillForm({
                    name_uz: '',
                    name_ru: '',
                    name_en: '',
                    name_jp: '',
                    level: 90,
                    image: null,
                    imageName: ''
                  });
                }
              } catch (err) {
                console.error('Error adding skill:', err);
              }
            }} className="admin-modal-form">
              
              {/* Skill Name in 4 languages */}
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>UZ {tr("Ko'nikma nomi","Skill Name")}</label>
                  <input 
                    type="text" 
                    placeholder="Ko'nikma nomini o'zbekcha kiriting"
                    value={skillForm.name_uz || ''}
                    onChange={(e) => setSkillForm({ ...skillForm, name_uz: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="editor-input-group">
                  <label>RU {tr("Ko'nikma nomi","Skill Name")}</label>
                  <input 
                    type="text" 
                    placeholder="Введите название навыка на русском"
                    value={skillForm.name_ru || ''}
                    onChange={(e) => setSkillForm({ ...skillForm, name_ru: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>ENG {tr("Ko'nikma nomi","Skill Name")}</label>
                  <input 
                    type="text" 
                    placeholder="Enter skill name in English"
                    value={skillForm.name_en || ''}
                    onChange={(e) => setSkillForm({ ...skillForm, name_en: e.target.value })}
                  />
                </div>
                <div className="editor-input-group">
                  <label>JP {tr("Ko'nikma nomi","Skill Name")}</label>
                  <input 
                    type="text" 
                    placeholder="日本語でスキル名を入力してください"
                    value={skillForm.name_jp || ''}
                    onChange={(e) => setSkillForm({ ...skillForm, name_jp: e.target.value })}
                  />
                </div>
              </div>

              {/* Skill Level */}
              <div className="editor-input-group">
                <label>{tr("Daraja (%)","Level (%)")}</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) || 90 })}
                  required
                />
              </div>

              {/* Skill Icon Upload field */}
              <div className="editor-input-group upload-input-group">
                <label>{tr("Ko'nikma belgisi (Icon / Image)","Skill Icon / Image")}</label>
                <div className="custom-file-upload-wrap">
                  <input 
                    type="file" 
                    id="skill-image-input"
                    accept="image/*"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile) {
                        setSkillForm({ 
                          ...skillForm, 
                          image: selectedFile, 
                          imageName: selectedFile.name 
                        });
                      }
                    }}
                    required
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="custom-upload-trigger-btn"
                    onClick={() => document.getElementById('skill-image-input').click()}
                  >
                    <Upload size={16} />
                    <span>
                      {skillForm.imageName 
                        ? skillForm.imageName 
                        : (tr("Rasm yuklash","Upload Image"))
                      }
                    </span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowSkillModal(false);
                  setSkillForm({
                    name_uz: '',
                    name_ru: '',
                    name_en: '',
                    name_jp: '',
                    level: 90,
                    image: null,
                    imageName: ''
                  });
                }}>
                  {tr("Bekor qilish","Cancel")}
                </button>
                <button type="submit" className="submit-btn">
                  {tr("Qo'shish","Add")}
                </button>
              </div>
            </form>
          </div>
        </AdminDialog>
      )}

      {/* 5. ADD JOB MODAL */}
      {showJobModal && (
        <AdminDialog label={tr("Ish tajribasi","Work Experience")} onClose={()=>setShowJobModal(false)}>
          <div className="admin-modal-card glass-panel project-modal-card">
            <div className="admin-modal-header">
              <h3>{tr("Yangi ish tajribasi qo'shish","Add Work Experience")}</h3>
            </div>
            <form onSubmit={handleJobSubmit} className="admin-modal-form">
              
              {/* Start and End Years */}
              <div className="hashtags-dual-inputs">
                {/* Start Year */}
                <div className="editor-input-group">
                  <label>{tr("Boshlanish yili","Start Year")}</label>
                  <input 
                    type="number" 
                    min="1990" 
                    max="2030"
                    placeholder="2023"
                    value={jobForm.startYear}
                    onChange={(e) => setJobForm({ ...jobForm, startYear: e.target.value })}
                    required
                  />
                </div>

                {/* End Year */}
                <div className="editor-input-group">
                  <label>{tr("Tugash yili","End Year")}</label>
                  <div className="end-year-toggle-wrap">
                    <input 
                      type="number" 
                      min="1990" 
                      max="2030"
                      placeholder="2026"
                      value={jobForm.endYear}
                      onChange={(e) => setJobForm({ ...jobForm, endYear: e.target.value })}
                      disabled={jobForm.isCurrent}
                      required={!jobForm.isCurrent}
                    />
                    <label className="checkbox-toggle-label">
                      <input 
                        type="checkbox" 
                        checked={jobForm.isCurrent}
                        onChange={(e) => setJobForm({ ...jobForm, isCurrent: e.target.checked })}
                      />
                      <span>{tr("Hozir (Present)","Present")}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Role Title in 4 languages */}
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>UZ {tr("Lavozim nomi (Role)","Job Title")}</label>
                  <input 
                    type="text" 
                    placeholder="Lavozim nomini o'zbekcha kiriting"
                    value={jobForm.role_uz || ''}
                    onChange={(e) => setJobForm({ ...jobForm, role_uz: e.target.value })}
                    required
                  />
                </div>
                <div className="editor-input-group">
                  <label>RU {tr("Lavozim nomi (Role)","Job Title")}</label>
                  <input 
                    type="text" 
                    placeholder="Название должности на русском"
                    value={jobForm.role_ru || ''}
                    onChange={(e) => setJobForm({ ...jobForm, role_ru: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>ENG {tr("Lavozim nomi (Role)","Job Title")}</label>
                  <input 
                    type="text" 
                    placeholder="Job title in English"
                    value={jobForm.role_en || ''}
                    onChange={(e) => setJobForm({ ...jobForm, role_en: e.target.value })}
                  />
                </div>
                <div className="editor-input-group">
                  <label>JP {tr("Lavozim nomi (Role)","Job Title")}</label>
                  <input 
                    type="text" 
                    placeholder="日本語で職位名を入力してください"
                    value={jobForm.role_jp || ''}
                    onChange={(e) => setJobForm({ ...jobForm, role_jp: e.target.value })}
                  />
                </div>
              </div>

              {/* Company Name in 4 languages */}
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>UZ {tr("Kompaniya nomi (Company)","Organization")}</label>
                  <input 
                    type="text" 
                    placeholder="Kompaniya nomini o'zbekcha kiriting"
                    value={jobForm.company_uz || ''}
                    onChange={(e) => setJobForm({ ...jobForm, company_uz: e.target.value })}
                    required
                  />
                </div>
                <div className="editor-input-group">
                  <label>RU {tr("Kompaniya nomi (Company)","Organization")}</label>
                  <input 
                    type="text" 
                    placeholder="Название компании на русском"
                    value={jobForm.company_ru || ''}
                    onChange={(e) => setJobForm({ ...jobForm, company_ru: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>ENG {tr("Kompaniya nomi (Company)","Organization")}</label>
                  <input 
                    type="text" 
                    placeholder="Company name in English"
                    value={jobForm.company_en || ''}
                    onChange={(e) => setJobForm({ ...jobForm, company_en: e.target.value })}
                  />
                </div>
                <div className="editor-input-group">
                  <label>JP {tr("Kompaniya nomi (Company)","Organization")}</label>
                  <input 
                    type="text" 
                    placeholder="日本語で会社名を入力してください"
                    value={jobForm.company_jp || ''}
                    onChange={(e) => setJobForm({ ...jobForm, company_jp: e.target.value })}
                  />
                </div>
              </div>

              {/* Logo Upload field */}
              <div className="editor-input-group upload-input-group">
                <label>{tr("Kompaniya Logotipi (Logo)","Company Logo")}</label>
                <div className="custom-file-upload-wrap">
                  <input 
                    type="file" 
                    id="job-logo-input"
                    accept="image/*"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile) {
                        setJobForm({ 
                          ...jobForm, 
                          logo: selectedFile, 
                          logoName: selectedFile.name 
                        });
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="custom-upload-trigger-btn"
                    onClick={() => document.getElementById('job-logo-input').click()}
                  >
                    <Upload size={16} />
                    <span>
                      {jobForm.logoName 
                        ? jobForm.logoName 
                        : (tr("Rasm yuklash (Ixtiyoriy)","Upload Image (Optional)"))
                      }
                    </span>
                  </button>
                </div>
              </div>

              {/* Description in 4 languages */}
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>UZ {tr("Batafsil tavsif (Description)","Description")}</label>
                  <textarea 
                    rows={3}
                    placeholder="Batafsil tavsifni o'zbekcha yozing..."
                    value={jobForm.desc_uz || ''}
                    onChange={(e) => setJobForm({ ...jobForm, desc_uz: e.target.value })}
                    required
                  />
                </div>
                <div className="editor-input-group">
                  <label>RU {tr("Batafsil tavsif (Description)","Description")}</label>
                  <textarea 
                    rows={3}
                    placeholder="Описание обязанностей на русском..."
                    value={jobForm.desc_ru || ''}
                    onChange={(e) => setJobForm({ ...jobForm, desc_ru: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>ENG {tr("Batafsil tavsif (Description)","Description")}</label>
                  <textarea 
                    rows={3}
                    placeholder="Detailed description in English..."
                    value={jobForm.desc_en || ''}
                    onChange={(e) => setJobForm({ ...jobForm, desc_en: e.target.value })}
                  />
                </div>
                <div className="editor-input-group">
                  <label>JP {tr("Batafsil tavsif (Description)","Description")}</label>
                  <textarea 
                    rows={3}
                    placeholder="日本語で詳しい説明を入力してください..."
                    value={jobForm.desc_jp || ''}
                    onChange={(e) => setJobForm({ ...jobForm, desc_jp: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowJobModal(false);
                  setJobForm({
                    role_uz: '',
                    role_ru: '',
                    role_en: '',
                    role_jp: '',
                    company_uz: '',
                    company_ru: '',
                    company_en: '',
                    company_jp: '',
                    startYear: new Date().getFullYear().toString(),
                    endYear: new Date().getFullYear().toString(),
                    isCurrent: false,
                    desc_uz: '',
                    desc_ru: '',
                    desc_en: '',
                    desc_jp: '',
                    logo: null,
                    logoName: ''
                  });
                }}>
                  {tr("Bekor qilish","Cancel")}
                </button>
                <button type="submit" className="submit-btn">
                  {tr("Qo'shish","Add")}
                </button>
              </div>
            </form>
          </div>
        </AdminDialog>
      )}

      {/* 5.1. ADD EDUCATION MODAL */}
      {showEducationModal && (
        <AdminDialog label={tr("Ta’lim","Education")} onClose={()=>setShowEducationModal(false)}>
          <div className="admin-modal-card glass-panel project-modal-card">
            <div className="admin-modal-header">
              <h3>{editingEducation ? (tr("Ta'limni tahrirlash","Edit Education")) : (tr("Yangi ta'lim qo'shish","Add New Education"))}</h3>
            </div>
            <form onSubmit={handleEducationSubmit} className="admin-modal-form">
              
              {/* Institution Name in 4 languages */}
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>UZ {tr("Muassasa nomi (Name)","Institution Name")}</label>
                  <input 
                    type="text" 
                    placeholder="Muassasa nomini o'zbekcha kiriting"
                    value={educationForm.name_uz || ''}
                    onChange={(e) => setEducationForm({ ...educationForm, name_uz: e.target.value })}
                    required
                  />
                </div>
                <div className="editor-input-group">
                  <label>RU {tr("Muassasa nomi (Name)","Institution Name")}</label>
                  <input 
                    type="text" 
                    placeholder="Название учреждения на русском"
                    value={educationForm.name_ru || ''}
                    onChange={(e) => setEducationForm({ ...educationForm, name_ru: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>ENG {tr("Muassasa nomi (Name)","Institution Name")}</label>
                  <input 
                    type="text" 
                    placeholder="Institution name in English"
                    value={educationForm.name_en || ''}
                    onChange={(e) => setEducationForm({ ...educationForm, name_en: e.target.value })}
                  />
                </div>
                <div className="editor-input-group">
                  <label>JP {tr("Muassasa nomi (Name)","Institution Name")}</label>
                  <input 
                    type="text" 
                    placeholder="日本語で機関名を入力してください"
                    value={educationForm.name_jp || ''}
                    onChange={(e) => setEducationForm({ ...educationForm, name_jp: e.target.value })}
                  />
                </div>
              </div>

              {/* Period / Duration */}
              <div className="editor-input-group">
                <label>{tr("Davomiyligi (yil hisobida, masalan: 2020-2024 yoki 4 yil)","Duration (in years, e.g. 2020-2024 or 4 years)")}</label>
                <input 
                  type="text" 
                  placeholder="2020 - 2024"
                  value={educationForm.period || ''}
                  onChange={(e) => setEducationForm({ ...educationForm, period: e.target.value })}
                  required
                />
              </div>

              {/* Logo Upload field */}
              <div className="editor-input-group upload-input-group">
                <label>{tr("Muassasa Logotipi (Logo)","Institution Logo")}</label>
                <div className="custom-file-upload-wrap">
                  <input 
                    type="file" 
                    id="education-logo-input"
                    accept="image/*"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];
                      if (selectedFile) {
                        setEducationForm({ 
                          ...educationForm, 
                          logo: selectedFile, 
                          logoName: selectedFile.name 
                        });
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="custom-upload-trigger-btn"
                    onClick={() => document.getElementById('education-logo-input').click()}
                  >
                    <Upload size={16} />
                    <span>
                      {educationForm.logoName 
                        ? educationForm.logoName 
                        : (tr("Rasm yuklash (Ixtiyoriy)","Upload Image (Optional)"))
                      }
                    </span>
                  </button>
                </div>
              </div>

              {/* Description in 4 languages */}
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>UZ {tr("Batafsil tavsif (Description)","Description")}</label>
                  <textarea 
                    rows={3}
                    placeholder="Batafsil tavsifni o'zbekcha yozing..."
                    value={educationForm.description_uz || ''}
                    onChange={(e) => setEducationForm({ ...educationForm, description_uz: e.target.value })}
                    required
                  />
                </div>
                <div className="editor-input-group">
                  <label>RU {tr("Batafsil tavsif (Description)","Description")}</label>
                  <textarea 
                    rows={3}
                    placeholder="Описание на русском..."
                    value={educationForm.description_ru || ''}
                    onChange={(e) => setEducationForm({ ...educationForm, description_ru: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>ENG {tr("Batafsil tavsif (Description)","Description")}</label>
                  <textarea 
                    rows={3}
                    placeholder="Detailed description in English..."
                    value={educationForm.description_en || ''}
                    onChange={(e) => setEducationForm({ ...educationForm, description_en: e.target.value })}
                  />
                </div>
                <div className="editor-input-group">
                  <label>JP {tr("Batafsil tavsif (Description)","Description")}</label>
                  <textarea 
                    rows={3}
                    placeholder="日本語で詳しい説明を入力してください..."
                    value={educationForm.description_jp || ''}
                    onChange={(e) => setEducationForm({ ...educationForm, description_jp: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowEducationModal(false);
                  setEducationForm({
                    name_uz: '',
                    name_ru: '',
                    name_en: '',
                    name_jp: '',
                    period: '',
                    description_uz: '',
                    description_ru: '',
                    description_en: '',
                    description_jp: '',
                    logo: null,
                    logoName: ''
                  });
                }}>
                  {tr("Bekor qilish","Cancel")}
                </button>
                <button type="submit" className="submit-btn">
                  {editingEducation ? (tr("Saqlash","Save")) : (tr("Qo'shish","Add"))}
                </button>
              </div>
            </form>
          </div>
        </AdminDialog>
      )}

      {/* 6. ADD PERSONAL SKILL MODAL */}
      {showPersonalSkillModal && (
        <AdminDialog label={tr("Shaxsiy ko‘nikma","Personal Skills")} onClose={()=>setShowPersonalSkillModal(false)}>
          <div className="admin-modal-card glass-panel alert-style-modal project-modal-card">
            <div className="admin-modal-header">
              <h3>{tr("Shaxsiy ko'nikma qo'shish","Add Personal Skill")}</h3>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!personalSkillForm.name_uz.trim()) return;
              const formData = new FormData();
              formData.append('name_uz', personalSkillForm.name_uz.trim());
              formData.append('name_ru', personalSkillForm.name_ru.trim());
              formData.append('name_en', personalSkillForm.name_en.trim());
              formData.append('name_jp', personalSkillForm.name_jp.trim());
              formData.append('name', personalSkillForm.name_uz.trim());
              formData.append('level', 90);
              formData.append('type', 'Personal');
              try {
                const res = await adminFetch(window.API_BASE_URL + '/api/skills/', {
                  method: 'POST',
                  body: formData,
                });
                if (res.ok) {
                  const data = await res.json();
                  setSkills([...skills, data]);
                  setShowPersonalSkillModal(false);
                  setPersonalSkillForm({ name_uz: '', name_ru: '', name_en: '', name_jp: '' });
                }
              } catch (err) {
                console.error(err);
              }
            }} className="admin-modal-form">
              
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>UZ {tr("ko'nikma","Skill Name")}</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Stressga chidamlilik"
                    value={personalSkillForm.name_uz}
                    onChange={(e) => setPersonalSkillForm({ ...personalSkillForm, name_uz: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="editor-input-group">
                  <label>RU {tr("ko'nikma","Skill Name")}</label>
                  <input 
                    type="text" 
                    placeholder="Например: Стрессоустойчивость"
                    value={personalSkillForm.name_ru}
                    onChange={(e) => setPersonalSkillForm({ ...personalSkillForm, name_ru: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>ENG {tr("ko'nikma","Skill Name")}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Stress resistance"
                    value={personalSkillForm.name_en}
                    onChange={(e) => setPersonalSkillForm({ ...personalSkillForm, name_en: e.target.value })}
                  />
                </div>
                <div className="editor-input-group">
                  <label>JP {tr("ko'nikma","Skill Name")}</label>
                  <input 
                    type="text" 
                    placeholder="例：ストレス耐性"
                    value={personalSkillForm.name_jp}
                    onChange={(e) => setPersonalSkillForm({ ...personalSkillForm, name_jp: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowPersonalSkillModal(false);
                  setPersonalSkillForm({ name_uz: '', name_ru: '', name_en: '', name_jp: '' });
                }}>
                  {tr("Bekor qilish","Cancel")}
                </button>
                <button type="submit" className="submit-btn">
                  {tr("Qo'shish","Add")}
                </button>
              </div>
            </form>
          </div>
        </AdminDialog>
      )}

      {/* 7. ADD STRENGTH MODAL */}
      {showStrengthModal && (
        <AdminDialog label={tr("Kuchli tomon","Strengths")} onClose={()=>setShowStrengthModal(false)}>
          <div className="admin-modal-card glass-panel alert-style-modal project-modal-card">
            <div className="admin-modal-header">
              <h3>{tr("Kuchli tomon qo'shish","Add Strength")}</h3>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!strengthForm.text_uz.trim()) return;
              try {
                const res = await adminFetch(window.API_BASE_URL + '/api/traits/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    text_uz: strengthForm.text_uz.trim(),
                    text_ru: strengthForm.text_ru.trim(),
                    text_en: strengthForm.text_en.trim(),
                    text_jp: strengthForm.text_jp.trim(),
                    text: strengthForm.text_uz.trim(),
                    type: 'Strength'
                  })
                });
                if (res.ok) {
                  const data = await res.json();
                  setStrengths([...strengths, data]);
                  setShowStrengthModal(false);
                  setStrengthForm({ text_uz: '', text_ru: '', text_en: '', text_jp: '' });
                }
              } catch (err) {
                console.error(err);
              }
            }} className="admin-modal-form">
              
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>UZ {tr("kuchli tomonlar","Strengths")}</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Tafsilotga e'tiborli"
                    value={strengthForm.text_uz}
                    onChange={(e) => setStrengthForm({ ...strengthForm, text_uz: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="editor-input-group">
                  <label>RU {tr("kuchli tomonlar","Strengths")}</label>
                  <input 
                    type="text" 
                    placeholder="Например: Внимание к деталям"
                    value={strengthForm.text_ru}
                    onChange={(e) => setStrengthForm({ ...strengthForm, text_ru: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>ENG {tr("kuchli tomonlar","Strengths")}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Attention to detail"
                    value={strengthForm.text_en}
                    onChange={(e) => setStrengthForm({ ...strengthForm, text_en: e.target.value })}
                  />
                </div>
                <div className="editor-input-group">
                  <label>JP {tr("kuchli tomonlar","Strengths")}</label>
                  <input 
                    type="text" 
                    placeholder="例：細部へのこだわり"
                    value={strengthForm.text_jp}
                    onChange={(e) => setStrengthForm({ ...strengthForm, text_jp: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowStrengthModal(false);
                  setStrengthForm({ text_uz: '', text_ru: '', text_en: '', text_jp: '' });
                }}>
                  {tr("Bekor qilish","Cancel")}
                </button>
                <button type="submit" className="submit-btn">
                  {tr("Qo'shish","Add")}
                </button>
              </div>
            </form>
          </div>
        </AdminDialog>
      )}

      {/* 8. ADD WEAKNESS MODAL */}
      {showWeaknessModal && (
        <AdminDialog label={tr("Zaif tomon","Weaknesses")} onClose={()=>setShowWeaknessModal(false)}>
          <div className="admin-modal-card glass-panel alert-style-modal project-modal-card">
            <div className="admin-modal-header">
              <h3>{tr("Zaif tomon qo'shish","Add Weakness")}</h3>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!weaknessForm.text_uz.trim()) return;
              try {
                const res = await adminFetch(window.API_BASE_URL + '/api/traits/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    text_uz: weaknessForm.text_uz.trim(),
                    text_ru: weaknessForm.text_ru.trim(),
                    text_en: weaknessForm.text_en.trim(),
                    text_jp: weaknessForm.text_jp.trim(),
                    text: weaknessForm.text_uz.trim(),
                    type: 'Weakness'
                  })
                });
                if (res.ok) {
                  const data = await res.json();
                  setWeaknesses([...weaknesses, data]);
                  setShowWeaknessModal(false);
                  setWeaknessForm({ text_uz: '', text_ru: '', text_en: '', text_jp: '' });
                }
              } catch (err) {
                console.error(err);
              }
            }} className="admin-modal-form">
              
              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>UZ {tr("Zaif tomonlar","Weaknesses")}</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Ishga haddan tashqari berilib ketish"
                    value={weaknessForm.text_uz}
                    onChange={(e) => setWeaknessForm({ ...weaknessForm, text_uz: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="editor-input-group">
                  <label>RU {tr("Zaif tomonlar","Weaknesses")}</label>
                  <input 
                    type="text" 
                    placeholder="Например: Слишком сильная вовлеченность в работу"
                    value={weaknessForm.text_ru}
                    onChange={(e) => setWeaknessForm({ ...weaknessForm, text_ru: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-grid-2">
                <div className="editor-input-group">
                  <label>ENG {tr("Zaif tomonlar","Weaknesses")}</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Over-involvement in work"
                    value={weaknessForm.text_en}
                    onChange={(e) => setWeaknessForm({ ...weaknessForm, text_en: e.target.value })}
                  />
                </div>
                <div className="editor-input-group">
                  <label>JP {tr("Zaif tomonlar","Weaknesses")}</label>
                  <input 
                    type="text" 
                    placeholder="例：仕事への過度の没頭"
                    value={weaknessForm.text_jp}
                    onChange={(e) => setWeaknessForm({ ...weaknessForm, text_jp: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setShowWeaknessModal(false);
                  setWeaknessForm({ text_uz: '', text_ru: '', text_en: '', text_jp: '' });
                }}>
                  {tr("Bekor qilish","Cancel")}
                </button>
                <button type="submit" className="submit-btn">
                  {tr("Qo'shish","Add")}
                </button>
              </div>
            </form>
          </div>
        </AdminDialog>
      )}
    </div>
  );
}

