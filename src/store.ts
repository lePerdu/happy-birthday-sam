import {
  GameConfig,
  GameState,
  makeGameStateStore,
  makePlayStateStore,
} from "./game-state";
import solutions from "./solutions.json";
import * as validate from "./validate";

const MS_PER_DAY = 1000 * 3600 * 24;

function calcDayNumber() {
  const solutionStartDate = new Date(solutions.startDate).getTime();
  const today = new Date();
  // Today's date in UTC
  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const dateDelta = todayUtc - solutionStartDate;
  // Convert ms to days and wrap the index to keep in the list
  return Math.floor(dateDelta / MS_PER_DAY);
}

// Determine the solution config for the current day. This can be considered
// global state, as it should only change on page refresh.
// Constructs date at UTC
const dayNumber = calcDayNumber();
const solutionIndex = dayNumber % solutions.solutions.length;
const currentSolution = solutions.solutions[solutionIndex];

export const config: GameConfig = {
  maxGuesses: 6,
  dayNumber: dayNumber,
  solution: currentSolution,
};

const GAME_STATE_KEY = "samdle-game-state";

// Validators for making sure the data in localStorage is in the expected format

const gameConfigValidator: validate.Validator<GameConfig> = validate.object({
  maxGuesses: validate.number({ integer: true }),
  dayNumber: validate.number({ integer: true }),
  solution: validate.object({
    word: validate.string(),
    message: validate.array(validate.string()),
  }),
});

const gameStateValidator: validate.Validator<GameState> = validate.object({
  config: gameConfigValidator,
  guesses: validate.array(
    validate.array(
      validate.object({
        correctness: validate.oneOf(["correct", "inWord", "notInWord"]),
        letter: validate.string({ minLength: 1, maxLength: 1 }),
      })
    )
  ),
});

function retrieveGameState(): GameState | undefined {
  try {
    const state = JSON.parse(localStorage.getItem(GAME_STATE_KEY));
    if (gameStateValidator(state)) {
      return state;
    } else {
      console.log("Ignoring invalid/old game state", state);
    }
  } catch (e) {
    return undefined;
  }
}

function storeGameState(state: GameState): void {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
}

export const gameState = makeGameStateStore(config, (set) => {
  const oldState = retrieveGameState();
  if (oldState && oldState.config.dayNumber === dayNumber) {
    // Only replace with stored state if it's the same day
    set(oldState);
  }
});

// Keep in sync with localStorage
gameState.subscribe(storeGameState);

export const playState = makePlayStateStore(config, gameState);
