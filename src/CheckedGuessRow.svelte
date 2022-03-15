<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import LetterTile from "./LetterTile.svelte";
  import { CheckedGuess } from "./guess";
  import GuessRow from "./GuessRow.svelte";

  export let guess: CheckedGuess;

  const dispatch = createEventDispatcher<{ revealed: never }>();

  let revealedTiles = 0;

  function handleTileRevealed() {
    // Dispatch revealed event when all tiles have been revealed
    // TODO Reset revealedTiles on certain conditions
    if (++revealedTiles === guess.length) {
      revealedTiles = 0;
      dispatch("revealed");
    }
  }
</script>

<GuessRow>
  {#each guess as g, index}
    <LetterTile
      correctness={g.correctness}
      {index}
      on:revealed={handleTileRevealed}
    >
      {g.letter}
    </LetterTile>
  {/each}
</GuessRow>
