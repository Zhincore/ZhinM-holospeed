<script lang="ts">
  import { fade } from "svelte/transition";
  import { Icon } from "svelte-awesome";
  import { faCheck } from "@fortawesome/free-solid-svg-icons";
  import { faSquare } from "@fortawesome/free-regular-svg-icons";
  import VItem from "../VItem.svelte";

  export let label: string;
  export let value = false;
</script>

<VItem action={() => (value = !value)}>
  {label}

  <div slot="icon" class="icon">
    <div><Icon data={faSquare} scale={1.1} /></div>
    {#if value}
      <div transition:fade|local={{ duration: 200 }}><Icon data={faCheck} scale={1.35} /></div>
    {/if}
    <!-- <input type="checkbox" bind:checked={value} /> -->
  </div>
</VItem>

<style lang="scss">
  .icon {
    position: relative;
    width: 1rem;
    text-align: center;

    & > div {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      &:nth-of-type(1) {
        opacity: 0.5;
      }
      &:nth-of-type(2) {
        transform: translate(-50%, -50%);
      }
    }
  }
</style>
