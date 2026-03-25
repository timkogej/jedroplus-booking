// ─── Season & Theme Types ───────────────────────────────────────────────────

export type Season = 'winter' | 'spring' | 'summer' | 'autumn'

export type Holiday =
  | 'christmas'
  | 'newyear'
  | 'valentine'
  | 'easter'
  | 'halloween'
  | 'thanksgiving'

export interface SeasonalThemeConfig {
  name: string
  snowflakes?: boolean
  flowers?: boolean
  leaves?: boolean
  sunRays?: boolean
  waves?: boolean
  santaHats?: boolean
  ornaments?: boolean
  hearts?: boolean
  eggs?: boolean
  pumpkins?: boolean
  ghosts?: boolean
  bats?: boolean
  spiderWebs?: boolean
  butterflies?: boolean
  fireworks?: boolean
  confettiAccents?: boolean
  harvest?: boolean
  accentColor: string
  overlayColor: string
  particleColor: string
  fontClass: string
}

export interface SeasonalTheme {
  season: Season
  holiday?: Holiday
  theme: SeasonalThemeConfig
}

// Theme configuration
export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  bgFrom: string;
  bgTo: string;
}

// Employee from API
export interface Employee {
  id: string;
  name: string;
  label?: string;
  subtitle?: string;
  initials?: string;
  image?: string;
  bio?: string;
  specialties?: string[];
}

// Employee UI representation from API
export interface EmployeeUI {
  id: string;
  label: string;
  subtitle?: string;
  initials?: string;
}

// Raw service from n8n API (Slovenian field names)
export interface RawService {
  id: number;
  naziv: string;
  kategorija: string;
  opis?: string;
  trajanjeMin: number;
  cena: string;
}

// Normalized service for frontend
export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  category_id: string;
  icon?: string;
}

// Raw service category from n8n API
export interface RawServiceCategory {
  id: string;
  name: string;
  count: number;
  icon?: string;
  description?: string;
}

// Normalized service category for frontend
export interface ServiceCategory {
  id: string;
  name: string;
  service_count: number;
  icon?: string;
  description?: string;
}

// UI Configuration from API
export interface UIConfig {
  employeeSelection: {
    mode: 'single' | 'multi';
  };
  serviceSelection?: {
    mode: string;
  };
}

// Company data from API
export interface Company {
  id: string;
  name: string;
  slug: string;
  bookingName?: string; // Display name for booking page (from "Booking ime" field)
}

// Combined company data for frontend (from init API response)
export interface CompanyData {
  company: Company;
  employees: Employee[];
  employees_ui: EmployeeUI[];
  services: Service[];
  serviceCategories: ServiceCategory[];
  servicesByCategory: Record<string, Service[]>;
  employeesByServiceId?: Record<string, (string | number)[]>;
  ui: UIConfig;
  theme: Theme;
}

// Customer form data
export interface CustomerData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: 'Moški' | 'Ženska' | 'Drugo' | '';
  notes: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
}

// Booking confirmation response
export interface BookingConfirmation {
  success: boolean;
  message: string;
  storitev?: string;
  datum?: string;
  cas?: string;
}

// Booking state management
export interface BookingState {
  currentStep: number;
  selectedEmployee: Employee | null;
  anyPerson: boolean;
  eligibleEmployeeIds: string[]; // String-normalized IDs for employees eligible for selected service
  selectedCategory: ServiceCategory | null;
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  customer: CustomerData;
}

// Step names for routing/navigation
export type BookingStep =
  | 'employee'
  | 'category'
  | 'service'
  | 'datetime'
  | 'customer'
  | 'confirmation';
