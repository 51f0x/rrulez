import RRuleZ from "../src/rrulez";

describe("Date Calculation Tests", () => {
  test("should generate all dates for a simple daily rule", () => {
    const rrule = new RRuleZ(
      { FREQ: "DAILY", INTERVAL: 1, COUNT: 3 },
      "2023-10-01T00:00:00",
    );
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2023-10-01T00:00:00.000+00:00",
      "2023-10-02T00:00:00.000+00:00",
      "2023-10-03T00:00:00.000+00:00",
    ]);
  });

  test("should filter by BYDAY correctly", () => {
    const rrule = new RRuleZ(
      { FREQ: "DAILY", INTERVAL: 1, COUNT: 7, BYDAY: ["MO", "WE"] },
      "2023-10-01T00:00:00",
    );
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

  test("should generate all dates for a simple weekly rule", () => {
    const rrule = new RRuleZ(
      { FREQ: "WEEKLY", INTERVAL: 1, COUNT: 3 },
      "2023-10-01T00:00:00",
    );
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2023-10-01T00:00:00.000+00:00",
      "2023-10-08T00:00:00.000+00:00",
      "2023-10-15T00:00:00.000+00:00",
    ]);
  });

  test("should generate all dates for a simple monthly rule", () => {
    const rrule = new RRuleZ(
      { FREQ: "MONTHLY", INTERVAL: 1, COUNT: 3 },
      "2023-10-01T00:00:00",
    );
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2023-10-01T00:00:00.000+00:00",
      "2023-11-01T00:00:00.000+00:00",
      "2023-12-01T00:00:00.000+00:00",
    ]);
  });

  test("should generate all dates for a simple yearly rule", () => {
    const rrule = new RRuleZ(
      { FREQ: "YEARLY", INTERVAL: 1, COUNT: 3 },
      "2023-10-01T00:00:00",
    );
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2023-10-01T00:00:00.000+00:00",
      "2024-10-01T00:00:00.000+00:00",
      "2025-10-01T00:00:00.000+00:00",
    ]);
  });

  test("should generate dates until a specific end date", () => {
    const rrule = new RRuleZ(
      { FREQ: "DAILY", INTERVAL: 1, UNTIL: "2023-10-03T00:00:00" },
      "2023-10-01T00:00:00",
    );
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2023-10-01T00:00:00.000+00:00",
      "2023-10-02T00:00:00.000+00:00",
      "2023-10-03T00:00:00.000+00:00",
    ]);
  });

  test("should generate a specific number of occurrences", () => {
    const rrule = new RRuleZ(
      { FREQ: "DAILY", INTERVAL: 1, COUNT: 2 },
      "2023-10-01T00:00:00",
      "en",
    );
    const dates = rrule.getAllDates();
    expect(dates).toEqual([
      "2023-10-01T00:00:00.000+00:00",
      "2023-10-02T00:00:00.000+00:00",
    ]);
  });
});
