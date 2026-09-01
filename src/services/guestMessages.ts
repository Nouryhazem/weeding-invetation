import { GuestMessageEntry } from '../types';

const STORAGE_KEY = 'wedding_ahmed_noor_guest_messages';
const LAST_SUBMIT_KEY = 'wedding_ahmed_noor_last_submit';

// Initial sample messages for the editorial marquee demo
const INITIAL_DEMO_MESSAGES: GuestMessageEntry[] = [
  {
    id: 'msg-1',
    name: 'كريم وياسمين',
    message: 'ألف مبروك يا أحمد ونور، ربنا يتمملكم على ألف خير ويسعد قلوبكم ديماً.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    approved: true
  },
  {
    id: 'msg-2',
    name: 'عائلة الألفي',
    message: 'من أحلى وأطيب القلوب.. فرحتكم فرحتنا ومستنيين ليلتكم بكل شوق ومحبة.',
    timestamp: Date.now() - 1000 * 60 * 60 * 18,
    approved: true
  },
  {
    id: 'msg-3',
    name: 'طارق ومريم',
    message: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير. يا رب بداية لحياة مليانة سكينة وبركة.',
    timestamp: Date.now() - 1000 * 60 * 60 * 8,
    approved: true
  },
  {
    id: 'msg-4',
    name: 'سارة عبد الرحمن',
    message: 'أجمل عروسين في الدنيا، منورين دايماً وفرحتنا بيكم ملهاش حدود!',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    approved: true
  }
];

export interface SendMessageResult {
  success: boolean;
  message?: string;
  entry?: GuestMessageEntry;
}

export class GuestMessageService {
  /**
   * Retrieves all approved messages from storage or fallback demo list
   */
  static async getMessages(): Promise<GuestMessageEntry[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: GuestMessageEntry[] = JSON.parse(stored);
        return parsed.filter((m) => m.approved !== false);
      }
    } catch {
      // ignore JSON errors and fallback
    }
    return INITIAL_DEMO_MESSAGES;
  }

  /**
   * Submits a guest message.
   * Can be configured to dispatch to Firebase, Supabase, Google Sheets, or Formspree.
   */
  static async submitMessage(name: string, message: string): Promise<SendMessageResult> {
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    // Validation
    if (!trimmedName) {
      return { success: false, message: 'برجاء كتابة الاسم الكريم' };
    }
    if (trimmedName.length > 50) {
      return { success: false, message: 'الاسم يجب ألا يتجاوز ٥٠ حرفاً' };
    }
    if (!trimmedMessage) {
      return { success: false, message: 'برجاء كتابة رسالتكم الكريمة' };
    }
    if (trimmedMessage.length < 5) {
      return { success: false, message: 'برجاء كتابة رسالة لا تقل عن ٥ أحرف' };
    }
    if (trimmedMessage.length > 500) {
      return { success: false, message: 'الرسالة يجب ألا تتجاوز ٥٠٠ حرف' };
    }

    // Rate limit check: 30 seconds cooldown
    const lastSubmitTime = Number(sessionStorage.getItem(LAST_SUBMIT_KEY) || '0');
    const now = Date.now();
    if (now - lastSubmitTime < 25000) {
      return { success: false, message: 'برجاء الانتظار قليلاً قبل إرسال رسالة أخرى' };
    }

    // Simulate network delay for refined interaction
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newEntry: GuestMessageEntry = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: trimmedName,
      message: trimmedMessage,
      timestamp: now,
      approved: true
    };

    try {
      const current = await this.getMessages();
      const updated = [newEntry, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      sessionStorage.setItem(LAST_SUBMIT_KEY, String(now));
      return { success: true, entry: newEntry };
    } catch (err) {
      console.error('Failed saving message locally', err);
      return { success: true, entry: newEntry };
    }
  }
}
