'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  CompanyData,
  Employee,
  Service,
  ServiceCategory,
  CustomerData,
  BookingState,
  BookingConfirmation,
} from '@/lib/types';
import { initializeBooking, getAvailableSlots, createBooking } from '@/lib/api';
import { format } from 'date-fns';

import BookingStepper from './BookingStepper';
import SummaryPanel from './SummaryPanel';
import StepEmployeeSelection from './StepEmployeeSelection';
import StepCategorySelection from './StepCategorySelection';
import StepServiceSelection from './StepServiceSelection';
import StepDateTimeSelection from './StepDateTimeSelection';
import StepCustomerDetails from './StepCustomerDetails';
import StepConfirmation from './StepConfirmation';
import LoadingScreen from './LoadingScreen';
import ErrorScreen from './ErrorScreen';

interface BookingPageProps {
  companySlug: string;
}

const initialCustomerData: CustomerData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  gender: '',
  notes: '',
  marketingConsent: false,
};

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export default function BookingPage({ companySlug }: BookingPageProps) {
  // Company data state
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transformed data for components
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [servicesByCategory, setServicesByCategory] = useState<Record<string, Service[]>>({});

  // Booking state
  const [bookingState, setBookingState] = useState<BookingState>({
    currentStep: 1,
    selectedEmployee: null,
    anyPerson: false,
    selectedCategory: null,
    selectedService: null,
    selectedDate: null,
    selectedTime: null,
    customer: initialCustomerData,
  });

  // Time slots state
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);

  // Substep for service selection (category vs service)
  const [serviceSubStep, setServiceSubStep] = useState<'category' | 'service'>('category');

  // Fetch company data using n8n API
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await initializeBooking(companySlug);

        // Store the full response
        setCompanyData(data);

        // Transform employees from employees_ui for display
        const transformedEmployees: Employee[] = (data.employees_ui || []).map((emp) => ({
          id: emp.id,
          name: emp.label,
          label: emp.label,
          subtitle: emp.subtitle,
          initials: emp.initials,
        }));
        setEmployees(transformedEmployees);

        // Set services
        setServices(data.services || []);

        // Set categories
        setServiceCategories(data.serviceCategories || []);

        // Set services by category
        setServicesByCategory(data.servicesByCategory || {});

        // Auto-select employee in single mode
        if (data.ui?.employeeSelection?.mode === 'single' && transformedEmployees.length === 1) {
          setBookingState((prev) => ({
            ...prev,
            selectedEmployee: transformedEmployees[0],
            currentStep: 2,
          }));
        }
      } catch (err) {
        setError('Podjetje ni bilo najdeno ali pa je prišlo do napake.');
        console.error('Error loading company data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanyData();
  }, [companySlug]);

  // Fetch available slots when date changes
  const loadSlots = useCallback(async () => {
    if (!bookingState.selectedDate || !bookingState.selectedService) return;

    try {
      setIsSlotsLoading(true);
      const dateStr = format(bookingState.selectedDate, 'yyyy-MM-dd');

      const slots = await getAvailableSlots({
        companySlug,
        date: dateStr,
        serviceId: bookingState.selectedService.id,
        employeeId: bookingState.selectedEmployee?.id || null,
        any_person: bookingState.anyPerson,
      });

      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error loading slots:', err);
      setAvailableSlots([]);
    } finally {
      setIsSlotsLoading(false);
    }
  }, [
    companySlug,
    bookingState.selectedDate,
    bookingState.selectedService,
    bookingState.selectedEmployee,
    bookingState.anyPerson,
  ]);

  useEffect(() => {
    if (bookingState.currentStep === 3 && bookingState.selectedDate) {
      loadSlots();
    }
  }, [bookingState.currentStep, bookingState.selectedDate, loadSlots]);

  // Handlers
  const handleSelectEmployee = (employee: Employee) => {
    setBookingState((prev) => ({
      ...prev,
      selectedEmployee: employee,
      anyPerson: false,
    }));
  };

  const handleSelectAnyPerson = () => {
    setBookingState((prev) => ({
      ...prev,
      selectedEmployee: null,
      anyPerson: true,
    }));
  };

  const handleSelectCategory = (category: ServiceCategory) => {
    setBookingState((prev) => ({
      ...prev,
      selectedCategory: category,
    }));
    setServiceSubStep('service');
  };

  const handleSelectService = (service: Service) => {
    setBookingState((prev) => ({
      ...prev,
      selectedService: service,
    }));
  };

  const handleSelectDate = (date: Date) => {
    setBookingState((prev) => ({
      ...prev,
      selectedDate: date,
      selectedTime: null,
    }));
  };

  const handleSelectTime = (time: string) => {
    setBookingState((prev) => ({
      ...prev,
      selectedTime: time,
    }));
  };

  const handleUpdateCustomer = (data: Partial<CustomerData>) => {
    setBookingState((prev) => ({
      ...prev,
      customer: { ...prev.customer, ...data },
    }));
  };

  const handleSubmit = async () => {
    if (!bookingState.selectedService || !bookingState.selectedDate || !bookingState.selectedTime) {
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await createBooking({
        companySlug,
        date: format(bookingState.selectedDate, 'yyyy-MM-dd'),
        time: bookingState.selectedTime,
        serviceId: bookingState.selectedService.id,
        employeeId: bookingState.selectedEmployee?.id || null,
        any_person: bookingState.anyPerson,
        firstName: bookingState.customer.firstName.trim(),
        lastName: bookingState.customer.lastName.trim(),
        customerName: `${bookingState.customer.firstName.trim()} ${bookingState.customer.lastName.trim()}`,
        customerEmail: bookingState.customer.email,
        customerPhone: bookingState.customer.phone,
        customerGender: bookingState.customer.gender,
        customerNote: bookingState.customer.notes || '',
        gdprSendMarketing: bookingState.customer.marketingConsent,
      });

      if (result.success) {
        setBookingConfirmation(result);
        setIsConfirmed(true);
        setBookingState((prev) => ({ ...prev, currentStep: 5 }));
      } else {
        alert(result.message || 'Prišlo je do napake pri ustvarjanju rezervacije.');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Prišlo je do napake pri ustvarjanju rezervacije. Prosim poskusite znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    setBookingState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 5),
    }));
  };

  const handlePrevStep = () => {
    if (bookingState.currentStep === 2 && serviceSubStep === 'service') {
      setServiceSubStep('category');
      return;
    }
    setBookingState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  };

  const handleNewBooking = () => {
    const isSingleMode = companyData?.ui?.employeeSelection?.mode === 'single';
    setBookingState({
      currentStep: isSingleMode ? 2 : 1,
      selectedEmployee: isSingleMode && employees.length > 0 ? employees[0] : null,
      anyPerson: false,
      selectedCategory: null,
      selectedService: null,
      selectedDate: null,
      selectedTime: null,
      customer: initialCustomerData,
    });
    setServiceSubStep('category');
    setIsConfirmed(false);
    setBookingConfirmation(null);
    setAvailableSlots([]);
  };

  const handleReset = () => {
    const isSingleMode = companyData?.ui?.employeeSelection?.mode === 'single';
    setBookingState({
      currentStep: isSingleMode ? 2 : 1,
      selectedEmployee: isSingleMode && employees.length > 0 ? employees[0] : null,
      anyPerson: false,
      selectedCategory: null,
      selectedService: null,
      selectedDate: null,
      selectedTime: null,
      customer: initialCustomerData,
    });
    setServiceSubStep('category');
    setIsConfirmed(false);
    setBookingConfirmation(null);
    setAvailableSlots([]);
  };

  // Navigation validation
  const canGoNext = (): boolean => {
    switch (bookingState.currentStep) {
      case 1:
        return bookingState.selectedEmployee !== null || bookingState.anyPerson;
      case 2:
        return bookingState.selectedService !== null;
      case 3:
        return bookingState.selectedDate !== null && bookingState.selectedTime !== null;
      case 4: {
        const { firstName, lastName, phone, email } = bookingState.customer;
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        const phoneValid = /^[\d\s\+\-\(\)]{6,}$/.test(phone.trim());
        return (
          firstName.trim().length > 0 &&
          lastName.trim().length > 0 &&
          phoneValid &&
          emailValid
        );
      }
      default:
        return false;
    }
  };

  // Get services for selected category (case-insensitive matching)
  const getServicesForCategory = (): Service[] => {
    if (!bookingState.selectedCategory) return [];

    const categoryId = bookingState.selectedCategory.id;

    // Try exact match first
    if (servicesByCategory[categoryId]) {
      return servicesByCategory[categoryId];
    }

    // Try case-insensitive match in servicesByCategory
    const normalizedId = categoryId.toLowerCase();
    const matchingKey = Object.keys(servicesByCategory).find(
      key => key.toLowerCase() === normalizedId
    );
    if (matchingKey) {
      return servicesByCategory[matchingKey];
    }

    // Fallback: filter services by category_id (case-insensitive)
    return services.filter((s) =>
      s.category_id.toLowerCase() === normalizedId
    );
  };

  // Loading state
  if (isLoading) {
    return <LoadingScreen primaryColor={companyData?.theme?.primaryColor} />;
  }

  // Error state
  if (error || !companyData) {
    return <ErrorScreen message={error || undefined} onRetry={() => window.location.reload()} />;
  }

  const { theme, company } = companyData;
  const companyName = company?.bookingName || company?.name || companySlug;

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgTo})`,
      }}
    >
      {/* Header with Company Name */}
      <header className="pt-8 pb-4 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white">{companyName}</h1>
        </motion.div>
      </header>

      {/* Progress Stepper */}
      {!isConfirmed && (
        <BookingStepper
          currentStep={bookingState.currentStep}
          totalSteps={5}
          primaryColor={theme.primaryColor}
        />
      )}

      {/* Main Content - two-column grid at xl to avoid SummaryPanel overlap */}
      <div className="xl:grid xl:grid-cols-[1fr_300px] xl:gap-6 xl:max-w-[1440px] xl:mx-auto xl:px-8">
      <main className="pb-48 md:pb-40 min-w-0">
        <AnimatePresence mode="wait">
          {/* Step 1: Employee Selection */}
          {bookingState.currentStep === 1 && !isConfirmed && (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <StepEmployeeSelection
                employees={employees}
                selectedEmployee={bookingState.selectedEmployee}
                anyPerson={bookingState.anyPerson}
                onSelectEmployee={handleSelectEmployee}
                onSelectAnyPerson={handleSelectAnyPerson}
                primaryColor={theme.primaryColor}
                secondaryColor={theme.secondaryColor}
              />
            </motion.div>
          )}

          {/* Step 2: Service Selection */}
          {bookingState.currentStep === 2 && !isConfirmed && (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {serviceSubStep === 'category' ? (
                <StepCategorySelection
                  categories={serviceCategories}
                  services={services}
                  onSelectCategory={handleSelectCategory}
                  primaryColor={theme.primaryColor}
                />
              ) : (
                <StepServiceSelection
                  services={getServicesForCategory()}
                  category={bookingState.selectedCategory!}
                  selectedService={bookingState.selectedService}
                  onSelectService={handleSelectService}
                  onBack={() => setServiceSubStep('category')}
                  primaryColor={theme.primaryColor}
                />
              )}
            </motion.div>
          )}

          {/* Step 3: Date/Time Selection */}
          {bookingState.currentStep === 3 && !isConfirmed && (
            <motion.div
              key="step3"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <StepDateTimeSelection
                selectedDate={bookingState.selectedDate}
                selectedTime={bookingState.selectedTime}
                availableSlots={availableSlots}
                isLoading={isSlotsLoading}
                onSelectDate={handleSelectDate}
                onSelectTime={handleSelectTime}
                primaryColor={theme.primaryColor}
              />
            </motion.div>
          )}

          {/* Step 4: Customer Details */}
          {bookingState.currentStep === 4 && !isConfirmed && (
            <motion.div
              key="step4"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <StepCustomerDetails
                customer={bookingState.customer}
                onUpdateCustomer={handleUpdateCustomer}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                employee={bookingState.selectedEmployee}
                anyPerson={bookingState.anyPerson}
                service={bookingState.selectedService}
                date={bookingState.selectedDate}
                time={bookingState.selectedTime}
                primaryColor={theme.primaryColor}
              />
            </motion.div>
          )}

          {/* Step 5: Confirmation */}
          {isConfirmed && (
            <motion.div
              key="step5"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <StepConfirmation
                employee={bookingState.selectedEmployee}
                anyPerson={bookingState.anyPerson}
                service={bookingState.selectedService}
                date={bookingState.selectedDate}
                time={bookingState.selectedTime}
                customer={bookingState.customer}
                onNewBooking={handleNewBooking}
                onReset={handleReset}
                primaryColor={theme.primaryColor}
                companyName={companyName}
                bookingConfirmation={bookingConfirmation}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Desktop Summary Panel - sticky in grid column */}
      {!isConfirmed && bookingState.currentStep < 4 && (
        <div className="hidden xl:block pt-0 pb-40">
          <div className="sticky top-32">
            <SummaryPanel
              employee={bookingState.selectedEmployee}
              anyPerson={bookingState.anyPerson}
              service={bookingState.selectedService}
              date={bookingState.selectedDate}
              time={bookingState.selectedTime}
              primaryColor={theme.primaryColor}
            />
          </div>
        </div>
      )}
      </div>{/* end xl:grid */}

      {/* Bottom Navigation (Mobile & Desktop) */}
      {!isConfirmed && bookingState.currentStep <= 4 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] glass-dark border-t border-white/10"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            {/* Back Button */}
            <motion.button
              onClick={handlePrevStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={bookingState.currentStep === 1 && serviceSubStep === 'category'}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                bookingState.currentStep === 1 && serviceSubStep === 'category'
                  ? 'opacity-50 cursor-not-allowed text-white/40'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Nazaj</span>
            </motion.button>

            {/* Mobile/tablet summary — hidden at xl (where SummaryPanel is visible) */}
            <div className="flex-1 xl:hidden">
              {bookingState.selectedService && bookingState.selectedService.price != null && (
                <div className="text-center">
                  <p className="text-xs text-white/60">Skupaj</p>
                  <p className="text-lg font-semibold" style={{ color: theme.primaryColor }}>
                    {Number(bookingState.selectedService.price).toFixed(2)} €
                  </p>
                </div>
              )}
            </div>

            {/* Next / Submit Button */}
            <motion.button
              onClick={bookingState.currentStep === 4 ? handleSubmit : handleNextStep}
              whileHover={{ scale: canGoNext() ? 1.02 : 1 }}
              whileTap={{ scale: canGoNext() ? 0.98 : 1 }}
              disabled={!canGoNext() || (bookingState.currentStep === 4 && isSubmitting)}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                canGoNext() && !(bookingState.currentStep === 4 && isSubmitting)
                  ? 'text-white shadow-lg'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
              style={{
                backgroundColor: canGoNext() ? theme.primaryColor : undefined,
                boxShadow: canGoNext() ? `0 10px 30px ${theme.primaryColor}40` : undefined,
              }}
            >
              {bookingState.currentStep === 4 && isSubmitting ? (
                <span>Pošiljam...</span>
              ) : bookingState.currentStep === 4 ? (
                <>
                  <span>Rezerviraj</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  <span>Naprej</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
