import RRuleZ from "../src/rrulez";
import { DateTime } from "luxon";

describe("Parsing Tests", () => {
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
});
