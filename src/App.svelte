<script lang="ts">
  import GameBoard from "./GameBoard.svelte";
  import Keyboard from "./Keyboard.svelte";
  import { CheckedGuess, checkGuess } from "./guess";
  import wordlist from "./wordlist.json";
  import { getKeyUsage } from "./keyboard";
  import Modal from "./Modal.svelte";
  import solutions from "./solutions.json";
  import ConffetiAnimation from "./ConffetiAnimation.svelte";

  const maxGuesses = 6;

  // All these are constant for a given page load

  // Constructs date at UTC
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
  const solutionIndex =
    Math.floor(dateDelta / 1000 / 3600 / 24) % solutions.solutions.length;
  const currentSolution = solutions.solutions[solutionIndex];
  const target = currentSolution.word;
  const wordLength = target.length;

  let gameState: "playing" | "won" | "lost" = "playing";

  let pastGuesses: CheckedGuess[] = [];
  let currentGuess = "";

  $: keyUsageInfo = getKeyUsage(pastGuesses);

  let showModal = false;

  function handleSuccess() {
    showModal = true;
  }

  function handleFailure() {
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

    pastGuesses = [...pastGuesses, checkGuess(currentGuess, target)];

    // Mark the game as over to block input, but don't trigger pop-ups until
    // the guess reveal animation is over (handleGuessRevealed())
    if (currentGuess === target) {
      gameState = "won";
    } else if (pastGuesses.length === maxGuesses) {
      gameState = "lost";
    }

    currentGuess = "";
  }

  /**
   * Keydown handler for handling non-printable keys.
   */
  function handleKeydown(event: KeyboardEvent) {
    if (gameState !== "playing") {
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
    switch (gameState) {
      case "won":
        handleSuccess();
        break;
      case "lost":
        handleFailure();
        break;
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
      {pastGuesses}
      {maxGuesses}
      gameActive={gameState === "playing"}
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
        {#if gameState === "won"}
          Congratulations!
        {:else}
          Better Luck Next Time!
        {/if}
      </h2>

      <small
        >Today's word is
        <q class="todays-word">{target}</q>
      </small>

      <hr />

      {#each currentSolution.message as part}
        <p>{part}</p>
      {/each}

      <hr />

      <small>Check back tomorrow for another word inspired by you.</small>
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
