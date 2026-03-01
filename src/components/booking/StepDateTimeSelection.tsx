'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  isBefore,
  startOfToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { sl } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepDateTimeSelectionProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  availableSlots: string[];
  isLoading: boolean;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  primaryColor: string;
}

const DAY_NAMES = ['PON', 'TOR', 'SRE', 'ČET', 'PET', 'SOB', 'NED'];

export default function StepDateTimeSelection({
  selectedDate,
  selectedTime,
  availableSlots,
  isLoading,
  onSelectDate,
  onSelectTime,
  primaryColor,
}: StepDateTimeSelectionProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate ?? new Date()
  );

  const today = startOfToday();
  const isCurrentMonth = isSameDay(startOfMonth(currentMonth), startOfMonth(today));

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Monday-first offset: getDay returns 0=Sun … 6=Sat
  const rawDay = getDay(startOfMonth(currentMonth));
  const offset = rawDay === 0 ? 6 : rawDay - 1;

  const handlePrevMonth = () => {
    if (!isCurrentMonth) setCurrentMonth((m) => subMonths(m, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((m) => addMonths(m, 1));
  };

  const handleDayClick = (day: Date) => {
    if (isBefore(day, today)) return;
    onSelectDate(day);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Izberite datum in čas
        </h1>
        <p className="text-lg text-white/70">Kdaj bi želeli priti?</p>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── LEFT: Calendar ── */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <motion.button
              onClick={handlePrevMonth}
              disabled={isCurrentMonth}
              whileHover={isCurrentMonth ? {} : { scale: 1.1 }}
              whileTap={isCurrentMonth ? {} : { scale: 0.9 }}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center transition-colors',
                isCurrentMonth
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {format(currentMonth, 'LLLL yyyy', { locale: sl })}
            </h3>

            <motion.button
              onClick={handleNextMonth}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Day-of-week header */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map((name) => (
              <div
                key={name}
                className="text-center text-xs font-medium text-gray-400 py-2"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty offset cells */}
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Day buttons */}
            {daysInMonth.map((day) => {
              const isPast = isBefore(day, today);
              const isDayToday = isSameDay(day, today);
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

              return (
                <motion.button
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  disabled={isPast}
                  whileHover={isPast || isSelected ? {} : { scale: 1.1 }}
                  whileTap={isPast ? {} : { scale: 0.95 }}
                  className={cn(
                    'aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all',
                    isPast && 'text-gray-300 cursor-not-allowed',
                    !isPast && !isSelected && 'text-gray-700 hover:bg-gray-100',
                    isDayToday && !isSelected && 'font-bold',
                    isSelected && 'text-white shadow-md'
                  )}
                  style={{
                    ...(isDayToday && !isSelected
                      ? { outline: `2px solid ${primaryColor}`, outlineOffset: '-2px' }
                      : {}),
                    ...(isSelected
                      ? {
                          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                          boxShadow: `0 4px 12px ${primaryColor}40`,
                        }
                      : {}),
                  }}
                >
                  {format(day, 'd')}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Time slots ── */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                }}
              >
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Prosti termini</h3>
                {selectedDate && (
                  <p className="text-sm text-gray-500">
                    {format(selectedDate, 'EEEE, d. MMMM', { locale: sl })}
                  </p>
                )}
              </div>
            </div>
            {selectedDate && (
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor,
                }}
              >
                {format(selectedDate, 'd. MMM', { locale: sl })}
              </span>
            )}
          </div>

          {/* Slots content */}
          <AnimatePresence mode="wait">
            {/* No date selected */}
            {!selectedDate && (
              <motion.div
                key="no-date"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <Calendar className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500">Najprej izberite datum</p>
                <p className="text-sm text-gray-400 mt-1">Kliknite na želeni dan v koledarju</p>
              </motion.div>
            )}

            {/* Loading */}
            {selectedDate && isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-12 rounded-lg bg-gray-200 animate-pulse" />
                  ))}
                </div>
              </motion.div>
            )}

            {/* No slots available */}
            {selectedDate && !isLoading && availableSlots.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-gray-900 font-medium">Ni prostih terminov</p>
                <p className="text-sm text-gray-500 mt-1">Poskusite izbrati drug datum</p>
              </motion.div>
            )}

            {/* Slots grid */}
            {selectedDate && !isLoading && availableSlots.length > 0 && (
              <motion.div
                key="slots"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-1 custom-scrollbar"
              >
                {availableSlots.map((slot, index) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <motion.button
                      key={slot}
                      onClick={() => onSelectTime(slot)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className={cn(
                        'py-3 px-2 rounded-lg text-sm font-medium transition-all border',
                        !isSelected &&
                          'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200',
                        isSelected && 'text-white shadow-md border-transparent'
                      )}
                      style={
                        isSelected
                          ? {
                              background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                              boxShadow: `0 4px 12px ${primaryColor}40`,
                            }
                          : undefined
                      }
                    >
                      {slot}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Confirmation strip */}
      <AnimatePresence>
        {selectedDate && selectedTime && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 flex items-center justify-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200"
          >
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-900 font-medium">
              {format(selectedDate, 'd. MMMM yyyy', { locale: sl })} ob {selectedTime}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
