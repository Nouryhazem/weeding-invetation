import { WeddingData } from '../types';

/**
 * Generates an RFC 5545 compliant iCalendar (.ics) file string and triggers a client-side download.
 */
export function downloadIcsCalendar(data: WeddingData): void {
  if (data.calendarUrl && data.calendarUrl.trim().length > 0 && !data.calendarUrl.includes('[CALENDAR_URL]')) {
    window.open(data.calendarUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  // Parse date and time: "2026-09-08" and "20:00"
  const [year, month, day] = data.date.split('-').map(Number);
  const [hours, minutes] = data.time.split(':').map(Number);

  // Format UTC dates for ICS: YYYYMMDDTHHmmSSZ
  const startDate = new Date(Date.UTC(year, month - 1, day, hours - 2, minutes)); // approximate UTC offset for Egypt UTC+2 or local
  const endDate = new Date(Date.UTC(year, month - 1, day, hours + 3, minutes));

  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  const formatDateToIcs = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const startFormatted = formatDateToIcs(startDate);
  const endFormatted = formatDateToIcs(endDate);
  const nowFormatted = formatDateToIcs(new Date());

  const eventTitle = `حفل زفاف ${data.groomArabic} و${data.brideArabic} | ${data.groomEnglish} & ${data.brideEnglish} Wedding`;
  const description = `يسعدنا ويشرفنا حضوركم لمشاركتنا فرحة ليلتنا المنتظرة.\nالمكان: ${data.venueName}\nالعنوان: ${data.venueAddress}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ahmed and Noor Wedding//Wedding Invitation//AR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wedding-${year}${month}${day}-${Date.now()}@ahmednoor.com`,
    `DTSTAMP:${nowFormatted}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${eventTitle}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${data.venueName}, ${data.venueAddress}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:تذكير: حفل زفاف أحمد ونور غداً',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:تذكير: حفل زفاف أحمد ونور بعد ساعتين',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Wedding-${data.groomEnglish}-${data.brideEnglish}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
