'use client'

import { motion } from 'framer-motion'
import { SeasonalTheme } from '@/lib/types'
import { StepSuccessAnimation } from './SuccessAnimations'
import { useState, useEffect } from 'react'

interface StepConfig {
  id: string
  title: string
}

interface Props {
  steps: StepConfig[]
  currentStep: number // 1-based
  seasonalTheme: SeasonalTheme
  primaryColor: string
}

export default function BookingStepper({ steps, currentStep, seasonalTheme, primaryColor }: Props) {
  const [justCompleted, setJustCompleted] = useState<number | null>(null)

  // currentStep is 1-based; convert to 0-based index for display logic
  const currentIndex = currentStep - 1

  useEffect(() => {
    if (currentIndex > 0) {
      setJustCompleted(currentIndex - 1)
      const timer = setTimeout(() => setJustCompleted(null), 1000)
      return () => clearTimeout(timer)
    }
  }, [currentIndex])

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Connection line background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        {/* Connection line progress */}
        <motion.div
          className="absolute top-5 left-0 h-0.5 z-0"
          style={{ backgroundColor: primaryColor }}
          initial={false}
          animate={{
            width: `${(currentIndex / Math.max(steps.length - 1, 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = index > currentIndex

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              {/* Step circle */}
              <motion.div
                className="relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300"
                style={{
                  backgroundColor: isCompleted || isCurrent ? primaryColor : '#e5e7eb',
                  color: isCompleted || isCurrent ? '#fff' : '#9ca3af',
                  boxShadow: isCurrent ? `0 0 0 4px ${primaryColor}25` : 'none',
                }}
                animate={isCurrent ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={
                  isCurrent
                    ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                    : {}
                }
              >
                {isCompleted ? (
                  <motion.svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  index + 1
                )}

                {/* Step completion mini-burst */}
                <StepSuccessAnimation
                  theme={seasonalTheme}
                  show={justCompleted === index}
                  primaryColor={primaryColor}
                />
              </motion.div>

              {/* Step label */}
              <span
                className={`mt-2 text-xs font-medium text-center max-w-[80px] leading-tight transition-colors duration-300 ${
                  isCurrent
                    ? 'opacity-100'
                    : isCompleted
                      ? 'opacity-70'
                      : 'opacity-40'
                }`}
                style={{ color: isCurrent || isCompleted ? primaryColor : undefined }}
              >
                {step.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
