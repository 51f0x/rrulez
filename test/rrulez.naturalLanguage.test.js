import RRuleZ from "../src/rrulez";

describe("Natural Language Tests", () => {
  test("should parse natural language input correctly", () => {
    const rrule = new RRuleZ({ FREQ: "DAILY" }, "2023-10-01T00:00:00", "en");
    const parsedRule = rrule.fromNaturalLanguage(
      "daily at 10:00 AM for 5 occurrences",
    );
    expect(parsedRule).toEqual({ FREQ: "DAILY", INTERVAL: 1, COUNT: 5 });
  });

  test("should throw error for unsupported locale in natural language input", () => {
    const rrule = new RRuleZ({ FREQ: "DAILY" }, "2023-10-01T00:00:00", "jp");
    expect(() => {
      rrule.fromNaturalLanguage("毎日午前10時に5回の発生");
    }).toThrow("NLP is not fully supported for locale: jp");
  });
});
