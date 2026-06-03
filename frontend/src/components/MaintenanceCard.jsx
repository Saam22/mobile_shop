import React from 'react';
import { motion } from 'framer-motion';
import { Printer, Edit2, Wrench } from 'lucide-react';

const statusSteps = [
    { id: 'new', label: 'تم الاستلام', color: 'bg-blue-500' },
    { id: 'checking', label: 'جاري الفحص', color: 'bg-yellow-500' },
    { id: 'repairing', label: 'جاري الإصلاح', color: 'bg-orange-500' },
    { id: 'waiting_parts', label: 'انتظار قطع غيار', color: 'bg-purple-500' },
    { id: 'repaired', label: 'تم الإصلاح', color: 'bg-green-500' },
    { id: 'delivered', label: 'تم التسليم', color: 'bg-gray-500' },
];

const MaintenanceCard = ({ ticket, onStatusChange, onPrint }) => {
    const currentStatusIndex = statusSteps.findIndex(s => s.id === ticket.status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5 card-hover"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Wrench size={24} className="text-primary-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-primary-400 text-sm">{ticket.ticketNumber}</span>
                            <span className={`px-2 py-0.5 rounded text-xs text-white ${statusSteps[currentStatusIndex]?.color}`}>
                                {statusSteps[currentStatusIndex]?.label}
                            </span>
                        </div>
                        <h3 className="font-semibold text-dark-100">{ticket.customerName}</h3>
                        <p className="text-dark-400 text-sm">{ticket.customerPhone}</p>
                        <p className="text-dark-300 text-sm mt-1">
                            {ticket.brand} {ticket.model} - {ticket.problem}
                        </p>
                        <p className="text-dark-500 text-xs mt-1">
                            الفني: {ticket.technician || 'غير محدد'} |
                            التكلفة: {ticket.cost || 0} ج.م |
                            السعر: {ticket.sellingPrice || 0} ج.م
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <select
                        value={ticket.status}
                        onChange={(e) => onStatusChange(ticket._id, e.target.value)}
                        className="input-dark px-3 py-2 rounded-lg text-sm"
                    >
                        {statusSteps.map(step => (
                            <option key={step.id} value={step.id}>{step.label}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => onPrint(ticket)}
                        className="p-2 rounded-lg bg-dark-800 text-dark-400 hover:text-blue-400 transition-colors"
                    >
                        <Printer size={16} />
                    </button>
                </div>
            </div>

            {/* Status Progress Bar */}
            <div className="mt-4 flex items-center gap-1">
                {statusSteps.map((step, idx) => {
                    const isActive = idx <= currentStatusIndex;
                    return (
                        <React.Fragment key={step.id}>
                            <div className={`flex-1 h-1.5 rounded-full transition-all ${isActive ? step.color : 'bg-dark-800'
                                }`} />
                            {idx < statusSteps.length - 1 && <div className="w-1" />}
                        </React.Fragment>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default MaintenanceCard;