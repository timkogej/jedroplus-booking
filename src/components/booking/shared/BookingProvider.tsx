'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { format } from 'date-fns';
import {
  CompanyData,
  Employee,
  Service,
  ServiceCategory,
  CustomerData,
  BookingConfirmation,
  Theme,
  Company,
} from '@/lib/types';
import { initializeBooking, getAvailableSlots, createBooking } from '@/lib/api';

export type BookingVariant = 'classic' | 'modern' | 'elegant' | 'seasonal' | 'magazine';

const DEFAULT_THEME: Theme = {
  primaryColor: '#8B5CF6',
  secondaryColor: '#A78BFA',
  bgFrom: '#7C3AED',
  bgTo: '#4F46E5',
};

const initialCustomer: CustomerData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  gender: '',
  notes: '',
  privacyConsent: false,
  marketingConsent: false,
};

export interface BookingContextValue {
  // Init state
  isLoading: boolean;
  error: string | null;
  companyData: CompanyData | null;
  theme: Theme;
  company: Company | null;
  companyName: string;

  // Step navigation
  currentStep: number;
  goToStep: (step: number) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;

  // Data
  serviceCategories: ServiceCategory[];
  employees: Employee[];
  filteredEmployees: Employee[];
  servicesForCategory: Service[];
  availableSlots: string[];
  isSlotsLoading: boolean;

  // Selections
  selectedCategory: ServiceCategory | null;
  selectedService: Service | null;
  selectedEmployee: Employee | null;
  anyPerson: boolean;
  eligibleEmployeeIds: string[];
  selectedDate: Date | null;
  selectedTime: string | null;
  customer: CustomerData;

  // Actions
  selectCategory: (category: ServiceCategory) => void;
  selectService: (service: Service) => void;
  selectEmployee: (employee: Employee) => void;
  selectAnyEmployee: () => void;
  selectDate: (date: Date) => void;
  selectTime: (time: string) => void;
  updateCustomer: (data: Partial<CustomerData>) => void;
  submitBooking: () => Promise<void>;
  resetBooking: () => void;

  // Submission
  isSubmitting: boolean;
  isConfirmed: boolean;
  bookingConfirmation: BookingConfirmation | null;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within <BookingProvider>');
  return ctx;
}

interface BookingProviderProps {
  children: React.ReactNode;
  companySlug: string;
  variant: BookingVariant;
}

export function BookingProvider({ children, companySlug, variant }: BookingProviderProps) {
  // Init
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);

  // Step
  const [currentStep, setCurrentStep] = useState(1);

  // Selections
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [anyPerson, setAnyPerson] = useState(false);
  const [eligibleEmployeeIds, setEligibleEmployeeIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerData>(initialCustomer);

  // Slots
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);

  // Derived
  const employees: Employee[] = useMemo(() => {
    return (companyData?.employees_ui ?? []).map((emp) => ({
      id: emp.id,
      name: emp.label,
      label: emp.label,
      subtitle: emp.subtitle,
      initials: emp.initials,
    }));
  }, [companyData]);

  const filteredEmployees: Employee[] = useMemo(() => {
    if (!selectedService || employees.length === 0) return employees;
    const set = new Set(eligibleEmployeeIds);
    return employees.filter((e) => set.has(String(e.id)));
  }, [selectedService, employees, eligibleEmployeeIds]);

  const servicesForCategory: Service[] = useMemo(() => {
    if (!selectedCategory || !companyData) return [];
    const categoryId = selectedCategory.id;
    const byCategory = companyData.servicesByCategory;

    if (byCategory[categoryId]) return byCategory[categoryId];

    const normalizedId = categoryId.toLowerCase();
    const matchingKey = Object.keys(byCategory).find(
      (k) => k.toLowerCase() === normalizedId
    );
    if (matchingKey) return byCategory[matchingKey];

    return companyData.services.filter(
      (s) => s.category_id.toLowerCase() === normalizedId
    );
  }, [selectedCategory, companyData]);

  const theme: Theme = companyData?.theme ?? DEFAULT_THEME;
  const company: Company | null = companyData?.company ?? null;
  const companyName = company?.bookingName || company?.name || companySlug;
  const serviceCategories: ServiceCategory[] = companyData?.serviceCategories ?? [];

  // Init fetch
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await initializeBooking(companySlug);
        setCompanyData(data);

        // Auto-select single employee in single mode
        const uiEmployees = (data.employees_ui ?? []).map((emp) => ({
          id: emp.id,
          name: emp.label,
          label: emp.label,
          subtitle: emp.subtitle,
          initials: emp.initials,
        }));
        if (
          data.ui?.employeeSelection?.mode === 'single' &&
          uiEmployees.length === 1
        ) {
          setSelectedEmployee(uiEmployees[0]);
        }
      } catch (err) {
        setError('Podjetje ni bilo najdeno ali pa je prišlo do napake.');
        console.error('[BookingProvider] init error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [companySlug]);

  // Fetch slots when date changes (and we're on the date step)
  const loadSlots = useCallback(async () => {
    if (!selectedDate || !selectedService) return;
    try {
      setIsSlotsLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const slots = await getAvailableSlots({
        companySlug,
        date: dateStr,
        serviceId: selectedService.id,
        employeeId: selectedEmployee?.id || null,
        any_person: anyPerson,
        eligibleEmployeeIds: anyPerson ? eligibleEmployeeIds : undefined,
      });
      setAvailableSlots(slots);
    } catch (err) {
      console.error('[BookingProvider] slots error:', err);
      setAvailableSlots([]);
    } finally {
      setIsSlotsLoading(false);
    }
  }, [companySlug, selectedDate, selectedService, selectedEmployee, anyPerson, eligibleEmployeeIds]);

  useEffect(() => {
    if (selectedDate && selectedService) {
      loadSlots();
    }
  }, [selectedDate, loadSlots]);

  // Actions
  const selectCategory = useCallback((category: ServiceCategory) => {
    setSelectedCategory(category);
    setSelectedService(null);
    setSelectedEmployee(null);
    setAnyPerson(false);
    setEligibleEmployeeIds([]);
    setCurrentStep(2);
  }, []);

  const selectService = useCallback(
    (service: Service) => {
      const rawIds = companyData?.employeesByServiceId?.[String(service.id)];
      const ids =
        rawIds != null ? rawIds.map(String) : employees.map((e) => e.id);

      const eligible = employees.filter((e) => ids.includes(String(e.id)));
      const autoSelected = eligible.length === 1 ? eligible[0] : null;

      setSelectedService(service);
      setEligibleEmployeeIds(ids);
      setSelectedEmployee(autoSelected);
      setAnyPerson(false);

      // For seasonal variant (starts at step 1 = service), advance to step 2
      // For other variants (start at step 1 = category), advance to step 3
      if (variant === 'seasonal') {
        setCurrentStep(2);
      } else {
        setCurrentStep(3);
      }
    },
    [companyData, employees, variant]
  );

  const selectEmployee = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setAnyPerson(false);
  }, []);

  const selectAnyEmployee = useCallback(() => {
    setSelectedEmployee(null);
    setAnyPerson(true);
    // Advance to next step
    if (variant === 'seasonal') {
      setCurrentStep(3);
    } else {
      setCurrentStep(4);
    }
  }, [variant]);

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  }, []);

  const selectTime = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  const updateCustomer = useCallback((data: Partial<CustomerData>) => {
    setCustomer((prev) => ({ ...prev, ...data }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const goToPrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const submitBooking = useCallback(async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    try {
      setIsSubmitting(true);
      const result = await createBooking({
        companySlug,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        serviceId: selectedService.id,
        employeeId: selectedEmployee?.id || null,
        any_person: anyPerson,
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        customerName: `${customer.firstName.trim()} ${customer.lastName.trim()}`,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerGender: customer.gender,
        customerNote: customer.notes || '',
        gdprSendMarketing: customer.marketingConsent,
        gdprPrivacyConsent: customer.privacyConsent,
        consentTimestamp: new Date().toISOString(),
      });

      if (result.success) {
        setBookingConfirmation(result);
        setIsConfirmed(true);
        setCurrentStep(variant === 'seasonal' ? 5 : 6);
      } else {
        alert(result.message || 'Prišlo je do napake pri ustvarjanju rezervacije.');
      }
    } catch (err) {
      console.error('[BookingProvider] booking error:', err);
      alert('Prišlo je do napake pri ustvarjanju rezervacije. Prosim poskusite znova.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    companySlug,
    selectedService,
    selectedDate,
    selectedTime,
    selectedEmployee,
    anyPerson,
    customer,
    variant,
  ]);

  const resetBooking = useCallback(() => {
    setCurrentStep(1);
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectedEmployee(null);
    setAnyPerson(false);
    setEligibleEmployeeIds([]);
    setSelectedDate(null);
    setSelectedTime(null);
    setCustomer(initialCustomer);
    setAvailableSlots([]);
    setIsConfirmed(false);
    setBookingConfirmation(null);
  }, []);

  const value: BookingContextValue = {
    isLoading,
    error,
    companyData,
    theme,
    company,
    companyName,
    currentStep,
    goToStep,
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
    eligibleEmployeeIds,
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
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}
