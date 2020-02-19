import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'nb',
    fallbackLng: {
      default: ['nb']
    },
    debug: false,
    ns: ['ui'],
    defaultNS: 'ui',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      wait: true,
      bindI18n: 'languageChange loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    }
  }, (err) => {
    if (err) return console.log('Loading i18n error', err)
    i18n.changeLanguage('nb')
  })

i18n.loadLanguages(['nb'], () => {})
i18n.language = 'nb'
document.documentElement.lang = 'nb'
export default i18n
