import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Heart, Thermometer, Zap, Moon, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

const HealthDashboard = ({ current, history }) => {
    if (!current) return <div className="text-white/20 animate-pulse text-center py-20">Initializing Health Engine...</div>;

    return (
        <div className="space-y-6">
            {/* Top Section: Health Score and Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <HealthScoreCard score={current.risk_score} />
                <StatCard
                    title="Heart Rate"
                    value={current.heart_rate}
                    unit="BPM"
                    icon={<Heart className="text-danger" />}
                    color="bg-danger/10"
                    history={history.map(h => ({ value: h.heart_rate, t: h.timestamp }))}
                    lineColor="#ef4444"
                />
                <StatCard
                    title="SpO2 Level"
                    value={current.spo2}
                    unit="%"
                    icon={<Droplets className="text-primary" />}
                    color="bg-primary/10"
                    history={history.map(h => ({ value: h.spo2, t: h.timestamp }))}
                    lineColor="#3b82f6"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Body Temp"
                    value={current.temperature}
                    unit="°C"
                    icon={<Thermometer className="text-warning" />}
                    color="bg-warning/10"
                    history={history.map(h => ({ value: h.temperature, t: h.timestamp }))}
                    lineColor="#f59e0b"
                />
                <StatCard
                    title="Activity Level"
                    value={current.activity_level}
                    unit="MET"
                    icon={<Zap className="text-success" />}
                    color="bg-success/10"
                    history={history.map(h => ({ value: h.activity_level, t: h.timestamp }))}
                    lineColor="#10b981"
                />
                <StatCard
                    title="Sleep Quality"
                    value={current.sleep_quality}
                    unit="%"
                    icon={<Moon className="text-purple-400" />}
                    color="bg-purple-400/10"
                    history={history.map(h => ({ value: h.sleep_quality, t: h.timestamp }))}
                    lineColor="#a78bfa"
                />
            </div>
        </div>
    );
};

const HealthScoreCard = ({ score }) => {
    const riskLabel = score < 30 ? "Excellent" : score < 60 ? "Moderate Risk" : "High Alert";
    const riskColor = score < 30 ? "text-success" : score < 60 ? "text-warning" : "text-danger";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-gradient p-6 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Shield size={120} />
            </div>
            <h3 className="text-white/40 text-sm font-medium mb-4 uppercase tracking-widest">Health Risk Score</h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                    <circle
                        cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={364.4}
                        strokeDashoffset={364.4 - (364.4 * score) / 100}
                        className={`${riskColor} transition-all duration-1000 ease-out`}
                        strokeLinecap="round"
                    />
                </svg>
                <span className="absolute text-4xl font-bold">{score}</span>
            </div>
            <p className={`mt-4 font-bold ${riskColor} uppercase tracking-tighter text-lg`}>{riskLabel}</p>
        </motion.div>
    );
};

const StatCard = ({ title, value, unit, icon, color, history, lineColor }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-gradient p-5 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`${color} p-3 rounded-2xl transition-transform group-hover:scale-110`}>
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">{title}</p>
                    <p className="text-2xl font-bold tracking-tight">{value}<span className="text-sm font-medium text-white/20 ml-1">{unit}</span></p>
                </div>
            </div>
            <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history}>
                        <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot={false} isAnimationActive={false} />
                        <YAxis domain={['auto', 'auto']} hide />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

const Shield = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export default HealthDashboard;
