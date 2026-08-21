import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaStethoscope
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const parseDate = (value) => {
  const date = new Date(`${String(value || '').slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = parseDate(value);
  return date
    ? date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Date unavailable';
};

const doctorName = (appointment) =>
  appointment.doctor?.name || appointment.doctorName || 'Doctor';

const statusClass = (status) => {
  switch (status) {
    case 'approved':
      return 'border-[#16C79A]/35 bg-[#16C79A]/15 text-[#91f2d5]';
    case 'completed':
      return 'border-blue-300/35 bg-blue-400/15 text-blue-100';
    default:
      return 'border-amber-300/35 bg-amber-300/15 text-amber-100';
  }
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await api.get('/appointments/patient');
        const appointmentList = Array.isArray(response.data)
          ? response.data
          : response.data?.appointments || response.data?.data || [];

        setAppointments(Array.isArray(appointmentList) ? appointmentList : []);
      } catch (error) {
        console.error('Dashboard load error:', error);
        toast.error(error.response?.data?.message || 'Could not load your appointments.');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const summary = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const upcoming = appointments
      .filter((appointment) => {
        const date = parseDate(appointment.date);
        return (
          date &&
          date >= startOfToday &&
          ['pending', 'approved'].includes((appointment.status || 'pending').toLowerCase())
        );
      })
      .sort((left, right) => {
        const leftKey = `${String(left.date).slice(0, 10)} ${left.time || ''}`;
        const rightKey = `${String(right.date).slice(0, 10)} ${right.time || ''}`;
        return leftKey.localeCompare(rightKey);
      });

    return {
      upcoming,
      total: appointments.length,
      pending: appointments.filter((appointment) => appointment.status === 'pending').length,
      completed: appointments.filter((appointment) => appointment.status === 'completed').length
    };
  }, [appointments]);

  const statCards = [
    { label: 'Total appointments', value: summary.total, icon: FaCalendarAlt, color: 'from-[#16C79A] to-[#11698E]' },
    { label: 'Upcoming visits', value: summary.upcoming.length, icon: FaCalendarCheck, color: 'from-sky-500 to-blue-600' },
    { label: 'Pending approval', value: summary.pending, icon: FaClock, color: 'from-amber-400 to-orange-500' },
    { label: 'Completed visits', value: summary.completed, icon: FaCheckCircle, color: 'from-indigo-500 to-violet-600' }
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 rounded-2xl border border-[#16C79A]/25 bg-gradient-to-r from-[#11698E]/25 to-[#0d2c4a]/45 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-sm font-semibold text-[#7ce8ca]">Patient dashboard</p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h2>
          <p className="mt-2 text-sm text-[#d5f7ee]">
            Keep track of your appointments and manage your care in one place.
          </p>
        </div>
        <Link
          to="/patient/book-appointment"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-[#16C79A] to-[#11698E] px-5 py-3 font-bold text-white shadow-lg transition hover:brightness-110"
        >
          <FaPlus />
          Book appointment
        </Link>
      </section>

      {loading ? (
        <div className="flex min-h-56 items-center justify-center gap-3 rounded-2xl border border-[#16C79A]/20 bg-[#0d2c4a]/40 text-[#d5f7ee]">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#16C79A] border-t-transparent" />
          Loading your dashboard…
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <article key={label} className="rounded-2xl border border-[#16C79A]/20 bg-[#0d2c4a]/45 p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                    <Icon />
                  </div>
                  <span className="text-3xl font-bold text-white">{value}</span>
                </div>
                <p className="mt-4 text-sm font-medium text-[#d5f7ee]">{label}</p>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-[#16C79A]/25 bg-[#0d2c4a]/45 p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Upcoming appointments</h3>
                <p className="mt-1 text-sm text-[#b9dfd7]">Your next scheduled visits appear here.</p>
              </div>
              <Link to="/patient/appointments" className="text-sm font-semibold text-[#7ce8ca] transition hover:text-white">
                View all appointments →
              </Link>
            </div>

            {summary.upcoming.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#16C79A]/35 p-8 text-center">
                <FaCalendarAlt className="mx-auto mb-3 text-3xl text-[#16C79A]" />
                <p className="font-semibold text-white">No upcoming appointments</p>
                <p className="mt-1 text-sm text-[#d5f7ee]">Choose a doctor to schedule your next visit.</p>
                <Link
                  to="/patient/book-appointment"
                  className="mt-4 inline-flex rounded-lg border border-[#16C79A] px-4 py-2 font-semibold text-[#91f2d5] transition hover:bg-[#16C79A]/10"
                >
                  Book now
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {summary.upcoming.slice(0, 4).map((appointment) => {
                  const status = (appointment.status || 'pending').toLowerCase();
                  return (
                    <article
                      key={appointment.id || appointment._id}
                      className="flex flex-col gap-4 rounded-xl border border-[#16C79A]/20 bg-white/5 p-4 transition hover:border-[#16C79A]/50 hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#16C79A] to-[#11698E] text-white">
                          <FaStethoscope />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-white">Dr. {doctorName(appointment)}</p>
                          <p className="mt-1 text-sm text-[#b9dfd7]">
                            {appointment.doctor?.specialization || 'Medical consultation'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-2 text-white">
                          <FaCalendarAlt className="text-[#16C79A]" />
                          {formatDate(appointment.date)}
                        </span>
                        <span className="flex items-center gap-2 text-white">
                          <FaClock className="text-[#16C79A]" />
                          {appointment.time || 'Time unavailable'}
                        </span>
                        <span className={`rounded-full border px-3 py-1 font-semibold capitalize ${statusClass(status)}`}>
                          {status}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default PatientDashboard;
