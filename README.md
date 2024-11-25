
# RRuleZ - Recurrence Rule Utility

`RRuleZ` is a robust JavaScript library for parsing, generating, and manipulating recurrence rules based on the iCalendar (RFC 5545) specification. It provides support for natural language processing (NLP) to convert human-readable recurrence patterns into rule objects, with multi-language support.

## Features

- **Recurrence Rule Parsing**: Convert recurrence rule strings into JavaScript objects.
- **Rule Generation**: Create recurrence rule strings from objects.
- **Date Generation**: Calculate all recurrence dates based on rules and start dates.
- **Natural Language Support**: Parse natural language inputs into recurrence rules.
- **Multi-Language Support**: Handles recurrence rules and NLP parsing in multiple languages (English, German, Spanish, French, Italian).
- **Validation**: Built-in validation for recurrence rules and error messages in multiple locales.

## Installation

```bash
npm install rrulez
```

## Usage

### Importing the Library

```javascript
import RRuleZ from 'rrulez';
```

### Initialize Recurrence Rule

```javascript
const rule = new RRuleZ(
  { FREQ: "WEEKLY", INTERVAL: 1, BYDAY: ["MO", "WE", "FR"] },
  "2024-01-01",
  "en"
);
```

### Parsing Natural Language Input

```javascript
const parsedRule = rule.fromNaturalLanguage("every 2 weeks on Monday and Friday at 10:00");
console.log(parsedRule);
// Output: { FREQ: 'WEEKLY', INTERVAL: 2, BYDAY: ['MO', 'FR'], DTSTART: '2024-01-01T10:00:00.000Z' }
```

### Generating Recurrence Dates

```javascript
const dates = rule.getAllDates();
console.log(dates);
// Output: ['2024-01-01T10:00:00.000Z', '2024-01-03T10:00:00.000Z', ...]
```

### Parsing a Recurrence Rule String

```javascript
const parsed = RRuleZ.parseString("FREQ=DAILY;INTERVAL=1;UNTIL=2024-12-31");
console.log(parsed);
// Output: { FREQ: 'DAILY', INTERVAL: 1, UNTIL: DateTime }
```

### Generating a Recurrence Rule String

```javascript
const ruleString = RRuleZ.generate({
  FREQ: "MONTHLY",
  INTERVAL: 1,
  BYMONTHDAY: [1, 15],
});
console.log(ruleString);
// Output: FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=1,15
```

## Multi-Language Support

`RRuleZ` supports the following languages:
- English (en)
- German (de)
- Spanish (es)
- French (fr)
- Italian (it)

The language can be set during initialization:

```javascript
const rule = new RRuleZ({ FREQ: "DAILY" }, "2024-01-01", "de");
```

### Error Messages in Locale

Localized error messages are automatically used based on the configured language.

## Natural Language Parsing

`RRuleZ` supports basic natural language input parsing for recurrence rules in supported languages.

#### Supported Natural Language Inputs:
- Frequencies (e.g., daily, weekly, monthly)
- Days of the week
- Keywords (`every`, `at`, `for`)

#### Example:
```javascript
const rule = new RRuleZ();
const parsed = rule.fromNaturalLanguage("ogni 2 settimane il lunedì e venerdì alle 10:00");
console.log(parsed);
// Output: { FREQ: 'WEEKLY', INTERVAL: 2, BYDAY: ['MO', 'FR'], DTSTART: '2024-01-01T10:00:00.000Z' }
```

## Validation

- Automatically validates the recurrence rule.
- Ensures that `UNTIL` and `COUNT` are not specified simultaneously.
- Validates the presence of required fields like `FREQ`.

## Dependencies

- [Luxon](https://moment.github.io/luxon/) - Date and time manipulation.
- [i18next](https://www.i18next.com/) - Internationalization framework.
- [Compromise](https://compromise.cool/) - Natural language processing.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

Start using `RRuleZ` for your recurrence rule needs and simplify the way you manage complex schedules and events!
