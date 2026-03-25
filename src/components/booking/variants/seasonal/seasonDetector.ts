import { SeasonalTheme, Season, Holiday } from '@/lib/types'

/**
 * Compute Easter Sunday for a given year using the Anonymous Gregorian algorithm.
 */
function getEasterDate(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1 // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month, day)
}

/**
 * Get the 4th Thursday of November (US Thanksgiving) for a given year.
 */
function getThanksgivingDate(year: number): Date {
  const nov1 = new Date(year, 10, 1) // November 1
  const dayOfWeek = nov1.getDay()
  // First Thursday: if Nov 1 is Thu (4) then it's the first. Otherwise calculate.
  const firstThursday = dayOfWeek <= 4 ? 1 + (4 - dayOfWeek) : 1 + (11 - dayOfWeek)
  const fourthThursday = firstThursday + 21
  return new Date(year, 10, fourthThursday)
}

function isInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end
}

function detectHoliday(date: Date): Holiday | undefined {
  const month = date.getMonth() // 0-11
  const day = date.getDate()
  const year = date.getFullYear()

  // Christmas: Dec 15 - Dec 26
  if (month === 11 && day >= 15 && day <= 26) return 'christmas'

  // New Year: Dec 27 - Jan 5
  if ((month === 11 && day >= 27) || (month === 0 && day <= 5)) return 'newyear'

  // Valentine's Day: Feb 1 - Feb 14
  if (month === 1 && day >= 1 && day <= 14) return 'valentine'

  // Easter: ± 7 days around Easter Sunday
  const easter = getEasterDate(year)
  const easterStart = new Date(easter)
  easterStart.setDate(easter.getDate() - 7)
  const easterEnd = new Date(easter)
  easterEnd.setDate(easter.getDate() + 7)
  if (isInRange(date, easterStart, easterEnd)) return 'easter'

  // Halloween: Oct 20 - Oct 31
  if (month === 9 && day >= 20 && day <= 31) return 'halloween'

  // Thanksgiving: ± 5 days around 4th Thursday of November
  const thanksgiving = getThanksgivingDate(year)
  const tgStart = new Date(thanksgiving)
  tgStart.setDate(thanksgiving.getDate() - 5)
  const tgEnd = new Date(thanksgiving)
  tgEnd.setDate(thanksgiving.getDate() + 2)
  if (isInRange(date, tgStart, tgEnd)) return 'thanksgiving'

  return undefined
}

function detectSeason(date: Date): Season {
  const month = date.getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

export function getCurrentSeasonalTheme(date: Date = new Date()): SeasonalTheme {
  const season = detectSeason(date)
  const holiday = detectHoliday(date)

  // Holiday themes take priority
  if (holiday === 'christmas') {
    return {
      season: 'winter',
      holiday: 'christmas',
      theme: {
        name: 'Christmas Magic',
        snowflakes: true,
        santaHats: true,
        ornaments: true,
        accentColor: '#C41E3A',
        overlayColor: 'rgba(200, 220, 255, 0.03)',
        particleColor: '#FFD700',
        fontClass: 'font-display',
      },
    }
  }

  if (holiday === 'newyear') {
    return {
      season: 'winter',
      holiday: 'newyear',
      theme: {
        name: 'New Year Celebration',
        fireworks: true,
        confettiAccents: true,
        snowflakes: true,
        accentColor: '#FFD700',
        overlayColor: 'rgba(255, 215, 0, 0.03)',
        particleColor: '#FFD700',
        fontClass: 'font-display',
      },
    }
  }

  if (holiday === 'valentine') {
    return {
      season,
      holiday: 'valentine',
      theme: {
        name: "Valentine's Day",
        hearts: true,
        flowers: true,
        accentColor: '#E91E63',
        overlayColor: 'rgba(255, 192, 203, 0.05)',
        particleColor: '#FF69B4',
        fontClass: 'font-display',
      },
    }
  }

  if (holiday === 'easter') {
    return {
      season: 'spring',
      holiday: 'easter',
      theme: {
        name: 'Easter Joy',
        eggs: true,
        flowers: true,
        butterflies: true,
        accentColor: '#9C27B0',
        overlayColor: 'rgba(144, 238, 144, 0.03)',
        particleColor: '#FFB74D',
        fontClass: 'font-sans',
      },
    }
  }

  if (holiday === 'halloween') {
    return {
      season: 'autumn',
      holiday: 'halloween',
      theme: {
        name: 'Halloween Spooky',
        pumpkins: true,
        ghosts: true,
        bats: true,
        spiderWebs: true,
        leaves: true,
        accentColor: '#FF6600',
        overlayColor: 'rgba(0, 0, 0, 0.05)',
        particleColor: '#6B46C1',
        fontClass: 'font-display',
      },
    }
  }

  if (holiday === 'thanksgiving') {
    return {
      season: 'autumn',
      holiday: 'thanksgiving',
      theme: {
        name: 'Thanksgiving Harvest',
        leaves: true,
        harvest: true,
        accentColor: '#D4740E',
        overlayColor: 'rgba(255, 140, 0, 0.05)',
        particleColor: '#8B4513',
        fontClass: 'font-sans',
      },
    }
  }

  // Base season themes
  switch (season) {
    case 'winter':
      return {
        season: 'winter',
        theme: {
          name: 'Winter Wonderland',
          snowflakes: true,
          accentColor: '#4FC3F7',
          overlayColor: 'rgba(200, 220, 255, 0.03)',
          particleColor: '#FFFFFF',
          fontClass: 'font-sans',
        },
      }
    case 'spring':
      return {
        season: 'spring',
        theme: {
          name: 'Spring Bloom',
          flowers: true,
          butterflies: true,
          accentColor: '#66BB6A',
          overlayColor: 'rgba(144, 238, 144, 0.03)',
          particleColor: '#FFB7C5',
          fontClass: 'font-sans',
        },
      }
    case 'summer':
      return {
        season: 'summer',
        theme: {
          name: 'Summer Vibes',
          sunRays: true,
          waves: true,
          accentColor: '#FFA726',
          overlayColor: 'rgba(255, 200, 100, 0.04)',
          particleColor: '#FFD54F',
          fontClass: 'font-sans',
        },
      }
    case 'autumn':
      return {
        season: 'autumn',
        theme: {
          name: 'Autumn Warmth',
          leaves: true,
          accentColor: '#EF6C00',
          overlayColor: 'rgba(255, 140, 0, 0.05)',
          particleColor: '#FF8A65',
          fontClass: 'font-sans',
        },
      }
  }
}
