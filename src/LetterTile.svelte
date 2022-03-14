<script lang="ts">
  import { Correctness } from "./guess";

  export let correctness: Correctness | undefined = undefined;
  export let index: number = 0;

  const correctnessClasses: Record<Correctness, string> = {
    correct: "correct",
    inWord: "in-word",
    notInWord: "not-in-word",
  };

  const correctnessClass = correctness ? correctnessClasses[correctness] : "";
</script>

<div
  class={`letter-tile ${correctnessClass}`}
  style={`--letter-tile-index: ${index};`}
>
  <slot />
</div>

<style>
  .letter-tile {
    width: 4rem;
    height: 4rem;

    display: flex;
    justify-content: center;
    align-items: center;

    border: 1px solid var(--primary);
    box-sizing: border-box;

    background-color: var(--letter-unknown);

    /* 0-based index of the tile, used for staggering reveal animations */
    --letter-tile-index: 0;
  }

  @keyframes flip-y {
    50% {
      transform: rotateX(90deg);
    }
  }

  @keyframes reveal-color {
    to {
      background-color: var(--letter-correctness-color);
    }
  }

  .correct {
    --letter-correctness-color: var(--letter-correct);
  }

  .in-word {
    --letter-correctness-color: var(--letter-in-word);
  }

  .not-in-word {
    --letter-correctness-color: var(--letter-not-in-word);
  }

  .correct,
  .in-word,
  .not-in-word {
    animation-delay: calc(var(--letter-tile-index) * var(--reveal-stagger));
    animation-duration: var(--reveal-duration);
    /* animation: flip-y linear, reveal-color steps(2, jump-none) forwards; */
    animation-name: flip-y, reveal-color;
    animation-timing-function: linear, steps(2, jump-none);
    animation-fill-mode: forwards;
  }
</style>
