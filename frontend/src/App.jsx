import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.origin.includes('localhost:5173') ? 'http://localhost:8080' : window.location.origin);

// Setup Axios Interceptor for JWT Authentication
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
    const [view, setView] = useState('analytics'); // analytics, timetable, approval, ai, rooms, audit, password
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/notifications?username=${user?.username || 'admin'}`);
            setNotifications(res.data);
        } catch (e) {
            console.log("Error fetching notifications", e);
        }
    };

    const handleLogin = (authData) => {
        localStorage.setItem('token', authData.token);
        const userInfo = {
            username: authData.username,
            fullName: authData.fullName,
            role: authData.role,
            department: authData.department,
            mobile: authData.mobile
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        setToken(authData.token);
        setUser(userInfo);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    if (!user || !token) {
        return <LoginView onLogin={handleLogin} />;
    }

    const notificationList = Array.isArray(notifications) ? notifications : [];
    const unreadCount = notificationList.filter(n => !n.isRead).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", backgroundColor: '#f4f6f9' }}>
            {/* --- TOP NAVBAR --- */}
            <header style={{ height: '65px', backgroundColor: '#1e293b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>⚡</div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px' }}>SmartScheduler <span style={{ color: '#60a5fa', fontSize: '12px', background: 'rgba(96,165,250,0.2)', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(96,165,250,0.4)' }}>PRO ENTERPRISE</span></h2>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <a href={`${API_BASE_URL}/swagger-ui/index.html`} target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', background: '#334155', padding: '6px 12px', borderRadius: '6px' }}>
                        📜 OpenAPI Docs
                    </a>

                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: '#334155', border: 'none', color: 'white', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                            🔔 Inbox {unreadCount > 0 && <span style={{ background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '11px', fontWeight: 'bold' }}>{unreadCount}</span>}
                        </button>

                        {showNotifications && (
                            <div style={{ position: 'absolute', right: 0, top: '45px', width: '340px', backgroundColor: 'white', color: '#1e293b', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000, padding: '15px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                                    <strong style={{ fontSize: '14px' }}>Notifications ({notificationList.length})</strong>
                                    <button onClick={() => setShowNotifications(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                                </div>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {notificationList.length === 0 ? <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center' }}>No notifications</p> : (
                                        notificationList.map(n => (
                                            <div key={n.id} style={{ padding: '10px', borderBottom: '1px solid #f1f5f9', background: n.isRead ? '#ffffff' : '#eff6ff', borderRadius: '6px', marginBottom: '6px' }}>
                                                <div style={{ fontWeight: '600', fontSize: '13px', color: '#1e3a8a' }}>{n.title}</div>
                                                <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px' }}>{n.message}</div>
                                                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>{new Date(n.createdAt).toLocaleTimeString()}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '15px', borderLeft: '1px solid #334155' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
                            {user.fullName.charAt(0)}
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>{user.fullName}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: user.role === 'HOD' ? '#10b981' : '#3b82f6', display: 'inline-block' }}></span>
                                {user.role === 'HOD' ? 'HOD / Admin' : 'Faculty Professor'}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- BODY MAIN LAYOUT --- */}
            <div style={{ display: 'flex', flex: 1 }}>
                {/* --- SIDEBAR --- */}
                <aside style={{ width: '250px', backgroundColor: 'white', borderRight: '1px solid #e2e8f0', padding: '25px 15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <SidebarButton icon="📊" label="Dashboard & Analytics" active={view === 'analytics'} onClick={() => setView('analytics')} />
                    <SidebarButton icon="📅" label="Master Timetable" active={view === 'timetable'} onClick={() => setView('timetable')} />
                    {user.role === 'HOD' && (
                        <SidebarButton icon="⏳" label="Approval Workflow" active={view === 'approval'} onClick={() => setView('approval')} badge="HOD" />
                    )}
                    <SidebarButton icon="🤖" label="AI Schedule Generator" active={view === 'ai'} onClick={() => setView('ai')} />
                    <SidebarButton icon="🏛️" label="Facilities & Rooms" active={view === 'rooms'} onClick={() => setView('rooms')} />
                    <SidebarButton icon="📜" label="System Audit Log" active={view === 'audit'} onClick={() => setView('audit')} />
                    <SidebarButton icon="🔒" label="Account Security" active={view === 'password'} onClick={() => setView('password')} />

                    <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button onClick={handleLogout} style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            🚪 Logout
                        </button>
                    </div>
                </aside>

                {/* --- MAIN CONTENT PANEL --- */}
                <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                    {view === 'analytics' && <AnalyticsView user={user} />}
                    {view === 'timetable' && <TimetableManagerView user={user} />}
                    {view === 'approval' && <ApprovalWorkflowView user={user} />}
                    {view === 'ai' && <AIGeneratorView user={user} />}
                    {view === 'rooms' && <RoomsView user={user} />}
                    {view === 'audit' && <AuditLogView user={user} />}
                    {view === 'password' && <SecurityView user={user} />}
                </main>
            </div>
        </div>
    );
}

function SidebarButton({ icon, label, active, onClick, badge }) {
    return (
        <button onClick={onClick} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px',
            border: 'none', background: active ? '#eff6ff' : 'transparent', color: active ? '#1d4ed8' : '#475569',
            fontWeight: active ? '700' : '500', fontSize: '14px', cursor: 'pointer', textAlign: 'left',
            transition: '0.2s', position: 'relative'
        }}>
            <span style={{ fontSize: '18px' }}>{icon}</span>
            <span style={{ flex: 1 }}>{label}</span>
            {badge && <span style={{ background: '#f59e0b', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>{badge}</span>}
        </button>
    );
}

// --- VIEW COMPONENTS ---

function LoginView({ onLogin }) {
    const [form, setForm] = useState({ username: 'admin', password: 'admin123' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form);
            onLogin(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Verify credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
            <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.95)', padding: '40px', borderRadius: '16px', width: '380px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 12px auto' }}>⚡</div>
                    <h2 style={{ margin: 0, fontSize: '22px' }}>SmartScheduler Pro</h2>
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '5px' }}>Enterprise Schedule & Resource Management</p>
                </div>

                {error && <div style={{ background: '#fef2f2', color: '#991b1b', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px' }}>❌ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '5px', fontWeight: '600' }}>USERNAME</label>
                        <input style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: 'white', boxSizing: 'border-box' }} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '5px', fontWeight: '600' }}>PASSWORD</label>
                        <input type="password" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: 'white', boxSizing: 'border-box' }} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                    </div>

                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(to right, #3b82f6, #2563eb)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '12px', color: '#94a3b8' }}>
                    <strong>Default Roles:</strong><br />
                    • HOD Admin: <code>admin</code> / <code>admin123</code><br />
                    • Professor: <code>uday</code> / <code>123</code>
                </div>
            </div>
        </div>
    );
}

function AnalyticsView() {
    const [stats, setStats] = useState({ totalSchedules: 0, totalProfessors: 0, dayStats: {}, groupStats: {}, subjectStats: {} });

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/analytics`).then(res => setStats(res.data));
    }, []);

    return (
        <div>
            <h2 style={{ marginTop: 0, color: '#0f172a' }}>📊 Dashboard & Resource Analytics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <Card title="TOTAL SESSIONS" value={stats.totalSchedules} subtitle="Active scheduled slots" color="#3b82f6" icon="📅" />
                <Card title="ACTIVE FACULTY" value={stats.totalProfessors} subtitle="Registered professors" color="#10b981" icon="👨‍🏫" />
                <Card title="ROOM UTILIZATION" value="82%" subtitle="Peak occupancy rate" color="#f59e0b" icon="🏛️" />
                <Card title="CLASH-FREE SCORE" value="100%" subtitle="Smart conflict check active" color="#8b5cf6" icon="🛡️" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, fontSize: '16px', color: '#1e293b' }}>📅 Day-wise Class Volume</h3>
                    <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '15px', paddingTop: '20px' }}>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                            const count = stats.dayStats?.[day] || 0;
                            const height = stats.totalSchedules ? (count / stats.totalSchedules) * 100 : 0;
                            return (
                                <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb' }}>{count}</span>
                                    <div style={{ width: '100%', background: '#3b82f6', height: `${Math.max(height, 8)}%`, borderRadius: '6px 6px 0 0', transition: '0.5s' }}></div>
                                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>{day.substring(0, 3)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, fontSize: '16px', color: '#1e293b' }}>📚 Subject Distribution</h3>
                    <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '15px', paddingTop: '20px' }}>
                        {Object.keys(stats.subjectStats || {}).slice(0, 5).map(subj => {
                            const count = stats.subjectStats[subj];
                            const height = stats.totalSchedules ? (count / stats.totalSchedules) * 100 : 0;
                            return (
                                <div key={subj} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669' }}>{count}</span>
                                    <div style={{ width: '100%', background: '#10b981', height: `${Math.max(height, 8)}%`, borderRadius: '6px 6px 0 0', transition: '0.5s' }}></div>
                                    <span style={{ fontSize: '10px', color: '#64748b', marginTop: '8px', textAlign: 'center' }}>{subj}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimetableManagerView({ user }) {
    const [schedules, setSchedules] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('ALL');
    const [conflictMsg, setConflictMsg] = useState('');
    const [form, setForm] = useState({ professorName: 'Dr. Uday Kumar', subject: '', day: 'Monday', time: '10:00 AM', groupName: 'Group A', roomNumber: 'Room 101' });

    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = () => {
        axios.get(`${API_BASE_URL}/api/schedules`).then(res => setSchedules(res.data));
    };

    const handleConflictCheck = async () => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/schedules/check-conflicts`, form);
            setConflictMsg(res.data.message);
        } catch (e) {
            setConflictMsg("❌ Error checking conflict");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/api/schedules?username=${user.username}&role=${user.role}`, form);
            alert(res.data.message);
            loadSchedules();
            setForm({ ...form, subject: '' });
            setConflictMsg('');
        } catch (err) {
            alert(err.response?.data?.message || "❌ Failed to create schedule slot.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this schedule entry?")) {
            await axios.delete(`${API_BASE_URL}/api/schedules/${id}`);
            loadSchedules();
        }
    };

    const exportCSV = () => {
        const headers = ["ID,Subject,Professor,Group,Day,Time,Room,Status\n"];
        const rows = schedules.map(s => `${s.id},"${s.subject}","${s.professorName}","${s.groupName}","${s.day}","${s.time}","${s.roomNumber}","${s.status}"\n`);
        const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Timetable_Export_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    };

    const scheduleList = Array.isArray(schedules) ? schedules : [];
    const filtered = scheduleList.filter(s => {
        const term = (search || '').toLowerCase();
        const matchesSearch = (s.subject || '').toLowerCase().includes(term) ||
            (s.professorName || '').toLowerCase().includes(term) ||
            (s.roomNumber || '').toLowerCase().includes(term);
        const matchesGroup = selectedGroup === 'ALL' || s.groupName === selectedGroup;
        return matchesSearch && matchesGroup;
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>📅 Master Timetable Management</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={exportCSV} style={{ padding: '8px 16px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>📥 Export CSV</button>
                    <button onClick={() => window.print()} style={{ padding: '8px 16px', background: '#475569', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🖨️ Print Timetable</button>
                </div>
            </div>

            {/* --- FORM PANEL --- */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, fontSize: '15px', color: '#1e293b' }}>➕ Assign New Class Slot (With Smart Clash Check)</h3>
                <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <input placeholder="Subject Name" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required style={inputStyle} />
                    <input placeholder="Professor Name" value={form.professorName} onChange={e => setForm({ ...form, professorName: e.target.value })} required style={inputStyle} />
                    <select value={form.groupName} onChange={e => setForm({ ...form, groupName: e.target.value })} style={inputStyle}>
                        <option>Group A</option><option>Group B</option><option>Group C</option>
                    </select>
                    <select value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} style={inputStyle}>
                        <option>Room 101</option><option>Room 102</option><option>Room 201</option><option>Lab A</option><option>Lab B</option>
                    </select>
                    <select value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} style={inputStyle}>
                        <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option>
                    </select>
                    <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={inputStyle}>
                        <option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option><option>12:00 PM</option><option>02:00 PM</option><option>03:00 PM</option>
                    </select>

                    <button type="button" onClick={handleConflictCheck} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        🔍 Check Clash
                    </button>
                    <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        {user.role === 'HOD' ? 'Publish Class' : 'Submit for Approval'}
                    </button>
                </form>

                {conflictMsg && (
                    <div style={{ marginTop: '12px', padding: '10px', background: conflictMsg.includes('✅') ? '#ecfdf5' : '#fef2f2', color: conflictMsg.includes('✅') ? '#065f46' : '#991b1b', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                        {conflictMsg}
                    </div>
                )}
            </div>

            {/* --- FILTER BAR --- */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <input placeholder="🔍 Search by Subject, Professor or Room..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} style={inputStyle}>
                    <option value="ALL">All Sections</option>
                    <option value="Group A">Group A</option>
                    <option value="Group B">Group B</option>
                    <option value="Group C">Group C</option>
                </select>
            </div>

            {/* --- GRID --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
                {filtered.map(s => (
                    <div key={s.id} style={{ background: 'white', padding: '18px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', borderLeft: `5px solid ${s.status === 'PUBLISHED' ? '#2563eb' : s.status === 'PENDING_APPROVAL' ? '#f59e0b' : '#ef4444'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b' }}>{s.subject}</h4>
                            <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold', background: s.status === 'PUBLISHED' ? '#dbeafe' : '#fef3c7', color: s.status === 'PUBLISHED' ? '#1e40af' : '#92400e' }}>
                                {s.status}
                            </span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#475569', margin: '4px 0' }}>👨‍🏫 {s.professorName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>📍 {s.roomNumber || 'Room 101'} | 🏷️ {s.groupName}</div>
                        <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600', marginTop: '8px' }}>⏰ {s.day} @ {s.time}</div>

                        {user.role === 'HOD' && (
                            <button onClick={() => handleDelete(s.id)} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', padding: 0 }}>
                                🗑️ Delete Entry
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ApprovalWorkflowView() {
    const [pending, setPending] = useState([]);

    useEffect(() => {
        loadPending();
    }, []);

    const loadPending = () => {
        axios.get(`${API_BASE_URL}/api/schedules/pending`).then(res => setPending(res.data));
    };

    const handleAction = async (id, action) => {
        const reason = action === 'REJECT' ? prompt("Reason for rejection:") : "";
        try {
            await axios.put(`${API_BASE_URL}/api/schedules/${id}/approval`, { action, reason });
            alert(`Schedule ${action.toLowerCase()}d!`);
            loadPending();
        } catch (e) {
            alert("Approval processing failed.");
        }
    };

    return (
        <div>
            <h2>⏳ HOD Approval Workflow Dashboard</h2>
            <p style={{ color: '#64748b' }}>Review schedule change requests submitted by faculty members.</p>

            {pending.length === 0 ? (
                <div style={{ background: 'white', padding: '40px', textAlign: 'center', borderRadius: '12px', color: '#94a3b8' }}>
                    ✅ No pending approvals. All schedule requests processed!
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                    {pending.map(s => (
                        <div key={s.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0' }}>{s.subject} ({s.groupName})</h4>
                                <div style={{ fontSize: '13px', color: '#475569' }}>Requested by: <strong>{s.professorName}</strong></div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>📅 {s.day} @ {s.time} | Room: {s.roomNumber}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => handleAction(s.id, 'APPROVE')} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>✓ Approve</button>
                                <button onClick={() => handleAction(s.id, 'REJECT')} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>✕ Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function AIGeneratorView() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/ai/generate-timetable`, {});
            setResult(res.data);
        } catch (e) {
            alert("AI Generation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>🤖 AI Automatic Timetable Generator Engine</h2>
            <p style={{ color: '#64748b' }}>Generate 100% conflict-free class timetables across rooms, professors, and sections using AI optimization algorithm.</p>

            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '500px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0 }}>Run AI Timetable Optimizer</h3>
                <p style={{ fontSize: '13px', color: '#475569' }}>This engine reads available faculty, subjects, sections, and room capacity constraints, then automatically schedules clash-free sessions.</p>

                <button onClick={handleGenerate} disabled={loading} style={{ width: '100%', padding: '14px', background: 'linear-gradient(to right, #8b5cf6, #6366f1)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
                    {loading ? '🤖 AI Engine Optimizing...' : '⚡ Generate Conflict-Free Timetable'}
                </button>

                {result && (
                    <div style={{ marginTop: '20px', padding: '15px', background: '#f3e8ff', borderRadius: '8px', color: '#6b21a8' }}>
                        <strong>{result.message}</strong>
                        <p style={{ fontSize: '13px', margin: '5px 0 0 0' }}>Generated {result.generatedCount} active schedule slots in database.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function RoomsView() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/rooms`).then(res => setRooms(res.data));
    }, []);

    return (
        <div>
            <h2>🏛️ Facilities & Room Management</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' }}>
                {rooms.map(r => (
                    <div key={r.id} style={{ background: 'white', padding: '18px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 6px 0', color: '#1e293b' }}>{r.roomNumber}</h3>
                        <div style={{ fontSize: '13px', color: '#475569' }}>🏢 {r.building} | Capacity: <strong>{r.capacity} Seats</strong></div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>Type: {r.roomType}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AuditLogView() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/audit-logs`).then(res => setLogs(res.data));
    }, []);

    return (
        <div>
            <h2>📜 Enterprise System Audit Trail</h2>
            <div style={{ background: 'white', borderRadius: '12px', padding: '15px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                {logs.map(log => (
                    <div key={log.id} style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <strong>{log.actorUsername}</strong> performed <code>{log.action}</code>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{log.details}</div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {new Date(log.timestamp).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SecurityView({ user }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleChange = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/change-password`, { username: user.username, oldPassword, newPassword });
            alert(res.data.message);
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            alert("Password change failed.");
        }
    };

    return (
        <div style={{ maxWidth: '400px' }}>
            <h2>🔒 Security Center</h2>
            <form onSubmit={handleChange} style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>CURRENT PASSWORD</label>
                    <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required style={inputStyle} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>NEW PASSWORD</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={inputStyle} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Update Security Key</button>
            </form>
        </div>
    );
}

function Card({ title, value, subtitle, color, icon }) {
    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', borderLeft: `5px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <small style={{ color: '#64748b', fontWeight: 'bold', fontSize: '11px' }}>{title}</small>
                <span style={{ fontSize: '20px' }}>{icon}</span>
            </div>
            <h2 style={{ margin: '8px 0 2px 0', color: '#0f172a', fontSize: '32px' }}>{value}</h2>
            <small style={{ color: '#94a3b8', fontSize: '11px' }}>{subtitle}</small>
        </div>
    );
}

const inputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    boxSizing: 'border-box',
    width: '100%'
};

export default App;
