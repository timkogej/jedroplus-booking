'use client';

import { motion } from 'framer-motion';
import { ServiceCategory, Service } from '@/lib/types';

interface StepCategorySelectionProps {
  categories: ServiceCategory[];
  services: Service[];
  onSelectCategory: (category: ServiceCategory) => void;
  primaryColor: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
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

export default function StepCategorySelection({
  categories,
  services,
  onSelectCategory,
  primaryColor,
}: StepCategorySelectionProps) {
  const getServiceCount = (category: ServiceCategory) => {
    if (Number.isFinite(category.service_count)) {
      return category.service_count;
    }
    return services.filter((s) => s.category_id === category.id).length;
  };

  const getServiceLabel = (count: number) => {
    if (count === 1) return 'storitev';
    if (count === 2) return 'storitvi';
    if (count === 3 || count === 4) return 'storitve';
    return 'storitev';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto px-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-10">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Izberite kategorijo
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-white/80 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Katero storitev bi želeli danes?
        </motion.p>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const serviceCount = getServiceCount(category);

          return (
            <motion.div key={category.id} variants={itemVariants}>
              <motion.button
                onClick={() => onSelectCategory(category)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full group relative overflow-hidden rounded-3xl p-7 glass hover:shadow-premium-lg transition-all duration-300"
              >
                {/* Gradient wash */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}12, ${primaryColor}05)`,
                  }}
                />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col items-center text-center">
                  <div className="w-full">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <span
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
                      style={{
                        backgroundColor: `${primaryColor}15`,
                        color: primaryColor,
                      }}
                    >
                      {serviceCount} {getServiceLabel(serviceCount)}
                    </span>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
