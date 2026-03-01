'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, User, Scissors, Share2, CalendarPlus, RotateCcw } from 'lucide-react';
import { Employee, Service, CustomerData, BookingConfirmation } from '@/lib/types';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { formatTimeRange } from '@/lib/utils';

interface StepConfirmationProps {
  employee: Employee | null;
  anyPerson: boolean;
  service: Service | null;
  date: Date | null;
  time: string | null;
  customer: CustomerData;
  onNewBooking: () => void;
  onReset: () => void;
  primaryColor: string;
  companyName: string;
  bookingConfirmation?: BookingConfirmation | null;
}

const Confetti = ({ primaryColor }: { primaryColor: string }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    delay: number;
    duration: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const colors = [primaryColor, '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
  }, [primaryColor]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: -20,
            backgroundColor: particle.color,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: 0,
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function StepConfirmation({
  employee,
  anyPerson,
  service,
  date,
  time,
  customer,
  onNewBooking,
  onReset,
  primaryColor,
  companyName,
  bookingConfirmation,
}: StepConfirmationProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sl-SI', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const handleShare = async () => {
    const timeDisplay = service && time ? formatTimeRange(time, service.duration) : time;
    const text = `Rezervacija pri ${companyName}
${service?.name}
${date ? format(date, 'EEEE, d. MMMM yyyy', { locale: sl }) : ''} ob ${timeDisplay}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Moja rezervacija',
          text,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Podatki o rezervaciji so bili kopirani!');
    }
  };

  const handleAddToCalendar = () => {
    if (!date || !time || !service) return;

    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + service.duration);

    const formatGoogleDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d{3}/g, '');

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `${service.name} - ${companyName}`
    )}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(
      endDate
    )}&details=${encodeURIComponent(
      `Rezervacija pri ${companyName}\nStoritev: ${service.name}\nIzvajalec: ${
        anyPerson ? 'Katerakoli oseba' : employee?.name
      }`
    )}`;

    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <>
      {showConfetti && <Confetti primaryColor={primaryColor} />}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl mx-auto px-4"
      >
        {/* Success Icon */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: 0.4,
              }}
            >
              <CheckCircle
                className="w-14 h-14"
                style={{ color: primaryColor }}
              />
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Rezervacija potrjena!
          </motion.h1>

          <motion.p
            className="text-lg text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {bookingConfirmation?.message || `Hvala, ${customer.firstName}! Potrditev smo vam poslali na email.`}
          </motion.p>
        </motion.div>

        {/* Booking Details Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-lg mb-8"
        >
          <div className="space-y-6">
            {/* Service */}
            {(service || bookingConfirmation?.storitev) && (
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Scissors className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Storitev</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {bookingConfirmation?.storitev || service?.name}
                  </p>
                  {service && (
                    <p className="text-sm text-gray-500">
                      {service.duration} min • {formatPrice(service.price)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Employee */}
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <User className="w-6 h-6" style={{ color: primaryColor }} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Izvajalec</p>
                <p className="text-lg font-semibold text-gray-900">
                  {anyPerson ? 'Katerakoli oseba' : employee?.name}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            {(date && time) || (bookingConfirmation?.datum && bookingConfirmation?.cas) ? (
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Calendar className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Datum in čas</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {bookingConfirmation?.datum || (date ? format(date, 'EEEE, d. MMMM yyyy', { locale: sl }) : '')}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span
                      className="text-xl font-bold"
                      style={{ color: primaryColor }}
                    >
                      {service && time
                        ? formatTimeRange(bookingConfirmation?.cas || time, service.duration)
                        : (bookingConfirmation?.cas || time)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              onClick={handleAddToCalendar}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              <CalendarPlus className="w-5 h-5" />
              Dodaj v koledar
            </motion.button>

            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Deli
            </motion.button>
          </div>
        </motion.div>

        {/* Bottom Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            onClick={onNewBooking}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 rounded-2xl text-white font-semibold text-lg shadow-lg"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 10px 30px ${primaryColor}40`,
            }}
          >
            Nov termin
          </motion.button>

          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 rounded-2xl bg-white text-gray-700 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Na začetek
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
}
