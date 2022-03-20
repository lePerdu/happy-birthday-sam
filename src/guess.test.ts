import { compareGuessLetters } from "./guess";

describe(compareGuessLetters, () => {
  test("fails when lengths do not match", () => {
    expect(() => {
      compareGuessLetters("ABC", "ABCD");
    }).toThrow(Error);
  });

  test("returns all correct for correct guess", () => {
    expect(compareGuessLetters("ABC", "ABC")).toEqual([
      "correct",
      "correct",
      "correct",
    ]);
  });

  test("marks letter in incorrect position", () => {
    expect(compareGuessLetters("ABC", "CZZ")).toEqual([
      "notInWord",
      "notInWord",
      "inWord",
    ]);
  });

  describe("with double letter in target", () => {
    test("guess contains no occurrences", () => {
      expect(compareGuessLetters("ABC", "DZD")).toEqual([
        "notInWord",
        "notInWord",
        "notInWord",
      ]);
    });

    describe("guess contains only one occurrence", () => {
      test("in wrong position", () => {
        expect(compareGuessLetters("ABC", "ZAA")).toEqual([
          "inWord",
          "notInWord",
          "notInWord",
        ]);
      });

      test("first occurrence position", () => {
        expect(compareGuessLetters("ABC", "AZA")).toEqual([
          "correct",
          "notInWord",
          "notInWord",
        ]);
      });

      test("second occurrence position", () => {
        expect(compareGuessLetters("ABC", "CZC")).toEqual([
          "notInWord",
          "notInWord",
          "correct",
        ]);
      });
    });

    describe("guess contains both occurrences", () => {
      describe("both in wrong position", () => {
        test("both between target positions", () => {
          expect(compareGuessLetters("AABC", "ZZAA")).toEqual([
            "inWord",
            "inWord",
            "notInWord",
            "notInWord",
          ]);
        });

        test("both after target positions", () => {
          expect(compareGuessLetters("BCAA", "AAZZ")).toEqual([
            "notInWord",
            "notInWord",
            "inWord",
            "inWord",
          ]);
        });

        test("both between target positions", () => {
          expect(compareGuessLetters("ABCA", "ZAAZ")).toEqual([
            "inWord",
            "notInWord",
            "notInWord",
            "inWord",
          ]);
        });
      });

      describe("one in first correct position", () => {
        test("second is before both target positions", () => {
          expect(compareGuessLetters("ABAC", "ZZAA")).toEqual([
            "inWord",
            "notInWord",
            "correct",
            "notInWord",
          ]);
        });

        test("second is between target positions", () => {
          expect(compareGuessLetters("ABAC", "AZZA")).toEqual([
            "correct",
            "notInWord",
            "inWord",
            "notInWord",
          ]);
        });

        test("second is after both target positions", () => {
          expect(compareGuessLetters("ABCA", "AZAZ")).toEqual([
            "correct",
            "notInWord",
            "notInWord",
            "inWord",
          ]);
        });
      });

      describe("one in second correct position", () => {
        test("second is before both target positions", () => {
          expect(compareGuessLetters("ABCA", "ZZAA")).toEqual([
            "inWord",
            "notInWord",
            "notInWord",
            "correct",
          ]);
        });

        test("second is between target positions", () => {
          expect(compareGuessLetters("BAAC", "AZAZ")).toEqual([
            "notInWord",
            "inWord",
            "correct",
            "notInWord",
          ]);
        });

        test("second is after both target positions", () => {
          expect(compareGuessLetters("BCAA", "AZAZ")).toEqual([
            "notInWord",
            "notInWord",
            "correct",
            "inWord",
          ]);
        });
      });
    });

    test("guess contains 3 occurrences", () => {
      expect(compareGuessLetters("AAA", "AAZ")).toEqual([
        "correct",
        "correct",
        "notInWord",
      ]);
    });
  });

  describe("with double letter in guess but not in target", () => {
    test("target contains no occurrences", () => {
      expect(compareGuessLetters("ABAC", "ZZZZ")).toEqual([
        "notInWord",
        "notInWord",
        "notInWord",
        "notInWord",
      ]);
    });

    test("target contains one in wrong position", () => {
      expect(compareGuessLetters("ABA", "ZAZ")).toEqual([
        "inWord",
        "notInWord",
        "notInWord",
      ]);
    });

    test("target contains first occurrence", () => {
      expect(compareGuessLetters("AAC", "AZZ")).toEqual([
        "correct",
        "notInWord",
        "notInWord",
      ]);
    });

    test("target contains second occurrence", () => {
      expect(compareGuessLetters("AAC", "ZAZ")).toEqual([
        "notInWord",
        "correct",
        "notInWord",
      ]);
    });
  });
});
