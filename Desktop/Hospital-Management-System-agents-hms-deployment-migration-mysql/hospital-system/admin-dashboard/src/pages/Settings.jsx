import React, { useState } from 'react';
import { FaSave, FaCog, FaBell, FaShieldAlt, FaDatabase, FaUserShield, FaCalendarAlt, FaHospital } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Simple Birr icon component (used instead of FaDollarSign)
const Birr = ({ className }) => (
  <span className={className} aria-hidden="true">Br</span>
);

const Settings = () => {
  const [settings, setSettings] = useState({
    hospitalName: 'ETH Hospital',
    hospitalEmail: 'info@medicare.so',
    hospitalPhone: '+251 994942373 ',
    hospitalAddress: 'KM4 Oromia, Adama',
    appointmentDuration: 30,
    workingHoursStart: '02:00',
    workingHoursEnd: '12:00',
    notifyOnNewAppointment: true,
    notifyOnCancellation: true,
    smsNotifications: true,
    emailNotifications: true,
    currency: 'Birr',
    consultationFee: 100,
    followupFee: 80,
    emergencyFee: 200
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Settings saved successfully');
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#0f4989] to-[#0b3561] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">System Settings</h1>
        <p className="text-[#58aefc]/80 mt-2">Configure system preferences and hospital information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Settings Categories */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#0f4989] to-[#0b3561] border border-[#58aefc]/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <FaHospital className="text-[#58aefc] text-xl" />
              <h3 className="font-semibold text-lg text-white">Settings Categories</h3>
            </div>
            <div className="space-y-2">
              {[
                { icon: FaCog, label: 'General Settings', color: '[#16C79A]' },
                { icon: FaBell, label: 'Notifications', color: 'green-500' },
                { icon: FaShieldAlt, label: 'Security', color: 'red-500' },
                { icon: FaDatabase, label: 'Database', color: 'purple-500' },
                { icon: FaUserShield, label: 'User Management', color: 'yellow-500' }
              ].map((item, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 hover:bg-gradient-to-r from-[#145fb8]/20 to-[#0f4989]/20 rounded-lg flex items-center gap-3 transition-all duration-300 group"
                >
                  <item.icon className={`text-${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-white group-hover:text-[#58aefc] transition-colors">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Settings Forms */}
        <div className="lg:col-span-3 space-y-6">
          {/* Hospital Information */}
          <div className="bg-gradient-to-br from-[#0f4989] to-[#0b3561] border border-[#58aefc]/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FaCog className="text-[#58aefc] text-xl" />
                <h3 className="text-xl font-semibold text-white">Hospital Information</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label text-[#58aefc]/80">Hospital Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58aefc]"
                  value={settings.hospitalName}
                  onChange={(e) => setSettings({...settings, hospitalName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="label text-[#58aefc]/80">Hospital Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58aefc]"
                  value={settings.hospitalEmail}
                  onChange={(e) => setSettings({...settings, hospitalEmail: e.target.value})}
                />
              </div>
              
              <div>
                <label className="label text-[#58aefc]/80">Hospital Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58aefc]"
                  value={settings.hospitalPhone}
                  onChange={(e) => setSettings({...settings, hospitalPhone: e.target.value})}
                />
              </div>
              
              <div>
                <label className="label text-[#58aefc]/80">Hospital Address</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58aefc]"
                  value={settings.hospitalAddress}
                  onChange={(e) => setSettings({...settings, hospitalAddress: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Appointment Settings */}
          <div className="bg-gradient-to-br from-[#0f4989] to-[#0b3561] border border-[#58aefc]/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-[#58aefc] text-xl" />
                <h3 className="text-xl font-semibold text-white">Appointment Settings</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label text-[#58aefc]/80">Appointment Duration</label>
                <select
                  className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58aefc]"
                  value={settings.appointmentDuration}
                  onChange={(e) => setSettings({...settings, appointmentDuration: parseInt(e.target.value)})}
                >
                  <option value={15} className="bg-[#0b3561]">15 minutes</option>
                  <option value={30} className="bg-[#0b3561]">30 minutes</option>
                  <option value={45} className="bg-[#0b3561]">45 minutes</option>
                  <option value={60} className="bg-[#0b3561]">60 minutes</option>
                </select>
              </div>
              
              <div>
                <label className="label text-[#58aefc]/80">Working Hours Start</label>
                <input
                  type="time"
                  className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58aefc]"
                  value={settings.workingHoursStart}
                  onChange={(e) => setSettings({...settings, workingHoursStart: e.target.value})}
                />
              </div>
              
              <div>
                <label className="label text-[#58aefc]/80">Working Hours End</label>
                <input
                  type="time"
                  className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58aefc]"
                  value={settings.workingHoursEnd}
                  onChange={(e) => setSettings({...settings, workingHoursEnd: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Fee Settings */}
          <div className="bg-gradient-to-br from-[#0f4989] to-[#0b3561] border border-[#58aefc]/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                <Birr className="text-[#58aefc] text-xl" />
                <h3 className="text-xl font-semibold text-white">Fee Settings</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="label text-[#58aefc]/80">Currency</label>
                <select
                  className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58aefc]"
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                >
                  <option value="USD" className="bg-[#0b3561]">Birr</option>
                </select>
              </div>
              
              <div>
                <label className="label text-[#58aefc]/80">Consultation Fee</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58aefc]"
                  value={settings.consultationFee}
                  onChange={(e) => setSettings({...settings, consultationFee: parseInt(e.target.value)})}
                  min="0"
                />
              </div>
              
              <div>
                <label className="label text-[#58aefc]/80">Follow-up Fee</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-[#0b3561] border border-[#58aefc]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#58aefc]"
                  value={settings.followupFee}
                  onChange={(e) => setSettings({...settings, followupFee: parseInt(e.target.value)})}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gradient-to-br from-[#0f4989] to-[#0b3561] border border-[#58aefc]/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FaBell className="text-[#58aefc] text-xl" />
                <h3 className="text-xl font-semibold text-white">Notification Settings</h3>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r from-[#145fb8]/10 to-[#0f4989]/10 transition-all duration-300">
                <div>
                  <p className="font-medium text-white">Notify on New Appointment</p>
                  <p className="text-sm text-[#58aefc]/70">Send notification when new appointment is booked</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notifyOnNewAppointment}
                    onChange={(e) => setSettings({...settings, notifyOnNewAppointment: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-[#0b3561] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#58aefc] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#58aefc]"></div>
                </label>
              </div>
              
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r from-[#145fb8]/10 to-[#0f4989]/10 transition-all duration-300">
                <div>
                  <p className="font-medium text-white">Notify on Cancellation</p>
                  <p className="text-sm text-[#58aefc]/70">Send notification when appointment is cancelled</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.notifyOnCancellation}
                    onChange={(e) => setSettings({...settings, notifyOnCancellation: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-[#0b3561] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#58aefc] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#58aefc]"></div>
                </label>
              </div>
              
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r from-[#145fb8]/10 to-[#0f4989]/10 transition-all duration-300">
                <div>
                  <p className="font-medium text-white">SMS Notifications</p>
                  <p className="text-sm text-[#58aefc]/70">Send SMS notifications to patients</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.smsNotifications}
                    onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-[#0b3561] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#58aefc] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#58aefc]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Buttons */}
          <div className="flex justify-end gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:opacity-90 transition-all">
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-[#58aefc] to-[#145fb8] text-white rounded-xl hover:opacity-90 transition-all flex items-center gap-3"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;