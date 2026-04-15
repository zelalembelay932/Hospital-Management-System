// services/reportService.js
import api from './api';

const reportService = {
    getMonthlyStats: async (year) => {
        try {
            const response = await api.get(`/reports/monthly${year ? `?year=${year}` : ''}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching monthly stats:', error);
            throw error;
        }
    },

    getDoctorPerformance: async (limit = 5) => {
        try {
            const response = await api.get(`/reports/doctor-performance?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching doctor performance:', error);
            throw error;
        }
    },

    getRevenueTrend: async (period = 'monthly', year) => {
        try {
            const response = await api.get(`/reports/revenue-trend?period=${period}${year ? `&year=${year}` : ''}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching revenue trend:', error);
            throw error;
        }
    },

    getStatsSummary: async (year) => {
        try {
            const response = await api.get(`/reports/stats-summary${year ? `?year=${year}` : ''}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching stats summary:', error);
            throw error;
        }
    },

    getAppointmentStatusDistribution: async (year) => {
        try {
            const response = await api.get(`/reports/status-distribution${year ? `?year=${year}` : ''}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching status distribution:', error);
            throw error;
        }
    }
};

export default reportService;