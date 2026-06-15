import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- ENHANCED STYLES (Clean & Professional) ---
const styles = {
    container: {
        padding: '30px',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        backgroundColor: '#f4f7f6',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    card: {
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '20px',
        margin: '15px 0',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '500px',
        borderLeft: '5px solid #007bff'
    },
    input: {
        display: 'block',
        margin: '15px 0',
        padding: '12px',
        width: '100%',
        borderRadius: '6px',
        border: '1px solid #ddd',
        boxSizing: 'border-box'
    },
    button: {
        padding: '12px 24px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    deleteBtn: {
        background: 'none',
        border: 'none',
        color: '#ff4d4d',
        cursor: 'pointer',
        float: 'right',
        fontSize: '18px'
    },
    header: { color: '#333', marginBottom: '20px' }
};

function App() {
    const [page, setPage] = useState('login');
    const [user, setUser] = useState(null);

    function logout() {
        setUser(null);
        setPage('login');
    }

    if (page === 'login') {
        return <Login onLogin={function(u) { setUser(u); setPage(u.role === 'HOD' ? 'hod' : 'professor'); }} />;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: "'Inter', sans-serif" }}>
            {page === 'hod' ? <HodDashboard user={user} onLogout={logout} /> : <ProfessorDashboard user={user} onLogout={logout} />}
        </div>
    );
}

// --- COMPONENTS ---

function Login(props) {
    const [form, setForm] = useState({ username: 'admin', password: 'admin123' });

    async function handleLogin() {
        try {
            const res = await axios.post('http://localhost:8080/api/login', form);
            if (res.data.status === 'success') {
                props.onLogin(res.data);
            } else {
                alert('❌ Login Failed! Use admin / admin123');
            }
        } catch (e) {
            alert('❌ Server Error!');
        }
    }

    return (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '350px', backdropFilter: 'blur(10px)' }}>
                <h1 style={{ textAlign: 'center', color: '#4A90E2', marginBottom: '30px' }}>✨ Smart Scheduler</h1>
                <input style={styles.input} placeholder="Username" value={form.username} onChange={function(e) { setForm({ username: e.target.value, password: form.password }); }} />
                <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={function(e) { setForm({ username: form.username, password: e.target.value }); }} />
                <button style={{ ...styles.button, width: '100%', marginTop: '10px', background: '#4A90E2' }} onClick={handleLogin}>Log In</button>
            </div>
        </div>
    );
}

function SidebarItem(props) {
    return (
        <div onClick={props.onClick} style={{
            padding: '15px 20px', cursor: 'pointer', borderRadius: '10px', marginBottom: '10px',
            backgroundColor: props.active ? '#4A90E2' : 'transparent',
            color: props.active ? 'white' : '#555',
            transition: '0.3s', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold'
        }}>
            <span>{props.icon}</span> {props.label}
        </div>
    );
}

function HodDashboard(props) {
    const [view, setView] = useState('analytics'); // analytics, schedules, professors, password
    const [data, setData] = useState({ schedules: [], professors: [], stats: { totalSchedules: 0, totalProfessors: 0, dayStats: {}, groupStats: {}, subjectStats: {} } });
    const [form, setForm] = useState({ prof: '', subj: '', day: 'Monday', time: '10:00 AM', group: 'Group A' });
    const [search, setSearch] = useState('');
    const [reg, setReg] = useState({ username: '', password: 'password123', fullName: '', department: '', mobile: '' });
    const [passForm, setPassForm] = useState({ old: '', new: '' });

    useEffect(function() {
        loadAll();
    }, []);

    async function loadAll() {
        try {
            const schedulesRes = await axios.get('http://localhost:8080/api/schedules');
            const professorsRes = await axios.get('http://localhost:8080/api/professors');
            const analyticsRes = await axios.get('http://localhost:8080/api/analytics');
            
            setData({
                schedules: schedulesRes.data,
                professors: professorsRes.data,
                stats: analyticsRes.data
            });
            console.log("📊 Analytics Data:", analyticsRes.data);
        } catch (e) {
            console.error("Load failed", e);
        }
    }

    async function addSchedule() {
        if (form.prof === '' || form.subj === '') {
            alert("❌ Select Professor and Subject!");
            return;
        }
        try {
            const res = await axios.post('http://localhost:8080/api/schedules', {
                professorName: form.prof,
                subject: form.subj,
                day: form.day,
                time: form.time,
                groupName: form.group
            });
            alert(res.data.message);
            loadAll();
        } catch (e) {
            alert("❌ Error adding schedule.");
        }
    }

    async function registerProf() {
        if (reg.username === '' || reg.fullName === '') {
            alert("❌ Fill Name and Username!");
            return;
        }
        try {
            const res = await axios.post('http://localhost:8080/api/register', reg);
            alert(res.data.message);
            loadAll();
            setReg({ username: '', password: 'password123', fullName: '', department: '', mobile: '' });
        } catch (e) {
            alert("❌ Username exists!");
        }
    }

    async function deleteSch(id) {
        if (window.confirm("Delete this class?")) {
            await axios.delete('http://localhost:8080/api/schedules/' + id);
            loadAll();
        }
    }

    async function resetDemoData() {
        if (window.confirm("Reset all schedules and load demo data?")) {
            try {
                const res = await axios.get('http://localhost:8080/api/demo');
                alert(res.data);
                loadAll();
            } catch (e) {
                alert("❌ Reset failed.");
            }
        }
    }

    async function handleChangePassword() {
        if (passForm.old === '' || passForm.new === '') {
            alert("❌ Fill all password fields!");
            return;
        }
        try {
            const res = await axios.post('http://localhost:8080/api/change-password', {
                username: props.user.username,
                oldPassword: passForm.old,
                newPassword: passForm.new
            });
            alert(res.data.message);
            if (res.data.status === 'success') {
                setPassForm({ old: '', new: '' });
                setView('analytics');
            }
        } catch (e) {
            alert("❌ Password change failed.");
        }
    }

    return (
        <>
            {/* --- SIDEBAR --- */}
            <div style={{ width: '260px', backgroundColor: 'white', padding: '30px 20px', boxShadow: '4px 0 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ color: '#4A90E2', marginBottom: '40px', textAlign: 'center' }}>👔 Admin Hub</h2>
                <SidebarItem id="analytics" label="Dashboard" icon="📊" active={view === 'analytics'} onClick={function() { setView('analytics'); }} />
                <SidebarItem id="schedules" label="Schedules" icon="📅" active={view === 'schedules'} onClick={function() { setView('schedules'); }} />
                <SidebarItem id="professors" label="Professors" icon="👨‍🏫" active={view === 'professors'} onClick={function() { setView('professors'); }} />
                <SidebarItem id="password" label="Security" icon="🔒" active={view === 'password'} onClick={function() { setView('password'); }} />
                
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button style={{ ...styles.button, width: '100%', background: '#ffaa00' }} onClick={resetDemoData}>🔄 Reset Data</button>
                    <button style={{ ...styles.button, width: '100%', background: '#ff4d4d' }} onClick={props.onLogout}>Logout</button>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                {view === 'analytics' && (
                    <div>
                        <h1 style={{ marginBottom: '30px' }}>📊 Advanced Analytics Dashboard</h1>

                        {/* --- STATS CARDS --- */}
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ ...styles.card, flex: 1, border: 'none', background: 'linear-gradient(135deg, #4A90E2, #007AFF)', color: 'white' }}>
                                <small>TOTAL SESSIONS</small>
                                <h1 style={{ fontSize: '48px', margin: '10px 0' }}>{data.stats.totalSchedules}</h1>
                                <p style={{ fontSize: '12px', opacity: 0.8 }}>+5% from last week</p>
                            </div>
                            <div style={{ ...styles.card, flex: 1, border: 'none', background: 'linear-gradient(135deg, #34C759, #28A745)', color: 'white' }}>
                                <small>ACTIVE FACULTY</small>
                                <h1 style={{ fontSize: '48px', margin: '10px 0' }}>{data.stats.totalProfessors}</h1>
                                <p style={{ fontSize: '12px', opacity: 0.8 }}>All professors online</p>
                            </div>
                        </div>

                        {/* --- NEW: GROUP EXPLOROR --- */}
                        <div style={{ marginBottom: '40px' }}>
                            <h3 style={{ marginBottom: '15px' }}>🔍 Explore Groups (Click to see info)</h3>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                {['Group A', 'Group B', 'Group C'].map(function(g) {
                                    return (
                                        <div key={g}
                                            onClick={function() { setSearch(g); }}
                                            style={{
                                                padding: '20px', background: search === g ? '#4A90E2' : 'white',
                                                color: search === g ? 'white' : '#333',
                                                borderRadius: '15px', cursor: 'pointer', flex: 1,
                                                textAlign: 'center', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                                transition: '0.3s'
                                            }}>
                                            {g}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* --- GROUP DETAILS LIST --- */}
                        {search.startsWith('Group') && (
                            <div style={{ marginBottom: '40px' }}>
                                <h3>📋 {search} Schedule Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                                    {data.schedules.filter(function(s) { return s.groupName === search; }).map(function(s) {
                                        const prof = data.professors.find(function(p) { return p.fullName === s.professorName; });
                                        return (
                                            <div key={s.id} style={{ ...styles.card, borderLeft: '6px solid #4A90E2', position: 'relative' }}>
                                                <h4 style={{ margin: '0 0 10px 0', color: '#4A90E2' }}>{s.subject}</h4>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                                    <img src={'https://ui-avatars.com/api/?name=' + s.professorName + '&background=random'} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                                                    <b>{s.professorName}</b>
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#666' }}>⏰ {s.day} @ {s.time}</div>
                                                <div style={{ fontSize: '13px', color: '#333', marginTop: '8px', padding: '8px', background: '#f0f7ff', borderRadius: '8px' }}>
                                                    📞 Contact: {prof ? (prof.mobile ? prof.mobile : '9876543210') : '9876543210'}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {data.schedules.filter(function(s) { return s.groupName === search; }).length === 0 && <p>No classes for this group yet.</p>}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
                            {/* Weekly Workload */}
                            <div style={{ ...styles.card, flex: 1 }}>
                                <h3 style={{ marginBottom: '25px' }}>📅 Weekly Workload (Classes/Day)</h3>
                                <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '15px', padding: '10px' }}>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(function(day) {
                                        const count = data.stats.dayStats ? (data.stats.dayStats[day] || 0) : 0;
                                        const height = data.stats.totalSchedules ? (count / data.stats.totalSchedules) * 100 : 0;
                                        return (
                                            <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#4A90E2', marginBottom: '2px' }}>{count}</span>
                                                <div style={{ width: '100%', background: '#4A90E2', height: Math.max(height, 5) + '%', borderRadius: '5px 5px 0 0', transition: '1s ease', boxShadow: '0 -2px 10px rgba(74, 144, 226, 0.3)' }}></div>
                                                <small style={{ marginTop: '10px', fontSize: '10px', color: '#888' }}>{day.substring(0, 3)}</small>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Subject Workload */}
                            <div style={{ ...styles.card, flex: 1 }}>
                                <h3 style={{ marginBottom: '25px' }}>📚 Subject Workload (Classes/Subject)</h3>
                                <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '15px', padding: '10px' }}>
                                    {['Java', 'OS', 'Python', 'DBMS', 'DS'].map(function(subj) {
                                        const count = data.stats.subjectStats ? (data.stats.subjectStats[subj] || 0) : 0;
                                        const height = data.stats.totalSchedules ? (count / data.stats.totalSchedules) * 100 : 0;
                                        return (
                                            <div key={subj} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#34C759', marginBottom: '2px' }}>{count}</span>
                                                <div style={{ width: '100%', background: '#34C759', height: Math.max(height, 5) + '%', borderRadius: '5px 5px 0 0', transition: '1s ease', boxShadow: '0 -2px 10px rgba(52, 199, 89, 0.3)' }}></div>
                                                <small style={{ marginTop: '10px', fontSize: '9px', color: '#888' }}>{subj}</small>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div style={{ ...styles.card, maxWidth: '100%' }}>
                            <h3>✨ Recent Activity</h3>
                            {data.schedules.slice(0, 3).map(function(s) {
                                return (
                                    <div key={s.id} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4A90E2' }}></div>
                                        <span style={{ fontSize: '13px' }}><b>{s.professorName}</b> was assigned to <b>{s.subject}</b></span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {view === 'schedules' && (
                    <div>
                        <h1>📅 Manage Timetables</h1>
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ ...styles.card, flex: 1, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)' }}>
                                <h3>➕ Assign New Class</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <select style={styles.input} value={form.prof} onChange={function(e) { setForm({ prof: e.target.value, subj: form.subj, day: form.day, time: form.time, group: form.group }); }}>
                                        <option value="">Select Professor</option>
                                        {data.professors.map(function(p) { return <option key={p.id} value={p.fullName}>{p.fullName}</option>; })}
                                    </select>
                                    <input style={styles.input} placeholder="Subject Name" value={form.subj} onChange={function(e) { setForm({ prof: form.prof, subj: e.target.value, day: form.day, time: form.time, group: form.group }); }} />
                                    <select style={styles.input} value={form.group} onChange={function(e) { setForm({ prof: form.prof, subj: form.subj, day: form.day, time: form.time, group: e.target.value }); }}>
                                        <option>Group A</option><option>Group B</option><option>Group C</option>
                                    </select>
                                    <select style={styles.input} value={form.day} onChange={function(e) { setForm({ prof: form.prof, subj: form.subj, day: e.target.value, time: form.time, group: form.group }); }}>
                                        <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option>
                                    </select>
                                    <select style={styles.input} value={form.time} onChange={function(e) { setForm({ prof: form.prof, subj: form.subj, day: form.day, time: e.target.value, group: form.group }); }}>
                                        <option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option><option>12:00 PM</option><option>02:00 PM</option>
                                    </select>
                                    <button style={{ ...styles.button, gridColumn: 'span 2', background: 'linear-gradient(to right, #4A90E2, #007AFF)' }} onClick={addSchedule}>Assign Group Schedule</button>
                                </div>
                            </div>
                        </div>
                        <div style={styles.card}>
                            <input style={styles.input} placeholder="🔍 Real-time search..." value={search} onChange={function(e) { setSearch(e.target.value); }} />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginTop: '20px' }}>
                                {data.schedules.filter(function(s) {
                                    const term = search.toLowerCase();
                                    return s.professorName.toLowerCase().indexOf(term) !== -1 ||
                                           s.subject.toLowerCase().indexOf(term) !== -1 ||
                                           (s.groupName && s.groupName.toLowerCase().indexOf(term) !== -1);
                                }).map(function(s) {
                                    return (
                                        <div key={s.id} style={{ padding: '15px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #eee', position: 'relative' }}>
                                            <div style={{ fontWeight: 'bold', color: '#4A90E2' }}>{s.subject}</div>
                                            <div style={{ fontSize: '13px', color: '#777' }}>{s.professorName} | {s.groupName}</div>
                                            <div style={{ fontSize: '12px', marginTop: '5px' }}>📅 {s.day} @ {s.time}</div>
                                            <button style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={function() { deleteSch(s.id); }}>🗑️</button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {view === 'professors' && (
                    <div style={{ display: 'flex', gap: '30px' }}>
                        <div style={{ flex: 1 }}>
                            <h1>👨‍🏫 Faculty Directory</h1>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {data.professors.map(function(p) {
                                    return (
                                        <div key={p.id} style={{ ...styles.card, display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <img src={'https://ui-avatars.com/api/?name=' + p.fullName + '&background=random'} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                                            <div>
                                                <h4 style={{ margin: 0 }}>{p.fullName}</h4>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{p.department} | 📞 {p.mobile || 'Not set'}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div style={{ width: '350px' }}>
                            <div style={styles.card}>
                                <h3>🆕 Register Faculty</h3>
                                <input style={styles.input} placeholder="Full Name" value={reg.fullName} onChange={function(e) { setReg({ username: reg.username, password: reg.password, fullName: e.target.value, department: reg.department, mobile: reg.mobile }); }} />
                                <input style={styles.input} placeholder="Phone Number" value={reg.mobile} onChange={function(e) { setReg({ username: reg.username, password: reg.password, fullName: reg.fullName, department: reg.department, mobile: e.target.value }); }} />
                                <input style={styles.input} placeholder="Department" value={reg.department} onChange={function(e) { setReg({ username: reg.username, password: reg.password, fullName: reg.fullName, department: e.target.value, mobile: reg.mobile }); }} />
                                <input style={styles.input} placeholder="Username" value={reg.username} onChange={function(e) { setReg({ username: e.target.value, password: reg.password, fullName: reg.fullName, department: reg.department, mobile: reg.mobile }); }} />
                                <input style={styles.input} type="password" placeholder="Password" value={reg.password} onChange={function(e) { setReg({ username: reg.username, password: e.target.value, fullName: reg.fullName, department: reg.department, mobile: reg.mobile }); }} />
                                <button style={{ ...styles.button, width: '100%' }} onClick={registerProf}>Add Professor</button>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'password' && (
                    <div style={{ maxWidth: '450px' }}>
                        <h1>🔒 Change Password</h1>
                        <div style={styles.card}>
                            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Provide your current password and choose a new one.</p>
                            <input style={styles.input} type="password" placeholder="Current Password" value={passForm.old} onChange={function(e) { setPassForm({ old: e.target.value, new: passForm.new }); }} />
                            <input style={styles.input} type="password" placeholder="New Password" value={passForm.new} onChange={function(e) { setPassForm({ old: passForm.old, new: e.target.value }); }} />
                            <button style={{ ...styles.button, width: '100%', marginTop: '10px' }} onClick={handleChangePassword}>Update Password</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function ProfessorDashboard(props) {
    const [schedules, setSchedules] = useState([]);
    const [view, setView] = useState('dashboard'); // dashboard, password
    const [passForm, setPassForm] = useState({ old: '', new: '' });

    useEffect(function() {
        loadSchedules();
    }, []);

    function loadSchedules() {
        axios.get('http://localhost:8080/api/schedules').then(function(res) {
            setSchedules(res.data);
        });
    }

    async function handleChangePassword() {
        if (passForm.old === '' || passForm.new === '') {
            alert("❌ Fill all password fields!");
            return;
        }
        try {
            const res = await axios.post('http://localhost:8080/api/change-password', {
                username: props.user.username,
                oldPassword: passForm.old,
                newPassword: passForm.new
            });
            alert(res.data.message);
            if (res.data.status === 'success') {
                setPassForm({ old: '', new: '' });
                setView('dashboard');
            }
        } catch (e) {
            alert("❌ Password change failed.");
        }
    }

    const mySchedules = schedules.filter(function(s) {
        return s.professorName === props.user.fullName;
    });

    return (
        <div style={{ flex: 1, padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img src={'https://ui-avatars.com/api/?name=' + props.user.fullName + '&background=4A90E2&color=fff'} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                    <div>
                        <h1 style={{ margin: 0 }}>Welcome, Prof. {props.user.fullName}</h1>
                        <p style={{ margin: 0, color: '#888' }}>{props.user.department} | 📞 {props.user.mobile || 'Contact HOD'}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button style={{ ...styles.button, background: '#4A90E2' }} onClick={function() { setView(view === 'dashboard' ? 'password' : 'dashboard'); }}>
                        {view === 'dashboard' ? '🔒 Security' : '📅 Dashboard'}
                    </button>
                    <button style={{ ...styles.button, background: '#ff4d4d' }} onClick={props.onLogout}>Logout</button>
                </div>
            </div>

            {view === 'dashboard' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                    <div style={styles.card}>
                        <h2>📅 Your Personal Schedule</h2>
                        {mySchedules.length === 0 ? <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No classes assigned yet. Enjoy your free time!</div> : (
                            mySchedules.map(function(s) {
                                return (
                                    <div key={s.id} style={{ padding: '20px', background: '#f8f9fa', borderRadius: '15px', marginBottom: '15px', borderLeft: '6px solid #4A90E2', display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <h3 style={{ margin: 0 }}>{s.subject}</h3>
                                            <p style={{ margin: '5px 0', color: '#666' }}>📍 {s.day} | ⏰ {s.time}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ padding: '6px 15px', background: '#4A90E2', color: 'white', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{s.groupName}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div>
                        <div style={{ ...styles.card, background: 'linear-gradient(135deg, #4A90E2, #007AFF)', color: 'white' }}>
                            <h3>📌 Active Workload</h3>
                            <h1 style={{ fontSize: '48px', margin: 0 }}>{mySchedules.length}</h1>
                            <p>Weekly Classes</p>
                        </div>
                        <div style={{ ...styles.card, marginTop: '20px' }}>
                            <h3>💡 Quick Tip</h3>
                            <p style={{ fontSize: '14px', color: '#555' }}>Check the Group Explorer to see which students you are teaching today!</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ maxWidth: '450px' }}>
                    <h1>🔒 Change Password</h1>
                    <div style={styles.card}>
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Provide your current password and choose a new one.</p>
                        <input style={styles.input} type="password" placeholder="Current Password" value={passForm.old} onChange={function(e) { setPassForm({ old: e.target.value, new: passForm.new }); }} />
                        <input style={styles.input} type="password" placeholder="New Password" value={passForm.new} onChange={function(e) { setPassForm({ old: passForm.old, new: e.target.value }); }} />
                        <button style={{ ...styles.button, width: '100%', marginTop: '10px' }} onClick={handleChangePassword}>Update Password</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
