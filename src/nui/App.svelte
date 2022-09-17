<script lang="ts">
  import { onMount } from "svelte";
  import { Icon } from "svelte-awesome";
  import { faCheck, faXmark, faArrowRotateBack } from "@fortawesome/free-solid-svg-icons";
  import Window from "./components/Window.svelte";
  import VMenu, { VItem, BooleanVItem, RangeVItem, SliderVItem } from "./components/VMenu.svelte";
  import api from "./api";

  let shown = import.meta.env.DEV;
  let enabled = true;
  let offset = [0.5, 0.5, 0.5];
  let color = [0, 1, 1];

  onMount(() => {
    api.on("toggle", (data) => (shown = data.state));
    api.on("data", (data) => {
      enabled = data.enabled;
      offset = data.offset;
      color = data.color;
    });
  });

  const onKeyDown = (ev: KeyboardEvent) => {
    if (!shown) return;
  };

  $: api.send("update", { enabled, offset, color });
</script>

<svelte:window on:keydown={onKeyDown} />

{#if shown}
  <Window initialPos={[window.innerWidth * 0.6, window.innerHeight * 0.1]}>
    <div class="header" slot="header">
      Holospeed <button class="button close"><Icon data={faXmark} scale={1.5} /></button>
    </div>

    <VMenu>
      <BooleanVItem label="Enabled" bind:value={enabled} />

      <VItem isTitle>Position</VItem>
      {#each offset as _, i (i)}
        <RangeVItem label={["X", "Y", "Z"][i]} bind:value={offset[i]}>
          <button class="button revert" on:click={() => (offset[i] = 0.5)}>
            <Icon data={faArrowRotateBack} />
          </button>
        </RangeVItem>
      {/each}

      <VItem isTitle>
        Color
        <div
          slot="icon"
          class="color"
          style:background-color="hsl({color[0] * 360}deg, {color[1] * 100}%, {color[2] * 100}%)"
        />
      </VItem>
      <SliderVItem label="Hue" bind:value={color[0]}>
        <div slot="background" class="bg bg-hue" />
      </SliderVItem>
      <SliderVItem label="Saturation" bind:value={color[1]}>
        <div
          slot="background"
          class="bg"
          style:background="linear-gradient(to right, hsl({color[0] * 360}deg, 0%, 50%), hsl({color[0] * 360}deg, 100%,
          50%))"
        />
      </SliderVItem>
      <SliderVItem label="Lightness" bind:value={color[2]}>
        <div
          slot="background"
          class="bg"
          style:background="linear-gradient(to right, hsl({color[0] * 100}deg, {color[1] * 100}%, 0%), hsl({color[0] *
            360}deg, {color[1] * 100}%, 50%), hsl({color[0] * 360}deg, {color[1] * 100}%, 100%))"
        />
      </SliderVItem>

      <VItem isAttached isTitle><div slot="icon" class="separator" /></VItem>
      <VItem isAttached action={() => api.send("save", { enabled, offset, color })}>
        Save

        <Icon slot="icon" data={faCheck} />
      </VItem>
    </VMenu>
  </Window>
{/if}

<style lang="scss">
  .button {
    appearance: none;
    background: none;
    border: none;
    color: inherit;
    font-size: inherit;
    cursor: pointer;
    line-height: 1;
    display: inline-block;
  }

  .header {
    position: relative;
    padding: 1rem;
    padding-right: 4rem;
    min-width: 20rem;
    background-color: var(--accent);
    font-size: 2rem;

    .close {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      padding: 0.3rem 0.8rem;
      transition: color 0.3s, background-color 0.3s;

      &:hover {
        color: black;
        background-color: white;
      }
    }
  }

  .revert {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
    opacity: 0.5;
    transition: opacity 0.3s, color 0.3s;

    &:hover {
      opacity: 1;
      color: var(--accent);
    }
  }

  .separator {
    width: 100%;
    border-bottom: 1px solid white;
  }

  .color {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }

  .bg {
    width: 100%;
    height: 100%;
  }

  .bg-hue {
    background: linear-gradient(
      to right,
      hsl(0deg, 100%, 50%),
      hsl(45deg, 100%, 50%),
      hsl(90deg, 100%, 50%),
      hsl(135deg, 100%, 50%),
      hsl(180deg, 100%, 50%),
      hsl(225deg, 100%, 50%),
      hsl(270deg, 100%, 50%),
      hsl(315deg, 100%, 50%),
      hsl(360deg, 100%, 50%)
    );
  }
</style>
