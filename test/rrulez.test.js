import RRuleZ from "../src/rrulez";
import { DateTime } from "luxon";

describe("RRuleZ Parse Tests", () => {
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

  // ... weitere Parsing-Tests ...
});
