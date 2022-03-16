<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { linear } from "svelte/easing";
  import { TransitionConfig } from "svelte/transition";
  import { Correctness } from "./guess";

  export let correctness: Correctness | undefined = undefined;
  export let index: number = 0;

  const dispatch = createEventDispatcher<{ revealed: never }>();

  const correctnessClasses: Record<Correctness, string> = {
    correct: "correct",
    inWord: "in-word",
    notInWord: "not-in-word",
  };

  const correctnessClass = correctness ? correctnessClasses[correctness] : "";

  let element: HTMLElement | undefined;
  $: {
    if (element) {
      const animations = element.getAnimations();
      if (animations.length > 0) {
        // TODO Consider all animations
        const firstAnimation = animations[0];
        firstAnimation.addEventListener("finish", () => dispatch("revealed"));
        // TODO Do we need to the event listener, or will everything garbage
        // collect by itself?
      }
    }
  }

  function flipReveal(
    node: HTMLElement,
    params: { index: number }
  ): TransitionConfig {
    const styles = getComputedStyle(node);
    return {
      delay: params.index * 250,
      duration: 1000,
      easing: linear,
      css: (t, u) => {
        const backgroundColor =
          t < 0.5 ? "var(--letter-unknown)" : "var(--letter-revealed-color)";
        const angle = 180 * Math.min(t, u);
        const rotation = `rotateX(${angle}deg)`;
        return `
          background-color: ${backgroundColor};
          transform: ${rotation};
        `;
      },
    };
  }
</script>

<div
  bind:this={element}
  class={`letter-tile ${correctnessClass}`}
  style={`--letter-tile-index: ${index}`}
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

    border: 1px solid var(--border-color);

    color: var(--letter-unknown-text);
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
      color: var(--letter-revealed-text);
      background-color: var(--letter-revealed-color);
    }
  }

  .correct {
    --letter-revealed-color: var(--letter-correct-color);
  }

  .in-word {
    --letter-revealed-color: var(--letter-in-word-color);
  }

  .not-in-word {
    --letter-revealed-color: var(--letter-not-in-word-color);
  }

  .correct,
  .in-word,
  .not-in-word {
    animation-delay: calc(var(--letter-tile-index) * var(--reveal-stagger));
    animation-duration: var(--reveal-duration);
    animation-name: flip-y, reveal-color;
    animation-timing-function: linear, steps(2, jump-none);
    animation-fill-mode: forwards;
  }
</style>
