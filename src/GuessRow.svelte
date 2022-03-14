<div class="guess-row">
  <slot />
</div>

<style>
  .guess-row {
    display: flex;
    margin-bottom: var(--letter-spacing);
  }

  .guess-row > :global(:not(:first-child)) {
    margin-left: var(--letter-spacing);
  }
</style>
