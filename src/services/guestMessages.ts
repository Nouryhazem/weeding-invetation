import { GuestMessageEntry } from '../types';

const STORAGE_KEY = 'wedding_ahmed_noor_guest_messages_persistent_v7';
const LAST_SUBMIT_KEY = 'wedding_ahmed_noor_last_submit_v7';

// The verified wish requested for Ahmed & Noor
export const SEED_GUEST_MESSAGE: GuestMessageEntry = {
  id: 'msg-seed-nour',
  name: 'Noury',
  message: 'My beautiful Nour, I love you so much! Wishing you a lifetime of love and happiness 🤍',
  timestamp: 1757361600000,
  approved: true,
  capsuleType: 'today',
};

export interface SendMessageResult {
  success: boolean;
  message?: string;
  entry?: GuestMessageEntry;
}

export class GuestMessageService {
  private static loadLocalMessages(): GuestMessageEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('wedding_ahmed_noor_guest_messages_persistent_v6');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove old 4 sample messages if they were cached previously
          const cleaned = parsed.filter(
            (m) =>
              m.id !== 'msg-1' &&
              m.id !== 'msg-2' &&
              m.id !== 'msg-3' &&
              m.id !== 'msg-4' &&
              m.name !== 'عائلة الجابري' &&
              m.name !== 'م. حسام وعائلته' &&
              m.name !== 'د. سارة وفارس' &&
              m.name !== 'أصدقاء العمر'
          ).map((m) => {
            if (m.id === 'msg-seed-nour') {
              return { ...m, name: 'Noury' };
            }
            return m;
          });
          if (cleaned.length > 0) {
            // Ensure the seed wish is always included
            if (!cleaned.some((m) => m.id === 'msg-seed-nour')) {
              cleaned.push(SEED_GUEST_MESSAGE);
            }
            return cleaned;
          }
        }
      }
    } catch {
      // ignore JSON parse errors
    }
    const defaults = [SEED_GUEST_MESSAGE];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    } catch {
      // ignore storage errors
    }
    return defaults;
  }

  private static saveLocalMessages(messages: GuestMessageEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      window.dispatchEvent(new Event('wedding-messages-updated'));
    } catch (err) {
      console.error('Failed to save messages locally', err);
    }
  }

  /**
   * Retrieves ONLY approved messages for public display on the website (synced with server)
   */
  static async getApprovedMessages(): Promise<GuestMessageEntry[]> {
    try {
      const response = await fetch('/api/messages?approved=true');
      if (response.ok) {
        const serverMsgs: GuestMessageEntry[] = await response.json();
        if (Array.isArray(serverMsgs) && serverMsgs.length > 0) {
          this.saveLocalMessages(serverMsgs);
          return serverMsgs.filter((m) => m.approved === true);
        }
      }
    } catch (err) {
      console.warn('Could not fetch messages from server, using local storage cache', err);
    }
    const local = this.loadLocalMessages();
    return local.filter((m) => m.approved === true);
  }

  /**
   * Retrieves ALL messages (pending + approved) for Admin moderation
   */
  static async getAllMessages(): Promise<GuestMessageEntry[]> {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const serverMsgs: GuestMessageEntry[] = await response.json();
        if (Array.isArray(serverMsgs) && serverMsgs.length > 0) {
          this.saveLocalMessages(serverMsgs);
          return serverMsgs;
        }
      }
    } catch (err) {
      console.warn('Could not fetch messages from server, using local storage cache', err);
    }
    return this.loadLocalMessages();
  }

  /**
   * Submits a guest message with capsule selection.
   * Auto-approved and synced across server and local storage.
   */
  static async submitMessage(
    name: string,
    message: string,
    capsuleType: 'today' | 'anniversary' = 'today'
  ): Promise<SendMessageResult> {
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    // Client-side validation
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
    if (now - lastSubmitTime < 4000) {
      return { success: false, message: 'برجاء الانتظار ثوانٍ قليلة قبل إرسال رسالة أخرى' };
    }

    const payload = {
      name: trimmedName,
      message: trimmedMessage,
      capsuleType,
    };

    let newEntry: GuestMessageEntry | null = null;

    // Try server persistence
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.entry) {
          newEntry = result.entry;
        }
      }
    } catch (err) {
      console.warn('Server message save encountered network error, falling back to local storage', err);
    }

    // Fallback if server is not reached
    if (!newEntry) {
      newEntry = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: trimmedName,
        message: trimmedMessage,
        timestamp: now,
        approved: true,
        capsuleType,
      };
    }

    // Update local cache
    const current = this.loadLocalMessages();
    const updated = [newEntry, ...current.filter((m) => m.id !== newEntry!.id)];
    this.saveLocalMessages(updated);
    sessionStorage.setItem(LAST_SUBMIT_KEY, String(now));

    return { success: true, entry: newEntry };
  }

  /**
   * Admin: Approve a message to make it visible to all visitors
   */
  static async approveMessage(id: string): Promise<boolean> {
    try {
      await fetch(`/api/messages/${id}/approve`, { method: 'PATCH' });
    } catch {
      // ignore
    }
    const all = this.loadLocalMessages();
    const target = all.find((m) => m.id === id);
    if (target) {
      target.approved = true;
      this.saveLocalMessages([...all]);
      return true;
    }
    return false;
  }

  /**
   * Admin: Hide an approved message without deleting
   */
  static async hideMessage(id: string): Promise<boolean> {
    try {
      await fetch(`/api/messages/${id}/hide`, { method: 'PATCH' });
    } catch {
      // ignore
    }
    const all = this.loadLocalMessages();
    const target = all.find((m) => m.id === id);
    if (target) {
      target.approved = false;
      this.saveLocalMessages([...all]);
      return true;
    }
    return false;
  }

  /**
   * Admin: Permanently delete a message
   */
  static async deleteMessage(id: string): Promise<boolean> {
    try {
      await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    const all = this.loadLocalMessages();
    const updated = all.filter((m) => m.id !== id);
    this.saveLocalMessages(updated);
    return true;
  }
}
