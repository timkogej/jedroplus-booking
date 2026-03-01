'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorScreen({
  message = 'Prišlo je do napake pri nalaganju podatkov.',
  onRetry,
}: ErrorScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 max-w-md w-full text-center shadow-premium-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6"
        >
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Ups!</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        {onRetry && (
          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Poskusi znova
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
