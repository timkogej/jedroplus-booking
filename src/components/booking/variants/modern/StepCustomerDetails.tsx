'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBooking } from '@/components/booking/shared/BookingProvider'
import { format, parseISO } from 'date-fns'
import { sl } from 'date-fns/locale'

export default function StepCustomerDetails() {
  const {
    theme,
    customer,
    selectedEmployee,
    anyPerson,
    selectedService,
    selectedDate,
    selectedTime,
    isSubmitting,
    updateCustomer,
    submitBooking,
  } = useBooking()

  const [showErrors, setShowErrors] = useState(false)

  const isFirstNameValid = customer.firstName.trim() !== ''
  const isLastNameValid = customer.lastName.trim() !== ''
  const isPhoneValid = customer.phone.trim() !== ''
  const isEmailValid = customer.email.trim() !== '' && customer.email.includes('@')

  const isPrivacyConsented = customer.privacyConsent === true
  const isFormValid = isFirstNameValid && isLastNameValid && isPhoneValid && isEmailValid && isPrivacyConsented

  // Convert selectedDate (Date | null) to string for display
  const selectedDateStr: string | null = selectedDate instanceof Date
    ? format(selectedDate, 'yyyy-MM-dd')
    : (selectedDate as string | null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) {
      setShowErrors(true)
      return
    }
    if (!isSubmitting) {
      submitBooking()
    }
  }

  const inputClasses = (isValid: boolean) => `
    w-full px-4 py-3 rounded-xl bg-white/10 border
    text-white placeholder-white/40 font-display
    focus:outline-none focus:bg-white/15
    transition-all duration-200
    ${showErrors && !isValid
      ? 'border-red-400/70 focus:border-red-400'
      : 'border-white/20 focus:border-white/40'
    }
  `

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-semibold text-white mb-2">
          Vaši podatki
        </h2>
        <p className="text-white/60 font-display">
          Izpolnite podatke za dokončanje rezervacije
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-display text-sm mb-2">
                    Ime <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={customer.firstName}
                    onChange={(e) => updateCustomer({ firstName: e.target.value })}
                    placeholder="Janez"
                    className={inputClasses(isFirstNameValid)}
                    required
                  />
                  {showErrors && !isFirstNameValid && (
                    <p className="text-red-400 text-xs font-display mt-1">Ime je obvezno</p>
                  )}
                </div>
                <div>
                  <label className="block text-white/70 font-display text-sm mb-2">
                    Priimek <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={customer.lastName}
                    onChange={(e) => updateCustomer({ lastName: e.target.value })}
                    placeholder="Novak"
                    className={inputClasses(isLastNameValid)}
                    required
                  />
                  {showErrors && !isLastNameValid && (
                    <p className="text-red-400 text-xs font-display mt-1">Priimek je obvezen</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white/70 font-display text-sm mb-2">
                  Telefon <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => updateCustomer({ phone: e.target.value })}
                  placeholder="+386 40 123 456"
                  className={inputClasses(isPhoneValid)}
                  required
                />
                {showErrors && !isPhoneValid && (
                  <p className="text-red-400 text-xs font-display mt-1">Telefon je obvezen</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white/70 font-display text-sm mb-2">
                  E-pošta <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => updateCustomer({ email: e.target.value })}
                  placeholder="janez@email.com"
                  className={inputClasses(isEmailValid)}
                  required
                />
                {showErrors && !isEmailValid && (
                  <p className="text-red-400 text-xs font-display mt-1">
                    {customer.email.trim() === ''
                      ? 'E-pošta je obvezna'
                      : 'Vnesite veljavno e-poštno naslov'}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-white/70 font-display text-sm mb-2">Spol</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Moški', 'Ženska', 'Drugo'] as const).map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => updateCustomer({ gender })}
                      className={`
                        py-2.5 px-3 rounded-xl font-display font-medium text-sm transition-all duration-200
                        ${customer.gender === gender
                          ? 'text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                        }
                      `}
                      style={customer.gender === gender ? {
                        backgroundColor: theme.primaryColor,
                      } : {}}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-white/70 font-display text-sm mb-2">Opombe</label>
                <textarea
                  value={customer.notes}
                  onChange={(e) => updateCustomer({ notes: e.target.value })}
                  placeholder="Posebne želje ali opombe..."
                  rows={3}
                  className={`${inputClasses(true)} resize-none`}
                />
              </div>

              {/* Privacy Consent - REQUIRED */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={customer.privacyConsent}
                    onChange={(e) => updateCustomer({ privacyConsent: e.target.checked })}
                    className="sr-only"
                  />
                  <div
                    className={`
                      w-5 h-5 rounded-md border-2 transition-all duration-200
                      flex items-center justify-center
                      ${customer.privacyConsent
                        ? 'border-transparent'
                        : 'border-white/30 group-hover:border-white/50'
                      }
                    `}
                    style={customer.privacyConsent ? { backgroundColor: theme.primaryColor } : {}}
                  >
                    {customer.privacyConsent && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                </div>
                <span className="text-white/60 font-display text-sm">
                  Strinjam se z obdelavo osebnih podatkov za namen rezervacije termina.{' '}
                  <a
                    href="https://jedroplus.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-80"
                    style={{ color: theme.primaryColor }}
                  >
                    Preberi politiko zasebnosti
                  </a>
                </span>
              </label>

              {/* Marketing Consent - OPTIONAL */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={customer.marketingConsent}
                    onChange={(e) => updateCustomer({ marketingConsent: e.target.checked })}
                    className="sr-only"
                  />
                  <div
                    className={`
                      w-5 h-5 rounded-md border-2 transition-all duration-200
                      flex items-center justify-center
                      ${customer.marketingConsent
                        ? 'border-transparent'
                        : 'border-white/30 group-hover:border-white/50'
                      }
                    `}
                    style={customer.marketingConsent ? {
                      backgroundColor: theme.primaryColor,
                    } : {}}
                  >
                    {customer.marketingConsent && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                </div>
                <span className="text-white/60 font-display text-sm">
                  Želim prejemati novice in posebne ponudbe
                </span>
              </label>

              {/* Privacy error */}
              {showErrors && !isPrivacyConsented && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs font-display"
                >
                  Za oddajo rezervacije se morate strinjati s politiko zasebnosti.
                </motion.p>
              )}
            </form>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-lg font-display font-semibold text-white mb-6">
              Povzetek rezervacije
            </h3>

            <div className="space-y-4">
              {/* Employee */}
              <div>
                <p className="text-xs font-display text-white/50">Oseba</p>
                <p className="text-white font-display font-medium">
                  {anyPerson ? 'Kdorkoli' : (selectedEmployee?.label || selectedEmployee?.name)}
                </p>
              </div>

              {/* Service */}
              {selectedService && (
                <div>
                  <p className="text-xs font-display text-white/50">Storitev</p>
                  <p className="text-white font-display font-medium">{selectedService.name}</p>
                  {selectedService.duration != null && (
                    <p className="text-white/60 font-display text-sm">{selectedService.duration} min</p>
                  )}
                </div>
              )}

              {/* Date & Time */}
              {selectedDateStr && selectedTime && (
                <div>
                  <p className="text-xs font-display text-white/50">Datum in čas</p>
                  <p className="text-white font-display font-medium">
                    {format(parseISO(selectedDateStr), 'd. MMMM yyyy', { locale: sl })}
                  </p>
                  <p className="text-white/60 font-display text-sm">ob {selectedTime}</p>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-white/10 my-4" />

              {/* Total */}
              {selectedService && selectedService.price != null && (
                <div className="flex items-center justify-between">
                  <span className="text-white/70 font-display">Skupaj</span>
                  <span
                    className="text-3xl font-display font-bold"
                    style={{ color: theme.primaryColor }}
                  >
                    {Number(selectedService.price).toFixed(2)} €
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button - Desktop */}
            <motion.button
              whileHover={{ scale: isFormValid && !isSubmitting ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid && !isSubmitting ? 0.98 : 1 }}
              onClick={() => {
                if (!isFormValid) {
                  setShowErrors(true)
                  return
                }
                if (!isSubmitting) submitBooking()
              }}
              disabled={isSubmitting}
              className={`
                hidden lg:flex w-full mt-6 py-4 rounded-xl font-display font-semibold text-white
                items-center justify-center gap-2 transition-all duration-300
                ${!isFormValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              style={{
                backgroundColor: theme.primaryColor,
                boxShadow: isFormValid && !isSubmitting ? `0 10px 30px ${theme.primaryColor}40` : 'none',
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

            {/* Validation hint */}
            {showErrors && !isFormValid && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="hidden lg:block mt-3 text-red-400 text-sm font-display text-center"
              >
                Prosimo, izpolnite vsa obvezna polja.
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
