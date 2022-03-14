<script lang="ts">
  import LetterTile from "./LetterTile.svelte";
  import { CheckedGuess } from "./guess";
  import GuessRow from "./GuessRow.svelte";

  export let guess: CheckedGuess;
</script>

<GuessRow>
  {#each guess as g, index}
    <LetterTile correctness={g.correctness} {index}>
      {g.letter}
    </LetterTile>
  {/each}
</GuessRow>
