'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBooking } from '@/components/booking/shared/BookingProvider'

interface Props {
  primaryColor: string
}

export default function StepInfo({ primaryColor: pc }: Props) {
  const { customer, updateCustomer, goToNextStep, goToPrevStep } = useBooking()

  const [firstName, setFirstName] = useState(customer.firstName)
  const [lastName, setLastName] = useState(customer.lastName)
  const [email, setEmail] = useState(customer.email)
  const [phone, setPhone] = useState(customer.phone)
  const [gender, setGender] = useState(customer.gender)
  const [notes, setNotes] = useState(customer.notes)
  const [marketingConsent, setMarketingConsent] = useState(customer.marketingConsent)
  const [privacyConsent, setPrivacyConsent] = useState(customer.privacyConsent)
  const [showPrivacyError, setShowPrivacyError] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!firstName.trim()) errs.firstName = 'Ime je obvezno'
    if (!lastName.trim()) errs.lastName = 'Priimek je obvezen'
    if (!email.trim()) {
      errs.email = 'E-pošta je obvezna'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Prosim vnesite veljavno e-pošto'
    }
    if (!phone.trim()) errs.phone = 'Telefonska številka je obvezna'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleContinue = () => {
    if (!privacyConsent) {
      setShowPrivacyError(true)
      return
    }
    if (validate()) {
      updateCustomer({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender: gender as '' | 'Moški' | 'Ženska' | 'Drugo',
        notes: notes.trim(),
        privacyConsent,
        marketingConsent,
      })
      goToNextStep()
    }
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3.5 rounded-2xl border-2 text-gray-800 text-sm outline-none transition-all duration-200 ${
      errors[field] ? 'border-red-300 bg-red-50/50' : 'border-gray-100 focus:bg-white'
    }`

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.target.style.borderColor = pc
    e.target.style.boxShadow = 'none'
  }

  const handleBlur =
    (field: string) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (!errors[field]) {
        e.target.style.borderColor = '#f3f4f6'
        e.target.style.boxShadow = 'none'
      }
    }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Vaši podatki</h2>
      <p className="text-gray-500 text-sm mb-6">Te podatke bomo uporabili za potrditev rezervacije</p>

      <div className="space-y-4">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Ime</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
                if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }))
              }}
              className={inputClass('firstName')}
              onFocus={handleFocus}
              onBlur={handleBlur('firstName')}
              placeholder="Ana"
            />
            {errors.firstName && (
              <motion.p
                className="text-xs text-red-500 mt-1"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.firstName}
              </motion.p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Priimek</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
                if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }))
              }}
              className={inputClass('lastName')}
              onFocus={handleFocus}
              onBlur={handleBlur('lastName')}
              placeholder="Novak"
            />
            {errors.lastName && (
              <motion.p
                className="text-xs text-red-500 mt-1"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.lastName}
              </motion.p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">E-pošta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
            }}
            className={inputClass('email')}
            onFocus={handleFocus}
            onBlur={handleBlur('email')}
            placeholder="ana@primer.si"
          />
          {errors.email && (
            <motion.p
              className="text-xs text-red-500 mt-1"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Telefon</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }))
            }}
            className={inputClass('phone')}
            onFocus={handleFocus}
            onBlur={handleBlur('phone')}
            placeholder="+386 ..."
          />
          {errors.phone && (
            <motion.p
              className="text-xs text-red-500 mt-1"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errors.phone}
            </motion.p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Spol</label>
          <div className="flex gap-2">
            {(['Moški', 'Ženska', 'Drugo'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex-1 py-3 rounded-2xl text-sm font-medium border-2 transition-all duration-200 ${
                  gender === g ? 'text-white' : 'border-gray-100 text-gray-600 hover:border-gray-200'
                }`}
                style={
                  gender === g
                    ? { backgroundColor: pc, borderColor: pc }
                    : {}
                }
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Opombe <span className="text-gray-400 font-normal">(neobvezno)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 text-gray-800 text-sm outline-none transition-all duration-200 resize-none"
            onFocus={handleFocus}
            onBlur={handleBlur('')}
            placeholder="Posebne zahteve ali opombe..."
          />
        </div>

        {/* Privacy consent - REQUIRED */}
        <div className="space-y-1">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="mt-0.5">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => {
                  setPrivacyConsent(e.target.checked)
                  if (e.target.checked) setShowPrivacyError(false)
                }}
                className="sr-only"
              />
              <div
                className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                style={{
                  borderColor: privacyConsent ? pc : '#d1d5db',
                  backgroundColor: privacyConsent ? pc : 'transparent',
                }}
              >
                {privacyConsent && (
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-500">
              Strinjam se z obdelavo osebnih podatkov za namen rezervacije termina.{' '}
              <a
                href="https://jedroplus.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
                style={{ color: pc }}
              >
                Preberi politiko zasebnosti
              </a>
            </span>
          </label>
          {showPrivacyError && !privacyConsent && (
            <p className="text-red-500 text-xs ml-8">
              Za oddajo rezervacije se morate strinjati s politiko zasebnosti.
            </p>
          )}
        </div>

        {/* Marketing consent - OPTIONAL */}
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="mt-0.5">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="sr-only"
            />
            <div
              className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
              style={{
                borderColor: marketingConsent ? pc : '#d1d5db',
                backgroundColor: marketingConsent ? pc : 'transparent',
              }}
            >
              {marketingConsent && (
                <svg
                  className="w-3 h-3 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-500">
            Strinjam se s prejemanjem promocijskih e-poštnih sporočil in ponudb
          </span>
        </label>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={goToPrevStep}
          className="flex-1 py-4 rounded-2xl text-gray-600 font-semibold text-base border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Nazaj
        </button>
        <motion.button
          onClick={handleContinue}
          disabled={!privacyConsent}
          className={`flex-[2] py-4 rounded-2xl text-white font-semibold text-base transition-all duration-200 ${!privacyConsent ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{
            backgroundColor: pc,
            boxShadow: privacyConsent ? `0 4px 20px ${pc}30` : 'none',
          }}
          whileHover={{ scale: privacyConsent ? 1.01 : 1 }}
          whileTap={{ scale: privacyConsent ? 0.98 : 1 }}
        >
          Preglej rezervacijo
        </motion.button>
      </div>
    </motion.div>
  )
}
