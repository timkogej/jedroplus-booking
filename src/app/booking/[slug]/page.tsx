import { Metadata } from 'next';
import BookingPage from '@/components/booking/BookingPage';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Rezervacija termina | ${slug}`,
    description: 'Rezervirajte svoj termin hitro in enostavno.',
    openGraph: {
      title: `Rezervacija termina | ${slug}`,
      description: 'Rezervirajte svoj termin hitro in enostavno.',
      type: 'website',
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return <BookingPage companySlug={slug} />;
}
