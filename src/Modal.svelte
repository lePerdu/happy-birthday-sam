<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher<{ close: never }>();

  function handleClose() {
    dispatch("close");
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="modal-container">
  <div class="modal-backdrop" on:click={handleClose} />
  <div class="modal" role="alert" aria-modal="true">
    <button class="close-button" on:click={handleClose}>&#x2715;</button>
    <slot />
  </div>
</div>

<style>
  .modal-container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: var(--modal-z-index);
  }

  .modal-backdrop {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: var(--background);
    opacity: var(--modal-backdrop-opacity);
  }

  .modal {
    position: relative;
    flex: 0 1 var(--modal-max-width);

    margin: var(--modal-margin);
    padding: var(--modal-padding);
    font-size: 1.5rem;
    text-align: center;

    background-color: var(--modal-background);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
  }

  .close-button {
    position: absolute;
    top: var(--modal-close-button-inset);
    right: var(--modal-close-button-inset);

    margin: 0;
    padding: 0;

    border: none;
    background: transparent;

    font-size: 1.5rem;
    cursor: pointer;
  }
</style>
