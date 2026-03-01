'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MessageSquare, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CustomerData, Employee, Service } from '@/lib/types';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { formatTimeRange } from '@/lib/utils';

interface StepCustomerDetailsProps {
  customer: CustomerData;
  onUpdateCustomer: (data: Partial<CustomerData>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  employee: Employee | null;
  anyPerson: boolean;
  service: Service | null;
  date: Date | null;
  time: string | null;
  primaryColor: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
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

export default function StepCustomerDetails({
  customer,
  onUpdateCustomer,
  onSubmit,
  isSubmitting,
  employee,
  anyPerson,
  service,
  date,
  time,
  primaryColor,
}: StepCustomerDetailsProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^[\d\s\+\-\(\)]{6,}$/;
    return re.test(phone);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!customer.firstName.trim()) {
      newErrors.firstName = 'Ime je obvezno';
    }

    if (!customer.lastName.trim()) {
      newErrors.lastName = 'Priimek je obvezen';
    }

    if (!customer.phone.trim()) {
      newErrors.phone = 'Telefon je obvezen';
    } else if (!validatePhone(customer.phone)) {
      newErrors.phone = 'Vnesite veljavno telefonsko številko';
    }

    if (!customer.email.trim()) {
      newErrors.email = 'Email je obvezen';
    } else if (!validateEmail(customer.email)) {
      newErrors.email = 'Vnesite veljaven email naslov';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setTouched({
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
    });

    if (validate()) {
      onSubmit();
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sl-SI', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto px-4"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-10">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Vaši podatki
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-white/80 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Izpolnite podatke za potrditev rezervacije
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700 font-medium">
                  Ime *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="firstName"
                    value={customer.firstName}
                    onChange={(e) =>
                      onUpdateCustomer({ firstName: e.target.value })
                    }
                    onBlur={() => handleBlur('firstName')}
                    placeholder="Vnesite ime"
                    className={`pl-10 h-12 rounded-xl border-2 transition-colors ${
                      errors.firstName && touched.firstName
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-gray-400'
                    }`}
                  />
                </div>
                {errors.firstName && touched.firstName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.firstName}
                  </motion.p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700 font-medium">
                  Priimek *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="lastName"
                    value={customer.lastName}
                    onChange={(e) =>
                      onUpdateCustomer({ lastName: e.target.value })
                    }
                    onBlur={() => handleBlur('lastName')}
                    placeholder="Vnesite priimek"
                    className={`pl-10 h-12 rounded-xl border-2 transition-colors ${
                      errors.lastName && touched.lastName
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-gray-400'
                    }`}
                  />
                </div>
                {errors.lastName && touched.lastName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.lastName}
                  </motion.p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Telefon *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => onUpdateCustomer({ phone: e.target.value })}
                    onBlur={() => handleBlur('phone')}
                    placeholder="+386 XX XXX XXX"
                    className={`pl-10 h-12 rounded-xl border-2 transition-colors ${
                      errors.phone && touched.phone
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-gray-400'
                    }`}
                  />
                </div>
                {errors.phone && touched.phone && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.phone}
                  </motion.p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={customer.email}
                    onChange={(e) => onUpdateCustomer({ email: e.target.value })}
                    onBlur={() => handleBlur('email')}
                    placeholder="vas@email.com"
                    className={`pl-10 h-12 rounded-xl border-2 transition-colors ${
                      errors.email && touched.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-gray-400'
                    }`}
                  />
                </div>
                {errors.email && touched.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-gray-700 font-medium">Spol</Label>
                <div className="flex gap-3">
                  {[
                    { value: 'Moški', label: 'Moški' },
                    { value: 'Ženska', label: 'Ženska' },
                    { value: 'Drugo', label: 'Drugo' },
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() =>
                        onUpdateCustomer({
                          gender: option.value as CustomerData['gender'],
                        })
                      }
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                        customer.gender === option.value
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{
                        backgroundColor:
                          customer.gender === option.value
                            ? primaryColor
                            : undefined,
                      }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes" className="text-gray-700 font-medium">
                  Opombe
                </Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Textarea
                    id="notes"
                    value={customer.notes}
                    onChange={(e) => onUpdateCustomer({ notes: e.target.value })}
                    placeholder="Posebne želje, alergije, ..."
                    className="pl-10 min-h-[100px] rounded-xl border-2 border-gray-200 focus:border-gray-400 resize-none"
                  />
                </div>
              </div>

              {/* Marketing Consent */}
              <div className="md:col-span-2">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="marketing"
                    checked={customer.marketingConsent}
                    onCheckedChange={(checked) =>
                      onUpdateCustomer({ marketingConsent: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <Label
                    htmlFor="marketing"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Želim prejemati obvestila o posebnih ponudbah, novostih in
                    akcijah. Privolitev lahko kadarkoli prekličem.
                  </Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full mt-8 py-4 rounded-2xl text-white font-semibold text-lg shadow-lg transition-all disabled:opacity-70"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 10px 30px ${primaryColor}40`,
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Potrjujem rezervacijo...
                </span>
              ) : (
                'Potrdi rezervacijo'
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Summary Section */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-lg sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Povzetek rezervacije
            </h3>

            <div className="space-y-4">
              {service && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Storitev</p>
                  <p className="font-semibold text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-500">{service.duration} min</p>
                </div>
              )}

              {(employee || anyPerson) && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Izvajalec</p>
                  <p className="font-semibold text-gray-900">
                    {anyPerson ? 'Katerakoli oseba' : employee?.name}
                  </p>
                </div>
              )}

              {date && time && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Datum in čas</p>
                  <p className="font-semibold text-gray-900">
                    {format(date, 'EEEE, d. MMMM yyyy', { locale: sl })}
                  </p>
                  <p className="text-lg font-bold" style={{ color: primaryColor }}>
                    {service ? formatTimeRange(time, service.duration) : time}
                  </p>
                </div>
              )}

              {service && (
                <div className="pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Skupaj</span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: primaryColor }}
                    >
                      {formatPrice(service.price)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
