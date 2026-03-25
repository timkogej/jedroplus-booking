// n8n Webhook API Client
import {
  Service,
  ServiceCategory,
  RawService,
  RawServiceCategory,
  CompanyData
} from './types';
import { supabase } from './supabase';

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
  employeesByServiceId?: Record<string, (string | number)[]>;
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
function parsePrice(priceStr: string | number | null | undefined): number {
  if (priceStr === null || priceStr === undefined) return 0;
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
  // Debug: log company fields in development to help diagnose name display issues
  if (process.env.NODE_ENV === 'development') {
    console.debug('[booking] raw company object:', raw.company);
  }

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
    bookingName:
      raw.company['Naziv podjetja'] ||
      (raw as unknown as Record<string, unknown>)['Naziv podjetja'] as string ||
      raw.company.bookingName ||
      raw.company['Booking ime'] ||
      raw.company.name,
  };

  return {
    company,
    employees: raw.employees || [],
    employees_ui: raw.employees_ui || [],
    services,
    serviceCategories,
    servicesByCategory,
    employeesByServiceId: raw.employeesByServiceId,
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

  // Fetch company display name directly from Supabase "Podatki podjetij" table
  let nazivPodjetja: string | null = null;
  try {
    // Try multiple possible slug column names
    const companyId = rawData.company?.id;
    let rows: Record<string, unknown>[] | null = null;

    // Attempt 1: filter by slug column
    const res1 = await supabase.from('Podatki podjetij').select('*').eq('slug', companySlug).limit(1);
    if (res1.data && res1.data.length > 0) {
      rows = res1.data as Record<string, unknown>[];
    }

    // Attempt 2: filter by id from n8n response
    if (!rows && companyId) {
      const res2 = await supabase.from('Podatki podjetij').select('*').eq('id', companyId).limit(1);
      if (res2.data && res2.data.length > 0) {
        rows = res2.data as Record<string, unknown>[];
      }
    }

    // Attempt 3: just take the first row (single-company setup)
    if (!rows) {
      const res3 = await supabase.from('Podatki podjetij').select('*').limit(1);
      if (res3.data && res3.data.length > 0) {
        rows = res3.data as Record<string, unknown>[];
      }
    }

    if (rows && rows.length > 0) {
      const row = rows[0];
      console.log('[supabase] Podatki podjetij row keys:', Object.keys(row));
      // Try all likely column name variations for the company name
      nazivPodjetja =
        (row['Naziv Podjetja'] as string) ||
        (row['Naziv podjetja'] as string) ||
        (row['naziv podjetja'] as string) ||
        (row['naziv_podjetja'] as string) ||
        (row['NazivPodjetja'] as string) ||
        null;
      console.log('[supabase] → nazivPodjetja:', nazivPodjetja);
    }
  } catch (err) {
    console.error('[supabase] query failed:', err);
  }

  const companyData = transformInitResponse(rawData);

  // Override bookingName with Supabase value if found
  if (nazivPodjetja) {
    companyData.company.bookingName = nazivPodjetja;
  }

  return companyData;
}

// 2. Get available time slots
export async function getAvailableSlots(params: {
  companySlug: string;
  date: string;
  serviceId: string;
  employeeId: string | null;
  any_person: boolean;
  eligibleEmployeeIds?: string[];
}): Promise<string[]> {
  const body: Record<string, unknown> = {
    action: 'slots',
    companySlug: params.companySlug,
    date: params.date,
    serviceId: params.serviceId,
    any_person: params.any_person,
  };

  if (params.any_person) {
    if (params.eligibleEmployeeIds && params.eligibleEmployeeIds.length > 0) {
      body.employeeIds = params.eligibleEmployeeIds;
    }
  } else {
    body.employeeId = params.employeeId;
  }

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
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
  gdprPrivacyConsent: boolean;
  consentTimestamp: string;
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
