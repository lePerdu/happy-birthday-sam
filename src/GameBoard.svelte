<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import CheckedGuessRow from "./CheckedGuessRow.svelte";
  import EmptyGuessRow from "./EmptyGuessRow.svelte";
  import { CheckedGuess } from "./guess";
  import GuessRow from "./GuessRow.svelte";
  import LetterTile from "./LetterTile.svelte";

  export let wordLength: number;
  export let currentGuess: string = "";
  export let pastGuesses: CheckedGuess[] = [];
  export let maxGuesses: number;
  export let gameActive: boolean;

  const dispatch = createEventDispatcher<{ reveled: CheckedGuess }>();

  let remainingGuesses: number;
  $: {
    const baseRemainingGuesses = maxGuesses - pastGuesses.length;
    // Remove a remaining guess if the game is active, since there is also a
    // current guess in that case
    remainingGuesses = Math.max(baseRemainingGuesses - (gameActive ? 1 : 0), 0);
  }

  // Blank strings to fill the rest of the tiles in the current row with
  let currentGuessLetters: string[];
  $: {
    const currentGuessRemainingLetters = wordLength - currentGuess.length;
    currentGuessLetters = currentGuess
      .split("")
      .concat(new Array(currentGuessRemainingLetters).fill(""));
  }

  /**
   * Only fire the event when the most recent guess is revealed.
   */
  function handleGuessRevealed(guess: CheckedGuess) {
    if (guess === pastGuesses[pastGuesses.length - 1]) {
      dispatch("reveled", guess);
    }
  }
</script>

<div class="game-board">
  {#each pastGuesses as guess}
    <CheckedGuessRow {guess} on:revealed={() => handleGuessRevealed(guess)} />
  {/each}

  <!-- Don't show the current guess if over -->
  {#if gameActive}
    <GuessRow>
      {#each currentGuessLetters as letter, index}
        <LetterTile {index}>
          {letter}
        </LetterTile>
      {/each}
    </GuessRow>
  {/if}

  {#each new Array(remainingGuesses).fill(null) as _}
    <EmptyGuessRow {wordLength} />
  {/each}
</div>

<style>
  .game-board {
    display: block;

    font-family: var(--game-font-family);
    font-size: 2rem;
    font-weight: bolder;
    text-transform: uppercase;
  }
</style>
