import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaSearch,
  FaStethoscope,
  FaUserMd
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../services/api';

const DEFAULT_TIME_SLOTS = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '02:00 PM',
  '03:00 PM'
];

const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)\n  .toISOString()\n  .slice(0, 10);

const doctorId = (doctor) => doctor?.id ?? doctor?._id;

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [booking, setBooking] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    symptoms: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        const doctorList = Array.isArray(response.data)
          ? response.data
          : response.data?.doctors || response.data?.data || [];

        setDoctors(Array.isArray(doctorList) ? doctorList : []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Could not load doctors. Please try again.');
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const specializations = useMemo(
    () => [...new Set(doctors.map((doctor) => doctor.specialization || doctor.speciality).filter(Boolean))],
    [doctors]
  );

  const filteredDoctors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const name = (doctor.name || doctor.fullName || '').toLowerCase();
      const specialization = (doctor.specialization || doctor.speciality || '').toLowerCase();
      const matchesSearch = !query || name.includes(query) || specialization.includes(query);
      const matchesSpecialization =
        selectedSpecialization === 'all' ||
        specialization === selectedSpecialization.toLowerCase();

      return matchesSearch && matchesSpecialization;
    });
  }, [doctors, searchTerm, selectedSpecialization]);

  const selectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({ date: '', time: '', symptoms: '' });
    setShowConfirmation(false);
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
      ...(name === 'date' ? { time: '' } : {})
    }));
    setShowConfirmation(false);
  };

  const handleReview = (event) => {
    event.preventDefault();

    if (!selectedDoctor) {
      toast.error('Select a doctor first.');
      return;
    }

    if (!formData.date || !formData.time) {
      toast.error('Select both an appointment date and time.');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmAppointment = async () => {
    const selectedDoctorId = doctorId(selectedDoctor);

    if (!selectedDoctorId) {
      toast.error('The selected doctor is missing an ID. Please choose another doctor.');
      return;
    }

    setBooking(true);

    try {
      await api.post('/appointments', {
        doctorId: selectedDoctorId,
        date: formData.date,
        time: formData.time,
        symptoms: formData.symptoms.trim()
      });

      toast.success('Appointment booked successfully.');
      navigate('/patient/appointments');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Could not book the appointment. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const selectedDoctorId = doctorId(selectedDoctor);

  return (
    <div className="min-h-full bg-gradient-to-br from-[#19456B] to-[#0d2c4a] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#16C79A]">
            <FaCalendarAlt />
            Patient portal
          </p>
          <h2 className="text-3xl font-bold text-white">Book an appointment</h2>
          <p className="mt-2 text-[#d5f7ee]">
            Choose a doctor, then select a date and time for your visit.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
          <section className="rounded-2xl border border-[#16C79A]/30 bg-[#0d2c4a]/55 p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-white">
                  <FaUserMd className="text-[#16C79A]" />
                  Select a doctor
                </h3>
                <p className="mt-1 text-sm text-[#b9dfd7]">
                  Select one doctor to continue.
                </p>
              </div>
              <span className="rounded-full border border-[#16C79A]/30 bg-[#16C79A]/10 px-3 py-1 text-sm font-medium text-[#8ff0d3]">
                {filteredDoctors.length} available
              </span>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_190px]">
              <label className="relative block">
                <span className="sr-only">Search doctors</span>
                <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#16C79A]" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search doctor or specialty"
                  className="w-full rounded-xl border border-[#16C79A]/30 bg-white px-11 py-3 text-slate-900 outline-none transition focus:border-[#16C79A] focus:ring-2 focus:ring-[#16C79A]/40"
                />
              </label>

              <label>
                <span className="sr-only">Filter by specialty</span>
                <select
                  value={selectedSpecialization}
                  onChange={(event) => setSelectedSpecialization(event.target.value)}
                  className="w-full rounded-xl border border-[#16C79A]/30 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#16C79A] focus:ring-2 focus:ring-[#16C79A]/40"
                >
                  <option value="all">All specialties</option>
                  {specializations.map((specialization) => (
                    <option key={specialization} value={specialization}>
                      {specialization}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {loadingDoctors ? (
              <div className="flex min-h-48 items-center justify-center gap-3 text-[#d5f7ee]">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#16C79A] border-t-transparent" />
                Loading doctors…
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#16C79A]/40 p-8 text-center text-[#d5f7ee]">
                No doctors match your search.
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredDoctors.map((doctor) => {
                  const id = doctorId(doctor);
                  const isSelected = id === selectedDoctorId;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => selectDoctor(doctor)}
                      className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-[#16C79A] bg-[#16C79A]/20 ring-2 ring-[#16C79A]/30'
                          : 'border-[#16C79A]/25 bg-white/5 hover:border-[#16C79A]/60 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#16C79A] to-[#11698E] text-lg font-bold text-white">
                            {(doctor.name || doctor.fullName || 'D').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-bold text-white">
                              Dr. {doctor.name || doctor.fullName || 'Doctor'}
                            </p>
                            <p className="mt-1 flex items-center gap-2 text-sm text-[#b9dfd7]">
                              <FaStethoscope className="text-[#16C79A]" />
                              {doctor.specialization || doctor.speciality || 'General medicine'}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? 'border-[#16C79A] bg-[#16C79A] text-[#0d2c4a]'
                              : 'border-white/40 text-transparent'
                          }`}
                          aria-label={isSelected ? 'Selected doctor' : undefined}
                        >
                          <FaCheck size={12} />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#16C79A]/30 bg-[#0d2c4a]/55 p-5 shadow-xl sm:p-6">
            <h3 className="flex items-center gap-2 text-xl font-bold text-white">
              <FaCalendarAlt className="text-[#16C79A]" />
              Appointment details
            </h3>
            <p className="mt-1 text-sm text-[#b9dfd7]">
              {selectedDoctor
                ? `Booking with Dr. ${selectedDoctor.name || selectedDoctor.fullName}`
                : 'First, select a doctor from the list.'}
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleReview}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">Appointment date</span>
                <input
                  type="date"
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleChange}
                  disabled={!selectedDoctor}
                  required
                  className="w-full rounded-xl border border-[#16C79A]/30 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#16C79A] focus:ring-2 focus:ring-[#16C79A]/40 disabled:cursor-not-allowed disabled:bg-slate-200"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">Available time</span>
                <div className="relative">
                  <FaClock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#16C79A]" />
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    disabled={!selectedDoctor || !formData.date}
                    required
                    className="w-full appearance-none rounded-xl border border-[#16C79A]/30 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-[#16C79A] focus:ring-2 focus:ring-[#16C79A]/40 disabled:cursor-not-allowed disabled:bg-slate-200"
                  >
                    <option value="">
                      {!selectedDoctor
                        ? 'Select a doctor first'
                        : !formData.date
                          ? 'Select a date first'
                          : 'Select an available time'}
                    </option>
                    {DEFAULT_TIME_SLOTS.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">
                  Symptoms <span className="font-normal text-[#b9dfd7]">(optional)</span>
                </span>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Briefly describe the reason for your visit"
                  disabled={!selectedDoctor}
                  className="w-full resize-y rounded-xl border border-[#16C79A]/30 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#16C79A] focus:ring-2 focus:ring-[#16C79A]/40 disabled:cursor-not-allowed disabled:bg-slate-200"
                />
              </label>

              <button
                type="submit"
                disabled={!selectedDoctor || !formData.date || !formData.time}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#16C79A] to-[#11698E] px-4 py-3.5 font-bold text-white shadow-lg transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#16C79A] focus:ring-offset-2 focus:ring-offset-[#0d2c4a] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Review appointment
              </button>
            </form>
          </section>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#16C79A]/40 bg-[#0d2c4a] p-6 shadow-2xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#16C79A]/20 text-[#16C79A]">
              <FaCheck size={20} />
            </div>
            <h3 className="text-2xl font-bold text-white">Confirm your appointment</h3>
            <p className="mt-2 text-[#d5f7ee]">Please check the details before booking.</p>

            <dl className="my-6 space-y-3 rounded-xl border border-[#16C79A]/25 bg-white/5 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#b9dfd7]">Doctor</dt>
                <dd className="text-right font-semibold text-white">
                  Dr. {selectedDoctor?.name || selectedDoctor?.fullName}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#b9dfd7]">Date</dt>
                <dd className="font-semibold text-white">{formData.date}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#b9dfd7]">Time</dt>
                <dd className="font-semibold text-white">{formData.time}</dd>
              </div>
              {formData.symptoms && (
                <div className="border-t border-white/10 pt-3">
                  <dt className="text-[#b9dfd7]">Symptoms</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-white">{formData.symptoms}</dd>
                </div>
              )}
            </dl>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                disabled={booking}
                className="rounded-xl border border-white/30 px-4 py-3 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Go back
              </button>
              <button
                type="button"
                onClick={confirmAppointment}
                disabled={booking}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#16C79A] to-[#11698E] px-4 py-3 font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {booking && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {booking ? 'Booking…' : 'Confirm booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
