// n8n Webhook API Client
import {
  Service,
  ServiceCategory,
  RawService,
  RawServiceCategory,
  CompanyData
} from './types';

const API_BASE_URL = 'https://tikej.app.n8n.cloud/webhook/booking';

// Raw API response types (as received from n8n)
interface RawInitResponse {
  company: {
    id: string;
    name: string;
    slug: string;
    bookingName?: string; // "Booking ime" field from Supabase
    'Booking ime'?: string; // Alternative field name
    'Naziv podjetja'?: string; // Primary display name column
  };
  employees: Array<{
    id: string;
    name: string;
    email?: string;
  }>;
  employees_ui: Array<{
    id: string;
    label: string;
    subtitle?: string;
    initials?: string;
  }>;
  services: RawService[];
  serviceCategories: RawServiceCategory[];
  servicesByCategory: Record<string, RawService[]>;
  ui: {
    employeeSelection: {
      mode: 'single' | 'multi';
    };
    serviceSelection?: {
      mode: string;
    };
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    bgFrom: string;
    bgTo: string;
  };
}

export interface SlotsResponse {
  slots: string[];
}

export interface BookingResponse {
  success: boolean;
  message: string;
  storitev?: string;
  datum?: string;
  cas?: string;
}

// Helper function to parse price string (e.g., "60 EUR" -> 60)
function parsePrice(priceStr: string): number {
  if (typeof priceStr === 'number') return priceStr;
  const match = priceStr.match(/(\d+(?:[.,]\d+)?)/);
  if (match) {
    return parseFloat(match[1].replace(',', '.'));
  }
  return 0;
}

// Transform raw service to normalized service
function transformService(raw: RawService): Service {
  return {
    id: String(raw.id),
    name: raw.naziv,
    description: raw.opis,
    duration: raw.trajanjeMin,
    price: parsePrice(raw.cena),
    category_id: raw.kategorija,
  };
}

// Transform raw category to normalized category
function transformCategory(raw: RawServiceCategory): ServiceCategory {
  return {
    id: raw.id,
    name: raw.name,
    service_count: raw.count,
    icon: raw.icon,
    description: raw.description,
  };
}

// Transform entire API response
function transformInitResponse(raw: RawInitResponse): CompanyData {
  // Transform services
  const services = (raw.services || []).map(transformService);

  // Transform categories
  const serviceCategories = (raw.serviceCategories || []).map(transformCategory);

  // Transform servicesByCategory
  const servicesByCategory: Record<string, Service[]> = {};
  for (const [categoryId, rawServices] of Object.entries(raw.servicesByCategory || {})) {
    servicesByCategory[categoryId] = rawServices.map(transformService);
  }

  // Transform company with bookingName
  const company = {
    id: raw.company.id,
    name: raw.company.name,
    slug: raw.company.slug,
    bookingName: raw.company['Naziv podjetja'] || raw.company.bookingName || raw.company['Booking ime'] || raw.company.name,
  };

  return {
    company,
    employees: raw.employees || [],
    employees_ui: raw.employees_ui || [],
    services,
    serviceCategories,
    servicesByCategory,
    ui: raw.ui || { employeeSelection: { mode: 'multi' } },
    theme: raw.theme || {
      primaryColor: '#8B5CF6',
      secondaryColor: '#A78BFA',
      bgFrom: '#7C3AED',
      bgTo: '#4F46E5',
    },
  };
}

// 1. Initialize booking - get all company data
export async function initializeBooking(companySlug: string): Promise<CompanyData> {
  const response = await fetch(
    `${API_BASE_URL}?action=init&companySlug=${encodeURIComponent(companySlug)}`
  );

  if (!response.ok) {
    throw new Error('Podjetje ni bilo najdeno');
  }

  const data = await response.json();

  // Handle array response
  const rawData: RawInitResponse = Array.isArray(data) ? data[0] : data;

  // Transform and return normalized data
  return transformInitResponse(rawData);
}

// 2. Get available time slots
export async function getAvailableSlots(params: {
  companySlug: string;
  date: string;
  serviceId: string;
  employeeId: string | null;
  any_person: boolean;
}): Promise<string[]> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'slots',
      companySlug: params.companySlug,
      date: params.date,
      serviceId: params.serviceId,
      employeeId: params.employeeId,
      any_person: params.any_person,
    }),
  });

  if (!response.ok) {
    throw new Error('Napaka pri nalaganju prostih terminov');
  }

  const data = await response.json();

  // Handle array response
  const result = Array.isArray(data) ? data[0] : data;
  return result.slots || [];
}

// 3. Create booking
export async function createBooking(params: {
  companySlug: string;
  date: string;
  time: string;
  serviceId: string;
  employeeId: string | null;
  any_person: boolean;
  firstName: string;
  lastName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerGender: string;
  customerNote: string;
  gdprSendMarketing: boolean;
}): Promise<BookingResponse> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'create',
      ...params,
    }),
  });

  if (!response.ok) {
    throw new Error('Napaka pri ustvarjanju rezervacije');
  }

  const data = await response.json();

  // Handle array response
  return Array.isArray(data) ? data[0] : data;
}

// Legacy exports for backward compatibility during transition
export { initializeBooking as fetchCompanyData };
