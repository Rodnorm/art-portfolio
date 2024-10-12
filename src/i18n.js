import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/en.json';
import translationPT from './locales/pt/pt.json';
import translationDE from './locales/de/de.json';

const resources = {
    en: {
        translation: translationEN,
    },
    pt: {
        translation: translationPT,
    },
    de: {
        translation: translationDE
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'pt', // idioma padrão
        fallbackLng: 'pt', // idioma de fallback
        interpolation: {
            escapeValue: false, // React já faz a proteção contra XSS
        },
    });

export default i18n;
