# Jedro+ Booking — Project Memory

## Stack
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4, Framer Motion, lucide-react
- date-fns v4 with Slovenian locale (`sl`)
- Glassmorphism via custom CSS classes: `.glass` (white 85%) and `.glass-dark` (white/10)

## Key Files
- `src/components/booking/BookingPage.tsx` — main orchestrator, manages all state
- `src/components/booking/SummaryPanel.tsx` — desktop right panel (xl+), dark glassmorphism
- `src/components/booking/StepEmployeeSelection.tsx` — step 1
- `src/components/booking/StepDateTimeSelection.tsx` — step 3
- `src/lib/types.ts` — all TypeScript interfaces
- `src/lib/api.ts` — n8n API calls
- `src/app/globals.css` — `.glass`, `.glass-dark`, `.shadow-premium`, `.shadow-premium-lg`

## Architecture
- `BookingState.selectedDate` is `Date | null` (not ISO string)
- `Service.price` is `number`, format with `Number(price).toFixed(2) + ' €'`
- `Employee` has optional `initials`, `subtitle`, `image`, `bio`, `specialties`
- SummaryPanel receives `employee`, `anyPerson`, `service`, `date`, `time`, `primaryColor`

## UI Conventions
- SummaryPanel: `glass-dark` class, white text, hidden below xl, visible steps 1-3
- Bottom nav: `glass-dark border-t border-white/10`, all screen sizes, steps 1-3
- Mobile price in bottom nav: `xl:hidden` (visible until xl where SummaryPanel takes over)
- Step cards (main content): `glass` class (white 85% opacity) with dark gray text
- Gradient background: `linear-gradient(135deg, bgFrom, bgTo)` from theme

## Slovenian locale
- Date format: `format(date, 'd. MMMM yyyy', { locale: sl })` → "2. marca 2026"
- Day names for calendar: Pon, Tor, Sre, Čet, Pet, Sob, Ned
- Week starts on Monday
