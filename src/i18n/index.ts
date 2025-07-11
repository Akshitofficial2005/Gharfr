// Simple i18n implementation
const translations = {
  en: {
    search: 'Search',
    login: 'Login',
    register: 'Register',
    book_now: 'Book Now',
    home: 'Home',
    my_bookings: 'My Bookings',
    profile: 'Profile',
    booking_confirmed: 'Booking Confirmed!',
    payment_successful: 'Payment Successful'
  },
  hi: {
    search: 'खोजें',
    login: 'लॉगिन',
    register: 'रजिस्टर करें',
    book_now: 'अभी बुक करें',
    home: 'होम',
    my_bookings: 'मेरी बुकिंग',
    profile: 'प्रोफाइल',
    booking_confirmed: 'बुकिंग की पुष्टि हो गई!',
    payment_successful: 'भुगतान सफल'
  }
};

class I18n {
  private currentLanguage: string = 'en';

  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'en';
  }

  setLanguage(lang: string) {
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    window.location.reload();
  }

  t(key: string): string {
    const lang = translations[this.currentLanguage as keyof typeof translations];
    return lang[key as keyof typeof lang] || key;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }
}

export const i18n = new I18n();
export const useTranslation = () => ({ t: i18n.t.bind(i18n) });