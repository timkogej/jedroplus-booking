'use client'

import { motion } from 'framer-motion'
import { useBooking } from '@/components/booking/shared/BookingProvider'
import { Service } from '@/lib/types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const itemVariants = {
  hidden: { y: 20 },
  visible: { y: 0, transition: { duration: 0.28 } },
}

export default function StepServiceSelection() {
  const {
    theme,
    servicesForCategory,
    selectedService,
    selectedCategory,
    selectService,
    goToPrevStep,
  } = useBooking()

  const categoryName = selectedCategory?.name || ''

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        {/* Back to categories button */}
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ x: -4 }}
          onClick={goToPrevStep}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-display">Nazaj na kategorije</span>
        </motion.button>

        <h2 className="text-3xl font-display font-semibold text-white mb-2">
          {categoryName}
        </h2>
        <p className="text-white/60 font-display">
          Izberite storitev, ki jo želite
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-3 max-w-2xl mx-auto"
      >
        {servicesForCategory.map((service: Service) => {
          const isSelected = selectedService?.id === service.id

          return (
            <motion.button
              key={service.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => selectService(service)}
              className={`
                relative p-5 rounded-2xl border-2 transition-all duration-300
                text-left w-full
                ${isSelected
                  ? 'bg-white/20 border-white'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }
              `}
              style={isSelected ? {
                borderColor: theme.primaryColor,
                boxShadow: `0 10px 30px ${theme.primaryColor}30`,
              } : {}}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-display font-semibold text-lg mb-1">
                    {service.name}
                  </h3>

                  {service.description && (
                    <p className="text-white/60 font-display text-sm mb-3 line-clamp-2">
                      {service.description}
                    </p>
                  )}

                  {service.duration != null && (
                    <p className="text-white/50 font-display text-sm">
                      {service.duration} min
                    </p>
                  )}
                </div>

                {/* Price and check */}
                <div className="flex flex-col items-end gap-2">
                  {service.price != null && (
                    <span
                      className="text-xl font-display font-bold"
                      style={{ color: isSelected ? 'white' : theme.primaryColor }}
                    >
                      {Number(service.price).toFixed(2)} €
                    </span>
                  )}

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}

        {servicesForCategory.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-white/60 font-display">V tej kategoriji ni storitev</p>
            <button
              onClick={goToPrevStep}
              className="mt-4 text-sm font-display hover:underline"
              style={{ color: theme.primaryColor }}
            >
              Izberite drugo kategorijo
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
