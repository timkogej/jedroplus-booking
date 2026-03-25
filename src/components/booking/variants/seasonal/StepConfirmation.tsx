'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { SeasonalTheme } from '@/lib/types'
import { useBooking } from '@/components/booking/shared/BookingProvider'
import SuccessAnimation from './SuccessAnimations'

interface Props {
  seasonalTheme: SeasonalTheme
  primaryColor: string
}

export default function StepConfirmation({ seasonalTheme, primaryColor: pc }: Props) {
  const {
    selectedService,
    selectedEmployee,
    anyPerson,
    selectedDate,
    selectedTime,
    customer,
    companyName,
    submitBooking,
    isSubmitting,
    isConfirmed,
    goToPrevStep,
    resetBooking,
  } = useBooking()

  const [showSuccess, setShowSuccess] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (isConfirmed) {
      setShowSuccess(true)
      const timer = setTimeout(() => setContentVisible(true), 1600)
      return () => clearTimeout(timer)
    }
  }, [isConfirmed])

  const seasonalCheckIcon = (() => {
    if (seasonalTheme.holiday === 'christmas') return '🎄'
    if (seasonalTheme.holiday === 'valentine') return '💖'
    if (seasonalTheme.holiday === 'easter') return '🐣'
    if (seasonalTheme.holiday === 'halloween') return '🎃'
    if (seasonalTheme.season === 'summer') return '☀️'
    if (seasonalTheme.season === 'spring') return '🌸'
    if (seasonalTheme.season === 'autumn') return '🍂'
    return '✨'
  })()

  const employeeName = anyPerson
    ? 'Katera koli oseba'
    : selectedEmployee?.label || selectedEmployee?.name || '—'

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '—'
  const dateDisplay = selectedDate
    ? format(selectedDate, 'EEEE, d. MMM yyyy')
    : '—'

  const fullName = `${customer.firstName} ${customer.lastName}`.trim()

  const handleSubmit = async () => {
    setSubmitError(null)
    try {
      await submitBooking()
    } catch {
      setSubmitError('Napaka pri potrditvi rezervacije. Prosim poskusite znova.')
    }
  }

  const handleAddToCalendar = () => {
    if (!selectedDate || !selectedTime) return

    const [hours, minutes] = selectedTime.split(':').map(Number)
    const startDate = new Date(selectedDate)
    startDate.setHours(hours, minutes, 0, 0)

    const endDate = new Date(startDate)
    endDate.setMinutes(endDate.getMinutes() + (selectedService?.duration || 60))

    const formatGoogleDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d{3}/g, '')

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `${selectedService?.name ?? 'Rezervacija'} - ${companyName}`
    )}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(
      endDate
    )}&details=${encodeURIComponent(
      `Rezervacija pri ${companyName}\nStoritev: ${selectedService?.name ?? ''}\nSpecialist: ${employeeName}`
    )}`

    window.open(googleCalendarUrl, '_blank')
  }

  const handleShare = async () => {
    const text = `Rezervacija pri ${companyName}\n${selectedService?.name ?? ''}\n${dateStr} ob ${selectedTime}`

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Moja rezervacija', text })
      } catch {
        // share cancelled
      }
    } else {
      await navigator.clipboard.writeText(text)
      alert('Podatki o rezervaciji so kopirani v odložišče!')
    }
  }

  // ── Confirmed view ────────────────────────────────────────────────────────
  if (isConfirmed) {
    return (
      <>
        <SuccessAnimation
          theme={seasonalTheme}
          show={showSuccess}
          primaryColor={pc}
        />
        {contentVisible && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <motion.div
              className="text-5xl mb-4"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              {seasonalCheckIcon}
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Rezervacija potrjena!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Poslali smo potrditveno e-pošto na{' '}
              <span className="font-medium text-gray-700">{customer.email}</span>
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 text-left max-w-sm mx-auto">
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Storitev</span>
                  <p className="text-sm font-semibold text-gray-800">{selectedService?.name ?? '—'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Specialist</span>
                  <p className="text-sm font-semibold text-gray-800">{employeeName}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Kdaj</span>
                  <p className="text-sm font-semibold text-gray-800">
                    {dateDisplay} ob {selectedTime}
                  </p>
                </div>
                {selectedService?.price != null && (
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Cena</span>
                    <p className="text-sm font-semibold text-gray-800">
                      €{Number(selectedService.price).toFixed(0)} EUR
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar & Share buttons */}
            <div className="flex gap-3 mt-6 max-w-sm mx-auto">
              <motion.button
                onClick={handleAddToCalendar}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="12" y1="14" x2="12" y2="18" />
                  <line x1="10" y1="16" x2="14" y2="16" />
                </svg>
                Dodaj v koledar
              </motion.button>
              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Deli
              </motion.button>
            </div>

            <motion.button
              onClick={resetBooking}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors underline"
            >
              Nova rezervacija
            </motion.button>
          </motion.div>
        )}
      </>
    )
  }

  // ── Pre-confirmation review view ──────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Potrdi rezervacijo</h2>
      <p className="text-gray-500 text-sm mb-6">Prosim preveri podatke spodaj</p>

      {/* Summary card */}
      <div
        className="rounded-2xl p-6 mb-6 border-2"
        style={{ borderColor: `${pc}20`, backgroundColor: `${pc}05` }}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ backgroundColor: `${pc}15` }}
            >
              {seasonalTheme.holiday === 'christmas' ? '🎁' : '💼'}
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Storitev</span>
              <p className="font-semibold text-gray-800">{selectedService?.name || '—'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ backgroundColor: `${pc}15` }}
            >
              {seasonalTheme.holiday === 'christmas' ? '🎅' : '👤'}
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Specialist</span>
              <p className="font-semibold text-gray-800">{employeeName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ backgroundColor: `${pc}15` }}
            >
              📅
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Datum in čas</span>
              <p className="font-semibold text-gray-800">
                {dateDisplay} ob {selectedTime}
              </p>
            </div>
          </div>

          {selectedService?.price != null && (
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ backgroundColor: `${pc}15` }}
              >
                💳
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Cena</span>
                <p className="font-semibold text-gray-800">
                  €{Number(selectedService.price).toFixed(0)} EUR
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ backgroundColor: `${pc}15` }}
              >
                📋
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Vaši podatki</span>
                <p className="font-semibold text-gray-800">{fullName}</p>
                <p className="text-sm text-gray-500">{customer.email}</p>
                <p className="text-sm text-gray-500">{customer.phone}</p>
                {customer.notes && (
                  <p className="text-sm text-gray-400 mt-1 italic">&ldquo;{customer.notes}&rdquo;</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {submitError && (
        <motion.div
          className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl mb-4"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {submitError}
        </motion.div>
      )}

      <div className="flex gap-3">
        <button
          onClick={goToPrevStep}
          disabled={isSubmitting}
          className="flex-1 py-4 rounded-2xl text-gray-600 font-semibold text-base border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Nazaj
        </button>
        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-[2] py-4 rounded-2xl text-white font-semibold text-base transition-all duration-200 disabled:opacity-70"
          style={{
            backgroundColor: pc,
            boxShadow: `0 4px 20px ${pc}30`,
          }}
          whileHover={!isSubmitting ? { scale: 1.01 } : {}}
          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              Potrjujem...
            </span>
          ) : (
            'Potrdi rezervacijo'
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
