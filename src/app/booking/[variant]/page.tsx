import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { BookingProvider } from '@/components/booking/shared/BookingProvider';
import type { BookingVariant } from '@/components/booking/shared/BookingProvider';
import BookingVariantLoader from './BookingVariantLoader';

const VALID_VARIANTS = ['classic', 'modern', 'elegant', 'seasonal', 'magazine'] as const;

interface PageProps {
  params: Promise<{ variant: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { variant } = await params;
  const sp = await searchParams;
  const company = sp.company || sp.c || variant;
  return {
    title: `Rezervacija termina | ${company}`,
    description: 'Rezervirajte svoj termin hitro in enostavno.',
  };
}

export default async function BookingVariantPage({ params, searchParams }: PageProps) {
  const { variant } = await params;
  const sp = await searchParams;

  // Legacy company slug URLs like /booking/test-salon → redirect to classic
  if (!VALID_VARIANTS.includes(variant as BookingVariant)) {
    redirect(`/booking/classic?company=${encodeURIComponent(variant)}`);
  }

  const companySlug = sp.company || sp.c || '';

  if (!companySlug) {
    notFound();
  }

  return (
    <BookingProvider
      variant={variant as BookingVariant}
      companySlug={companySlug}
    >
      <BookingVariantLoader variant={variant as BookingVariant} />
    </BookingProvider>
  );
}

export function generateStaticParams() {
  return VALID_VARIANTS.map((variant) => ({ variant }));
}
