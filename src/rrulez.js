import { DateTime } from "luxon";
import i18next from "i18next";
import nlp from "compromise";

// Initialize i18n
i18next.init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        FREQ_REQUIRED: "FREQ is required in a recurrence rule.",
        UNTIL_COUNT_ERROR: "UNTIL and COUNT cannot both be specified.",
        INVALID_RULE_PART: "Invalid recurrence rule part: {{part}}",
        UNKNOWN_RULE_KEY: "Unknown recurrence rule key: {{key}}",
        DTSTART_REQUIRED: "DTSTART is required to generate dates.",
        UNSUPPORTED_FREQ: "Unsupported FREQ: {{freq}}",

        INVALID_NLP: "Cannot parse the natural language input: {{input}}",
        NLP_UNSUPPORTED_LOCALE:
          "NLP is not fully supported for locale: {{locale}}",
      },
    },
    // Add other languages (de, es, fr, it) as needed
    de: {
      translation: {
        FREQ_REQUIRED: "FREQ ist erforderlich in einer Wiederholungsregel.",
        UNTIL_COUNT_ERROR:
          "UNTIL und COUNT können nicht gleichzeitig angegeben werden.",
        INVALID_RULE_PART: "Ungültige Wiederholungsregel-Teil: {{part}}",
        UNKNOWN_RULE_KEY: "Unbekannte Wiederholungsregel-Teil: {{key}}",
        DTSTART_REQUIRED: "DTSTART ist erforderlich, um Daten zu generieren.",
        UNSUPPORTED_FREQ: "Nicht unterstützte FREQ: {{freq}}",

        INVALID_NLP:
          "Eingabe in natürlicher Sprache konnte nicht analysiert werden: {{input}}",
        NLP_UNSUPPORTED_LOCALE:
          "NLP wird für die Sprache {{locale}} nicht vollständig unterstützt.",
      },
    },
    es: {
      translation: {
        FREQ_REQUIRED: "FREQ es requerido en una regla de repetición.",
        UNTIL_COUNT_ERROR:
          "UNTIL y COUNT no pueden especificarse simultáneamente.",
        INVALID_RULE_PART: "Parte de la regla de repetición inválida: {{part}}",
        UNKNOWN_RULE_KEY:
          "Clave de la regla de repetición desconocida: {{key}}",
        DTSTART_REQUIRED: "DTSTART es necesario para generar fechas.",
        UNSUPPORTED_FREQ: "FREQ no soportada: {{freq}}",

        INVALID_NLP:
          "No se pudo analizar la entrada en lenguaje natural: {{input}}",
        NLP_UNSUPPORTED_LOCALE:
          "NLP no está completamente soportado para el idioma {{locale}}.",
      },
    },
    fr: {
      translation: {
        FREQ_REQUIRED: "FREQ est requis pour une règle de récurrence.",
        UNTIL_COUNT_ERROR:
          "UNTIL et COUNT ne peuvent pas être spécifiés simultanément.",
        INVALID_RULE_PART:
          "Partie de la règle de récurrence invalide: {{part}}",
        UNKNOWN_RULE_KEY: "Clé de la règle de récurrence inconnue: {{key}}",
        DTSTART_REQUIRED: "DTSTART est nécessaire pour générer des dates.",
        UNSUPPORTED_FREQ: "FREQ non supportée: {{freq}}",

        INVALID_NLP:
          "Impossible d'analyser l'entrée en langue naturelle: {{input}}",
        NLP_UNSUPPORTED_LOCALE:
          "NLP n'est pas entièrement pris en charge pour la langue {{locale}}.",
      },
    },
    it: {
      translation: {
        FREQ_REQUIRED: "FREQ è richiesto in una regola di ripetizione.",
        UNTIL_COUNT_ERROR:
          "UNTIL e COUNT non possono essere specificati contemporaneamente.",
        INVALID_RULE_PART:
          "Parte della regola di ripetizione non valida: {{part}}",
        UNKNOWN_RULE_KEY:
          "Chiave della regola di ripetizione sconosciuta: {{key}}",
        DTSTART_REQUIRED: "DTSTART è necessario per generare date.",
        UNSUPPORTED_FREQ: "FREQ non supportata: {{freq}}",

        INVALID_NLP:
          "Impossibile analizzare l'input in lingua naturale: {{input}}",
        NLP_UNSUPPORTED_LOCALE:
          "NLP non è completamente supportato per la lingua {{locale}}.",
      },
    },
  },
});

class RRuleZ {
  constructor(parsedRule, startDate, locale = "en") {
    if (parsedRule && !parsedRule.FREQ) {
      throw new Error(i18next.t("FREQ_REQUIRED"));
    }
    if (parsedRule && !parsedRule.INTERVAL) {
      parsedRule.INTERVAL = 1;
    }
    if (parsedRule && parsedRule.UNTIL) {
      parsedRule.UNTIL = DateTime.fromISO(parsedRule.UNTIL);
    }
    this.parsedRule = parsedRule || {}; // Parsed recurrence rule

    this.dtStart = startDate ? DateTime.fromISO(startDate) : null; // Start date
    this.locale = locale; // Language/locale
    i18next.changeLanguage(locale); // Set the desired language
  }

  /**
   * Parse natural language into a parsedRule object
   * @param {string} input - Natural language input
   * @returns {Object} Parsed recurrence rule
   */
  fromNaturalLanguage(input) {
    const lang = this.locale;

    // Mapping for supported languages
    const mappings = {
      en: {
        frequencies: {
          daily: "DAILY",
          weekly: "WEEKLY",
          monthly: "MONTHLY",
          yearly: "YEARLY",
        },
        days: {
          monday: "MO",
          tuesday: "TU",
          wednesday: "WE",
          thursday: "TH",
          friday: "FR",
          saturday: "SA",
          sunday: "SU",
        },
        keywords: { every: "every", at: "at", for: "for" },
      },
      de: {
        frequencies: {
          täglich: "DAILY",
          wöchentlich: "WEEKLY",
          monatlich: "MONTHLY",
          jährlich: "YEARLY",
        },
        days: {
          montag: "MO",
          dienstag: "TU",
          mittwoch: "WE",
          donnerstag: "TH",
          freitag: "FR",
          samstag: "SA",
          sonntag: "SU",
        },
        keywords: { every: "alle", at: "um", for: "für" }, // Hinzugefügt
      },
      es: {
        frequencies: {
          diario: "DAILY",
          semanal: "WEEKLY",
          mensual: "MONTHLY",
          anual: "YEARLY",
        },
        days: {
          lunes: "MO",
          martes: "TU",
          miércoles: "WE",
          jueves: "TH",
          viernes: "FR",
          sábado: "SA",
          domingo: "SU",
        },
        keywords: { every: "cada", at: "a", for: "durante" },
      },
      fr: {
        frequencies: {
          quotidien: "DAILY",
          hebdomadaire: "WEEKLY",
          mensuel: "MONTHLY",
          annuel: "YEARLY",
        },
        days: {
          lundi: "MO",
          mardi: "TU",
          mercredi: "WE",
          jeudi: "TH",
          vendredi: "FR",
          samedi: "SA",
          dimanche: "SU",
        },
        keywords: { every: "chaque", at: "à", for: "pour" },
      },
      it: {
        frequencies: {
          giornaliero: "DAILY",
          settimanale: "WEEKLY",
          mensile: "MONTHLY",
          annuale: "YEARLY",
        },
        days: {
          lunedì: "MO",
          martedì: "TU",
          mercoledì: "WE",
          giovedì: "TH",
          venerdì: "FR",
          sabato: "SA",
          domenica: "SU",
        },
        keywords: { every: "ogni", at: "alle", for: "per" },
      },
    };

    const mapping = mappings[lang];
    if (!mapping) {
      throw new Error(i18next.t("NLP_UNSUPPORTED_LOCALE", { locale: lang }));
    }

    const words = input.toLowerCase().split(/\s+/);

    // Frequenz
    const freq = Object.keys(mapping.frequencies).find((key) =>
      words.includes(key),
    );
    if (!freq) {
      throw new Error(i18next.t("INVALID_NLP", { input }));
    }
    const frequency = mapping.frequencies[freq];

    // Intervall
    const everyIndex = words.indexOf(mapping.keywords.every);
    const interval =
      everyIndex > -1 ? parseInt(words[everyIndex + 1], 10) || 1 : 1;

    // Wochentage
    const days = Object.keys(mapping.days)
      .filter((day) => words.includes(day))
      .map((day) => mapping.days[day]);

    // Anzahl
    const forIndex = words.indexOf(mapping.keywords.for);
    const count =
      forIndex > -1 ? parseInt(words[forIndex + 1], 10) || null : null;

    // Uhrzeit
    const atIndex = words.indexOf(mapping.keywords.at);
    const time = atIndex > -1 ? words[atIndex + 1] : null;

    // Erstelle die geparste Regel
    const parsedRule = { FREQ: frequency, INTERVAL: interval };
    if (days.length > 0) parsedRule.BYDAY = days;
    if (count) parsedRule.COUNT = count;

    // Setze DTSTART mit Uhrzeit, falls verfügbar
    if (!this.dtStart) {
      this.dtStart = DateTime.now().set({ hour: 0, minute: 0, second: 0 });
      if (time) {
        const [hour, minute] = time.split(":").map(Number);
        if (!isNaN(hour) && !isNaN(minute)) {
          this.dtStart = this.dtStart.set({ hour, minute });
        } else {
          throw new Error(i18next.t("INVALID_NLP", { input }));
        }
      }
    }

    this.parsedRule = parsedRule;
    return parsedRule;
  }

  /**
   * Static method to parse a recurrence rule string into an object
   * @param {string} rule - Recurrence rule string
   * @returns {Object} Parsed recurrence rule
   */
  static parseString(rule) {
    if (!rule) {
      throw new Error(i18next.t("FREQ_REQUIRED"));
    }

    const parts = rule.split(";");
    const parsed = {};

    parts.forEach((part) => {
      const [key, value] = part.split("=");
      if (!key || !value) {
        throw new Error(i18next.t("INVALID_RULE_PART", { part }));
      }
      parsed[key] = this.parseValue(key, value);
    });

    if (!parsed.FREQ) {
      throw new Error(i18next.t("FREQ_REQUIRED"));
    }

    // Überprüfung, ob sowohl UNTIL als auch COUNT vorhanden sind
    if (parsed.UNTIL && parsed.COUNT) {
      throw new Error(i18next.t("UNTIL_COUNT_ERROR"));
    }
    if (!parsed.INTERVAL) {
      parsed.INTERVAL = 1;
    }

    return parsed;
  }

  /**
   * Helper to parse specific rule part values
   * @param {string} key - The rule part key
   * @param {string} value - The rule part value
   * @returns {any} Parsed value
   */
  static parseValue(key, value) {
    switch (key) {
      case "FREQ":
        return value;
      case "UNTIL":
        return DateTime.fromISO(value);
      case "COUNT":
      case "INTERVAL":
        return parseInt(value, 10);
      case "BYSECOND":
      case "BYMINUTE":
      case "BYHOUR":
      case "BYDAY":
      case "BYMONTHDAY":
      case "BYYEARDAY":
      case "BYWEEKNO":
      case "BYMONTH":
      case "BYSETPOS":
        return value
          .split(",")
          .map((v) => (isNaN(Number(v)) ? v : parseInt(v, 10)));
      case "WKST":
        return value; // Workweek start
      default:
        throw new Error(i18next.t("UNKNOWN_RULE_KEY", { key }));
    }
  }

  /**
   * Generate all recurrence dates based on the parsed rule and DTSTART
   * @returns {Array<string>} List of ISO date strings
   */
  getAllDates() {
    if (!this.dtStart) {
      throw new Error(i18next.t("DTSTART_REQUIRED"));
    }

    const {
      FREQ,
      INTERVAL,
      UNTIL,
      COUNT,
      BYDAY,
      BYMONTH,
      BYMONTHDAY,
      BYYEARDAY,
      BYWEEKNO,
      BYSETPOS,
      WKST,
    } = this.parsedRule;

    let occurrences = [];
    let currentDate = this.dtStart;
    let occurrencesCount = 0;

    while (true) {
      if (UNTIL && currentDate > UNTIL) break;
      if (COUNT && occurrences.length >= COUNT) break;
      if (occurrencesCount >= 36 * 1000) {
        throw new Error(
          `Too many occurrences for this rule ${RRuleZ.generate(this.parsedRule)}`,
        );
      }

      occurrences.push(currentDate);
      occurrencesCount++;

      // Increment based on FREQ
      switch (FREQ) {
        case "SECONDLY":
          currentDate = currentDate.plus({ seconds: INTERVAL });
          break;
        case "MINUTELY":
          currentDate = currentDate.plus({ minutes: INTERVAL });
          break;
        case "HOURLY":
          currentDate = currentDate.plus({ hours: INTERVAL });
          break;
        case "DAILY":
          currentDate = currentDate.plus({ days: INTERVAL });

          occurrences = this.filterByDay(occurrences, BYDAY);
          occurrences = this.filterByMonth(occurrences, BYMONTH);
          occurrences = this.filterByMonthDay(occurrences, BYMONTHDAY);
          occurrences = this.filterByYearDay(occurrences, BYYEARDAY);
          occurrences = this.filterByWeekNo(occurrences, BYWEEKNO);
          break;
        case "WEEKLY":
          if (
            BYDAY ||
            BYWEEKNO ||
            BYSETPOS ||
            BYMONTH ||
            BYMONTHDAY ||
            BYYEARDAY
          ) {
            for (let i = 0; i < INTERVAL * 7 - 1; i++) {
              currentDate = currentDate.plus({ days: 1 });
              occurrences.push(currentDate);
            }
            currentDate = currentDate.minus({ days: 1 });
          } else {
            currentDate = currentDate.plus({ days: INTERVAL * 7 });
          }

          occurrences = this.filterByDay(occurrences, BYDAY);
          occurrences = this.filterByMonth(occurrences, BYMONTH);
          occurrences = this.filterByMonthDay(occurrences, BYMONTHDAY);
          occurrences = this.filterByYearDay(occurrences, BYYEARDAY);
          occurrences = this.filterByWeekNo(occurrences, BYWEEKNO);
          break;
        case "MONTHLY":
          if (
            BYDAY ||
            BYWEEKNO ||
            BYSETPOS ||
            BYMONTH ||
            BYMONTHDAY ||
            BYYEARDAY
          ) {
            for (let i = 0; i < INTERVAL * 30 - 1; i++) {
              currentDate = currentDate.plus({ days: 1 });
              occurrences.push(currentDate);
            }
            currentDate = currentDate.minus({ days: 1 });
          } else {
            currentDate = currentDate.plus({ months: INTERVAL });
          }

          occurrences = this.filterByDay(occurrences, BYDAY);
          occurrences = this.filterByMonth(occurrences, BYMONTH);
          occurrences = this.filterByMonthDay(occurrences, BYMONTHDAY);
          occurrences = this.filterByYearDay(occurrences, BYYEARDAY);
          occurrences = this.filterByWeekNo(occurrences, BYWEEKNO);
          break;
        case "YEARLY":
          if (
            BYDAY ||
            BYWEEKNO ||
            BYSETPOS ||
            BYMONTH ||
            BYMONTHDAY ||
            BYYEARDAY
          ) {
            //TODO make sure we have always the right numbers of "day in year"
            for (let i = 0; i < INTERVAL * 365 - 1; i++) {
              currentDate = currentDate.plus({ days: 1 });
              occurrences.push(currentDate);
            }
            currentDate = currentDate.minus({ days: 1 });
          } else {
            //TODO make sure we have always the right numbers of "day in year"
            currentDate = currentDate.plus({ years: INTERVAL });
          }
          occurrences = this.filterByDay(occurrences, BYDAY);
          occurrences = this.filterByMonth(occurrences, BYMONTH);
          occurrences = this.filterByMonthDay(occurrences, BYMONTHDAY);
          occurrences = this.filterByYearDay(occurrences, BYYEARDAY);
          occurrences = this.filterByWeekNo(occurrences, BYWEEKNO);
          break;
        default:
          throw new Error(i18next.t("UNSUPPORTED_FREQ", { freq: FREQ }));
      }
    }

    // Limit the number of occurrences
    occurrences = occurrences.slice(0, COUNT);

    // Apply BYSETPOS
    if (BYSETPOS) {
      occurrences = BYSETPOS.map((pos) => {
        if (pos > 0) return occurrences[pos - 1];
        else return occurrences[occurrences.length + pos];
      }).filter(Boolean);
    }

    return occurrences.map((date) => date.toISO());
  }

  /**
   * Filters occurrences by BYDAY rule
   */
  filterByDay(occurrences, BYDAY) {
    if (!BYDAY) return occurrences;
    return occurrences.filter((date) => {
      const dayCode = date.toFormat("ccc").toUpperCase().slice(0, 2);
      return BYDAY.includes(dayCode);
    });
  }

  /**
   * Filters occurrences by BYMONTH rule
   */
  filterByMonth(occurrences, BYMONTH) {
    if (!BYMONTH) return occurrences;
    return occurrences.filter((date) => BYMONTH.includes(date.month));
  }

  /**
   * Filters occurrences by BYMONTHDAY rule
   */
  filterByMonthDay(occurrences, BYMONTHDAY) {
    if (!BYMONTHDAY) return occurrences;
    return occurrences.filter(
      (date) => BYMONTHDAY.includes(date.day) || BYMONTHDAY.includes(-date.day),
    );
  }

  /**
   * Filters occurrences by BYYEARDAY rule
   */
  filterByYearDay(occurrences, BYYEARDAY) {
    if (!BYYEARDAY) return occurrences;
    return occurrences.filter((date) => {
      const dayOfYear = date.ordinal;
      return BYYEARDAY.includes(dayOfYear) || BYYEARDAY.includes(-dayOfYear);
    });
  }

  /**
   * Filters occurrences by BYWEEKNO rule
   */
  filterByWeekNo(occurrences, BYWEEKNO) {
    if (!BYWEEKNO) return occurrences;
    const weekStart = this.parsedRule.WKST || "MO";
    return occurrences.filter((date) => {
      const weekNumber = Math.ceil(date.ordinal / 7);
      return BYWEEKNO.includes(weekNumber) || BYWEEKNO.includes(-weekNumber);
    });
  }

  /**
   * Generate a recurrence rule string from an object
   * @param {Object} ruleObj - Recurrence rule object
   * @returns {string} Recurrence rule string
   */
  static generate(ruleObj) {
    if (!ruleObj.FREQ) {
      throw new Error(i18next.t("FREQ_REQUIRED"));
    }

    return Object.entries(ruleObj)
      .map(
        ([key, value]) =>
          `${key}=${Array.isArray(value) ? value.join(",") : value}`,
      )
      .join(";");
  }
}

export default RRuleZ;
