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
import StepCategorySelection from './StepCategorySelection';
import StepServiceSelection from './StepServiceSelection';
import StepEmployeeSelection from './StepEmployeeSelection';
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
  privacyConsent: false,
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
  // Steps: 1=Category, 2=Service, 3=Employee, 4=DateTime, 5=CustomerDetails, 6=Confirmation
  const [bookingState, setBookingState] = useState<BookingState>({
    currentStep: 1,
    selectedEmployee: null,
    anyPerson: false,
    eligibleEmployeeIds: [],
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

        // Auto-select employee in single mode (but keep starting at step 1)
        if (data.ui?.employeeSelection?.mode === 'single' && transformedEmployees.length === 1) {
          setBookingState((prev) => ({
            ...prev,
            selectedEmployee: transformedEmployees[0],
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

  // Fetch available slots when date changes (step 4 = DateTime)
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
        eligibleEmployeeIds: bookingState.anyPerson
          ? bookingState.eligibleEmployeeIds
          : undefined,
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
    bookingState.eligibleEmployeeIds,
  ]);

  useEffect(() => {
    if (bookingState.currentStep === 4 && bookingState.selectedDate) {
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
    // Auto-advance to date selection when "Kdorkoli" is chosen
    setBookingState((prev) => ({
      ...prev,
      selectedEmployee: null,
      anyPerson: true,
      currentStep: 4,
    }));
  };

  const handleSelectCategory = (category: ServiceCategory) => {
    // Selecting a category auto-advances to service selection (step 2)
    // Clear service, employee, and eligible IDs when category changes
    setBookingState((prev) => ({
      ...prev,
      selectedCategory: category,
      selectedService: null,
      selectedEmployee: null,
      anyPerson: false,
      eligibleEmployeeIds: [],
      currentStep: 2,
    }));
  };

  const handleSelectService = (service: Service) => {
    // Compute eligible employee IDs for this service
    const rawIds = companyData?.employeesByServiceId?.[String(service.id)];
    const eligibleEmployeeIds =
      rawIds != null ? rawIds.map(String) : employees.map((e) => e.id);

    // Auto-select if exactly one eligible employee
    const eligible = employees.filter((emp) =>
      eligibleEmployeeIds.includes(String(emp.id))
    );
    const autoSelected = eligible.length === 1 ? eligible[0] : null;

    setBookingState((prev) => ({
      ...prev,
      selectedService: service,
      selectedEmployee: autoSelected,
      anyPerson: false,
      eligibleEmployeeIds,
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
        gdprPrivacyConsent: bookingState.customer.privacyConsent,
        consentTimestamp: new Date().toISOString(),
      });

      if (result.success) {
        setBookingConfirmation(result);
        setIsConfirmed(true);
        setBookingState((prev) => ({ ...prev, currentStep: 6 }));
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
      currentStep: Math.min(prev.currentStep + 1, 6),
    }));
  };

  const handlePrevStep = () => {
    setBookingState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  };

  const handleNewBooking = () => {
    setBookingState({
      currentStep: 1,
      selectedEmployee: null,
      anyPerson: false,
      eligibleEmployeeIds: [],
      selectedCategory: null,
      selectedService: null,
      selectedDate: null,
      selectedTime: null,
      customer: initialCustomerData,
    });
    setIsConfirmed(false);
    setBookingConfirmation(null);
    setAvailableSlots([]);
  };

  const handleReset = () => {
    setBookingState({
      currentStep: 1,
      selectedEmployee: null,
      anyPerson: false,
      eligibleEmployeeIds: [],
      selectedCategory: null,
      selectedService: null,
      selectedDate: null,
      selectedTime: null,
      customer: initialCustomerData,
    });
    setIsConfirmed(false);
    setBookingConfirmation(null);
    setAvailableSlots([]);
  };

  // Employees eligible for the currently selected service
  const filteredEmployees = bookingState.selectedService
    ? employees.filter((emp) =>
        bookingState.eligibleEmployeeIds.includes(String(emp.id))
      )
    : employees;

  // Navigation validation
  const canGoNext = (): boolean => {
    switch (bookingState.currentStep) {
      case 1:
        return bookingState.selectedCategory !== null;
      case 2:
        return bookingState.selectedService !== null;
      case 3:
        // Block progression if no eligible employees for this service
        if (filteredEmployees.length === 0) return false;
        return bookingState.selectedEmployee !== null || bookingState.anyPerson;
      case 4:
        return bookingState.selectedDate !== null && bookingState.selectedTime !== null;
      case 5: {
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
          totalSteps={6}
          primaryColor={theme.primaryColor}
        />
      )}

      {/* Main Content */}
      <main className="pb-28">
        <AnimatePresence mode="wait">
          {/* Step 1: Category Selection */}
          {bookingState.currentStep === 1 && !isConfirmed && (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <StepCategorySelection
                categories={serviceCategories}
                services={services}
                onSelectCategory={handleSelectCategory}
                primaryColor={theme.primaryColor}
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
              <StepServiceSelection
                services={getServicesForCategory()}
                category={bookingState.selectedCategory!}
                selectedService={bookingState.selectedService}
                onSelectService={handleSelectService}
                primaryColor={theme.primaryColor}
              />
            </motion.div>
          )}

          {/* Step 3: Employee Selection */}
          {bookingState.currentStep === 3 && !isConfirmed && (
            <motion.div
              key="step3"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <StepEmployeeSelection
                employees={filteredEmployees}
                selectedEmployee={bookingState.selectedEmployee}
                anyPerson={bookingState.anyPerson}
                onSelectEmployee={handleSelectEmployee}
                onSelectAnyPerson={handleSelectAnyPerson}
                primaryColor={theme.primaryColor}
                secondaryColor={theme.secondaryColor}
              />
            </motion.div>
          )}

          {/* Step 4: Date/Time Selection */}
          {bookingState.currentStep === 4 && !isConfirmed && (
            <motion.div
              key="step4"
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

          {/* Step 5: Customer Details */}
          {bookingState.currentStep === 5 && !isConfirmed && (
            <motion.div
              key="step5"
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

          {/* Step 6: Confirmation */}
          {isConfirmed && (
            <motion.div
              key="step6"
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

      {/* Bottom Navigation (Mobile & Desktop) */}
      {!isConfirmed && bookingState.currentStep <= 5 && (
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
              disabled={bookingState.currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                bookingState.currentStep === 1
                  ? 'opacity-50 cursor-not-allowed text-white/40'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Nazaj</span>
            </motion.button>

            {/* Price summary in bottom nav */}
            <div className="flex-1">
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
              onClick={bookingState.currentStep === 5 ? handleSubmit : handleNextStep}
              whileHover={{ scale: canGoNext() ? 1.02 : 1 }}
              whileTap={{ scale: canGoNext() ? 0.98 : 1 }}
              disabled={!canGoNext() || (bookingState.currentStep === 5 && isSubmitting)}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                canGoNext() && !(bookingState.currentStep === 5 && isSubmitting)
                  ? 'text-white shadow-lg'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
              style={{
                backgroundColor: canGoNext() ? theme.primaryColor : undefined,
                boxShadow: canGoNext() ? `0 10px 30px ${theme.primaryColor}40` : undefined,
              }}
            >
              {bookingState.currentStep === 5 && isSubmitting ? (
                <span>Pošiljam...</span>
              ) : bookingState.currentStep === 5 ? (
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
