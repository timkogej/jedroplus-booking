'use client'

import { motion } from 'framer-motion'
import { SeasonalTheme } from '@/lib/types'
import { useBooking } from '@/components/booking/shared/BookingProvider'

interface Props {
  seasonalTheme: SeasonalTheme
  primaryColor: string
}

export default function StepEmployee({ seasonalTheme, primaryColor: pc }: Props) {
  const {
    filteredEmployees,
    selectedEmployee,
    anyPerson,
    selectEmployee,
    selectAnyEmployee,
    goToNextStep,
    goToPrevStep,
  } = useBooking()

  const canContinue = selectedEmployee !== null || anyPerson

  const handleContinue = () => {
    if (canContinue) goToNextStep()
  }

  const avatarDecoration = (() => {
    if (seasonalTheme.holiday === 'christmas') return '🎅'
    if (seasonalTheme.holiday === 'easter') return '🐰'
    if (seasonalTheme.holiday === 'halloween') return '🎃'
    return null
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Izberi specialista</h2>
      <p className="text-gray-500 text-sm mb-6">
        Izberi osebo, ki bi jo rad obiskal, ali pa pusti, da izberemo mi
      </p>

      {filteredEmployees.length === 0 && (
        <p className="text-sm text-gray-500 py-4">Za to storitev ni na voljo nobenega osebja.</p>
      )}

      <div className="space-y-3">
        {/* Any available option */}
        {filteredEmployees.length > 0 && (
          <motion.button
            onClick={selectAnyEmployee}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
              anyPerson
                ? 'shadow-lg'
                : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
            }`}
            style={
              anyPerson
                ? {
                    borderColor: pc,
                    backgroundColor: `${pc}08`,
                    boxShadow: `0 4px 20px ${pc}15`,
                  }
                : {}
            }
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: `${pc}15`, color: pc }}
              >
                {seasonalTheme.holiday === 'easter' ? '🐰' : '✨'}
              </div>
              <div>
                <span className="font-semibold text-gray-800">Katera koli oseba</span>
                <p className="text-xs text-gray-400">Poišči mi najboljši termin</p>
              </div>
            </div>
          </motion.button>
        )}

        {filteredEmployees.map((emp) => {
          const isSelected = selectedEmployee?.id === emp.id
          return (
            <motion.button
              key={emp.id}
              onClick={() => selectEmployee(emp)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'shadow-lg'
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
              }`}
              style={
                isSelected
                  ? {
                      borderColor: pc,
                      backgroundColor: `${pc}08`,
                      boxShadow: `0 4px 20px ${pc}15`,
                    }
                  : {}
              }
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: pc }}
                  >
                    {emp.initials || (emp.name ?? '?').charAt(0).toUpperCase()}
                  </div>
                  {avatarDecoration && (
                    <span className="absolute -top-1.5 -right-1.5 text-sm transform rotate-12">
                      {avatarDecoration}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{emp.label || emp.name}</span>
                  {emp.subtitle && (
                    <p className="text-xs text-gray-400">{emp.subtitle}</p>
                  )}
                </div>
                <div
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{
                    borderColor: isSelected ? pc : '#d1d5db',
                    backgroundColor: isSelected ? pc : 'transparent',
                  }}
                >
                  {isSelected && (
                    <motion.svg
                      className="w-3.5 h-3.5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
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
          disabled={!canContinue || filteredEmployees.length === 0}
          className="flex-[2] py-4 rounded-2xl text-white font-semibold text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: pc,
            boxShadow: canContinue && filteredEmployees.length > 0 ? `0 4px 20px ${pc}30` : 'none',
          }}
          whileHover={canContinue && filteredEmployees.length > 0 ? { scale: 1.01 } : {}}
          whileTap={canContinue && filteredEmployees.length > 0 ? { scale: 0.98 } : {}}
        >
          Naprej
        </motion.button>
      </div>
    </motion.div>
  )
}
