'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBooking } from '@/components/booking/shared/BookingProvider'
import BookingStepper from './BookingStepper'
import SummaryPanel from './SummaryPanel'
import StepCategorySelection from './StepCategorySelection'
import StepServiceSelection from './StepServiceSelection'
import StepEmployeeSelection from './StepEmployeeSelection'
import StepDateTimeSelection from './StepDateTimeSelection'
import StepCustomerDetails from './StepCustomerDetails'
import StepConfirmation from './StepConfirmation'

function LoadingScreen({ companyName, theme }: { companyName?: string; theme: { primaryColor: string; bgFrom: string; bgTo: string } }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgTo})` }}
    >
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-white/70 font-display text-lg">{companyName || 'Nalaganje...'}</p>
      </div>
    </div>
  )
}

function ErrorScreen({ error, theme, onRetry }: { error: string; theme: { primaryColor: string; bgFrom: string; bgTo: string }; onRetry: () => void }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgTo})` }}
    >
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-white font-display text-lg mb-2">Prišlo je do napake</p>
        <p className="text-white/60 font-display text-sm mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-3 rounded-xl font-display font-medium text-white transition-all"
          style={{ backgroundColor: theme.primaryColor }}
        >
          Poskusi znova
        </button>
      </div>
    </div>
  )
}

export default function ModernBookingPage() {
  const {
    isLoading,
    error,
    theme,
    companyName,
    currentStep,
    goToNextStep,
    goToPrevStep,
    filteredEmployees,
    selectedCategory,
    selectedService,
    selectedEmployee,
    anyPerson,
    selectedDate,
    selectedTime,
    customer,
    submitBooking,
    resetBooking,
    isSubmitting,
  } = useBooking()

  // Validation for Next button — mirrors the canProceed logic from the original page.tsx
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return selectedCategory !== null
      case 2:
        return selectedService !== null
      case 3:
        if (filteredEmployees.length === 0) return false
        return selectedEmployee !== null || anyPerson
      case 4:
        return selectedDate !== null && selectedTime !== null
      case 5:
        return (
          customer.firstName.trim() !== '' &&
          customer.lastName.trim() !== '' &&
          customer.phone.trim() !== '' &&
          customer.email.trim() !== '' &&
          customer.email.includes('@')
        )
      default:
        return false
    }
  }, [currentStep, selectedCategory, selectedService, filteredEmployees, selectedEmployee, anyPerson, selectedDate, selectedTime, customer])

  if (isLoading) {
    return <LoadingScreen companyName={companyName} theme={theme} />
  }

  if (error) {
    return (
      <ErrorScreen
        error={error}
        theme={theme}
        onRetry={() => window.location.reload()}
      />
    )
  }

  // Convert selectedDate (Date | null) to string for child components that expect string | null
  const selectedDateStr = selectedDate
    ? selectedDate instanceof Date
      ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
      : (selectedDate as string)
    : null

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgTo})`,
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-display font-semibold text-white">
              {companyName || 'Rezervacija'}
            </h1>
          </div>

          {/* Stepper - show for steps 1-5, not confirmation (6) */}
          {currentStep < 6 && (
            <BookingStepper currentStep={currentStep} theme={theme} />
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Content area */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Step 1: Category Selection */}
              {currentStep === 1 && (
                <StepCategorySelection key="category" />
              )}

              {/* Step 2: Service Selection */}
              {currentStep === 2 && (
                <StepServiceSelection key="service" />
              )}

              {/* Step 3: Employee Selection */}
              {currentStep === 3 && (
                <StepEmployeeSelection key="employee" />
              )}

              {/* Step 4: Date/Time Selection */}
              {currentStep === 4 && (
                <StepDateTimeSelection key="datetime" />
              )}

              {/* Step 5: Customer Details */}
              {currentStep === 5 && (
                <StepCustomerDetails key="customer" />
              )}

              {/* Step 6: Confirmation */}
              {currentStep === 6 && (
                <StepConfirmation key="confirmation" />
              )}
            </AnimatePresence>
          </div>

          {/* Summary Panel - Desktop only, Steps 1-4 */}
          {currentStep < 5 && (
            <div className="hidden xl:block w-80 flex-shrink-0">
              <SummaryPanel
                theme={theme}
                selectedEmployee={selectedEmployee}
                anyPerson={anyPerson}
                selectedService={selectedService}
                selectedDate={selectedDateStr}
                selectedTime={selectedTime}
              />
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      {currentStep < 6 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-t border-white/20"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Back Button */}
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goToPrevStep}
                  className="px-6 py-3 rounded-xl font-display font-medium text-white/80 bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                >
                  Nazaj
                </motion.button>
              )}

              {/* Spacer when no back button */}
              {currentStep === 1 && <div />}

              {/* Price - Mobile only */}
              {selectedService && selectedService.price != null && (
                <div className="xl:hidden text-center">
                  <p className="text-white/60 font-display text-xs">Skupaj</p>
                  <p className="text-xl font-display font-bold" style={{ color: theme.primaryColor }}>
                    {Number(selectedService.price).toFixed(2)} €
                  </p>
                </div>
              )}

              {/* Next Button - Steps 1-4 */}
              {currentStep < 5 && (
                <motion.button
                  whileHover={{ scale: canProceed ? 1.02 : 1 }}
                  whileTap={{ scale: canProceed ? 0.98 : 1 }}
                  onClick={goToNextStep}
                  disabled={!canProceed}
                  className={`
                    px-8 py-3 rounded-xl font-display font-semibold text-white transition-all
                    flex items-center gap-2
                    ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  style={{
                    backgroundColor: theme.primaryColor,
                    boxShadow: canProceed ? `0 10px 30px ${theme.primaryColor}40` : 'none',
                  }}
                >
                  Naprej
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              )}

              {/* Submit Button - Mobile, Step 5 */}
              {currentStep === 5 && (
                <motion.button
                  whileHover={{ scale: canProceed && !isSubmitting ? 1.02 : 1 }}
                  whileTap={{ scale: canProceed && !isSubmitting ? 0.98 : 1 }}
                  onClick={submitBooking}
                  disabled={!canProceed || isSubmitting}
                  className={`
                    lg:hidden px-8 py-3 rounded-xl font-display font-semibold text-white transition-all
                    flex items-center gap-2
                    ${!canProceed || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  style={{
                    backgroundColor: theme.primaryColor,
                    boxShadow: canProceed && !isSubmitting ? `0 10px 30px ${theme.primaryColor}40` : 'none',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Rezerviranje...
                    </>
                  ) : (
                    <>
                      Potrdi rezervacijo
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Bottom padding to account for fixed nav */}
      {currentStep < 6 && <div className="h-24" />}
    </div>
  )
}
