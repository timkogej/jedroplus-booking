'use client';

import dynamic from 'next/dynamic';
import type { BookingVariant } from '@/components/booking/shared/BookingProvider';

const ClassicBooking = dynamic(
  () => import('@/components/booking/variants/classic'),
  { ssr: false }
);
const ModernBooking = dynamic(
  () => import('@/components/booking/variants/modern'),
  { ssr: false }
);
const ElegantBooking = dynamic(
  () => import('@/components/booking/variants/elegant'),
  { ssr: false }
);
const SeasonalBooking = dynamic(
  () => import('@/components/booking/variants/seasonal'),
  { ssr: false }
);
const MagazineBooking = dynamic(
  () => import('@/components/booking/variants/magazine'),
  { ssr: false }
);

interface Props {
  variant: BookingVariant;
}

export default function BookingVariantLoader({ variant }: Props) {
  switch (variant) {
    case 'classic':
      return <ClassicBooking />;
    case 'modern':
      return <ModernBooking />;
    case 'elegant':
      return <ElegantBooking />;
    case 'seasonal':
      return <SeasonalBooking />;
    case 'magazine':
      return <MagazineBooking />;
  }
}
