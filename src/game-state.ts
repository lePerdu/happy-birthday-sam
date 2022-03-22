import { derived, Readable, StartStopNotifier, writable } from "svelte/store";
import { CheckedGuess, checkGuess } from "./guess";

export type Solution = {
  word: string;
  message: string[];
};

export type GameConfig = {
  maxGuesses: number;
  dayNumber: number;
  solution: Solution;
};

export type GameState = {
  /**
   * Store game config in case it changes after page reload.
   */
  config: GameConfig;
  guesses: CheckedGuess[];
};

export type PlayState = "playing" | "won" | "lost";

export type GameStore = Readable<GameState> & {
  submitGuess: (guess: string) => void;
};

const checkedGuessString = (guess: CheckedGuess): string =>
  guess.map((l) => l.letter).join("");

function derivePlayState(config: GameConfig, state: GameState): PlayState {
  if (
    state.guesses.some((g) => checkedGuessString(g) === config.solution.word)
  ) {
    return "won";
  } else if (state.guesses.length >= config.maxGuesses) {
    return "lost";
  } else {
    return "playing";
  }
}

export function makeGameStateStore(
  config: GameConfig,
  start?: StartStopNotifier<GameState>
): GameStore {
  const { subscribe, update } = writable<GameState>(
    {
      config,
      guesses: [],
    },
    start
  );

  return {
    subscribe,
    submitGuess(guess: string) {
      update((state) => ({
        ...state,
        guesses: [...state.guesses, checkGuess(guess, config.solution.word)],
      }));
    },
  };
}

export function makePlayStateStore(
  config: GameConfig,
  gameStore: GameStore
): Readable<PlayState> {
  return derived(gameStore, ($gameStore) =>
    derivePlayState(config, $gameStore)
  );
}
