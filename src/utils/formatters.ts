/**
 * Format date string into day of week, day number, month name in Arabic, and year.
 */
export function getArabicDateDetails(dateStr: string, timeStr: string) {
  // e.g. dateStr = "2026-09-08", timeStr = "20:00"
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  const d = new Date(year, month - 1, day, hours, minutes);

  const dayNamesArabic = [
    'الأحد',
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت'
  ];

  const monthNamesArabic = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر'
  ];

  const dayName = dayNamesArabic[d.getDay()];
  const monthName = monthNamesArabic[month - 1];
  const formattedDay = day < 10 ? `0${day}` : `${day}`;
  const formattedDate = `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
  
  // Format time in 12h Arabic
  let timeArabic = '';
  if (hours === 20 && minutes === 0) {
    timeArabic = 'الساعة 8 مساءً';
  } else {
    const isPM = hours >= 12;
    const hour12 = hours % 12 || 12;
    const minsStr = minutes > 0 ? `:${minutes < 10 ? '0' + minutes : minutes}` : '';
    timeArabic = `الساعة ${hour12}${minsStr} ${isPM ? 'مساءً' : 'صباحاً'}`;
  }

  return {
    dayName,
    dayNumber: formattedDay,
    rawDay: day,
    monthName,
    rawMonth: month,
    year: String(year),
    timeArabic,
    formattedDate
  };
}

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: 'upcoming' | 'today' | 'passed';
}

/**
 * Calculates countdown remaining time.
 */
export function calculateCountdown(dateStr: string, timeStr: string): CountdownResult {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  const targetDate = new Date(year, month - 1, day, hours, minutes, 0);
  const now = new Date();

  // Check if same day
  const isSameDay =
    now.getFullYear() === year &&
    now.getMonth() === month - 1 &&
    now.getDate() === day;

  const diffMs = targetDate.getTime() - now.getTime();

  if (isSameDay) {
    if (diffMs <= 0 && diffMs > -86400000) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'today' };
    }
  }

  if (diffMs < -86400000) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'passed' };
  }

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'today' };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutesRemaining = Math.floor((diffMs / (1000 * 60)) % 60);
  const secondsRemaining = Math.floor((diffMs / 1000) % 60);

  return {
    days,
    hours: hoursRemaining,
    minutes: minutesRemaining,
    seconds: secondsRemaining,
    status: 'upcoming'
  };
}

/**
 * Formats a number with leading zero if needed
 */
export function formatTwoDigits(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}
