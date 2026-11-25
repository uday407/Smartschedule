import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

/* ─────────────────────────── GLOBAL CSS ─────────────────────────── */
const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f6f9; color: #1e293b; }
  
  /* Scrollbars */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #f1f5f9; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }

  /* ── Navbar ── */
  .navbar {
    height: 60px;
    background: #1e293b;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,.2);
    position: sticky;
    top: 0;
    z-index: 200;
    gap: 10px;
  }
  .navbar-brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .navbar-logo  { background: linear-gradient(135deg,#3b82f6,#8b5cf6); width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
  .navbar-title { font-size:16px; font-weight:700; white-space:nowrap; }
  .navbar-title span { color:#60a5fa; font-size:10px; background:rgba(96,165,250,.2); padding:2px 7px; border-radius:12px; border:1px solid rgba(96,165,250,.4); margin-left:6px; }
  .navbar-actions { display:flex; align-items:center; gap:10px; }
  .navbar-api-link { color:#94a3b8; text-decoration:none; font-size:12px; display:flex; align-items:center; gap:4px; background:#334155; padding:5px 10px; border-radius:6px; white-space:nowrap; }
  .navbar-api-link:hover { background:#475569; }
  .navbar-user { display:flex; align-items:center; gap:10px; padding-left:12px; border-left:1px solid #334155; }
  .navbar-avatar { width:34px; height:34px; border-radius:50%; background:#3b82f6; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; color:white; flex-shrink:0; }
  .navbar-user-info { line-height:1.3; }
  .navbar-user-name { font-size:13px; font-weight:600; }
  .navbar-user-role { font-size:11px; color:#94a3b8; display:flex; align-items:center; gap:4px; }
  .navbar-user-dot  { width:7px; height:7px; border-radius:50%; display:inline-block; }
  .hamburger { display:none; background:#334155; border:none; color:white; padding:7px 10px; border-radius:6px; cursor:pointer; font-size:18px; flex-shrink:0; }

  /* ── Notification dropdown ── */
  .notif-btn { background:#334155; border:none; color:white; padding:7px 12px; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:7px; font-size:13px; white-space:nowrap; }
  .notif-btn:hover { background:#475569; }
  .notif-badge { background:#ef4444; color:white; border-radius:50%; padding:1px 5px; font-size:10px; font-weight:700; }
  .notif-dropdown { position:absolute; right:0; top:calc(100% + 8px); width:min(340px, 95vw); background:white; color:#1e293b; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,.2); z-index:1000; padding:14px; border:1px solid #e2e8f0; }
  .notif-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #e2e8f0; }
  .notif-close { border:none; background:none; cursor:pointer; font-size:16px; padding:2px 6px; }
  .notif-list  { max-height:280px; overflow-y:auto; }
  .notif-item  { padding:9px; border-bottom:1px solid #f1f5f9; border-radius:6px; margin-bottom:5px; }
  .notif-item-title { font-weight:600; font-size:12px; color:#1e3a8a; }
  .notif-item-msg   { font-size:11px; color:#475569; margin-top:2px; }
  .notif-item-time  { font-size:10px; color:#94a3b8; margin-top:3px; }

  /* ── Layout ── */
  .app-body { display:flex; min-height:calc(100vh - 60px); }

  /* ── Sidebar ── */
  .sidebar {
    width: 240px;
    background: white;
    border-right: 1px solid #e2e8f0;
    padding: 20px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-shrink: 0;
    overflow-y: auto;
    transition: transform .25s ease;
  }
  .sidebar-footer { margin-top:auto; padding-top:16px; border-top:1px solid #e2e8f0; }
  .sidebar-nav-btn {
    display:flex; align-items:center; gap:11px;
    padding:11px 14px; border-radius:8px; border:none;
    background:transparent; color:#475569;
    font-weight:500; font-size:13px; cursor:pointer;
    text-align:left; width:100%; transition:.15s;
  }
  .sidebar-nav-btn:hover  { background:#f8fafc; color:#1e293b; }
  .sidebar-nav-btn.active { background:#eff6ff; color:#1d4ed8; font-weight:700; }
  .sidebar-nav-btn .btn-icon  { font-size:17px; }
  .sidebar-nav-btn .btn-label { flex:1; }
  .sidebar-nav-btn .btn-badge { background:#f59e0b; color:white; font-size:9px; padding:2px 6px; border-radius:10px; font-weight:700; }
  .logout-btn { width:100%; padding:11px; background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; border-radius:8px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-size:13px; }
  .logout-btn:hover { background:#fecaca; }

  /* Overlay for mobile sidebar */
  .sidebar-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:150; }

  /* ── Main content ── */
  .main-content { flex:1; padding:24px; overflow-y:auto; min-width:0; }

  /* ── Cards / Grids ── */
  .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:18px; margin-bottom:28px; }
  .chart-grid  { display:grid; grid-template-columns:1fr 1fr; gap:22px; }
  .schedule-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:16px; }
  .rooms-grid    { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }

  /* ── Form ── */
  .form-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:12px; }
  .input-base { padding:10px 12px; border-radius:7px; border:1px solid #cbd5e1; width:100%; font-size:13px; background:white; color:#1e293b; }
  .input-base:focus { outline:2px solid #3b82f6; border-color:#3b82f6; }

  /* ── Approval row ── */
  .approval-row { background:white; padding:18px; border-radius:10px; display:flex; justify-content:space-between; align-items:center; gap:12px; box-shadow:0 2px 6px rgba(0,0,0,.05); flex-wrap:wrap; }
  .approval-actions { display:flex; gap:8px; flex-shrink:0; flex-wrap:wrap; }

  /* ── Audit row ── */
  .audit-row { padding:11px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; }

  /* ── Filter bar ── */
  .filter-bar { display:flex; gap:12px; margin-bottom:18px; align-items:center; flex-wrap:wrap; }
  .filter-bar .input-base { flex:1; min-width:160px; }

  /* ── Page header ── */
  .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px; }
  .page-header h2 { margin:0; font-size:clamp(16px,3vw,22px); }
  .header-actions { display:flex; gap:8px; flex-wrap:wrap; }

  /* ── Login ── */
  .login-wrap { display:flex; min-height:100vh; justify-content:center; align-items:center; background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%); padding:16px; }
  .login-card { background:rgba(30,41,59,.95); padding:clamp(24px,6vw,42px); border-radius:16px; width:100%; max-width:420px; box-shadow:0 20px 40px rgba(0,0,0,.4); border:1px solid rgba(255,255,255,.1); color:white; }
  .login-input { width:100%; padding:12px; border-radius:8px; border:1px solid #475569; background:#0f172a; color:white; font-size:14px; }
  .login-input:focus { outline:2px solid #3b82f6; }

  /* ── Responsive breakpoints ── */
  @media (max-width: 1024px) {
    .chart-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 768px) {
    .hamburger { display:flex; }
    .sidebar {
      position: fixed;
      top: 60px;
      left: 0;
      height: calc(100vh - 60px);
      z-index: 160;
      transform: translateX(-100%);
      width: 240px;
      box-shadow: 4px 0 16px rgba(0,0,0,.15);
    }
    .sidebar.open { transform: translateX(0); }
    .sidebar-overlay.open { display: block; }
    .main-content { padding: 16px; }
    .navbar-title span { display:none; }
    .navbar-api-link { display:none; }
    .navbar-user-info { display:none; }
    .stats-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:12px; }
    .schedule-grid { grid-template-columns: 1fr; }
    .rooms-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
    .form-grid { grid-template-columns: 1fr; }
    .approval-row { flex-direction: column; align-items: flex-start; }
    .chart-grid { grid-template-columns: 1fr; }
    .notif-dropdown { right: -40px; }
  }

  @media (max-width: 480px) {
    .navbar-title { font-size: 14px; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .header-actions { width: 100%; }
    .header-actions button { flex: 1; }
    .filter-bar { flex-direction: column; }
    .filter-bar .input-base { width: 100%; }
  }

  /* ── Print ── */
  @media print {
    .navbar, .sidebar, .hamburger, .sidebar-overlay, .page-header .header-actions, .filter-bar button, .logout-btn { display:none !important; }
    .app-body { display:block; }
    .main-content { padding:0; }
    .schedule-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

/* Inject global CSS once */
if (!document.getElementById('ss-global-style')) {
    const s = document.createElement('style');
    s.id = 'ss-global-style';
    s.textContent = globalCSS;
    document.head.appendChild(s);
}

/* ─────────────────────────── API ─────────────────────────── */
const getApiBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL;
    if (url) {
        url = url.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) url = `https://${url}`;
        url = url.endsWith('/') ? url.slice(0, -1) : url;
        if (url.includes('smartscheduler-backend.onrender.com') || url.includes('app-backend-94b1.onrender.com'))
            return 'https://smartscheduler-backend-us41.onrender.com';
        return url;
    }
    if (typeof window !== 'undefined' && window.location?.origin) {
        if (window.location.origin.includes('localhost')) return 'http://localhost:8080';
        return 'https://smartscheduler-backend-us41.onrender.com';
    }
    return 'http://localhost:8080';
};
const API_BASE_URL = getApiBaseUrl();

/* ─────────────────────────── Auth helpers ─────────────────────────── */
const getInitialUser = () => {
    try { const i = localStorage.getItem('user'); return (!i || i === 'undefined' || i === 'null') ? null : JSON.parse(i); }
    catch { localStorage.removeItem('user'); return null; }
};
const getInitialToken = () => {
    try { const t = localStorage.getItem('token'); return (!t || t === 'undefined' || t === 'null') ? null : t; }
    catch { localStorage.removeItem('token'); return null; }
};

/* ─────────────────────────── Axios interceptor ─────────────────────────── */
axios.interceptors.request.use(config => {
    const t = getInitialToken();
    if (t) config.headers['Authorization'] = `Bearer ${t}`;
    return config;
}, err => Promise.reject(err));

/* ══════════════════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════════════════ */
function App() {
    const [token, setToken] = useState(getInitialToken);
    const [user, setUser] = useState(getInitialUser);
    const [view, setView] = useState('analytics');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => { if (user) fetchNotifications(); }, [user]);

    // Close notification dropdown on outside click
    useEffect(() => {
        const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Close sidebar on route change (mobile)
    const navigate = (v) => { setView(v); setSidebarOpen(false); };

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/notifications?username=${user?.username || 'admin'}`);
            setNotifications(res.data);
        } catch { }
    };

    const handleLogin = (authData) => {
        localStorage.setItem('token', authData.token);
        const u = { username: authData.username, fullName: authData.fullName, role: authData.role, department: authData.department, mobile: authData.mobile };
        localStorage.setItem('user', JSON.stringify(u));
        setToken(authData.token); setUser(u);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); localStorage.removeItem('user');
        setToken(null); setUser(null);
    };

    if (!user || !token) return <LoginView onLogin={handleLogin} />;

    const notifList = Array.isArray(notifications) ? notifications : [];
    const unread = notifList.filter(n => !n.isRead).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {/* ── NAVBAR ── */}
            <header className="navbar">
                <div className="navbar-brand">
                    <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">☰</button>
                    <div className="navbar-logo">⚡</div>
                    <div className="navbar-title">SmartScheduler <span>PRO</span></div>
                </div>

                <div className="navbar-actions">
                    <a href={`${API_BASE_URL}/swagger-ui/index.html`} target="_blank" rel="noreferrer" className="navbar-api-link">📜 OpenAPI</a>

                    <div style={{ position: 'relative' }} ref={notifRef}>
                        <button className="notif-btn" onClick={() => setShowNotif(o => !o)}>
                            🔔 {unread > 0 && <span className="notif-badge">{unread}</span>}
                        </button>
                        {showNotif && (
                            <div className="notif-dropdown">
                                <div className="notif-header">
                                    <strong style={{ fontSize: '13px' }}>Notifications ({notifList.length})</strong>
                                    <button className="notif-close" onClick={() => setShowNotif(false)}>✕</button>
                                </div>
                                <div className="notif-list">
                                    {notifList.length === 0
                                        ? <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', padding: '10px' }}>No notifications</p>
                                        : notifList.map(n => (
                                            <div key={n.id} className="notif-item" style={{ background: n.isRead ? '#fff' : '#eff6ff' }}>
                                                <div className="notif-item-title">{n.title}</div>
                                                <div className="notif-item-msg">{n.message}</div>
                                                <div className="notif-item-time">{new Date(n.createdAt).toLocaleTimeString()}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="navbar-user">
                        <div className="navbar-avatar">{user.fullName.charAt(0)}</div>
                        <div className="navbar-user-info">
                            <div className="navbar-user-name">{user.fullName}</div>
                            <div className="navbar-user-role">
                                <span className="navbar-user-dot" style={{ background: user.role === 'HOD' ? '#10b981' : '#3b82f6' }} />
                                {user.role === 'HOD' ? 'HOD / Admin' : 'Professor'}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── BODY ── */}
            <div className="app-body">

                {/* Mobile overlay */}
                <div className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

                {/* ── SIDEBAR ── */}
                <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
                    <NavBtn icon="📊" label="Dashboard" active={view === 'analytics'} onClick={() => navigate('analytics')} />
                    <NavBtn icon="📅" label="Master Timetable" active={view === 'timetable'} onClick={() => navigate('timetable')} />
                    {user.role === 'HOD' && <NavBtn icon="⏳" label="Approval Workflow" active={view === 'approval'} onClick={() => navigate('approval')} badge="HOD" />}
                    {user.role === 'HOD' && <NavBtn icon="🤖" label="AI Schedule Gen" active={view === 'ai'} onClick={() => navigate('ai')} badge="HOD" />}
                    <NavBtn icon="🏛️" label="Facilities & Rooms" active={view === 'rooms'} onClick={() => navigate('rooms')} />
                    {user.role === 'HOD' && <NavBtn icon="📜" label="Audit Log" active={view === 'audit'} onClick={() => navigate('audit')} badge="HOD" />}
                    <NavBtn icon="🔒" label="Account Security" active={view === 'password'} onClick={() => navigate('password')} />

                    <div className="sidebar-footer">
                        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
                    </div>
                </aside>

                {/* ── MAIN ── */}
                <main className="main-content">
                    {view === 'analytics' && <AnalyticsView user={user} />}
                    {view === 'timetable' && <TimetableManagerView user={user} />}
                    {view === 'approval' && user.role === 'HOD' && <ApprovalWorkflowView />}
                    {view === 'ai' && user.role === 'HOD' && <AIGeneratorView />}
                    {view === 'rooms' && <RoomsView />}
                    {view === 'audit' && user.role === 'HOD' && <AuditLogView />}
                    {view === 'password' && <SecurityView user={user} />}
                </main>
            </div>
        </div>
    );
}

/* ── Sidebar nav button ── */
function NavBtn({ icon, label, active, onClick, badge }) {
    return (
        <button className={`sidebar-nav-btn${active ? ' active' : ''}`} onClick={onClick}>
            <span className="btn-icon">{icon}</span>
            <span className="btn-label">{label}</span>
            {badge && <span className="btn-badge">{badge}</span>}
        </button>
    );
}

/* ══════════════════════════════════════════════════════════════
   LOGIN VIEW
══════════════════════════════════════════════════════════════ */
function LoginView({ onLogin }) {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ username: 'admin', password: 'admin123' });
    const [regForm, setRegForm] = useState({ username: '', password: '', fullName: '', department: 'Computer Science', mobile: '', role: 'PROFESSOR' });
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/heartbeat`, { timeout: 30000 }).catch(() => { });
    }, []);

    const go = (m) => { setMsg({ type: '', text: '' }); setMode(m); };

    const handleLogin = async (e) => {
        e.preventDefault(); setMsg({ type: '', text: '' }); setLoading(true);
        try { const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form, { timeout: 45000 }); onLogin(res.data); }
        catch (err) {
            if (err.response?.data?.message) setMsg({ type: 'error', text: err.response.data.message });
            else if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') setMsg({ type: 'error', text: '⏱️ Backend cold-starting. Wait 5 s and try again.' });
            else setMsg({ type: 'error', text: 'Login failed. Check credentials.' });
        } finally { setLoading(false); }
    };

    const handleRegister = async (e) => {
        e.preventDefault(); setMsg({ type: '', text: '' }); setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/register`, regForm);
            setMsg({ type: 'success', text: '✅ ' + (res.data.message || 'Registration successful! You can now sign in.') });
            setRegForm({ username: '', password: '', fullName: '', department: 'Computer Science', mobile: '', role: 'PROFESSOR' });
            setTimeout(() => go('login'), 2000);
        } catch (err) { setMsg({ type: 'error', text: err.response?.data?.message || 'Registration failed.' }); }
        finally { setLoading(false); }
    };

    const alertStyle = (t) => ({ background: t === 'error' ? '#fef2f2' : '#ecfdf5', color: t === 'error' ? '#991b1b' : '#065f46', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', border: `1px solid ${t === 'error' ? '#fca5a5' : '#a7f3d0'}` });

    return (
        <div className="login-wrap">
            <div className="login-card">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', margin: '0 auto 12px' }}>⚡</div>
                    <h2 style={{ fontSize: 'clamp(18px,4vw,22px)', fontWeight: '700' }}>SmartScheduler Pro</h2>
                    <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '5px' }}>
                        {mode === 'login' ? 'Enterprise Schedule & Resource Management' : 'Create Faculty / Admin Account'}
                    </p>
                </div>

                {msg.text && <div style={alertStyle(msg.type)}>{msg.text}</div>}

                {mode === 'login' && (
                    <form onSubmit={handleLogin}>
                        <label style={labelStyle}>USERNAME / EMAIL</label>
                        <input className="login-input" style={{ marginBottom: '14px' }} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required autoComplete="username" />
                        <label style={labelStyle}>PASSWORD</label>
                        <input type="password" className="login-input" style={{ marginBottom: '20px' }} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
                        <button type="submit" disabled={loading} style={primaryBtn('#3b82f6')}>
                            {loading ? 'Authenticating…' : 'Sign In'}
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '14px' }}>
                            <button type="button" onClick={() => go('register')} style={linkBtn}>Don't have an account? Register</button>
                        </div>
                        <div style={{ marginTop: '18px', padding: '12px', background: 'rgba(255,255,255,.05)', borderRadius: '8px', fontSize: '12px', color: '#94a3b8', lineHeight: '1.7' }}>
                            <strong>Default Accounts:</strong><br />
                            • HOD Admin: <code>admin</code> / <code>admin123</code><br />
                            • Professor: <code>uday</code> / <code>123</code>
                        </div>
                    </form>
                )}

                {mode === 'register' && (
                    <form onSubmit={handleRegister}>
                        {[['EMAIL / USERNAME', 'email', 'prof@university.edu', 'username', v => setRegForm({ ...regForm, username: v })],
                          ['FULL NAME', 'text', 'Dr. Jane Doe', 'fullName', v => setRegForm({ ...regForm, fullName: v })],
                          ['PASSWORD', 'password', '', 'password', v => setRegForm({ ...regForm, password: v })]
                        ].map(([lbl, type, ph, key, onChange]) => (
                            <div key={key} style={{ marginBottom: '12px' }}>
                                <label style={labelStyle}>{lbl}</label>
                                <input type={type} className="login-input" placeholder={ph} value={regForm[key]} onChange={e => onChange(e.target.value)} required />
                            </div>
                        ))}
                        <label style={labelStyle}>ROLE</label>
                        <select className="login-input" style={{ marginBottom: '16px' }} value={regForm.role} onChange={e => setRegForm({ ...regForm, role: e.target.value })}>
                            <option value="PROFESSOR">Professor / Faculty</option>
                            <option value="HOD">Department HOD / Admin</option>
                        </select>
                        <button type="submit" disabled={loading} style={primaryBtn('#10b981')}>
                            {loading ? 'Registering…' : 'Register Account'}
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '14px' }}>
                            <button type="button" onClick={() => go('login')} style={{ ...linkBtn, color: '#94a3b8' }}>← Back to Sign In</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
const labelStyle = { display: 'block', fontSize: '11px', color: '#cbd5e1', marginBottom: '5px', fontWeight: '600', letterSpacing: '.5px' };
const primaryBtn = (bg) => ({ width: '100%', padding: '12px', background: bg, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' });
const linkBtn = { background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '12px', padding: 0 };

/* ══════════════════════════════════════════════════════════════
   ANALYTICS VIEW
══════════════════════════════════════════════════════════════ */
function AnalyticsView() {
    const [stats, setStats] = useState({ totalSchedules: 0, totalProfessors: 0, dayStats: {}, subjectStats: {} });
    useEffect(() => { axios.get(`${API_BASE_URL}/api/analytics`).then(r => setStats(r.data)).catch(() => {}); }, []);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <div>
            <h2 style={{ marginBottom: '20px', fontSize: 'clamp(16px,3vw,22px)' }}>📊 Dashboard & Resource Analytics</h2>

            <div className="stats-grid">
                <StatCard title="TOTAL SESSIONS" value={stats.totalSchedules} subtitle="Active scheduled slots" color="#3b82f6" icon="📅" />
                <StatCard title="ACTIVE FACULTY" value={stats.totalProfessors} subtitle="Registered professors" color="#10b981" icon="👨‍🏫" />
                <StatCard title="ROOM UTILIZATION" value="82%" subtitle="Peak occupancy rate" color="#f59e0b" icon="🏛️" />
                <StatCard title="CLASH-FREE SCORE" value="100%" subtitle="Conflict check active" color="#8b5cf6" icon="🛡️" />
            </div>

            <div className="chart-grid">
                <ChartPanel title="📅 Day-wise Class Volume">
                    {days.map(day => {
                        const count = stats.dayStats?.[day] || 0;
                        const pct = stats.totalSchedules ? Math.max((count / stats.totalSchedules) * 100, 8) : 8;
                        return (
                            <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', marginBottom: '4px' }}>{count}</span>
                                <div style={{ width: '100%', background: '#3b82f6', height: `${pct}%`, borderRadius: '5px 5px 0 0', minHeight: '10px' }} />
                                <span style={{ fontSize: '10px', color: '#64748b', marginTop: '7px' }}>{day.slice(0, 3)}</span>
                            </div>
                        );
                    })}
                </ChartPanel>

                <ChartPanel title="📚 Subject Distribution">
                    {Object.keys(stats.subjectStats || {}).slice(0, 5).map(subj => {
                        const count = stats.subjectStats[subj];
                        const pct = stats.totalSchedules ? Math.max((count / stats.totalSchedules) * 100, 8) : 8;
                        return (
                            <div key={subj} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669', marginBottom: '4px' }}>{count}</span>
                                <div style={{ width: '100%', background: '#10b981', height: `${pct}%`, borderRadius: '5px 5px 0 0', minHeight: '10px' }} />
                                <span style={{ fontSize: '10px', color: '#64748b', marginTop: '7px', textAlign: 'center', wordBreak: 'break-word' }}>{subj.slice(0, 8)}</span>
                            </div>
                        );
                    })}
                </ChartPanel>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtitle, color, icon }) {
    return (
        <div style={{ background: 'white', padding: '18px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,.05)', borderLeft: `5px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <small style={{ color: '#64748b', fontWeight: '700', fontSize: '10px', letterSpacing: '.5px' }}>{title}</small>
                <span style={{ fontSize: '20px' }}>{icon}</span>
            </div>
            <div style={{ fontSize: 'clamp(24px,4vw,32px)', fontWeight: '800', color: '#0f172a', margin: '8px 0 2px' }}>{value}</div>
            <small style={{ color: '#94a3b8', fontSize: '11px' }}>{subtitle}</small>
        </div>
    );
}

function ChartPanel({ title, children }) {
    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,.05)' }}>
            <h3 style={{ marginTop: 0, fontSize: '14px', color: '#1e293b', marginBottom: '12px' }}>{title}</h3>
            <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingTop: '10px' }}>
                {children}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   TIMETABLE MANAGER VIEW
══════════════════════════════════════════════════════════════ */
function TimetableManagerView({ user }) {
    const [schedules, setSchedules] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('ALL');
    const [showOnlyMine, setShowOnlyMine] = useState(false);
    const [conflictMsg, setConflictMsg] = useState('');
    const [form, setForm] = useState({
        professorName: user.role !== 'HOD' ? (user.fullName || 'Dr. Uday Kumar') : 'Dr. Uday Kumar',
        professorEmail: user.username?.includes('@') ? user.username : 'n.udaykumar2005@gmail.com',
        subject: '', day: 'Monday', time: '10:00 AM', groupName: 'Group A', roomNumber: 'Room 101'
    });

    useEffect(() => { load(); }, []);

    const load = () => axios.get(`${API_BASE_URL}/api/schedules`).then(r => setSchedules(r.data)).catch(() => {});

    const checkConflict = async () => {
        try { const r = await axios.post(`${API_BASE_URL}/api/schedules/check-conflicts`, form); setConflictMsg(r.data.message); }
        catch { setConflictMsg('❌ Error checking conflict'); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const r = await axios.post(`${API_BASE_URL}/api/schedules?username=${user.username}&role=${user.role}`, form);
            alert(r.data.message); load(); setForm(f => ({ ...f, subject: '' })); setConflictMsg('');
        } catch (err) { alert(err.response?.data?.message || '❌ Failed to create slot.'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this schedule entry?')) return;
        await axios.delete(`${API_BASE_URL}/api/schedules/${id}`); load();
    };

    const exportCSV = () => {
        const hdr = 'ID,Subject,Professor,Email,Group,Day,Time,Room,Status\n';
        const rows = schedules.map(s => `${s.id},"${s.subject}","${s.professorName}","${s.professorEmail || ''}","${s.groupName}","${s.day}","${s.time}","${s.roomNumber}","${s.status}"\n`);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([hdr, ...rows], { type: 'text/csv' }));
        a.download = `Timetable_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    };

    const list = Array.isArray(schedules) ? schedules : [];
    const filtered = list.filter(s => {
        const q = (search || '').toLowerCase();
        return (
            ((s.subject || '').toLowerCase().includes(q) || (s.professorName || '').toLowerCase().includes(q) || (s.roomNumber || '').toLowerCase().includes(q)) &&
            (selectedGroup === 'ALL' || s.groupName === selectedGroup) &&
            (!showOnlyMine || (s.professorName || '').toLowerCase().includes((user.fullName || user.username || '').toLowerCase()))
        );
    });

    const selStyle = { ...inputBaseStyle };

    return (
        <div>
            <div className="page-header">
                <h2>📅 Master Timetable</h2>
                <div className="header-actions">
                    <button onClick={exportCSV} style={actionBtn('#059669')}>📥 Export CSV</button>
                    <button onClick={() => window.print()} style={actionBtn('#475569')}>🖨️ Print</button>
                </div>
            </div>

            {/* Form */}
            <div style={{ background: 'white', padding: '18px', borderRadius: '12px', marginBottom: '22px', boxShadow: '0 2px 6px rgba(0,0,0,.05)' }}>
                <h3 style={{ marginTop: 0, fontSize: '14px', color: '#1e293b', marginBottom: '14px' }}>➕ Assign New Class Slot</h3>
                <form onSubmit={handleCreate} className="form-grid">
                    <input className="input-base" placeholder="Subject Name" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
                    <input className="input-base" placeholder="Professor Name" value={form.professorName} onChange={e => setForm({ ...form, professorName: e.target.value })} required />
                    <input type="email" className="input-base" placeholder="Professor Email" value={form.professorEmail} onChange={e => setForm({ ...form, professorEmail: e.target.value })} required />
                    <select className="input-base" value={form.groupName} onChange={e => setForm({ ...form, groupName: e.target.value })}>
                        <option>Group A</option><option>Group B</option><option>Group C</option>
                    </select>
                    <select className="input-base" value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })}>
                        <option>Room 101</option><option>Room 102</option><option>Room 201</option><option>Lab A</option><option>Lab B</option>
                    </select>
                    <select className="input-base" value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
                        <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option>
                    </select>
                    <select className="input-base" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                        <option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option><option>12:00 PM</option><option>02:00 PM</option><option>03:00 PM</option>
                    </select>
                    <button type="button" onClick={checkConflict} style={actionBtn('#f59e0b')}>🔍 Check Clash</button>
                    <button type="submit" style={actionBtn('#2563eb')}>{user.role === 'HOD' ? 'Publish Class' : 'Submit for Approval'}</button>
                </form>
                {conflictMsg && (
                    <div style={{ marginTop: '12px', padding: '10px 14px', background: conflictMsg.includes('✅') ? '#ecfdf5' : '#fef2f2', color: conflictMsg.includes('✅') ? '#065f46' : '#991b1b', borderRadius: '7px', fontSize: '13px', fontWeight: '600' }}>
                        {conflictMsg}
                    </div>
                )}
            </div>

            {/* Filter bar */}
            <div className="filter-bar">
                <input className="input-base" placeholder="🔍 Search subject, professor, room…" value={search} onChange={e => setSearch(e.target.value)} />
                <select className="input-base" style={{ maxWidth: '160px' }} value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
                    <option value="ALL">All Sections</option>
                    <option value="Group A">Group A</option><option value="Group B">Group B</option><option value="Group C">Group C</option>
                </select>
                <button onClick={() => setShowOnlyMine(o => !o)}
                    style={{ padding: '10px 14px', borderRadius: '7px', border: '1px solid #cbd5e1', background: showOnlyMine ? '#3b82f6' : '#f8fafc', color: showOnlyMine ? 'white' : '#475569', fontWeight: '700', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {showOnlyMine ? '👤 Mine Only' : '🌐 All Schedules'}
                </button>
            </div>

            {/* Cards grid */}
            <div className="schedule-grid">
                {filtered.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#94a3b8', background: 'white', borderRadius: '12px' }}>
                        No schedules found.
                    </div>
                )}
                {filtered.map(s => {
                    const color = s.status === 'PUBLISHED' ? '#2563eb' : s.status === 'PENDING_APPROVAL' ? '#f59e0b' : '#ef4444';
                    return (
                        <div key={s.id} style={{ background: 'white', padding: '16px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,.05)', borderLeft: `5px solid ${color}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', flex: 1 }}>{s.subject}</h4>
                                <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '10px', fontWeight: '700', background: s.status === 'PUBLISHED' ? '#dbeafe' : '#fef3c7', color: s.status === 'PUBLISHED' ? '#1e40af' : '#92400e', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                    {s.status}
                                </span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#475569', margin: '6px 0 2px' }}>👨‍🏫 {s.professorName}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>📍 {s.roomNumber || 'Room 101'} &nbsp;|&nbsp; 🏷️ {s.groupName}</div>
                            <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: '700', marginTop: '8px' }}>⏰ {s.day} @ {s.time}</div>
                            {user.role === 'HOD' && (
                                <button onClick={() => handleDelete(s.id)} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: '700', padding: 0 }}>
                                    🗑️ Delete
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   APPROVAL WORKFLOW VIEW
══════════════════════════════════════════════════════════════ */
function ApprovalWorkflowView() {
    const [pending, setPending] = useState([]);
    useEffect(() => { load(); }, []);
    const load = () => axios.get(`${API_BASE_URL}/api/schedules/pending`).then(r => setPending(r.data)).catch(() => {});

    const handleAction = async (id, action) => {
        const reason = action === 'REJECT' ? prompt('Reason for rejection:') : '';
        try { await axios.put(`${API_BASE_URL}/api/schedules/${id}/approval`, { action, reason }); alert(`Schedule ${action.toLowerCase()}d!`); load(); }
        catch { alert('Approval processing failed.'); }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '8px' }}>⏳ HOD Approval Workflow</h2>
            <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}>Review schedule change requests submitted by faculty.</p>
            {pending.length === 0 ? (
                <div style={{ background: 'white', padding: '40px', textAlign: 'center', borderRadius: '12px', color: '#94a3b8' }}>
                    ✅ No pending approvals. All requests processed!
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '14px' }}>
                    {pending.map(s => (
                        <div key={s.id} className="approval-row">
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>{s.subject} <span style={{ color: '#64748b', fontWeight: '500' }}>({s.groupName})</span></h4>
                                <div style={{ fontSize: '13px', color: '#475569' }}>By: <strong>{s.professorName}</strong></div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>📅 {s.day} @ {s.time} | 📍 {s.roomNumber}</div>
                            </div>
                            <div className="approval-actions">
                                <button onClick={() => handleAction(s.id, 'APPROVE')} style={actionBtn('#10b981')}>✓ Approve</button>
                                <button onClick={() => handleAction(s.id, 'REJECT')} style={actionBtn('#ef4444')}>✕ Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   AI GENERATOR VIEW
══════════════════════════════════════════════════════════════ */
function AIGeneratorView() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const generate = async () => {
        setLoading(true);
        try { const r = await axios.post(`${API_BASE_URL}/api/ai/generate-timetable`, {}); setResult(r.data); }
        catch { alert('AI Generation failed'); }
        finally { setLoading(false); }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '8px' }}>🤖 AI Timetable Generator</h2>
            <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}>Generate 100% conflict-free timetables using AI optimization.</p>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', maxWidth: '500px', boxShadow: '0 2px 6px rgba(0,0,0,.05)' }}>
                <h3 style={{ marginTop: 0, fontSize: '15px' }}>Run AI Optimizer</h3>
                <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>Reads available faculty, subjects, sections, and room constraints, then schedules clash-free sessions automatically.</p>
                <button onClick={generate} disabled={loading} style={{ ...primaryBtn('linear-gradient(to right, #8b5cf6, #6366f1)'), cursor: loading ? 'wait' : 'pointer' }}>
                    {loading ? '🤖 Optimizing…' : '⚡ Generate Conflict-Free Timetable'}
                </button>
                {result && (
                    <div style={{ marginTop: '18px', padding: '14px', background: '#f3e8ff', borderRadius: '8px', color: '#6b21a8' }}>
                        <strong>{result.message}</strong>
                        <p style={{ fontSize: '13px', margin: '5px 0 0' }}>Generated {result.generatedCount} schedule slots.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   ROOMS VIEW
══════════════════════════════════════════════════════════════ */
function RoomsView() {
    const [rooms, setRooms] = useState([]);
    useEffect(() => { axios.get(`${API_BASE_URL}/api/rooms`).then(r => setRooms(r.data)).catch(() => {}); }, []);

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>🏛️ Facilities & Room Management</h2>
            <div className="rooms-grid">
                {rooms.length === 0 && <div style={{ color: '#94a3b8', fontSize: '14px' }}>Loading rooms…</div>}
                {rooms.map(r => (
                    <div key={r.id} style={{ background: 'white', padding: '16px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,.05)' }}>
                        <h3 style={{ margin: '0 0 6px', color: '#1e293b', fontSize: '15px' }}>{r.roomNumber}</h3>
                        <div style={{ fontSize: '13px', color: '#475569' }}>🏢 {r.building} | <strong>{r.capacity} Seats</strong></div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>Type: {r.roomType}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   AUDIT LOG VIEW
══════════════════════════════════════════════════════════════ */
function AuditLogView() {
    const [logs, setLogs] = useState([]);
    useEffect(() => { axios.get(`${API_BASE_URL}/api/audit-logs`).then(r => setLogs(r.data)).catch(() => {}); }, []);

    return (
        <div>
            <h2 style={{ marginBottom: '16px' }}>📜 System Audit Trail</h2>
            <div style={{ background: 'white', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 6px rgba(0,0,0,.05)', overflowX: 'auto' }}>
                {logs.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No audit logs found.</p>}
                {logs.map(log => (
                    <div key={log.id} className="audit-row">
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <strong style={{ fontSize: '13px' }}>{log.actorUsername}</strong>
                            <span style={{ fontSize: '13px', color: '#475569' }}> performed </span>
                            <code style={{ fontSize: '12px', background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>{log.action}</code>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{log.details}</div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0, whiteSpace: 'nowrap' }}>
                            {new Date(log.timestamp).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   SECURITY VIEW
══════════════════════════════════════════════════════════════ */
function SecurityView({ user }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleChange = async (e) => {
        e.preventDefault();
        try {
            const r = await axios.post(`${API_BASE_URL}/api/auth/change-password`, { username: user.username, oldPassword, newPassword });
            alert(r.data.message); setOldPassword(''); setNewPassword('');
        } catch { alert('Password change failed.'); }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '20px' }}>🔒 Security Center</h2>
            <form onSubmit={handleChange} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,.05)', maxWidth: '420px' }}>
                <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>CURRENT PASSWORD</label>
                    <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required className="input-base" />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', fontWeight: '600', color: '#475569' }}>NEW PASSWORD</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="input-base" />
                </div>
                <button type="submit" style={actionBtn('#2563eb', '100%')}>Update Password</button>
            </form>
        </div>
    );
}

/* ── Shared style helpers ── */
const inputBaseStyle = { padding: '10px 12px', borderRadius: '7px', border: '1px solid #cbd5e1', boxSizing: 'border-box', width: '100%', fontSize: '13px' };
const actionBtn = (bg, width = 'auto') => ({ padding: '9px 16px', background: bg, color: 'white', border: 'none', borderRadius: '7px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', width });

export default App;
