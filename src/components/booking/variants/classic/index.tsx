'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useBooking } from '@/components/booking/shared/BookingProvider';
import BookingStepper from '@/components/booking/BookingStepper';
import StepCategorySelection from '@/components/booking/StepCategorySelection';
import StepServiceSelection from '@/components/booking/StepServiceSelection';
import StepEmployeeSelection from '@/components/booking/StepEmployeeSelection';
import StepDateTimeSelection from '@/components/booking/StepDateTimeSelection';
import StepCustomerDetails from '@/components/booking/StepCustomerDetails';
import StepConfirmation from '@/components/booking/StepConfirmation';
import LoadingScreen from '@/components/booking/LoadingScreen';
import ErrorScreen from '@/components/booking/ErrorScreen';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

function canGoNext(
  currentStep: number,
  selectedCategory: ReturnType<typeof useBooking>['selectedCategory'],
  selectedService: ReturnType<typeof useBooking>['selectedService'],
  selectedEmployee: ReturnType<typeof useBooking>['selectedEmployee'],
  anyPerson: boolean,
  filteredEmployees: ReturnType<typeof useBooking>['filteredEmployees'],
  selectedDate: ReturnType<typeof useBooking>['selectedDate'],
  selectedTime: ReturnType<typeof useBooking>['selectedTime'],
  customer: ReturnType<typeof useBooking>['customer']
): boolean {
  switch (currentStep) {
    case 1:
      return selectedCategory !== null;
    case 2:
      return selectedService !== null;
    case 3:
      if (filteredEmployees.length === 0) return false;
      return selectedEmployee !== null || anyPerson;
    case 4:
      return selectedDate !== null && selectedTime !== null;
    case 5: {
      const { firstName, lastName, phone, email } = customer;
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      const phoneValid = /^[\d\s+\-()]{6,}$/.test(phone.trim());
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
}

export default function ClassicBooking() {
  const {
    isLoading,
    error,
    theme,
    companyName,
    currentStep,
    goToNextStep,
    goToPrevStep,
    serviceCategories,
    employees,
    filteredEmployees,
    servicesForCategory,
    availableSlots,
    isSlotsLoading,
    selectedCategory,
    selectedService,
    selectedEmployee,
    anyPerson,
    selectedDate,
    selectedTime,
    customer,
    selectCategory,
    selectService,
    selectEmployee,
    selectAnyEmployee,
    selectDate,
    selectTime,
    updateCustomer,
    submitBooking,
    resetBooking,
    isSubmitting,
    isConfirmed,
    bookingConfirmation,
  } = useBooking();

  if (isLoading) {
    return <LoadingScreen primaryColor={theme.primaryColor} />;
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={() => window.location.reload()} />;
  }

  const canNext = canGoNext(
    currentStep,
    selectedCategory,
    selectedService,
    selectedEmployee,
    anyPerson,
    filteredEmployees,
    selectedDate,
    selectedTime,
    customer
  );

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${theme.bgFrom}, ${theme.bgTo})`,
      }}
    >
      {/* Header */}
      <header className="pt-8 pb-4 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white">{companyName}</h1>
        </motion.div>
      </header>

      {/* Stepper */}
      {!isConfirmed && (
        <BookingStepper
          currentStep={currentStep}
          totalSteps={6}
          primaryColor={theme.primaryColor}
        />
      )}

      {/* Main content */}
      <main className="pb-28">
        <AnimatePresence mode="wait">
          {currentStep === 1 && !isConfirmed && (
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
                services={[]}
                onSelectCategory={selectCategory}
                primaryColor={theme.primaryColor}
              />
            </motion.div>
          )}

          {currentStep === 2 && !isConfirmed && (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <StepServiceSelection
                services={servicesForCategory}
                category={selectedCategory!}
                selectedService={selectedService}
                onSelectService={selectService}
                primaryColor={theme.primaryColor}
              />
            </motion.div>
          )}

          {currentStep === 3 && !isConfirmed && (
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
                selectedEmployee={selectedEmployee}
                anyPerson={anyPerson}
                onSelectEmployee={selectEmployee}
                onSelectAnyPerson={selectAnyEmployee}
                primaryColor={theme.primaryColor}
                secondaryColor={theme.secondaryColor}
              />
            </motion.div>
          )}

          {currentStep === 4 && !isConfirmed && (
            <motion.div
              key="step4"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <StepDateTimeSelection
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                availableSlots={availableSlots}
                isLoading={isSlotsLoading}
                onSelectDate={selectDate}
                onSelectTime={selectTime}
                primaryColor={theme.primaryColor}
              />
            </motion.div>
          )}

          {currentStep === 5 && !isConfirmed && (
            <motion.div
              key="step5"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <StepCustomerDetails
                customer={customer}
                onUpdateCustomer={updateCustomer}
                onSubmit={submitBooking}
                isSubmitting={isSubmitting}
                employee={selectedEmployee}
                anyPerson={anyPerson}
                service={selectedService}
                date={selectedDate}
                time={selectedTime}
                primaryColor={theme.primaryColor}
              />
            </motion.div>
          )}

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
                employee={selectedEmployee}
                anyPerson={anyPerson}
                service={selectedService}
                date={selectedDate}
                time={selectedTime}
                customer={customer}
                onNewBooking={resetBooking}
                onReset={resetBooking}
                primaryColor={theme.primaryColor}
                companyName={companyName}
                bookingConfirmation={bookingConfirmation}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      {!isConfirmed && currentStep <= 5 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] glass-dark border-t border-white/10"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <motion.button
              onClick={goToPrevStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                currentStep === 1
                  ? 'opacity-50 cursor-not-allowed text-white/40'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Nazaj</span>
            </motion.button>

            <div className="flex-1">
              {selectedService && selectedService.price != null && (
                <div className="text-center">
                  <p className="text-xs text-white/60">Skupaj</p>
                  <p className="text-lg font-semibold" style={{ color: theme.primaryColor }}>
                    {Number(selectedService.price).toFixed(2)} €
                  </p>
                </div>
              )}
            </div>

            <motion.button
              onClick={currentStep === 5 ? submitBooking : goToNextStep}
              whileHover={{ scale: canNext ? 1.02 : 1 }}
              whileTap={{ scale: canNext ? 0.98 : 1 }}
              disabled={!canNext || (currentStep === 5 && isSubmitting)}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                canNext && !(currentStep === 5 && isSubmitting)
                  ? 'text-white shadow-lg'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
              style={{
                backgroundColor: canNext ? theme.primaryColor : undefined,
                boxShadow: canNext ? `0 10px 30px ${theme.primaryColor}40` : undefined,
              }}
            >
              {currentStep === 5 && isSubmitting ? (
                <span>Pošiljam...</span>
              ) : currentStep === 5 ? (
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
