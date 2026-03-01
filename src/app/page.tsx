'use client';

import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Palette, Sparkles } from 'lucide-react';

const G = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">
    {children}
  </span>
);

const cards = [
  {
    icon: Calendar,
    title: 'Book in a few clicks',
    body: (
      <>
        Schedule an appointment in a few clicks —{' '}
        <G>anywhere</G>, <G>anytime</G>.
        Simple for clients, powerful for your business.
      </>
    ),
  },
  {
    icon: TrendingUp,
    title: 'Grow effortlessly',
    body: (
      <>
        <G>Fewer</G> calls.{' '}
        <G>More</G> bookings.{' '}
        <G>24/7</G> scheduling.{' '}
        <G>Professional</G> impression.
      </>
    ),
  },
  {
    icon: Palette,
    title: 'Your brand, your design',
    body: (
      <>
        Choose your <G>style</G>. Set{' '}
        <G>colors</G> that match your{' '}
        <G>brand</G> — and let the platform handle the rest.
      </>
    ),
  },
  {
    icon: Sparkles,
    title: 'Built for conversion',
    body: (
      <>
        Create a booking <G>experience</G> that brings your
        clients from discovery to reservation — seamlessly.
      </>
    ),
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'linear-gradient(135deg, #1e0a3c 0%, #0d1a4a 40%, #062a3f 70%, #0a1f35 100%)',
      }}
    >
      {/* Subtle glow blobs */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }}
        />
        <div
          className="absolute top-1/3 right-[-100px] w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }}
        />
        <div
          className="absolute bottom-[-80px] left-1/3 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
        />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Jedro+
            </span>{' '}
            booking platform
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto font-normal">
            A modern appointment scheduling platform for your business.
          </p>
        </motion.div>

        {/* 4 cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl w-full"
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <card.icon className="w-5 h-5 text-white/80" />
              </div>

              {/* Title */}
              <h3 className="text-white font-semibold text-base">
                {card.title}
              </h3>

              {/* Body */}
              <p className="text-white/60 text-sm leading-relaxed">
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
