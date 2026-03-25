'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  shortLabel: string;
}

interface BookingStepperProps {
  currentStep: number;
  totalSteps: number;
  primaryColor: string;
}

const steps: Step[] = [
  { id: 1, label: 'Kategorija', shortLabel: 'Kat.' },
  { id: 2, label: 'Storitev', shortLabel: 'Stor.' },
  { id: 3, label: 'Izvajalec', shortLabel: 'Izv.' },
  { id: 4, label: 'Termin', shortLabel: 'Term.' },
  { id: 5, label: 'Podatki', shortLabel: 'Pod.' },
  { id: 6, label: 'Potrditev', shortLabel: 'Potr.' },
];

export default function BookingStepper({
  currentStep,
  primaryColor,
}: BookingStepperProps) {
  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center max-w-2xl mx-auto w-full">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step circle */}
              <div className="flex flex-col items-center flex-none">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? primaryColor
                      : isCurrent
                        ? primaryColor
                        : 'rgba(255, 255, 255, 0.3)',
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg"
                  style={{
                    boxShadow: isCurrent
                      ? `0 0 20px ${primaryColor}40`
                      : 'none',
                  }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="w-5 h-5 text-white" />
                    </motion.div>
                  ) : (
                    <span
                      className={`text-sm font-semibold ${
                        isCurrent ? 'text-white' : 'text-white/70'
                      }`}
                    >
                      {step.id}
                    </span>
                  )}

                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </motion.div>

                <motion.span
                  initial={false}
                  animate={{
                    opacity: isCurrent ? 1 : 0.6,
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                  className="mt-2 text-xs text-white whitespace-nowrap hidden sm:block"
                >
                  {step.label}
                </motion.span>
              </div>

              {/* Connector line between circles */}
              {!isLast && (
                <div className="flex-1 mx-2 h-[2px] bg-white/20 relative overflow-hidden">
                  <motion.div
                    initial={false}
                    animate={{
                      width: isCompleted ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0 h-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
