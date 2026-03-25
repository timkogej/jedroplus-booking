'use client'

import { motion } from 'framer-motion'
import { Service } from '@/lib/types'
import { SeasonalTheme } from '@/lib/types'
import { useBooking } from '@/components/booking/shared/BookingProvider'

interface Props {
  seasonalTheme: SeasonalTheme
  primaryColor: string
  services: Service[]
}

export default function StepService({ seasonalTheme, primaryColor: pc, services }: Props) {
  const { selectedService, selectService } = useBooking()

  const seasonIcon = (() => {
    if (seasonalTheme.holiday === 'christmas') return '🎁'
    if (seasonalTheme.holiday === 'halloween') return '🎃'
    if (seasonalTheme.holiday === 'valentine') return '💖'
    if (seasonalTheme.holiday === 'easter') return '🥚'
    if (seasonalTheme.season === 'summer') return '☀️'
    return null
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Izberi storitev</h2>
      <p className="text-gray-500 text-sm mb-6">Izberi storitev, ki jo želiš rezervirati</p>

      {services.length === 0 && (
        <p className="text-sm text-gray-400 py-4">Ni razpoložljivih storitev.</p>
      )}

      <div className="space-y-3">
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id

          return (
            <motion.button
              key={service.id}
              onClick={() => selectService(service)}
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
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {seasonIcon && (
                      <span className="text-sm opacity-60">{seasonIcon}</span>
                    )}
                    <span className="font-semibold text-gray-800">{service.name}</span>
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    {service.duration != null && <span>{service.duration} min</span>}
                    {service.price != null && (
                      <span
                        className="font-semibold"
                        style={{ color: isSelected ? pc : undefined }}
                      >
                        €{Number(service.price).toFixed(0)} EUR
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ml-4"
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

      <p className="text-xs text-gray-400 text-center mt-6">
        Klikni na storitev za nadaljevanje
      </p>
    </motion.div>
  )
}
