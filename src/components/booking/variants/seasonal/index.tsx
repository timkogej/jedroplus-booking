'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBooking } from '@/components/booking/shared/BookingProvider'
import { SeasonalTheme } from '@/lib/types'
import { getCurrentSeasonalTheme } from './seasonDetector'
import SeasonalDecorations from './SeasonalDecorations'
import BookingStepper from './BookingStepper'
import StepService from './StepService'
import StepEmployee from './StepEmployee'
import StepDateTime from './StepDateTime'
import StepInfo from './StepInfo'
import StepConfirmation from './StepConfirmation'

// ─── Step config for the seasonal 5-step flow ─────────────────────────────────

const SEASONAL_STEPS = [
  { id: 'service', title: 'Storitev' },
  { id: 'specialist', title: 'Specialist' },
  { id: 'datum', title: 'Datum' },
  { id: 'podatki', title: 'Podatki' },
  { id: 'potrditev', title: 'Potrditev' },
]

// ─── Validation ───────────────────────────────────────────────────────────────

function canGoNext(
  currentStep: number,
  {
    selectedService,
    selectedEmployee,
    anyPerson,
    filteredEmployees,
    selectedDate,
    selectedTime,
    customer,
  }: ReturnType<typeof useBooking>
): boolean {
  switch (currentStep) {
    case 1:
      return selectedService !== null
    case 2:
      if (filteredEmployees.length === 0) return false
      return selectedEmployee !== null || anyPerson
    case 3:
      return selectedDate !== null && selectedTime !== null
    case 4: {
      const { firstName, lastName, phone, email } = customer
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      const phoneValid = /^[\d\s+\-()]{6,}$/.test(phone.trim())
      return (
        firstName.trim().length > 0 &&
        lastName.trim().length > 0 &&
        phoneValid &&
        emailValid
      )
    }
    default:
      return false
  }
}

// ─── Seasonal emoji helper ────────────────────────────────────────────────────

function getSeasonalEmoji(theme: SeasonalTheme): string {
  if (theme.holiday === 'christmas') return '🎄'
  if (theme.holiday === 'newyear') return '🎆'
  if (theme.holiday === 'valentine') return '💕'
  if (theme.holiday === 'easter') return '🐣'
  if (theme.holiday === 'halloween') return '🎃'
  if (theme.holiday === 'thanksgiving') return '🦃'
  if (theme.season === 'winter') return '❄️'
  if (theme.season === 'spring') return '🌸'
  if (theme.season === 'summer') return '☀️'
  if (theme.season === 'autumn') return '🍂'
  return '✨'
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SeasonalBooking() {
  const booking = useBooking()
  const {
    isLoading,
    error,
    theme,
    companyName,
    currentStep,
    isConfirmed,
    companyData,
  } = booking

  // Compute seasonal theme once on mount
  const [seasonalTheme] = useState<SeasonalTheme>(() =>
    getCurrentSeasonalTheme(new Date())
  )

  const pc = theme.primaryColor

  const seasonFontClass = seasonalTheme.theme.fontClass

  // All services from companyData (no category filter for seasonal variant)
  const allServices = companyData?.services || []

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden ${seasonFontClass}`}>
        <SeasonalDecorations theme={seasonalTheme} />
        <div className="relative z-10 text-center">
          <motion.div
            className="w-12 h-12 border-[3px] rounded-full mx-auto mb-4"
            style={{ borderColor: `${pc}30`, borderTopColor: pc }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-gray-400 text-sm">Nalagam stran za rezervacije...</p>
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden ${seasonFontClass}`}>
        <SeasonalDecorations theme={seasonalTheme} />
        <div className="relative z-10 text-center px-6">
          <div className="text-5xl mb-4">
            {seasonalTheme.season === 'winter' ? '❄️' : '😔'}
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Napaka</h1>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">{error}</p>
        </div>
      </div>
    )
  }

  // ── Render step content ───────────────────────────────────────────────────
  const renderStep = () => {
    // Step 5 (isConfirmed) is always shown as confirmation
    if (isConfirmed || currentStep === 5) {
      return (
        <StepConfirmation
          seasonalTheme={seasonalTheme}
          primaryColor={pc}
        />
      )
    }

    switch (currentStep) {
      case 1:
        return (
          <StepService
            seasonalTheme={seasonalTheme}
            primaryColor={pc}
            services={allServices}
          />
        )
      case 2:
        return (
          <StepEmployee
            seasonalTheme={seasonalTheme}
            primaryColor={pc}
          />
        )
      case 3:
        return (
          <StepDateTime
            seasonalTheme={seasonalTheme}
            primaryColor={pc}
          />
        )
      case 4:
        return <StepInfo primaryColor={pc} />
      default:
        return null
    }
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 relative overflow-hidden ${seasonFontClass}`}
    >
      <SeasonalDecorations theme={seasonalTheme} />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-8 pb-4 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-2"
              style={{ backgroundColor: `${pc}12`, color: pc }}
            >
              <span>{getSeasonalEmoji(seasonalTheme)}</span>
              <span>{companyName}</span>
            </div>
          </motion.div>
        </header>

        {/* Stepper (hide on confirmation) */}
        {!isConfirmed && currentStep <= 5 && (
          <div className="px-4 py-2">
            <BookingStepper
              steps={SEASONAL_STEPS}
              currentStep={currentStep}
              seasonalTheme={seasonalTheme}
              primaryColor={pc}
            />
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 px-4 pb-8 max-w-lg mx-auto w-full">
          <div
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8"
            style={{
              boxShadow: `0 4px 24px ${pc}08, 0 1px 3px rgba(0,0,0,0.04)`,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isConfirmed ? 'confirmed' : currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center">
          <p className="text-xs text-gray-400">
            Powered by{' '}
            <span className="font-semibold" style={{ color: pc }}>
              Jedro+
            </span>
          </p>
        </footer>
      </div>
    </div>
  )
}
