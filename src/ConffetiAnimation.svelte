<script lang="ts">
  /**
   * Simple, seeded RNG (since `Math.random()` cannot be seeded).
   *
   * Not a "real" RNG, but good enough for visual purposes.
   */
  const randomWithSeed =
    (seed: number): (() => number) =>
    () => {
      const x = Math.sin(++seed) * 10000;
      return x - Math.floor(x);
    };

  type ConfettiContext = {
    index: number;
    total: number;
    windowWidth: number;
    windowHight: number;
  };

  /**
   * Density of confetti objects in objects per pixel of page width.
   */
  const density: number = 1 / 20;

  // Use ceil() over floor() since more confetti is always better
  const confettiCount = Math.ceil(window.innerWidth * density);

  const releaseDuration = 4;

  // TODO Config these in CSS?
  // Would probably have to do calculations in CSS as well in that case
  const baseAcceleration = 200;

  const positionVariance = 0.3;
  const accelerationVariance = 0.1;
  const scaleDownVariance = -0.5;
  const scaleUpVariance = 3;

  function calcConfettiParameters({
    index,
    total,
    windowHight,
  }: ConfettiContext): string {
    const random = randomWithSeed(total * index);

    const position =
      (index + 0.5 + (2 * random() - 1) * positionVariance) / total;
    const delay = releaseDuration * random();

    const acceleration =
      baseAcceleration * (1 + accelerationVariance * random());
    const duration = Math.sqrt((2 * windowHight) / acceleration);

    const scale =
      1 + random() * (scaleUpVariance - scaleDownVariance) + scaleDownVariance;

    return `
      --confetti-position: ${position * 100}%;
      --confetti-delay: ${delay}s;
      --confetti-duration: ${duration}s;
      --confetti-scale: ${scale};
    `;
  }
</script>

<div class="confetti-container">
  {#each new Array(confettiCount).fill(null) as _, index}
    <div
      class="confetti"
      style={calcConfettiParameters({
        index,
        total: confettiCount,
        windowHight: window.innerHeight,
        windowWidth: window.innerWidth,
      })}
    />
  {/each}
</div>

<style>
  .confetti-container {
    position: fixed;
    height: 100%;
    width: 100%;

    /* Render above everything, but pass-through clicks */
    z-index: var(--confetti-z-index);
    pointer-events: none;
  }

  @keyframes confetti-float {
    from {
      top: 100%;
    }
    to {
      top: 0;
    }
  }

  .confetti {
    animation: var(--confetti-duration) confetti-float ease-in
      var(--confetti-delay);
    position: absolute;
    top: -100%;
    left: var(--confetti-position);

    transform: scale(var(--confetti-scale));

    /* width: 8px;
    height: 6px;
    background-color: red; */
  }

  .confetti::after {
    content: "❤️";
    color: red;
  }
</style>
