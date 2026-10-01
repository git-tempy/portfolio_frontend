import { useState } from 'react';
import { LogIn, Key, User, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import './AdminLogin.css';
import { saveAdminToken } from '../lib/adminApi';

const localLocales = {
  UZ: {
    title: "Tizimga kirish",
    subtitle: "Boshqaruv paneliga kirish uchun ma'lumotlarni kiriting",
    username: "Foydalanuvchi nomi",
    password: "Parol",
    loginBtn: "Kirish",
    backBtn: "Bosh sahifaga qaytish",
    invalidErr: "Foydalanuvchi nomi yoki parol noto'g'ri!",
    successMsg: "Muvaffaqiyatli kirildi! Boshqaruv paneli yuklanmoqda...",
  },
  ENG: {
    title: "Admin Portal Sign In",
    subtitle: "Enter credentials to access the administrative dashboard",
    username: "Username",
    password: "Password",
    loginBtn: "Sign In",
    backBtn: "Back to Home",
    invalidErr: "Invalid username or password!",
    successMsg: "Login successful! Loading dashboard...",
  },
  RU: {
    title: "Вход в систему",
    subtitle: "Введите данные для доступа к панели управления",
    username: "Имя пользователя",
    password: "Пароль",
    loginBtn: "Войти",
    backBtn: "На главную",
    invalidErr: "Неверное имя пользователя или пароль!",
    successMsg: "Успешный вход! Панель загружается...",
  },
  JP: {
    title: "管理者ログイン",
    subtitle: "管理ダッシュボードにアクセスするための資格情報を入力してください",
    username: "ユーザー名",
    password: "パスワード",
    loginBtn: "ログイン",
    backBtn: "ホームに戻る",
    invalidErr: "ユーザー名またはパスワードが正しくありません！",
    successMsg: "ログイン成功！ダッシュボードを読み込んでいます...",
  }
};

export default function AdminLogin({ language, onLoginSuccess, onBack }) {
  const t = localLocales[language] || localLocales['UZ'];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(window.API_BASE_URL + '/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        saveAdminToken(data.token);
        setSuccess(true);
        // Simulate redirection delay for rich feel
        setTimeout(() => {
          setLoading(false);
          onLoginSuccess();
        }, 1500);
      } else {
        setLoading(false);
        setError(data.error || t.invalidErr);
        // Trigger temporary vibration or shake style via resetting inputs focus
        const loginCard = document.querySelector('.login-card');
        if (loginCard) {
          loginCard.classList.add('shake-error');
          setTimeout(() => loginCard.classList.remove('shake-error'), 500);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      setError(language === 'UZ' ? 'Server bilan bog\'lanishda xatolik yuz berdi!' : 'Failed to connect to the server!');
      const loginCard = document.querySelector('.login-card');
      if (loginCard) {
        loginCard.classList.add('shake-error');
        setTimeout(() => loginCard.classList.remove('shake-error'), 500);
      }
    }
  };

  return (
    <section className="admin-login-section">
      <div className="login-background-shapes">
        <div className="login-orb login-orb-1"></div>
        <div className="login-orb login-orb-2"></div>
      </div>

      <div className="login-container">

        {/* Glassmorphic Login Card */}
        <div className={`login-card ${error ? 'card-error' : ''} ${success ? 'card-success' : ''}`}>
          <div className="login-card-header">
            <div className="login-logo-orb">
              <LogIn size={26} className="login-icon-glow" />
            </div>
            <h2 className="login-title">{t.title}</h2>
            <p className="login-subtitle">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Error Message Display */}
            {error && (
              <div className="login-error-alert">
                <AlertCircle size={16} className="alert-icon" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message Display */}
            {success && (
              <div className="login-success-alert">
                <CheckCircle2 size={16} className="alert-icon" />
                <span>{t.successMsg}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="login-input-group">
              <label htmlFor="username">{t.username}</label>
              <div className="input-icon-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  disabled={loading}
                  required
                  autoComplete="username"
                  className="login-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-input-group">
              <label htmlFor="password">{t.password}</label>
              <div className="input-icon-wrapper">
                <Key size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  disabled={loading}
                  required
                  autoComplete="current-password"
                  className="login-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  title="Toggle Password Visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`login-submit-btn ${loading ? 'loading-btn' : ''}`}
            >
              {loading ? (
                <div className="login-spinner"></div>
              ) : (
                <>
                  <span>{t.loginBtn}</span>
                  <LogIn size={16} />
                </>
              )}
            </button>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                style={{
                  marginTop: '0.75rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem'
                }}
              >
                <ArrowLeft size={16} />
                <span>{t.backBtn}</span>
              </button>
            )}
          </form>

          {/* Secure Hint Info */}
          <div className="login-footer-hint">
            <span>secure access protocols active</span>
          </div>
        </div>
      </div>
    </section>
  );
}
