import RRuleZ from "../src/rrulez";

describe("Generation Tests", () => {
  test("should generate a recurrence rule string from an object", () => {
    const ruleObj = { FREQ: "WEEKLY", INTERVAL: 1, BYDAY: ["MO", "WE", "FR"] };
    const ruleString = RRuleZ.generate(ruleObj);
    expect(ruleString).toBe("FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR");
  });

  test("should throw error if FREQ is missing in generate", () => {
    const ruleObj = { INTERVAL: 1 };
    expect(() => {
      RRuleZ.generate(ruleObj);
    }).toThrow("FREQ is required in a recurrence rule.");
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
});
