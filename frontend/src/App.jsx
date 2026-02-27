import React, { useState, useEffect } from 'react';
import { Activity, Bell, Heart, Shield, Settings, User as UserIcon, Zap, Moon, Thermometer } from 'lucide-react';
import HealthDashboard from './components/HealthDashboard';
import AlertPanel from './components/AlertPanel';

function App() {
    const [data, setData] = useState(null);
    const [history, setHistory] = useState([]);
    const [anomalies, setAnomalies] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // Initial fetch
        fetch('http://localhost:8000/history')
            .then(res => res.json())
            .then(setData_history => setHistory(setData_history.reverse()));

        fetch('http://localhost:8000/anomalies')
            .then(res => res.json())
            .then(setAnomalies);

        // WebSocket connection
        const socket = new WebSocket('ws://localhost:8000/ws');
        socket.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            setData(newData);
            setHistory(prev => [...prev.slice(-49), newData]);
            if (newData.is_anomaly) {
                setAnomalies(prev => [newData, ...prev.slice(0, 19)]);
            }
        };
        setWs(socket);

        return () => socket.close();
    }, []);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className="w-20 lg:w-64 bg-card border-r border-white/5 flex flex-col items-center lg:items-stretch p-4 transition-all duration-300">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="bg-primary/20 p-2 rounded-xl">
                        <Shield className="text-primary w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold hidden lg:block tracking-tight italic">HealthSense <span className="text-primary">AI</span></h1>
                </div>

                <nav className="flex-1 space-y-4">
                    <NavItem icon={<Activity />} label="Dashboard" active />
                    <NavItem icon={<Heart />} label="Wellness" />
                    <NavItem icon={<Zap />} label="Performance" />
                    <NavItem icon={<Settings />} label="Settings" />
                </nav>

                <div className="mt-auto p-2">
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center">
                            <UserIcon className="w-6 h-6" />
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-sm font-semibold">User Account</p>
                            <p className="text-xs text-white/40">Premium Status</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white/90">Real-time Vitals</h2>
                        <p className="text-white/40">Active monitoring via AI Analysis</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                            <span className="text-xs font-medium uppercase tracking-wider text-white/60">Live Stream</span>
                        </div>
                        <button className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors">
                            <Bell className="w-5 h-5 text-white/60" />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        <HealthDashboard current={data} history={history} />
                    </div>
                    <div className="lg:col-span-1">
                        <AlertPanel anomalies={anomalies} />
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false }) {
    return (
        <div className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 group ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:bg-white/5 hover:text-white/80'}`}>
            <span className="shrink-0">{icon}</span>
            <span className="font-medium hidden lg:block">{label}</span>
        </div>
    );
}

export default App;
