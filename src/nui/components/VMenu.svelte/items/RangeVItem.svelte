<script lang="ts">
  import VItem from "../VItem.svelte";

  export let label: string;
  export let value = 0;
  export let step = 0.01;

  let dragging = false;
  let sliderEl: HTMLDivElement;

  const onMouse = (ev: MouseEvent) => {
    if (!dragging) return;
    const { left, width } = sliderEl.getBoundingClientRect();
    let pos = (ev.pageX - left) / width;
    pos = Math.round(pos / step) * step;

    value = Math.min(1, Math.max(0, pos));
  };

  const onMouseDown = (ev: MouseEvent) => {
    dragging = true;
    onMouse(ev);
  };
</script>

<svelte:window on:mouseup={() => (dragging = false)} on:mousemove={onMouse} />

<VItem>
  {label}

  <svelte:fragment slot="icon">
    <slot />

    <div class="slider" bind:this={sliderEl}>
      <div class="bar" style:width={value * 100 + "%"} />
      <div class="click-catcher" on:mousedown={onMouseDown} />
    </div>
  </svelte:fragment>
</VItem>

<style lang="scss">
  .slider {
    position: relative;
    width: 8rem;
    height: 0.5rem;
    background-color: rgba(128, 128, 128, 0.5);
    line-height: 0;

    .bar {
      height: 100%;
      background-color: var(--accent);
    }
  }

  .click-catcher {
    position: absolute;
    left: 0;
    right: 0;
    top: -0.5rem;
    bottom: -0.5rem;
  }
</style>
