import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaStethoscope,
  FaTimesCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../services/api';

const getDoctorName = (appointment) =>
  appointment.doctorName ||
  appointment.doctor?.name ||
  appointment.doctor?.fullName ||
  'Doctor';

const formatDate = (date) => {
  if (!date) return 'Date unavailable';

  const localDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(localDate.getTime())
    ? date
    : localDate.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
};

const statusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'border-[#16C79A]/40 bg-[#16C79A]/15 text-[#8ff0d3]';
    case 'completed':
      return 'border-blue-400/40 bg-blue-400/15 text-blue-200';
    case 'cancelled':
      return 'border-red-400/40 bg-red-400/15 text-red-200';
    default:
      return 'border-amber-400/40 bg-amber-400/15 text-amber-100';
  }
};

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments/patient');
        const appointmentList = Array.isArray(response.data)
          ? response.data
          : response.data?.appointments || response.data?.data || [];

        setAppointments(Array.isArray(appointmentList) ? appointmentList : []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error(error.response?.data?.message || 'Could not load your appointments.');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const status = (appointment.status || 'pending').toLowerCase();
      const doctor = getDoctorName(appointment).toLowerCase();

      return (
        (statusFilter === 'all' || status === statusFilter) &&
        (!query || doctor.includes(query))
      );
    });
  }, [appointments, searchTerm, statusFilter]);

  return (
    <div className="min-h-full bg-gradient-to-br from-[#19456B] to-[#0d2c4a] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#16C79A]">
              <FaCalendarAlt />
              Patient portal
            </p>
            <h2 className="text-3xl font-bold text-white">My appointments</h2>
            <p className="mt-2 text-[#d5f7ee]">View the status and details of your booked visits.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/patient/book-appointment')}
            className="rounded-xl bg-gradient-to-r from-[#16C79A] to-[#11698E] px-5 py-3 font-bold text-white shadow-lg transition hover:brightness-110"
          >
            Book appointment
          </button>
        </div>

        <section className="rounded-2xl border border-[#16C79A]/30 bg-[#0d2c4a]/55 p-5 shadow-xl sm:p-6">
          <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_190px]">
            <label className="relative block">
              <span className="sr-only">Search appointments</span>
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#16C79A]" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by doctor"
                className="w-full rounded-xl border border-[#16C79A]/30 bg-white px-11 py-3 text-slate-900 outline-none transition focus:border-[#16C79A] focus:ring-2 focus:ring-[#16C79A]/40"
              />
            </label>

            <label>
              <span className="sr-only">Filter by status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-[#16C79A]/30 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#16C79A] focus:ring-2 focus:ring-[#16C79A]/40"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>

          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-[#d5f7ee]">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#16C79A] border-t-transparent" />
              Loading appointments…
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#16C79A]/40 p-10 text-center">
              <FaCalendarAlt className="mx-auto mb-4 text-3xl text-[#16C79A]" />
              <h3 className="text-lg font-bold text-white">
                {appointments.length === 0 ? 'No appointments yet' : 'No matching appointments'}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-[#d5f7ee]">
                {appointments.length === 0
                  ? 'Choose a doctor and book your first appointment.'
                  : 'Try a different search or status filter.'}
              </p>
              {appointments.length === 0 && (
                <button
                  type="button"
                  onClick={() => navigate('/patient/book-appointment')}
                  className="mt-5 rounded-xl border border-[#16C79A] px-4 py-2.5 font-semibold text-[#8ff0d3] transition hover:bg-[#16C79A]/10"
                >
                  Book now
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appointment) => {
                const status = appointment.status || 'pending';

                return (
                  <article
                    key={appointment.id || appointment._id}
                    className="rounded-xl border border-[#16C79A]/25 bg-white/5 p-4 transition hover:border-[#16C79A]/55 hover:bg-white/10 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#16C79A] to-[#11698E] text-white">
                          <FaStethoscope />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-white">
                            Dr. {getDoctorName(appointment)}
                          </h3>
                          <p className="mt-1 text-sm text-[#b9dfd7]">
                            {appointment.doctor?.specialization || 'Medical consultation'}
                          </p>
                        </div>
                      </div>

                      <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold capitalize ${statusStyle(status)}`}>
                        {status.toLowerCase() === 'cancelled' ? <FaTimesCircle /> : <FaCheckCircle />}
                        {status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
                      <p className="flex items-center gap-2 text-sm text-white">
                        <FaCalendarAlt className="text-[#16C79A]" />
                        {formatDate(appointment.date)}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-white">
                        <FaClock className="text-[#16C79A]" />
                        {appointment.time || 'Time unavailable'}
                      </p>
                    </div>

                    {appointment.notes && (
                      <p className="mt-4 rounded-lg bg-black/15 p-3 text-sm text-[#d5f7ee]">
                        <span className="font-semibold text-white">Symptoms: </span>
                        {appointment.notes}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyAppointments;
