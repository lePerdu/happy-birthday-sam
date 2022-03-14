<script lang="ts">
  import { Correctness } from "./guess";

  import { KeyUsageInfo } from "./keyboard";

  import keyboardLayout from "./keyboard-layout.json";

  export let keyUsageInfo: KeyUsageInfo = {};

  const correctnessClasses: Record<Correctness, string> = {
    correct: "correct",
    inWord: "in-word",
    notInWord: "not-in-word",
  };

  const specialKeys = {
    Enter: "\u23ce",
    Backspace: "\u232b",
  };

  const isSpecialKey = (key: string): boolean => key in specialKeys;

  const resolveKey = (key: string): string =>
    isSpecialKey(key) ? specialKeys[key] : key;

  const getClickHandler = (key: string) => () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key }));
  };
</script>

<div class="keyboard">
  {#each keyboardLayout as row}
    <div class="keyboard-row">
      {#each row as key}
        {#if key === null}
          <div class="spacer" />
        {:else}
          <button
            class={`key ${correctnessClasses[keyUsageInfo[key]]}`}
            class:special={isSpecialKey(key)}
            on:click={getClickHandler(key)}
          >
            {resolveKey(key)}
          </button>
        {/if}
      {/each}
    </div>
  {/each}
</div>

<style>
  .keyboard {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    max-width: var(--keyboard-max-width);
    font-weight: bolder;
  }

  .keyboard-row {
    display: flex;

    margin-bottom: var(--keyboard-key-spacing);
  }

  .key {
    flex: 1;
    height: var(--keyboard-key-height);

    background: lightgray;
    margin-bottom: 0; /* Undo button styling */
    border: none;
    padding: 0;
  }

  .key:not(:last-child) {
    margin-right: var(--keyboard-key-spacing);
  }

  .key.special {
    flex: 1.5;
  }

  .spacer {
    flex: 0.5;
  }

  .spacer:last-child {
    /* Remove margin from previous item to fix alignment */
    margin-left: calc(-1 * var(--keyboard-key-spacing));
  }

  .key.correct {
    background: var(--letter-correct);
  }

  .key.in-word {
    background: var(--letter-in-word);
  }

  .key.not-in-word {
    background: var(--letter-not-in-word);
  }
</style>
