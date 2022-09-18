<script lang="ts">
  import { onMount } from "svelte";
  import { Icon } from "svelte-awesome";
  import { faCheck, faXmark, faArrowRotateBack } from "@fortawesome/free-solid-svg-icons";
  import Window from "./components/Window.svelte";
  import VMenu, { VItem, BooleanVItem, RangeVItem, SliderVItem } from "./components/VMenu.svelte";
  import api from "./api";
  import { Settings, defaults } from "../Settings";

  let shown = import.meta.env.DEV;
  let settings = { ...new Settings() };

  onMount(() => {
    api.on("toggle", (data) => (shown = data.state));
    api.on("data", (data) => Object.assign(settings, data));
  });

  const onKeyDown = (ev: KeyboardEvent) => {
    if (!shown) return;
    switch (ev.key) {
      case "Escape":
        api.send("close");
        break;
    }
  };

  $: if (shown) api.send("update", settings);
</script>

<svelte:window on:keydown={onKeyDown} />

{#if shown}
  <Window initialPos={[window.innerWidth * 0.6, window.innerHeight * 0.1]}>
    <div class="header" slot="header">
      Holospeed
      <button class="button close" on:click={() => api.send("close")}><Icon data={faXmark} scale={1.5} /></button>
    </div>

    <VMenu>
      <BooleanVItem label="Enabled" bind:value={settings.enabled} />
      <BooleanVItem label="Show speed unit" bind:value={settings.showUnit} />
      <BooleanVItem label="Show RPM bar" bind:value={settings.showRPM} />

      <VItem isTitle>Position</VItem>
      {#each settings.offset as _, i (i)}
        <RangeVItem label={["Sideways (X)", "Forward (Y)", "Up (Z)"][i]} bind:value={settings.offset[i]}>
          <button class="button revert" on:click={() => (settings.offset[i] = defaults.offset[i])}>
            <Icon data={faArrowRotateBack} />
          </button>
        </RangeVItem>
      {/each}
      <BooleanVItem label="Left aligned" bind:value={settings.leftAlign} />

      <VItem isTitle>
        Color
        <div
          slot="icon"
          class="color"
          style:background-color="hsl({settings.color[0] * 360}deg, {settings.color[1] * 100}%, {settings.color[2] *
            100}%)"
        />
      </VItem>
      <SliderVItem label="Hue" bind:value={settings.color[0]}>
        <div slot="background" class="bg bg-hue" />
      </SliderVItem>
      <SliderVItem label="Saturation" bind:value={settings.color[1]}>
        <div
          slot="background"
          class="bg"
          style:background="linear-gradient(to right, hsl({settings.color[0] * 360}deg, 0%, 50%), hsl({settings
            .color[0] * 360}deg, 100%, 50%))"
        />
      </SliderVItem>
      <SliderVItem label="Lightness" bind:value={settings.color[2]}>
        <div
          slot="background"
          class="bg"
          style:background="linear-gradient(to right, hsl({settings.color[0] * 100}deg, {settings.color[1] * 100}%, 0%),
          hsl({settings.color[0] * 360}deg, {settings.color[1] * 100}%, 50%), hsl({settings.color[0] * 360}deg, {settings
            .color[1] * 100}%, 100%))"
        />
      </SliderVItem>

      <RangeVItem label="Day brightness" bind:value={settings.dayBrightness}>
        <button class="button revert" on:click={() => (settings.dayBrightness = defaults.dayBrightness)}>
          <Icon data={faArrowRotateBack} />
        </button>
      </RangeVItem>
      <RangeVItem label="Night brightness" bind:value={settings.nightBrightness}>
        <button class="button revert" on:click={() => (settings.nightBrightness = defaults.nightBrightness)}>
          <Icon data={faArrowRotateBack} />
        </button>
      </RangeVItem>
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
    width: 24rem;
    background-color: var(--accent);
    font-size: 2rem;

    .close {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      padding: 0.3rem 0.8rem;
      transition: color 0.2s, background-color 0.2s;

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
    transition: opacity 0.2s, color 0.2s;

    &:hover {
      opacity: 1;
      color: var(--accent);
    }
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
