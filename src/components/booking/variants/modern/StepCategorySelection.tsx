'use client'

import { motion } from 'framer-motion'
import { useBooking } from '@/components/booking/shared/BookingProvider'
import { ServiceCategory } from '@/lib/types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { y: 20 },
  visible: { y: 0, transition: { duration: 0.28 } },
}

function serviceCountLabel(count: number): string {
  if (count === 1) return '1 storitev'
  if (count >= 2 && count <= 4) return `${count} storitve`
  return `${count} storitev`
}

export default function StepCategorySelection() {
  const {
    theme,
    serviceCategories,
    selectedCategory,
    selectCategory,
    servicesForCategory,
  } = useBooking()

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
          Izberite kategorijo
        </h2>
        <p className="text-white/60 font-display">
          Katero vrsto storitve potrebujete?
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto"
      >
        {serviceCategories.map((category: ServiceCategory) => {
          const isSelected = selectedCategory?.id === category.id
          const count = category.service_count

          return (
            <motion.button
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectCategory(category)}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                text-left w-full overflow-hidden group
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
              {/* Background gradient on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at center, ${theme.primaryColor}, transparent)`,
                }}
              />

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-white font-display font-semibold text-lg truncate">
                      {category.name}
                    </p>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-display font-medium flex-shrink-0"
                      style={{
                        backgroundColor: `${theme.primaryColor}30`,
                        color: theme.primaryColor,
                      }}
                    >
                      {serviceCountLabel(count)}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-white/60 font-display text-sm mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
