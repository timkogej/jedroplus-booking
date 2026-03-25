'use client'

import { motion } from 'framer-motion'
import { Theme, Service, Employee } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { sl } from 'date-fns/locale'

interface SummaryPanelProps {
  theme: Theme
  selectedEmployee: Employee | null
  anyPerson: boolean
  selectedService: Service | null
  selectedDate: string | null
  selectedTime: string | null
}

export default function SummaryPanel({
  theme,
  selectedEmployee,
  anyPerson,
  selectedService,
  selectedDate,
  selectedTime,
}: SummaryPanelProps) {
  const hasContent = selectedEmployee || anyPerson || selectedService || selectedDate

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 sticky top-8"
    >
      <h3 className="text-lg font-display font-semibold text-white mb-6">
        Povzetek rezervacije
      </h3>

      {!hasContent ? (
        <p className="text-white/50 font-display text-sm">
          Začnite z izbiro za prikaz povzetka...
        </p>
      ) : (
        <div className="space-y-4">
          {/* Employee */}
          {(selectedEmployee || anyPerson) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs font-display text-white/50">Oseba</p>
              <p className="text-white font-display font-medium">
                {anyPerson ? 'Kdorkoli' : (selectedEmployee?.label || selectedEmployee?.name)}
              </p>
            </motion.div>
          )}

          {/* Service */}
          {selectedService && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs font-display text-white/50">Storitev</p>
              <p className="text-white font-display font-medium">{selectedService.name}</p>
              {selectedService.duration != null && (
                <p className="text-white/60 font-display text-sm">{selectedService.duration} min</p>
              )}
            </motion.div>
          )}

          {/* Date & Time */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs font-display text-white/50">Datum in čas</p>
              <p className="text-white font-display font-medium">
                {format(parseISO(selectedDate), 'd. MMMM yyyy', { locale: sl })}
              </p>
              {selectedTime && (
                <p className="text-white/60 font-display text-sm">ob {selectedTime}</p>
              )}
            </motion.div>
          )}

          {/* Divider + Total */}
          {selectedService && selectedService.price != null && (
            <>
              <div className="border-t border-white/10 my-4" />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between"
              >
                <span className="text-white/70 font-display">Skupaj</span>
                <span
                  className="text-2xl font-display font-bold"
                  style={{ color: theme.primaryColor }}
                >
                  {Number(selectedService.price).toFixed(2)} €
                </span>
              </motion.div>
            </>
          )}
        </div>
      )}
    </motion.div>
  )
}
