import RRuleZ from "../src/rrulez";
import { DateTime } from "luxon";

describe("RRuleZ", () => {
  test("should throw error if FREQ is missing in parseString", () => {
    expect(() => {
      RRuleZ.parseString("");
    }).toThrow("FREQ is required in a recurrence rule.");
  });

  test("should parse a valid recurrence rule string", () => {
    const rule = "FREQ=DAILY;INTERVAL=2";
    const parsed = RRuleZ.parseString(rule);
    expect(parsed).toEqual({ FREQ: "DAILY", INTERVAL: 2 });
  });

  test("should throw error for unknown rule key", () => {
    const rule = "FREQ=DAILY;UNKNOWN=VALUE";
    expect(() => {
      RRuleZ.parseString(rule);
    }).toThrow("Unknown recurrence rule key: UNKNOWN");
  });

  test("should generate a recurrence rule string from an object", () => {
    const ruleObj = { FREQ: "WEEKLY", INTERVAL: 1, BYDAY: ["MO", "WE", "FR"] };
    const ruleString = RRuleZ.generate(ruleObj);
    expect(ruleString).toBe("FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR");
  });

  test("should generate all dates for a simple daily rule", () => {
    const rrule = new RRuleZ({
      parsedRule: { FREQ: "DAILY", INTERVAL: 1, COUNT: 3 },
      dtStart: "2023-10-01T00:00:00",
    });
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2023-10-01T00:00:00.000+00:00",
      "2023-10-02T00:00:00.000+00:00",
      "2023-10-03T00:00:00.000+00:00",
    ]);
  });

  test("should throw error if DTSTART is missing in getAllDates", () => {
    const rrule = new RRuleZ({ parsedRule: { FREQ: "DAILY" } });
    expect(() => {
      rrule.getAllDates();
    }).toThrow("DTSTART is required to generate dates.");
  });

  test("should throw error for invalid natural language input", () => {
    const rrule = new RRuleZ({ locale: "cn" });
    expect(() => {
      rrule.fromNaturalLanguage("invalid input");
    }).toThrow("NLP is not fully supported for locale: cn");
  });

  test("should throw error for invalid rule part in parseValue", () => {
    expect(() => {
      RRuleZ.parseValue("INVALID", "value");
    }).toThrow("Unknown recurrence rule key: INVALID");
  });

  test("should throw error if UNTIL and COUNT are both specified", () => {
    const rule = "FREQ=DAILY;UNTIL=2023-12-31;COUNT=10";
    expect(() => {
      RRuleZ.parseString(rule);
    }).toThrow("UNTIL and COUNT cannot both be specified.");
  });

  test("should throw error for unsupported frequency", () => {
    const rrule = new RRuleZ({
      parsedRule: { FREQ: "UNKNOWN" },
      dtStart: "2023-10-01T00:00:00",
    });
    expect(() => {
      rrule.getAllDates();
    }).toThrow("Unsupported FREQ: UNKNOWN");
  });

  test("should throw error for invalid rule part", () => {
    const rule = "FREQ=DAILY;INVALID=VALUE";
    expect(() => {
      RRuleZ.parseString(rule);
    }).toThrow("Unknown recurrence rule key: INVALID");
  });

  test("should throw error if FREQ is missing in generate", () => {
    const ruleObj = { INTERVAL: 1 };
    expect(() => {
      RRuleZ.generate(ruleObj);
    }).toThrow("FREQ is required in a recurrence rule.");
  });

  test("should parse natural language input correctly", () => {
    const rrule = new RRuleZ({ locale: "en" });
    const parsedRule = rrule.fromNaturalLanguage(
      "daily at 10:00 AM for 5 occurrences",
    );
    expect(parsedRule).toEqual({ FREQ: "DAILY", INTERVAL: 1, COUNT: 5 });
  });

  test("should parse natural language input correctly", () => {
    const rrule = new RRuleZ({ locale: "de" });
    const parsedRule = rrule.fromNaturalLanguage(
      "wöchentlich alle Montag und Freitag um 9:00 Uhr für 5 Vorkommen",
    );
    expect(parsedRule).toEqual({
      FREQ: "WEEKLY",
      INTERVAL: 1,
      BYDAY: ["MO", "FR"],
      COUNT: 5,
    });
  });

  test("should throw error for invalid natural language input", () => {
    const rrule = new RRuleZ({ locale: "en" });
    expect(() => {
      rrule.fromNaturalLanguage("invalid input");
    }).toThrow("Cannot parse the natural language input: invalid input");
  });

  test("should handle unsupported frequency", () => {
    const rrule = new RRuleZ({
      parsedRule: { FREQ: "UNKNOWN" },
      dtStart: "2023-10-01T00:00:00",
    });
    expect(() => {
      rrule.getAllDates();
    }).toThrow("Unsupported FREQ: UNKNOWN");
  });

  test("should parse and handle all rule parts", () => {
    const rule =
      "FREQ=DAILY;UNTIL=2023-12-31;INTERVAL=2;BYDAY=MO,TU;BYMONTH=1,2";
    const parsed = RRuleZ.parseString(rule);
    expect(parsed).toEqual({
      FREQ: "DAILY",
      UNTIL: DateTime.fromISO("2023-12-31"),
      INTERVAL: 2,
      BYDAY: ["MO", "TU"],
      BYMONTH: [1, 2],
    });
  });

  test("should parse and handle all rule parts", () => {
    const rule = "FREQ=DAILY;COUNT=10;INTERVAL=2;BYDAY=MO,TU;BYMONTH=1,2";
    const parsed = RRuleZ.parseString(rule);
    expect(parsed).toEqual({
      FREQ: "DAILY",
      COUNT: 10,
      INTERVAL: 2,
      BYDAY: ["MO", "TU"],
      BYMONTH: [1, 2],
    });
  });

  test("should handle all frequency increments", () => {
    const frequencies = [
      "SECONDLY",
      "MINUTELY",
      "HOURLY",
      "DAILY",
      "WEEKLY",
      "MONTHLY",
      "YEARLY",
    ];
    frequencies.forEach((freq) => {
      const rrule = new RRuleZ({
        parsedRule: { FREQ: freq, INTERVAL: 1, COUNT: 1 },
        dtStart: "2023-10-01T00:00:00",
      });
      const dates = rrule.getAllDates();
      expect(dates.length).toBe(1);
    });
  });

  test("should throw error for invalid rule part in parseValue", () => {
    expect(() => {
      RRuleZ.parseValue("INVALID", "value");
    }).toThrow("Unknown recurrence rule key: INVALID");
  });

  test("should parse natural language input in French", () => {
    const rrule = new RRuleZ({ locale: "fr" });
    const parsedRule = rrule.fromNaturalLanguage(
      "quotidien à 10:00 AM pour 5 occurrences",
    );
    expect(parsedRule).toEqual({ FREQ: "DAILY", INTERVAL: 1, COUNT: 5 });
  });

  test("should generate a complex recurrence rule string from an object", () => {
    const ruleObj = {
      FREQ: "MONTHLY",
      INTERVAL: 1,
      BYDAY: ["MO", "WE"],
      BYMONTH: [1, 2],
    };
    const ruleString = RRuleZ.generate(ruleObj);
    expect(ruleString).toBe("FREQ=MONTHLY;INTERVAL=1;BYDAY=MO,WE;BYMONTH=1,2");
  });

  test("should generate all dates with BYDAY filter", () => {
    const rrule = new RRuleZ({
      parsedRule: { FREQ: "WEEKLY", COUNT: 3, BYDAY: ["MO", "WE"] },
      dtStart: "2024-11-24T00:00:00",
    });
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2024-11-25T00:00:00.000+00:00",
      "2024-11-27T00:00:00.000+00:00",
      "2024-12-02T00:00:00.000+00:00",
    ]);
  });

  test("should generate all dates with BYMONTH filter", () => {
    const rrule = new RRuleZ({
      parsedRule: { FREQ: "DAILY", INTERVAL: 1, COUNT: 3, BYMONTH: [10] },
      dtStart: "2023-10-01T00:00:00",
    });
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2023-10-01T00:00:00.000+00:00",
      "2023-10-02T00:00:00.000+00:00",
      "2023-10-03T00:00:00.000+00:00",
    ]);
  });

  test("should generate all dates with BYMONTHDAY filter", () => {
    const rrule = new RRuleZ({
      parsedRule: {
        FREQ: "MONTHLY",
        INTERVAL: 1,
        COUNT: 3,
        BYMONTHDAY: [1, 15],
      },
      dtStart: "2023-10-01T00:00:00",
    });
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2023-10-01T00:00:00.000+00:00",
      "2023-10-15T00:00:00.000+00:00",
      "2023-11-01T00:00:00.000+00:00",
    ]);
  });

  test("should throw error for unsupported locale in natural language input", () => {
    const rrule = new RRuleZ({ locale: "jp" });
    expect(() => {
      rrule.fromNaturalLanguage("毎日午前10時に5回の発生");
    }).toThrow("NLP is not fully supported for locale: jp");
  });

  test("should apply BYSETPOS correctly", () => {
    const rrule = new RRuleZ({
      parsedRule: { FREQ: "DAILY", INTERVAL: 1, COUNT: 10, BYSETPOS: [1, -1] },
      dtStart: "2023-10-01T00:00:00",
    });
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2023-10-01T00:00:00.000+00:00",
      "2023-10-10T00:00:00.000+00:00",
    ]);
  });

  test("should handle WKST correctly", () => {
    const rrule = new RRuleZ({
      parsedRule: { FREQ: "WEEKLY", INTERVAL: 1, COUNT: 3, WKST: "SU" },
      dtStart: "2023-10-01T00:00:00",
    });
    const dates = rrule.getAllDates();
    expect(dates.length).toBe(3);
  });

  test("should filter by BYYEARDAY correctly", () => {
    const rrule = new RRuleZ({
      parsedRule: {
        FREQ: "YEARLY",
        INTERVAL: 1,
        COUNT: 3,
        BYYEARDAY: [1, 365],
      },
      dtStart: "2023-01-01T00:00:00",
    });
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2023-01-01T00:00:00.000+00:00",
      "2023-12-31T00:00:00.000+00:00",
      "2024-01-01T00:00:00.000+00:00",
    ]);
  });

  test("should filter by BYWEEKNO correctly", () => {
    const rrule = new RRuleZ({
      parsedRule: { FREQ: "YEARLY", INTERVAL: 1, COUNT: 3, BYWEEKNO: [1, 52] },
      dtStart: "2023-01-01T00:00:00",
    });
    const dates = rrule.getAllDates();
    expect(dates.length).toBeGreaterThan(0);
  });

  test("should throw error for unknown rule key in parseValue", () => {
    expect(() => {
      RRuleZ.parseValue("UNKNOWN", "value");
    }).toThrow("Unknown recurrence rule key: UNKNOWN");
  });

  test("should filter occurrences by BYDAY", () => {
    const rrule = new RRuleZ({
      parsedRule: { FREQ: "DAILY", INTERVAL: 1, COUNT: 7, BYDAY: ["MO", "WE"] },
      dtStart: "2023-10-01T00:00:00",
    });
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2023-10-02T00:00:00.000+00:00",
      "2023-10-04T00:00:00.000+00:00",
      "2023-10-09T00:00:00.000+00:00",
      "2023-10-11T00:00:00.000+00:00",
      "2023-10-16T00:00:00.000+00:00",
      "2023-10-18T00:00:00.000+00:00",
      "2023-10-23T00:00:00.000+00:00",
    ]);
  });

  test("should filter occurrences by BYMONTH", () => {
    const rrule = new RRuleZ({
      parsedRule: { FREQ: "DAILY", INTERVAL: 1, COUNT: 31, BYMONTH: [10] },
      dtStart: "2023-09-30T00:00:00",
    });
    const dates = rrule.getAllDates();
    expect(dates.every((date) => date.startsWith("2023-10"))).toBe(true);
  });

  test("should throw error if FREQ is missing in generate", () => {
    const ruleObj = { INTERVAL: 1 };
    expect(() => {
      RRuleZ.generate(ruleObj);
    }).toThrow("FREQ is required in a recurrence rule.");
  });

  test("pattern test", () => {
    const parsedRule = RRuleZ.parseString(
      "FREQ=WEEKLY;COUNT=20;WKST=MO;BYDAY=MO,WE;BYMONTH=3,9",
    );
    const rrule = new RRuleZ({ parsedRule, dtStart: "2024-11-24T00:00:00" });
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2025-03-03T00:00:00.000+00:00",
      "2025-03-05T00:00:00.000+00:00",
      "2025-03-10T00:00:00.000+00:00",
      "2025-03-12T00:00:00.000+00:00",
      "2025-03-17T00:00:00.000+00:00",
      "2025-03-19T00:00:00.000+00:00",
      "2025-03-24T00:00:00.000+00:00",
      "2025-03-26T00:00:00.000+00:00",
      "2025-03-31T00:00:00.000+00:00",
      "2025-09-01T00:00:00.000+00:00",
      "2025-09-03T00:00:00.000+00:00",
      "2025-09-08T00:00:00.000+00:00",
      "2025-09-10T00:00:00.000+00:00",
      "2025-09-15T00:00:00.000+00:00",
      "2025-09-17T00:00:00.000+00:00",
      "2025-09-22T00:00:00.000+00:00",
      "2025-09-24T00:00:00.000+00:00",
      "2025-09-29T00:00:00.000+00:00",
      "2026-03-02T00:00:00.000+00:00",
      "2026-03-04T00:00:00.000+00:00",
    ]);
  });
});
