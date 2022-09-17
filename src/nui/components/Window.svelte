<script lang="ts">
  export let initialPos: [number, number] = [0, 0];

  export let x = initialPos[0];
  export let y = initialPos[1];
  export let dragging = false;

  let offsetX = 0;
  let offsetY = 0;
  let winEl: HTMLDivElement;

  const onMouseDown = (ev: MouseEvent) => {
    ev.preventDefault();
    offsetX = ev.pageX - x;
    offsetY = ev.pageY - y;
    dragging = true;
  };

  const onMouseMove = (ev: MouseEvent) => {
    if (!dragging) return;
    x = Math.min(window.innerWidth - winEl.clientWidth, Math.max(0, ev.pageX - offsetX));
    y = Math.min(window.innerHeight - winEl.clientHeight, Math.max(0, ev.pageY - offsetY));
  };
</script>

<svelte:window on:mousemove={onMouseMove} on:mouseup={() => (dragging = false)} />

<div class="window" bind:this={winEl} style:left={x + "px"} style:top={y + "px"}>
  <div class="header" class:dragging on:mousedown={onMouseDown}>
    <slot name="header" />
  </div>

  <slot />
</div>

<style lang="scss">
  .window {
    position: absolute;
  }

  .header {
    cursor: grab;

    &.dragging {
      cursor: grabbing;
    }
  }
</style>
