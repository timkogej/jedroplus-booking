'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SeasonalTheme } from '@/lib/types'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  emoji?: string
  angle: number
  distance: number
  delay: number
}

function generateBurst(count: number, emojis: string[], colors: string[]): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 0,
    y: 0,
    size: 12 + Math.random() * 16,
    color: colors[i % colors.length],
    emoji: emojis.length > 0 ? emojis[i % emojis.length] : undefined,
    angle: (i / count) * 360 + Math.random() * 20,
    distance: 80 + Math.random() * 120,
    delay: Math.random() * 0.2,
  }))
}

function ParticleBurst({ particles }: { particles: Particle[] }) {
  return (
    <>
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180
        const tx = Math.cos(rad) * p.distance
        const ty = Math.sin(rad) * p.distance
        return (
          <motion.div
            key={p.id}
            className="absolute"
            style={{
              fontSize: `${p.size}px`,
              left: '50%',
              top: '50%',
              marginLeft: `-${p.size / 2}px`,
              marginTop: `-${p.size / 2}px`,
            }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
            animate={{
              opacity: [1, 1, 0],
              x: tx,
              y: ty,
              scale: [0.5, 1.2, 0.8],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 1.2,
              delay: p.delay,
              ease: 'easeOut',
            }}
          >
            {p.emoji || (
              <div
                className="rounded-full"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size * 0.6}px`,
                  backgroundColor: p.color,
                }}
              />
            )}
          </motion.div>
        )
      })}
    </>
  )
}

function SuccessCheckmark({ color }: { color: string }) {
  return (
    <motion.div
      className="relative"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          boxShadow: `0 8px 32px ${color}40`,
        }}
      >
        <motion.svg
          className="w-10 h-10 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </motion.svg>
      </div>
    </motion.div>
  )
}

function WinterSuccess() {
  const particles = useMemo(
    () => generateBurst(16, ['❄️', '❄', '✨', '⭐'], ['#FFFFFF', '#B3E5FC', '#E1F5FE']),
    []
  )
  return <ParticleBurst particles={particles} />
}

function ChristmasSuccess() {
  const particles = useMemo(
    () =>
      generateBurst(20, ['🎄', '⭐', '🎁', '🔔', '✨', '🎅'], ['#C41E3A', '#FFD700', '#0F5132']),
    []
  )
  return <ParticleBurst particles={particles} />
}

function NewYearSuccess() {
  const particles = useMemo(
    () => generateBurst(24, ['🎆', '🎊', '✨', '🥂', '⭐', '🎉'], ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']),
    []
  )
  return <ParticleBurst particles={particles} />
}

function ValentineSuccess() {
  const particles = useMemo(
    () => generateBurst(18, ['💕', '💖', '💗', '❤️', '💘', '🌹'], ['#E91E63', '#FF69B4', '#FFB6C1']),
    []
  )
  return <ParticleBurst particles={particles} />
}

function EasterSuccess() {
  const particles = useMemo(
    () => generateBurst(16, ['🥚', '🐣', '🐰', '🌷', '✨'], ['#FFB74D', '#9C27B0', '#66BB6A', '#FFB7C5']),
    []
  )
  return <ParticleBurst particles={particles} />
}

function SpringSuccess() {
  const particles = useMemo(
    () => generateBurst(16, ['🌸', '🌺', '🦋', '🌼', '✨'], ['#FFB7C5', '#66BB6A', '#FFDAB9']),
    []
  )
  return <ParticleBurst particles={particles} />
}

function SummerSuccess() {
  const particles = useMemo(
    () => generateBurst(16, ['☀️', '🌊', '✨', '⭐', '🌴'], ['#FFD54F', '#FFA726', '#4FC3F7']),
    []
  )
  return <ParticleBurst particles={particles} />
}

function AutumnSuccess() {
  const particles = useMemo(
    () => generateBurst(18, ['🍂', '🍁', '🍃', '✨'], ['#EF6C00', '#FF8A65', '#8D6E63', '#FFB74D']),
    []
  )
  return <ParticleBurst particles={particles} />
}

function HalloweenSuccess() {
  const particles = useMemo(
    () => generateBurst(16, ['🎃', '👻', '🦇', '✨', '⭐'], ['#FF6600', '#6B46C1', '#FFD700']),
    []
  )
  return <ParticleBurst particles={particles} />
}

function ThanksgivingSuccess() {
  const particles = useMemo(
    () => generateBurst(16, ['🦃', '🍂', '🍁', '🌽', '✨'], ['#D4740E', '#8B4513', '#FFB74D']),
    []
  )
  return <ParticleBurst particles={particles} />
}

export default function SuccessAnimation({
  theme,
  show,
  primaryColor,
}: {
  theme: SeasonalTheme
  show: boolean
  primaryColor: string
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [show])

  const getSeasonalBurst = () => {
    if (theme.holiday === 'christmas') return <ChristmasSuccess />
    if (theme.holiday === 'newyear') return <NewYearSuccess />
    if (theme.holiday === 'valentine') return <ValentineSuccess />
    if (theme.holiday === 'easter') return <EasterSuccess />
    if (theme.holiday === 'halloween') return <HalloweenSuccess />
    if (theme.holiday === 'thanksgiving') return <ThanksgivingSuccess />
    if (theme.season === 'winter') return <WinterSuccess />
    if (theme.season === 'spring') return <SpringSuccess />
    if (theme.season === 'summer') return <SummerSuccess />
    if (theme.season === 'autumn') return <AutumnSuccess />
    return null
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop glow */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${primaryColor}15 0%, transparent 60%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Particle burst */}
          <div className="relative">
            {getSeasonalBurst()}
            <SuccessCheckmark color={primaryColor} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Smaller step-completion animation
export function StepSuccessAnimation({
  theme,
  show,
  primaryColor,
}: {
  theme: SeasonalTheme
  show: boolean
  primaryColor: string
}) {
  const emojis: Record<string, string[]> = {
    christmas: ['⭐', '🎄', '✨'],
    newyear: ['🎆', '✨', '🎊'],
    valentine: ['💖', '💕', '✨'],
    easter: ['🥚', '🌷', '✨'],
    halloween: ['🎃', '✨', '👻'],
    thanksgiving: ['🍁', '✨', '🍂'],
    winter: ['❄️', '✨'],
    spring: ['🌸', '✨'],
    summer: ['☀️', '✨'],
    autumn: ['🍂', '✨'],
  }

  const key = theme.holiday || theme.season
  const emoji = emojis[key] || ['✨']

  const miniParticles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (i / 8) * 360,
        distance: 30 + Math.random() * 30,
        emoji: emoji[i % emoji.length],
        delay: Math.random() * 0.15,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  )

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {miniParticles.map((p) => {
            const rad = (p.angle * Math.PI) / 180
            return (
              <motion.span
                key={p.id}
                className="absolute text-sm"
                initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  x: Math.cos(rad) * p.distance,
                  y: Math.sin(rad) * p.distance,
                  scale: [0, 1, 0.5],
                }}
                transition={{ duration: 0.8, delay: p.delay, ease: 'easeOut' }}
              >
                {p.emoji}
              </motion.span>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
