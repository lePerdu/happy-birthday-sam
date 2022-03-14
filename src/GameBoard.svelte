<script lang="ts">
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

  $: remainingGuesses = Math.max(maxGuesses - pastGuesses.length - 1, 0);

  // Blank strings to fill the rest of the tiles in the current row with
  let currentGuessLetters: string[];
  $: {
    const currentGuessRemainingLetters = wordLength - currentGuess.length;
    currentGuessLetters = currentGuess
      .split("")
      .concat(new Array(currentGuessRemainingLetters).fill(""));
  }
</script>

<div class="game-board">
  {#each pastGuesses as guess}
    <CheckedGuessRow {guess} />
  {/each}

  <!-- Don't show the current guess if over (only applicable if solved on the
  last guess)-->
  {#if gameActive || remainingGuesses > 0}
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

    font-size: 2rem;
    font-weight: bolder;
    text-transform: uppercase;
  }
</style>
