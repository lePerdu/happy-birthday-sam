<script lang="ts">
  import ConffetiAnimation from "./ConffetiAnimation.svelte";
  import GameBoard from "./GameBoard.svelte";
  import generateGuessSummary from "./guess-summary";
  import { getKeyUsage } from "./keyboard";
  import Keyboard from "./Keyboard.svelte";
  import Modal from "./Modal.svelte";
  import { gameState, playState } from "./store";
  import wordlist from "./wordlist.json";

  $: wordLength = $gameState.config.solution.word.length;
  $: solution = $gameState.config.solution;

  let currentGuess = "";

  $: keyUsageInfo = getKeyUsage($gameState.guesses);

  let showModal = false;

  function handleFinish() {
    showModal = true;
  }

  function validateGuess() {
    if (currentGuess.length !== wordLength) {
      console.log("Not enough letters");
      return false;
    }

    if (!wordlist.includes(currentGuess)) {
      console.log("Not a real word");
      return false;
    }

    return true;
  }

  function handleSubmitGuess() {
    if (!validateGuess()) {
      return;
    }

    gameState.submitGuess(currentGuess);
    currentGuess = "";
  }

  /**
   * Keydown handler for handling non-printable keys.
   */
  function handleKeydown(event: KeyboardEvent) {
    if ($playState !== "playing") {
      return;
    }

    if (event.ctrlKey || event.altKey || event.metaKey) {
      // Ignore modified keys
      return;
    }
    switch (event.key) {
      case "Enter":
        // Prevent from triggering last pressed button
        event.preventDefault();

        handleSubmitGuess();
        break;
      case "Backspace":
        currentGuess = currentGuess.slice(0, currentGuess.length - 1);
        break;
      case "Delete":
        currentGuess = "";
        break;
      default:
        // Append letters to the current guess
        if (/^[a-z]$/i.test(event.key)) {
          if (currentGuess.length < wordLength) {
            currentGuess += event.key.toUpperCase();
          } else {
            console.log("No more letters");
          }
        }
    }
  }

  /**
   * Show success/failure pop-ups when the last guess is reveled.
   */
  function handleGuessRevealed() {
    switch ($playState) {
      case "won":
      case "lost":
        handleFinish();
        break;
    }
  }

  async function handleShare() {
    const summary = generateGuessSummary(
      $gameState.guesses,
      $gameState.config.maxGuesses,
      $gameState.config.dayNumber,
      $playState === "won"
    );
    const shareData = { text: summary };
    if (navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      console.log("Shared");
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(summary);
      console.log("Copied to clipboard");
    } else {
      console.log("Not shareable");
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<header>
  <h1>Samdle</h1>
</header>

<main>
  <div class="game-board-container">
    <GameBoard
      {wordLength}
      {currentGuess}
      pastGuesses={$gameState.guesses}
      maxGuesses={$gameState.config.maxGuesses}
      gameActive={$playState === "playing"}
      on:reveled={handleGuessRevealed}
    />
  </div>

  <div class="keyboard-container">
    <Keyboard {keyUsageInfo} />
  </div>

  {#if showModal}
    <ConffetiAnimation />

    <Modal on:close={() => (showModal = false)}>
      <h2>
        {#if $playState === "won"}
          Congratulations!
        {:else}
          Better Luck Next Time!
        {/if}
      </h2>

      {#if $playState === "won"}
        <small>
          Today's word is
          <q class="todays-word">{solution.word}</q>
        </small>

        <hr />

        {#each solution.message as part}
          <p>{@html part}</p>
        {/each}
      {:else}
        <small>
          I still love you, even if you couldn't guess today's word 🙂
        </small>
      {/if}

      <hr />

      <p>
        <small>Check back tomorrow for another word inspired by you.</small>
      </p>

      <button class="share" on:click={handleShare}>Share</button>
    </Modal>
  {/if}
</main>

<style>
  header {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid var(--border-color);

    font-family: var(--title-font-family);
  }

  header h1 {
    margin: 0.5rem 0;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    padding: 0.5rem;
  }

  .game-board-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .keyboard-container {
    display: flex;
    justify-content: center;
  }

  q.todays-word {
    font-weight: bold;
  }
</style>
