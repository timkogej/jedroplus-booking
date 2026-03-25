'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Employee, Service } from '@/lib/types';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';

interface SummaryPanelProps {
  employee: Employee | null;
  anyPerson: boolean;
  service: Service | null;
  date: Date | null;
  time: string | null;
  primaryColor: string;
  className?: string;
}

export default function SummaryPanel({
  employee,
  anyPerson,
  service,
  date,
  time,
  primaryColor,
  className = '',
}: SummaryPanelProps) {
  const hasSelection = employee || anyPerson || service || date || time;

  if (!hasSelection) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`glass-dark rounded-2xl px-6 py-4 border border-white/10 shadow-premium-lg ${className}`}
    >
      <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
        Vaša rezervacija
      </p>

      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <AnimatePresence mode="popLayout">
          {/* Oseba */}
          {(employee || anyPerson) && (
            <motion.div
              key="employee"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <p className="text-xs text-white/50 uppercase tracking-wide mb-0.5">Oseba</p>
              <p className="font-medium text-white">
                {anyPerson ? 'Kdorkoli' : employee?.name}
              </p>
              {!anyPerson && employee?.subtitle && (
                <p className="text-xs text-white/50">{employee.subtitle}</p>
              )}
            </motion.div>
          )}

          {/* Storitev */}
          {service && (
            <motion.div
              key="service"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <p className="text-xs text-white/50 uppercase tracking-wide mb-0.5">Storitev</p>
              <p className="font-medium text-white">{service.name}</p>
              <p className="text-xs text-white/60">{service.duration} min</p>
            </motion.div>
          )}

          {/* Datum in čas */}
          {date && (
            <motion.div
              key="datetime"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <p className="text-xs text-white/50 uppercase tracking-wide mb-0.5">Datum in čas</p>
              <p className="font-medium text-white">
                {format(date, 'd. MMMM yyyy', { locale: sl })}
              </p>
              {time && (
                <p className="text-xs text-white/70">ob {time}</p>
              )}
            </motion.div>
          )}

          {/* Skupaj / Cena */}
          {service && service.price != null && (
            <motion.div
              key="price"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-auto"
            >
              <p className="text-xs text-white/50 uppercase tracking-wide mb-0.5">Skupaj</p>
              <p className="text-xl font-bold" style={{ color: primaryColor }}>
                {Number(service.price).toFixed(2)} €
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
