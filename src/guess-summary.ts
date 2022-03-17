/**
 * Utilities for creating a guess summary for sharing externally.
 *
 * @module
 */

import { CheckedGuess, Correctness } from "./guess";

const GAME_NAME = "Samdle ❤";

const correctnessTypeSymbols: Record<Correctness, string> = {
  correct: "🟩",
  inWord: "🟨",
  notInWord: "⬛",
};

export default function generateGuessSummary(
  guesses: CheckedGuess[],
  maxGuesses: number,
  dayNumber: number,
  solved: boolean
): string {
  const score = `${solved ? guesses.length : "X"}/${maxGuesses}`;
  const guessSummary = guesses
    .map((letters) =>
      letters
        .map(({ correctness }) => correctnessTypeSymbols[correctness])
        .join("")
    )
    .join("\n");

  // dayNumber + 1 to index from 1
  return `${GAME_NAME} ${dayNumber + 1} ${score}` + "\n" + guessSummary;
}
