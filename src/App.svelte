<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import GameBoard from "./GameBoard.svelte";
  import Keyboard from "./Keyboard.svelte";
  import { CheckedGuess, checkGuess } from "./guess";
  import wordlist from "./wordlist.json";
  import { getKeyUsage } from "./keyboard";

  const target = "GUESS";
  const maxGuesses = 6;

  $: wordLength = target.length;

  let gameFinished = false;

  let pastGuesses: CheckedGuess[] = [];
  let currentGuess = "";

  $: keyUsageInfo = getKeyUsage(pastGuesses);

  function handleSuccess() {
    alert("Nice job!");
  }

  function handleFailure() {
    alert("Ran out of guesses");
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

    if (currentGuess === target) {
      gameFinished = true;
      handleSuccess();
    } else if (pastGuesses.length === maxGuesses) {
      gameFinished = true;
      handleFailure();
    }

    currentGuess = "";
  }

  /**
   * Keydown handler for handling non-printable keys.
   */
  function handleKeydown(event: KeyboardEvent) {
    if (gameFinished) {
      return;
    }

    if (event.ctrlKey || event.altKey || event.metaKey) {
      // Ignore modified keys
      return;
    }
    switch (event.key) {
      case "Enter":
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

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
</script>

<header>
  <h1>Totally Not Wordle</h1>
</header>

<main>
  <div class="game-board-container">
    <GameBoard
      {wordLength}
      {currentGuess}
      {pastGuesses}
      {maxGuesses}
      gameActive={!gameFinished}
    />
  </div>

  <div class="keyboard-container">
    <Keyboard {keyUsageInfo} />
  </div>
</main>

<style>
  :root {
    font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
    --primary: black;
    --background: white;
    --letter-spacing: 0.5rem;

    --letter-unknown: transparent;
    --letter-correct: green;
    --letter-in-word: yellow;
    --letter-not-in-word: darkgray;

    --reveal-duration: 1s;
    --reveal-stagger: calc(var(--reveal-duration) / 4);

    --keyboard-max-width: 500px;
    --keyboard-key-spacing: 0.25rem;
    --keyboard-key-height: 3.625rem;
  }

  header {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid var(--primary);
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
</style>
