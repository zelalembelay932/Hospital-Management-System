import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color, loading = false, trend }) => {
    return (
        <div className={`bg-gradient-to-br ${color} rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-white/80">{title}</p>
                    {loading ? (
                        <div className="flex items-center gap-2 mt-2">
                            <FaSpinner className="animate-spin text-white" />
                            <span className="text-xl font-bold text-white">Loading...</span>
                        </div>
                    ) : (
                        <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">{value}</h3>
                    )}
                </div>
                <div className={`p-3 rounded-lg bg-white/10 backdrop-blur-sm`}>
                    <div className="text-white text-xl">
                        {icon}
                    </div>
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center gap-2">
                    <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-200' : 'text-red-200'}`}>
                        {trend === 'up' ? '↗' : '↘'} 
                        {trend === 'up' ? ' Increased' : ' Decreased'} this month
                    </span>
                </div>
            )}
        </div>
    );
};

export default StatCard;