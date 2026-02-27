import React from 'react';
import { AlertTriangle, Clock, Activity, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AlertPanel = ({ anomalies }) => {
    return (
        <div className="card-gradient rounded-[2rem] border border-white/5 h-full overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-white/80">Intelligence Log</h3>
                <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-white/40 uppercase tracking-widest font-bold">Anomaly Detection</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {anomalies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-white/10 italic text-sm">
                        <Activity className="w-10 h-10 mb-4 opacity-5" />
                        No anomalies detected
                    </div>
                ) : (
                    <AnimatePresence>
                        {anomalies.map((anomaly, idx) => (
                            <motion.div
                                key={anomaly.timestamp + idx}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={`p-4 rounded-2xl border ${anomaly.risk_score > 70 ? 'bg-danger/5 border-danger/20' : 'bg-warning/5 border-warning/20'} risk-alert group`}
                            >
                                <div className="flex gap-3">
                                    <div className={`mt-1 ${anomaly.risk_score > 70 ? 'text-danger' : 'text-warning'}`}>
                                        <AlertTriangle size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-xs font-bold uppercase tracking-tight text-white/80">
                                                {anomaly.risks && anomaly.risks.length > 0 ? anomaly.risks[0] : "Physiological Abnormality"}
                                            </p>
                                            <span className="text-[10px] text-white/30 font-medium">
                                                {new datetime(anomaly.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-white/50 leading-relaxed mb-3">
                                            Detected a cluster of signals deviating from your learned baseline.
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${anomaly.risk_score > 70 ? 'bg-danger' : 'bg-warning'}`}
                                                    style={{ width: `${anomaly.risk_score}%` }}
                                                />
                                            </div>
                                            <span className={`text-[10px] font-bold ${anomaly.risk_score > 70 ? 'text-danger' : 'text-warning'}`}>
                                                {anomaly.risk_score}% RISK
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5">
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white/40 transition-colors flex items-center justify-center gap-2">
                    <Clock size={14} /> Full Alert History
                </button>
            </div>
        </div>
    );
};

// Helper for date in component
const datetime = Date;

export default AlertPanel;
