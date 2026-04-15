import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Plus, Trash2, Save, Clock as ClockIcon, X, CalendarDays, Settings } from 'lucide-react'
import { format, addDays, startOfWeek, eachDayOfInterval } from 'date-fns'
import { toast } from 'react-toastify'

const Availability = () => {
  const [availability, setAvailability] = useState({
    Monday: [{ start: '09:00', end: '17:00' }],
    Tuesday: [{ start: '09:00', end: '17:00' }],
    Wednesday: [{ start: '09:00', end: '17:00' }],
    Thursday: [{ start: '09:00', end: '17:00' }],
    Friday: [{ start: '09:00', end: '17:00' }],
    Saturday: [],
    Sunday: []
  })

  const [customDates, setCustomDates] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2).toString().padStart(2, '0')
    const minute = (i % 2) * 30
    return `${hour}:${minute === 0 ? '00' : '30'}`
  })

  const addTimeSlot = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: [...prev[day], { start: '09:00', end: '17:00' }]
    }))
  }

  const removeTimeSlot = (day, index) => {
    if (availability[day].length <= 1) {
      toast.error('At least one time slot is required')
      return
    }
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }))
  }

  const updateTimeSlot = (day, index, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }))
  }

  const addCustomDate = () => {
    const newDate = {
      id: Date.now(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      slots: [{ start: '09:00', end: '17:00' }],
      isDayOff: false
    }
    setCustomDates([...customDates, newDate])
  }

  const removeCustomDate = (id) => {
    setCustomDates(customDates.filter(date => date.id !== id))
  }

  const addCustomDateSlot = (dateId) => {
    setCustomDates(customDates.map(date => 
      date.id === dateId 
        ? { ...date, slots: [...date.slots, { start: '09:00', end: '17:00' }] }
        : date
    ))
  }

  const updateCustomDateSlot = (dateId, slotIndex, field, value) => {
    setCustomDates(customDates.map(date => 
      date.id === dateId 
        ? {
            ...date,
            slots: date.slots.map((slot, i) => 
              i === slotIndex ? { ...slot, [field]: value } : slot
            )
          }
        : date
    ))
  }

  const toggleDayOff = (dateId) => {
    setCustomDates(customDates.map(date => 
      date.id === dateId 
        ? { ...date, isDayOff: !date.isDayOff }
        : date
    ))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const dataToSave = {
        recurring: availability,
        customDates: customDates.map(date => ({
          date: date.date,
          slots: date.isDayOff ? [] : date.slots,
          isDayOff: date.isDayOff
        }))
      }

      console.log('Saving availability:', dataToSave)
      toast.success('Availability saved successfully!')
      
    } catch (error) {
      toast.error('Failed to save availability')
    } finally {
      setIsLoading(false)
    }
  }

  const getNextTwoWeeks = () => {
    const start = new Date()
    const end = addDays(start, 13)
    return eachDayOfInterval({ start, end })
  }

  const renderTimeSlot = (slot, index, day, isCustom = false, dateId = null) => (
    <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#11698E]/10 to-[#19456B]/10 rounded-xl border border-[#16C79A]/20">
      <div className="flex-1 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[#16C79A]/80 mb-1">
            Start Time
          </label>
          <select
            value={slot.start}
            onChange={(e) => isCustom 
              ? updateCustomDateSlot(dateId, index, 'start', e.target.value)
              : updateTimeSlot(day, index, 'start', e.target.value)
            }
            className="w-full px-3 py-2 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
          >
            {timeOptions.map(time => (
              <option key={time} value={time} className="bg-[#0d2c4a]">{time}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#16C79A]/80 mb-1">
            End Time
          </label>
          <select
            value={slot.end}
            onChange={(e) => isCustom 
              ? updateCustomDateSlot(dateId, index, 'end', e.target.value)
              : updateTimeSlot(day, index, 'end', e.target.value)
            }
            className="w-full px-3 py-2 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
          >
            {timeOptions.filter(time => time > slot.start).map(time => (
              <option key={time} value={time} className="bg-[#0d2c4a]">{time}</option>
            ))}
          </select>
        </div>
      </div>
      
      <button
        onClick={() => isCustom 
          ? removeCustomDateSlot(dateId, index)
          : removeTimeSlot(day, index)
        }
        className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-all duration-300"
        disabled={!isCustom && availability[day].length <= 1}
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  )

  const removeCustomDateSlot = (dateId, slotIndex) => {
    setCustomDates(customDates.map(date => 
      date.id === dateId 
        ? {
            ...date,
            slots: date.slots.filter((_, i) => i !== slotIndex)
          }
        : date
    ))
  }

  return (
    <div className="p-6 bg-gradient-to-br from-[#19456B] to-[#0d2c4a] min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Availability Settings</h1>
        <p className="text-[#16C79A]/80">Set your working hours and days off</p>
      </div>

      {/* Recurring Weekly Schedule */}
      <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl mb-6">
        <div className="p-6 border-b border-[#16C79A]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20">
                <CalendarDays className="h-6 w-6 text-[#16C79A]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Recurring Weekly Schedule</h2>
                <p className="text-sm text-[#16C79A]/80">These hours apply every week</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {daysOfWeek.map(day => (
              <div key={day} className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      availability[day].length > 0 
                        ? 'bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A]' 
                        : 'bg-gradient-to-r from-gray-700/30 to-gray-800/30 text-gray-400'
                    }`}>
                      {availability[day].length > 0 ? '✓' : '—'}
                    </div>
                    <span className="font-medium text-lg text-white">{day}</span>
                  </div>
                  
                  <button
                    onClick={() => addTimeSlot(day)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all duration-300"
                  >
                    <Plus className="h-4 w-4" />
                    Add Time Slot
                  </button>
                </div>

                <div className="space-y-3">
                  {availability[day].map((slot, index) => 
                    renderTimeSlot(slot, index, day)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Dates & Exceptions */}
      <div className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-2xl shadow-xl mb-6">
        <div className="p-6 border-b border-[#16C79A]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20">
                <ClockIcon className="h-6 w-6 text-[#16C79A]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Custom Dates & Exceptions</h2>
                <p className="text-sm text-[#16C79A]/80">Override regular schedule for specific dates</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-3 py-2 bg-[#0d2c4a] border border-[#16C79A]/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#16C79A]"
                min={format(new Date(), 'yyyy-MM-dd')}
              />
              <button
                onClick={addCustomDate}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                Add Custom Date
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {customDates.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 text-[#16C79A]/30 mx-auto mb-3" />
              <p className="text-gray-300">No custom dates added yet</p>
              <p className="text-sm text-[#16C79A]/70 mt-1">
                Add specific dates with custom hours or mark them as days off
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {customDates.map(date => (
                <div key={date.id} className="bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl flex flex-col items-center justify-center ${
                        date.isDayOff 
                          ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300' 
                          : 'bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A]'
                      }`}>
                        <span className="font-bold">{format(new Date(date.date), 'd')}</span>
                        <span className="text-xs">{format(new Date(date.date), 'MMM')}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{format(new Date(date.date), 'EEEE, MMMM d, yyyy')}</p>
                        <p className="text-sm text-[#16C79A]/80">
                          {date.isDayOff ? 'Day Off' : `${date.slots.length} time slot(s)`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleDayOff(date.id)}
                        className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                          date.isDayOff
                            ? 'bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white hover:opacity-90'
                            : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90'
                        }`}
                      >
                        {date.isDayOff ? 'Working Day' : 'Mark as Day Off'}
                      </button>
                      <button
                        onClick={() => removeCustomDate(date.id)}
                        className="p-2 text-red-500 hover:bg-red-500/20 rounded-xl transition-all duration-300"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {!date.isDayOff && (
                    <div className="space-y-3">
                      {date.slots.map((slot, index) => 
                        renderTimeSlot(slot, index, null, true, date.id)
                      )}
                      <button
                        onClick={() => addCustomDateSlot(date.id)}
                        className="w-full py-3 border-2 border-dashed border-[#16C79A]/30 rounded-xl text-[#16C79A] hover:text-white hover:border-[#16C79A]/50 flex items-center justify-center gap-2 transition-all duration-300"
                      >
                        <Plus className="h-5 w-5" />
                        Add Another Time Slot
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Two Weeks Preview */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="h-5 w-5 text-[#16C79A]" />
              <h3 className="font-semibold text-white">Upcoming Two Weeks Preview</h3>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {getNextTwoWeeks().map(date => {
                const dayName = format(date, 'EEEE')
                const isAvailable = availability[dayName].length > 0
                
                return (
                  <div 
                    key={date.toString()} 
                    className="text-center p-3 bg-gradient-to-br from-[#19456B] to-[#0d2c4a] border border-[#16C79A]/20 rounded-xl"
                  >
                    <p className="text-sm font-medium text-white">{format(date, 'EEE')}</p>
                    <p className="text-lg font-bold text-white">{format(date, 'd')}</p>
                    <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                      isAvailable 
                        ? 'bg-gradient-to-r from-[#16C79A]/20 to-[#11698E]/20 text-[#16C79A]' 
                        : 'bg-gradient-to-r from-gray-700/30 to-gray-800/30 text-gray-400'
                    }`}>
                      {isAvailable ? 'Available' : 'Off'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-gradient-to-b from-[#19456B] to-[#0d2c4a] border-t border-[#16C79A]/20 p-6 -mx-6 -mb-6">
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#16C79A] to-[#11698E] text-white rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Availability
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Availability