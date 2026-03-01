'use client';

import { motion } from 'framer-motion';

interface LoadingScreenProps {
  primaryColor?: string;
}

export default function LoadingScreen({ primaryColor = '#6366f1' }: LoadingScreenProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}80)`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-white/30 border-t-white mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.p
          className="text-white text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Nalagam...
        </motion.p>
      </motion.div>
    </div>
  );
}
