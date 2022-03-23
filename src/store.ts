import {
  GameConfig,
  GameState,
  makeGameStateStore,
  makePlayStateStore,
} from "./game-state";
import solutions from "./solutions.json";

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

function retrieveGameState(): GameState | undefined {
  try {
    // TODO Schema validation
    return JSON.parse(localStorage.getItem(GAME_STATE_KEY));
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

/**
 * When returning to the application and it's a new day, refresh the page to
 * reset the game state and fetch potential updates.
 *
 * TODO Soft reset the state and check for updates asynchronously to avoid
 * unnecessary refreshes.
 */
function handleVisibilityChange() {
  if (document.visibilityState === "visible") {
    if (calcDayNumber() !== dayNumber) {
      location.reload();
    }
  }
}

window.addEventListener("visibilitychange", handleVisibilityChange);
