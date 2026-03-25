'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '@/components/booking/shared/BookingProvider';

import TimelineStepper from './TimelineStepper';
import MobileStepIndicator from './MobileStepIndicator';
import NavigationBar from './NavigationBar';
import CategorySelection from './CategorySelection';
import ServiceSelection from './ServiceSelection';
import EmployeeSelection from './EmployeeSelection';
import DateTimeSelection from './DateTimeSelection';
import CustomerDetails from './CustomerDetails';
import Confirmation from './Confirmation';

export default function ElegantBooking() {
  const {
    currentStep,
    theme,
    companyName,
    isLoading,
    error,
  } = useBooking();

  // Apply theme CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--bg-from', theme.bgFrom);
    document.documentElement.style.setProperty('--bg-to', theme.bgTo);
  }, [theme]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CategorySelection />;
      case 2:
        return <ServiceSelection />;
      case 3:
        return <EmployeeSelection />;
      case 4:
        return <DateTimeSelection />;
      case 5:
        return <CustomerDetails />;
      case 6:
        return <Confirmation />;
      default:
        return null;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #f5f0ff 0%, #eff6ff 40%, #f0fdfa 100%)' }}
      >
        <div
          className="animate-spin"
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #8b5cf6, #3b82f6, #14b8a6, transparent 75%)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), black calc(100% - 5px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), black calc(100% - 5px))',
          }}
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{
          background: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgTo})`,
        }}
      >
        <div className="text-center max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h1 className="font-serif text-2xl mb-4 text-white">
            Napaka pri nalaganju
          </h1>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full border-2 border-white text-white hover:bg-white hover:text-gray-800 transition-all duration-300"
          >
            Poskusi znova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgTo})`,
      }}
    >
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-xl font-bold text-white">
              {companyName || 'Rezervacija'}
            </h1>
          </div>

          <div className="hidden lg:block text-sm text-white/60 font-light tracking-wide">
            Korak {currentStep} od 6
          </div>
        </div>
      </header>

      {/* Mobile step indicator */}
      <MobileStepIndicator />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <div className="flex gap-8 lg:gap-16">
          {/* Timeline stepper (desktop) */}
          <TimelineStepper />

          {/* Step content */}
          <div className="flex-1 pb-24 lg:pb-0">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 lg:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation bar */}
      <NavigationBar />
    </div>
  );
}
