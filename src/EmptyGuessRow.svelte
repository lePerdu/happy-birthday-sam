<script lang="ts">
  import GuessRow from "./GuessRow.svelte";
  import LetterTile from "./LetterTile.svelte";

  export let wordLength: number;
</script>

<GuessRow>
  {#each new Array(wordLength).fill(null) as _, index}
    <LetterTile {index} />
  {/each}
</GuessRow>
