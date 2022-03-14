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

export function checkGuess(guess: string, target: string): CheckedLetter[] {
  if (guess.length !== target.length) {
    throw new Error("Guess and target must have same length");
  }

  const wordLength = guess.length;

  const checkedLetters: CheckedLetter[] = guess.split("").map((letter) => ({
    correctness: "notInWord",
    letter,
  }));

  // Find exact matches first
  for (let i = 0; i < wordLength; i++) {
    if (checkedLetters[i].letter === target[i]) {
      checkedLetters[i].correctness = "correct";
    }
  }

  // Look for letters in the word, but only those which aren't an exact match
  for (let i = 0; i < wordLength; i++) {
    const targetLetter = target[i];
    const matching = checkedLetters.find(
      // Exclude letters which have already been matched against a target letter
      ({ correctness, letter }) =>
        correctness === "notInWord" && letter === targetLetter
    );

    if (matching) {
      matching.correctness = "inWord";
    }
  }

  return checkedLetters;
}
