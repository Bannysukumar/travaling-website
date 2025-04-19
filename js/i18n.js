// Internationalization System
class I18n {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = {};
        this.loadTranslations();
    }

    async loadTranslations() {
        try {
            const response = await fetch(`/translations/${this.currentLang}.json`);
            this.translations = await response.json();
            this.updatePageContent();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.loadTranslations();
    }

    translate(key) {
        return this.translations[key] || key;
    }

    updatePageContent() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });

        // Update all elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });

        // Update all elements with data-i18n-title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.translate(key);
        });
    }
}

// Initialize i18n
const i18n = new I18n();

// Language switcher
function switchLanguage(lang) {
    i18n.setLanguage(lang);
    // Update language switcher UI
    document.querySelectorAll('.lang-switch').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
} 