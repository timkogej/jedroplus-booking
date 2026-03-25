'use client'

import { motion } from 'framer-motion'
import { useBooking } from '@/components/booking/shared/BookingProvider'
import { Employee } from '@/lib/types'

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

export default function StepEmployeeSelection() {
  const {
    theme,
    filteredEmployees,
    selectedEmployee,
    anyPerson,
    selectEmployee,
    selectAnyEmployee,
  } = useBooking()

  const handleSelectEmployee = (employee: Employee) => {
    selectEmployee(employee)
  }

  const handleSelectAnyPerson = () => {
    selectAnyEmployee()
  }

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
          Izberite osebo
        </h2>
        <p className="text-white/60 font-display">
          Kdo naj izvede vašo storitev?
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 max-w-2xl mx-auto"
      >
        {/* Any Person Option */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSelectAnyPerson}
          className={`
            relative p-5 rounded-2xl border-2 transition-all duration-300
            flex items-center gap-4 text-left w-full
            ${anyPerson
              ? 'bg-white/20 border-white'
              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }
          `}
          style={anyPerson ? {
            borderColor: theme.primaryColor,
            boxShadow: `0 10px 30px ${theme.primaryColor}30`,
          } : {}}
        >
          <div className="flex-1">
            <p className="text-white font-display font-semibold text-lg">Kdorkoli</p>
            <p className="text-white/60 font-display text-sm">Izberite najboljši termin zame</p>
          </div>

          {anyPerson && (
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
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/40 text-sm font-display">ali izberite osebo</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Empty state: no eligible employees for this service */}
        {filteredEmployees.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-10"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-white/60 font-display">Za to storitev ni na voljo nobenega osebja.</p>
          </motion.div>
        )}

        {/* Employees */}
        {filteredEmployees.map((employee: Employee) => {
          const isSelected = selectedEmployee?.id === employee.id && !anyPerson

          return (
            <motion.button
              key={employee.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectEmployee(employee)}
              className={`
                relative p-5 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300
                flex items-center gap-4 text-left w-full
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
              <div className="flex-1">
                <p className="text-white font-display font-semibold text-lg">{employee.label || employee.name}</p>
                {employee.subtitle && (
                  <p className="text-white/60 font-display text-sm">{employee.subtitle}</p>
                )}
              </div>

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
            </motion.button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
