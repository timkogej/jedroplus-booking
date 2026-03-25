'use client'

import { useEffect, useMemo, useState } from 'react'
import { SeasonalTheme } from '@/lib/types'

// ─── Snowflakes ───────────────────────────────────────────────────────────────

function FallingSnowflakes() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const flakes = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 12,
        duration: 10 + Math.random() * 12,
        delay: Math.random() * 8,
        sway: 30 + Math.random() * 60,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    []
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {flakes.map((f) => (
        <div
          key={f.id}
          className="absolute"
          style={{
            left: `${f.left}%`,
            top: '-20px',
            fontSize: `${f.size}px`,
            opacity: f.opacity,
            animation: `sd-snowfall ${f.duration}s linear ${f.delay}s infinite`,
            ['--sway' as string]: `${f.sway}px`,
          }}
        >
          ❄
        </div>
      ))}
      <style>{`
        @keyframes sd-snowfall {
          0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(105vh) translateX(var(--sway, 40px)) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ─── Floating Hearts ──────────────────────────────────────────────────────────

const HEART_EMOJIS = ['💕', '💖', '💗', '❤️', '💘']

function FloatingHearts() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const hearts = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 16,
        duration: 12 + Math.random() * 10,
        delay: Math.random() * 8,
        sway: 20 + Math.random() * 40,
        emoji: HEART_EMOJIS[i % HEART_EMOJIS.length],
        opacity: 0.25 + Math.random() * 0.35,
      })),
    []
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: `${h.left}%`,
            bottom: '-30px',
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            animation: `sd-heartFloat ${h.duration}s ease-in-out ${h.delay}s infinite`,
            ['--sway' as string]: `${h.sway}px`,
          }}
        >
          {h.emoji}
        </div>
      ))}
      <style>{`
        @keyframes sd-heartFloat {
          0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.5; }
          50%  { transform: translateY(-55vh) translateX(var(--sway, 30px)) rotate(15deg); }
          90%  { opacity: 0.5; }
          100% { transform: translateY(-110vh) translateX(calc(var(--sway, 30px) * -1)) rotate(-15deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ─── Falling Leaves ───────────────────────────────────────────────────────────

const LEAF_EMOJIS = ['🍂', '🍁', '🍃']

function FallingLeaves() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const leaves = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 14,
        duration: 12 + Math.random() * 10,
        delay: Math.random() * 8,
        sway: 40 + Math.random() * 80,
        emoji: LEAF_EMOJIS[i % LEAF_EMOJIS.length],
        opacity: 0.4 + Math.random() * 0.4,
      })),
    []
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {leaves.map((l) => (
        <div
          key={l.id}
          className="absolute"
          style={{
            left: `${l.left}%`,
            top: '-20px',
            fontSize: `${l.size}px`,
            opacity: l.opacity,
            animation: `sd-leafFall ${l.duration}s ease-in-out ${l.delay}s infinite`,
            ['--sway' as string]: `${l.sway}px`,
          }}
        >
          {l.emoji}
        </div>
      ))}
      <style>{`
        @keyframes sd-leafFall {
          0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.6; }
          50%  { transform: translateY(50vh) translateX(var(--sway, 60px)) rotate(180deg); }
          90%  { opacity: 0.6; }
          100% { transform: translateY(105vh) translateX(calc(var(--sway, 60px) * -0.5)) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ─── Christmas Ornaments ──────────────────────────────────────────────────────

const ORNAMENT_EMOJIS = ['🎄', '⭐', '🔔', '🎁', '❄️', '✨']

function ChristmasOrnaments() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const ornaments = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: 5 + (i / 12) * 90,
        top: Math.random() * 30,
        size: 16 + Math.random() * 12,
        emoji: ORNAMENT_EMOJIS[i % ORNAMENT_EMOJIS.length],
        duration: 4 + Math.random() * 3,
        delay: Math.random() * 2,
        opacity: 0.35 + Math.random() * 0.3,
      })),
    []
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {ornaments.map((o) => (
        <div
          key={o.id}
          className="absolute"
          style={{
            left: `${o.left}%`,
            top: `${o.top}%`,
            fontSize: `${o.size}px`,
            opacity: o.opacity,
            animation: `sd-sway ${o.duration}s ease-in-out ${o.delay}s infinite alternate`,
          }}
        >
          {o.emoji}
        </div>
      ))}
      <style>{`
        @keyframes sd-sway {
          0%   { transform: rotate(-8deg) scale(1); }
          100% { transform: rotate(8deg) scale(1.05); }
        }
      `}</style>
    </div>
  )
}

// ─── Halloween Elements ───────────────────────────────────────────────────────

const HALLOWEEN_EMOJIS = ['🎃', '👻', '🦇', '🕷️', '✨']

function HalloweenElements() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const elements = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 80,
        size: 16 + Math.random() * 16,
        emoji: HALLOWEEN_EMOJIS[i % HALLOWEEN_EMOJIS.length],
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 3,
        opacity: 0.2 + Math.random() * 0.25,
      })),
    []
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {elements.map((e) => (
        <div
          key={e.id}
          className="absolute"
          style={{
            left: `${e.left}%`,
            top: `${e.top}%`,
            fontSize: `${e.size}px`,
            opacity: e.opacity,
            animation: `sd-float ${e.duration}s ease-in-out ${e.delay}s infinite alternate`,
          }}
        >
          {e.emoji}
        </div>
      ))}
      <style>{`
        @keyframes sd-float {
          0%   { transform: translateY(0) rotate(-5deg); }
          100% { transform: translateY(-12px) rotate(5deg); }
        }
      `}</style>
    </div>
  )
}

// ─── Spring Flowers ───────────────────────────────────────────────────────────

const FLOWER_EMOJIS = ['🌸', '🌺', '🌼', '🌷']
const BUTTERFLY_EMOJIS = ['🦋']

function SpringFlowers({ showButterflies }: { showButterflies?: boolean }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const petals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: '-20px',
        size: 14 + Math.random() * 10,
        emoji: showButterflies && i % 5 === 0
          ? BUTTERFLY_EMOJIS[0]
          : FLOWER_EMOJIS[i % FLOWER_EMOJIS.length],
        duration: 14 + Math.random() * 10,
        delay: Math.random() * 8,
        sway: 30 + Math.random() * 50,
        opacity: 0.35 + Math.random() * 0.4,
      })),
    [showButterflies]
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: p.top,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animation: `sd-petalFall ${p.duration}s ease-in-out ${p.delay}s infinite`,
            ['--sway' as string]: `${p.sway}px`,
          }}
        >
          {p.emoji}
        </div>
      ))}
      <style>{`
        @keyframes sd-petalFall {
          0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.5; }
          50%  { transform: translateY(50vh) translateX(var(--sway, 40px)) rotate(90deg); }
          90%  { opacity: 0.5; }
          100% { transform: translateY(105vh) translateX(0) rotate(180deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ─── Summer Elements ──────────────────────────────────────────────────────────

function SummerElements() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const elements = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: 5 + (i / 8) * 90,
        top: 5 + Math.random() * 20,
        size: 18 + Math.random() * 14,
        emoji: ['☀️', '🌊', '🌴', '🌻', '⭐'][i % 5],
        duration: 5 + Math.random() * 4,
        delay: Math.random() * 3,
        opacity: 0.2 + Math.random() * 0.2,
      })),
    []
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {elements.map((e) => (
        <div
          key={e.id}
          className="absolute"
          style={{
            left: `${e.left}%`,
            top: `${e.top}%`,
            fontSize: `${e.size}px`,
            opacity: e.opacity,
            animation: `sd-pulse ${e.duration}s ease-in-out ${e.delay}s infinite alternate`,
          }}
        >
          {e.emoji}
        </div>
      ))}
      <style>{`
        @keyframes sd-pulse {
          0%   { transform: scale(1) rotate(-3deg); }
          100% { transform: scale(1.1) rotate(3deg); }
        }
      `}</style>
    </div>
  )
}

// ─── Easter Elements ──────────────────────────────────────────────────────────

function EasterElements() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const elements = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: '-20px',
        size: 16 + Math.random() * 10,
        emoji: ['🥚', '🐣', '🐰', '🌷', '🌸'][i % 5],
        duration: 14 + Math.random() * 8,
        delay: Math.random() * 6,
        sway: 30 + Math.random() * 40,
        opacity: 0.4 + Math.random() * 0.35,
      })),
    []
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {elements.map((e) => (
        <div
          key={e.id}
          className="absolute"
          style={{
            left: `${e.left}%`,
            top: e.top,
            fontSize: `${e.size}px`,
            opacity: e.opacity,
            animation: `sd-easterFall ${e.duration}s ease-in-out ${e.delay}s infinite`,
            ['--sway' as string]: `${e.sway}px`,
          }}
        >
          {e.emoji}
        </div>
      ))}
      <style>{`
        @keyframes sd-easterFall {
          0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.5; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(105vh) translateX(var(--sway, 35px)) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ─── New Year Elements ────────────────────────────────────────────────────────

function NewYearElements() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const elements = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: '-20px',
        size: 12 + Math.random() * 14,
        emoji: ['🎆', '🎊', '✨', '🥂', '⭐', '🎉'][i % 6],
        duration: 8 + Math.random() * 8,
        delay: Math.random() * 6,
        sway: 40 + Math.random() * 80,
        opacity: 0.4 + Math.random() * 0.4,
      })),
    []
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {elements.map((e) => (
        <div
          key={e.id}
          className="absolute"
          style={{
            left: `${e.left}%`,
            top: e.top,
            fontSize: `${e.size}px`,
            opacity: e.opacity,
            animation: `sd-confettiFall ${e.duration}s ease-in ${e.delay}s infinite`,
            ['--sway' as string]: `${e.sway}px`,
          }}
        >
          {e.emoji}
        </div>
      ))}
      <style>{`
        @keyframes sd-confettiFall {
          0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.7; }
          100% { transform: translateY(105vh) translateX(var(--sway, 60px)) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ─── Thanksgiving Elements ────────────────────────────────────────────────────

function ThanksgivingElements() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const elements = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: '-20px',
        size: 14 + Math.random() * 12,
        emoji: ['🍂', '🍁', '🦃', '🌽', '🍎'][i % 5],
        duration: 12 + Math.random() * 8,
        delay: Math.random() * 6,
        sway: 40 + Math.random() * 60,
        opacity: 0.4 + Math.random() * 0.35,
      })),
    []
  )

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden>
      {elements.map((e) => (
        <div
          key={e.id}
          className="absolute"
          style={{
            left: `${e.left}%`,
            top: e.top,
            fontSize: `${e.size}px`,
            opacity: e.opacity,
            animation: `sd-leafFall2 ${e.duration}s ease-in-out ${e.delay}s infinite`,
            ['--sway' as string]: `${e.sway}px`,
          }}
        >
          {e.emoji}
        </div>
      ))}
      <style>{`
        @keyframes sd-leafFall2 {
          0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.5; }
          50%  { transform: translateY(50vh) translateX(var(--sway, 50px)) rotate(180deg); }
          90%  { opacity: 0.5; }
          100% { transform: translateY(105vh) translateX(0) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ─── Main SeasonalDecorations ─────────────────────────────────────────────────

export default function SeasonalDecorations({ theme }: { theme: SeasonalTheme }) {
  return (
    <>
      {/* Season overlay tint */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ backgroundColor: theme.theme.overlayColor }}
      />

      {/* Seasonal decoration layers */}
      {theme.theme.snowflakes && <FallingSnowflakes />}
      {theme.theme.hearts && <FloatingHearts />}
      {theme.theme.leaves && !theme.theme.harvest && <FallingLeaves />}
      {theme.theme.ornaments && <ChristmasOrnaments />}
      {theme.theme.pumpkins && <HalloweenElements />}
      {theme.theme.flowers && !theme.holiday && (
        <SpringFlowers showButterflies={theme.theme.butterflies} />
      )}
      {theme.theme.sunRays && <SummerElements />}
      {theme.holiday === 'easter' && <EasterElements />}
      {theme.holiday === 'newyear' && <NewYearElements />}
      {theme.holiday === 'thanksgiving' && <ThanksgivingElements />}
      {theme.holiday === 'valentine' && <SpringFlowers showButterflies={false} />}
    </>
  )
}
