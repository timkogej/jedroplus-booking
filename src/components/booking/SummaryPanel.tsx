'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, Scissors, Calendar, CreditCard } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`glass-dark rounded-2xl p-6 border border-white/10 shadow-premium-lg overflow-hidden ${className}`}
    >
      <h3 className="text-base font-semibold text-white/80 uppercase tracking-wider mb-5">
        Vaša rezervacija
      </h3>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {/* Oseba */}
          {(employee || anyPerson) && (
            <motion.div
              key="employee"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${primaryColor}30` }}
              >
                {employee?.initials ? (
                  <span className="text-xs font-bold text-white">{employee.initials}</span>
                ) : (
                  <User className="w-4 h-4" style={{ color: primaryColor }} />
                )}
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wide mb-0.5">Oseba</p>
                <p className="font-medium text-white">
                  {anyPerson ? 'Kdorkoli' : employee?.name}
                </p>
                {!anyPerson && employee?.subtitle && (
                  <p className="text-xs text-white/50">{employee.subtitle}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Storitev */}
          {service && (
            <motion.div
              key="service"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${primaryColor}30` }}
              >
                <Scissors className="w-4 h-4" style={{ color: primaryColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/50 uppercase tracking-wide mb-0.5">Storitev</p>
                <p className="font-medium text-white truncate">{service.name}</p>
                <p className="text-sm text-white/60">{service.duration} min</p>
              </div>
            </motion.div>
          )}

          {/* Ločilna črta po storitvi */}
          {service && (date || time) && (
            <motion.div
              key="divider-service"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-t border-white/10"
            />
          )}

          {/* Datum in čas */}
          {date && (
            <motion.div
              key="datetime"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${primaryColor}30` }}
              >
                <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wide mb-0.5">Datum in čas</p>
                <p className="font-medium text-white">
                  {format(date, 'd. MMMM yyyy', { locale: sl })}
                </p>
                {time && (
                  <p className="text-sm text-white/70">ob {time}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skupaj / Cena */}
      {service && service.price != null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 pt-4 border-t border-white/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-white/40" />
              <span className="text-white/70">Skupaj</span>
            </div>
            <span
              className="text-2xl font-bold"
              style={{ color: primaryColor }}
            >
              {Number(service.price).toFixed(2)} €
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
