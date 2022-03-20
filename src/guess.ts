export type Correctness = "correct" | "inWord" | "notInWord";

export type CheckedLetter = {
  correctness: Correctness;
  letter: string;
};

export type CheckedGuess = CheckedLetter[];

const correctnessPriority = ["notInWord", "inWord", "correct"];
export function comparePriority(c1: Correctness, c2: Correctness): number {
  let c1Index = correctnessPriority.indexOf(c1);
  let c2Index = correctnessPriority.indexOf(c2);
  return c2Index - c1Index;
}

export function compareGuessLetters(
  guess: string,
  target: string
): Correctness[] {
  if (guess.length !== target.length) {
    throw new Error("Guess and target must have same length");
  }

  const wordLength = guess.length;

  // Start with all notInWord
  let result: Correctness[] = new Array(wordLength).fill("notInWord");

  // First pass to find correct letters
  for (let i = 0; i < wordLength; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
    }
  }

  // Second pass to find incorrect positions, excluding letters in the target
  // which have already been mapped to letters in the guess
  for (let targetIndex = 0; targetIndex < wordLength; targetIndex++) {
    if (result[targetIndex] !== "correct") {
      // Look for and mark first matching letter in the guess that hasn't
      // already been marked
      for (let resultIndex = 0; resultIndex < result.length; resultIndex++) {
        if (
          result[resultIndex] === "notInWord" &&
          guess[resultIndex] === target[targetIndex]
        ) {
          result[resultIndex] = "inWord";
          break;
        }
      }
    }
  }

  return result;
}

export function checkGuess(guess: string, target: string): CheckedGuess {
  return compareGuessLetters(guess, target).map((correctness, index) => ({
    correctness,
    letter: guess[index],
  }));
}
