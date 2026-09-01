import { GuestMessageEntry } from '../types';

const STORAGE_KEY = 'wedding_ahmed_noor_guest_messages_persistent_v5';
const LAST_SUBMIT_KEY = 'wedding_ahmed_noor_last_submit_v5';

// Initial verified sample messages for the editorial marquee
const INITIAL_DEMO_MESSAGES: GuestMessageEntry[] = [
  {
    id: 'msg-1',
    name: 'عائلة الجابري',
    message: 'ألف مبروك يا أحمد ونور، ربنا يتمملكم على ألف خير ويسعد قلوبكم دائماً.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    approved: true,
    capsuleType: 'today',
  },
  {
    id: 'msg-2',
    name: 'م. حسام وعائلته',
    message: 'من أحلى وأطيب القلوب.. فرحتكم فرحتنا ومستنيين ليلتكم بكل شوق ومحبة.',
    timestamp: Date.now() - 1000 * 60 * 60 * 18,
    approved: true,
    capsuleType: 'today',
  },
  {
    id: 'msg-3',
    name: 'د. سارة وفارس',
    message: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير. رسالة كتبناها لكم في كبسولة الزمن لتفتحوها بعد عام وأنتم في أتم صحة وسعادة.',
    timestamp: Date.now() - 1000 * 60 * 60 * 8,
    approved: true,
    capsuleType: 'anniversary',
  },
  {
    id: 'msg-4',
    name: 'أصدقاء العمر',
    message: 'أجمل عروسين في الدنيا، منورين دايماً وفرحتنا بيكم ملهاش حدود!',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    approved: true,
    capsuleType: 'today',
  },
];

export interface SendMessageResult {
  success: boolean;
  message?: string;
  entry?: GuestMessageEntry;
}

export class GuestMessageService {
  private static loadRawMessages(): GuestMessageEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore JSON errors
    }
    // initialize storage with demo approved messages
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_MESSAGES));
    } catch {
      // ignore
    }
    return INITIAL_DEMO_MESSAGES;
  }

  private static saveRawMessages(messages: GuestMessageEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      window.dispatchEvent(new Event('wedding-messages-updated'));
    } catch (err) {
      console.error('Failed to save messages', err);
    }
  }

  /**
   * Retrieves ONLY approved messages for public display on the website
   */
  static async getApprovedMessages(): Promise<GuestMessageEntry[]> {
    const all = this.loadRawMessages();
    return all.filter((m) => m.approved === true);
  }

  /**
   * Retrieves ALL messages (pending + approved) for Admin moderation
   */
  static async getAllMessages(): Promise<GuestMessageEntry[]> {
    return this.loadRawMessages();
  }

  /**
   * Submits a guest message with capsule selection.
   * Auto-approved so it is immediately saved and visible across refreshes,
   * while fully manageable via the Admin modal in the footer.
   */
  static async submitMessage(
    name: string,
    message: string,
    capsuleType: 'today' | 'anniversary' = 'today'
  ): Promise<SendMessageResult> {
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
    if (trimmedMessage.length < 3) {
      return { success: false, message: 'برجاء كتابة رسالة لا تقل عن ٣ أحرف' };
    }
    if (trimmedMessage.length > 500) {
      return { success: false, message: 'الرسالة يجب ألا تتجاوز ٥٠٠ حرف' };
    }

    // Rate limit check: 5 seconds cooldown
    const lastSubmitTime = Number(sessionStorage.getItem(LAST_SUBMIT_KEY) || '0');
    const now = Date.now();
    if (now - lastSubmitTime < 5000) {
      return { success: false, message: 'برجاء الانتظار ثوانٍ قليلة قبل إرسال رسالة أخرى' };
    }

    // Simulate smooth processing delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newEntry: GuestMessageEntry = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: trimmedName,
      message: trimmedMessage,
      timestamp: now,
      approved: true, // Saved and immediately available!
      capsuleType,
    };

    const current = this.loadRawMessages();
    const updated = [newEntry, ...current];
    this.saveRawMessages(updated);
    sessionStorage.setItem(LAST_SUBMIT_KEY, String(now));

    return { success: true, entry: newEntry };
  }

  /**
   * Admin: Approve a message to make it visible to all visitors
   */
  static async approveMessage(id: string): Promise<boolean> {
    const all = this.loadRawMessages();
    const target = all.find((m) => m.id === id);
    if (target) {
      target.approved = true;
      this.saveRawMessages([...all]);
      return true;
    }
    return false;
  }

  /**
   * Admin: Hide an approved message without deleting
   */
  static async hideMessage(id: string): Promise<boolean> {
    const all = this.loadRawMessages();
    const target = all.find((m) => m.id === id);
    if (target) {
      target.approved = false;
      this.saveRawMessages([...all]);
      return true;
    }
    return false;
  }

  /**
   * Admin: Permanently delete an unwanted message
   */
  static async deleteMessage(id: string): Promise<boolean> {
    const all = this.loadRawMessages();
    const updated = all.filter((m) => m.id !== id);
    this.saveRawMessages(updated);
    return true;
  }
}
