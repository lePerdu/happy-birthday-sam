import { CheckedGuess, comparePriority, Correctness } from "./guess";

export type KeyUsageInfo = Record<string, Correctness | undefined>;

export function getKeyUsage(guesses: CheckedGuess[]): KeyUsageInfo {
  let usageInfo: KeyUsageInfo = {};

  for (const guess of guesses) {
    for (const { letter, correctness } of guess) {
      // Only update with a correctness of a "higher priority"
      // i.e. override "inWord" with "correct" but not vice-versa
      const existingInfo = usageInfo[letter];
      if (!existingInfo || comparePriority(existingInfo, correctness) > 0) {
        usageInfo[letter] = correctness;
      }
    }
  }

  return usageInfo;
}
