<script lang="ts">
  import { Icon } from "svelte-awesome";
  import { faXmark } from "@fortawesome/free-solid-svg-icons";
  import Window from "./components/Window.svelte";
  import VMenu, { VItem, BooleanVItem } from "./components/VMenu.svelte";
</script>

<Window>
  <!-- initialPos={[window.innerWidth * 0.75, window.innerHeight * 0.25]} -->
  <div class="header" slot="header">Holospeed <button class="close"><Icon data={faXmark} scale={1.5} /></button></div>

  <VMenu>
    <BooleanVItem label="Enabled" />

    <VItem isLabel>Position</VItem>

    <VItem isLabel>Color</VItem>
  </VMenu>
</Window>

<style lang="scss">
  .header {
    position: relative;
    padding: 1rem;
    padding-right: 4rem;
    min-width: 20rem;
    background-color: #2a6fb6;
    font-size: 2rem;

    .close {
      appearance: none;
      background: none;
      border: none;
      color: inherit;
      font-size: inherit;

      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      padding: 0.3rem 0.8rem;
      line-height: 1;
      cursor: pointer;
      transition: color 0.3s, background-color 0.3s;

      &:hover {
        color: black;
        background-color: white;
      }
    }
  }
</style>
