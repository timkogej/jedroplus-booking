'use client';

import { motion } from 'framer-motion';
import { Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import { Service, ServiceCategory } from '@/lib/types';

interface StepServiceSelectionProps {
  services: Service[];
  category: ServiceCategory;
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  onBack: () => void;
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

export default function StepServiceSelection({
  services,
  category,
  selectedService,
  onSelectService,
  onBack,
  primaryColor,
}: StepServiceSelectionProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sl-SI', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  // Services are already filtered by BookingPage.getServicesForCategory()
  const categoryServices = services;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto px-4"
    >
      {/* Back Button */}
      <motion.button
        variants={itemVariants}
        onClick={onBack}
        className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        whileHover={{ x: -4 }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Nazaj na kategorije</span>
      </motion.button>

      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-10">
        <motion.div
          className="inline-block px-4 py-2 rounded-full text-sm font-medium text-white/90 mb-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          {category.name}
        </motion.div>
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Izberite storitev
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-white/80 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Izberite želeno storitev iz kategorije {category.name.toLowerCase()}
        </motion.p>
      </motion.div>

      {/* Services List */}
      <div className="space-y-4">
        {categoryServices.map((service) => {
          const isSelected = selectedService?.id === service.id;

          return (
            <motion.div key={service.id} variants={itemVariants}>
              <motion.button
                onClick={() => onSelectService(service)}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 text-left ${
                  isSelected
                    ? 'shadow-premium-lg'
                    : 'glass hover:shadow-premium'
                }`}
                style={{
                  outline: isSelected ? `4px solid ${primaryColor}` : 'none',
                  outlineOffset: '-4px',
                  boxShadow: isSelected
                    ? `0 0 30px ${primaryColor}30`
                    : undefined,
                  background: isSelected ? 'rgba(255, 255, 255, 0.9)' : undefined,
                }}
              >
                {/* Gradient overlay on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}10, ${primaryColor}05)`,
                  }}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Service Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {service.name}
                    </h3>

                    {/* Description */}
                    {service.description && (
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    {/* Duration */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {service.duration} min
                      </span>
                    </div>
                  </div>

                  {/* Price and Arrow */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: primaryColor }}
                      >
                        {formatPrice(service.price)}
                      </span>
                    </div>

                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? 'text-white' : 'text-gray-400'
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? primaryColor
                          : `${primaryColor}15`,
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
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
