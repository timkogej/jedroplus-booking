'use client';

import { motion } from 'framer-motion';
import { User, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { Employee } from '@/lib/types';

interface StepEmployeeSelectionProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  anyPerson: boolean;
  onSelectEmployee: (employee: Employee) => void;
  onSelectAnyPerson: () => void;
  primaryColor: string;
  secondaryColor: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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

export default function StepEmployeeSelection({
  employees,
  selectedEmployee,
  anyPerson,
  onSelectEmployee,
  onSelectAnyPerson,
  primaryColor,
}: StepEmployeeSelectionProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto px-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-10">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Izberite osebo
        </motion.h1>
        <motion.p
          className="text-lg text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Kdo naj izvede vašo storitev?
        </motion.p>
      </motion.div>

      {/* No eligible employees message */}
      {employees.length === 0 && (
        <motion.div variants={itemVariants} className="glass rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-8 h-8 text-white/50" />
          <p className="text-white/80 font-medium">
            Za to storitev ni na voljo nobenega izvajalca.
          </p>
          <p className="text-sm text-white/50">
            Prosimo, izberite drugo storitev.
          </p>
        </motion.div>
      )}

      {/* Options list */}
      {employees.length > 0 && (
      <div className="flex flex-col gap-3">
        {/* Kdorkoli */}
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={onSelectAnyPerson}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full glass rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${
              anyPerson ? 'shadow-premium-lg' : 'hover:shadow-premium'
            }`}
            style={{
              outline: anyPerson ? `3px solid ${primaryColor}` : 'none',
              outlineOffset: '-3px',
              boxShadow: anyPerson ? `0 0 20px ${primaryColor}25` : undefined,
              background: anyPerson ? 'rgba(255, 255, 255, 0.92)' : undefined,
            }}
          >
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}80)`,
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            {/* Text */}
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-900 leading-tight">Kdorkoli</p>
              <p className="text-sm text-gray-500 mt-0.5">Vseeno mi je, kdo me postreže</p>
            </div>

            {/* Checkmark */}
            {anyPerson && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: primaryColor }} />
              </motion.div>
            )}
          </motion.button>
        </motion.div>

        {/* Divider */}
        {employees.length > 0 && (
          <motion.div variants={itemVariants} className="flex items-center gap-4 my-3">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-sm text-white/60">ali izberite osebo</span>
            <div className="flex-1 h-px bg-white/20" />
          </motion.div>
        )}

        {/* Individual employees */}
        {employees.map((employee) => {
          const isSelected = selectedEmployee?.id === employee.id;

          return (
            <motion.div key={employee.id} variants={itemVariants}>
              <motion.button
                onClick={() => onSelectEmployee(employee)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full glass rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${
                  isSelected ? 'shadow-premium-lg' : 'hover:shadow-premium'
                }`}
                style={{
                  outline: isSelected ? `3px solid ${primaryColor}` : 'none',
                  outlineOffset: '-3px',
                  boxShadow: isSelected ? `0 0 20px ${primaryColor}25` : undefined,
                  background: isSelected ? 'rgba(255, 255, 255, 0.92)' : undefined,
                }}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  {employee.image ? (
                    <img
                      src={employee.image}
                      alt={employee.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : employee.initials ? (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}80)`,
                      }}
                    >
                      {employee.initials}
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      <User className="w-5 h-5" style={{ color: primaryColor }} />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 leading-tight">{employee.name}</p>
                  {employee.subtitle && (
                    <p className="text-sm text-gray-500 mt-0.5">{employee.subtitle}</p>
                  )}
                </div>

                {/* Checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <CheckCircle className="w-6 h-6" style={{ color: primaryColor }} />
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
      )}
    </motion.div>
  );
}
