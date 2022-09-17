<script lang="ts">
  import { createVMenuContext } from "./vMenuContext";
  import VSubHeader from "./VSubHeader.svelte";
  import VItem from "./VItem.svelte";
  import api from "../../api";

  export let itemsPerPage = 9;

  const context = createVMenuContext(itemsPerPage);
  const store = context.vMenu;

  $: store.update({ itemsPerPage });
  $: itemCount = Object.keys($store.selectableItems).length;

  const scroll = (delta: number) =>
    store.update({ offset: Math.max(0, Math.min(itemCount - itemsPerPage + 1, $store.offset + delta)) });

  const onWheel = (ev: WheelEvent) => scroll(Math.sign(ev.deltaY));

  $: ($store.activeItem || 1) && api.send("sound", { type: "updown" });
</script>

<div class="content" on:wheel={onWheel}>
  <VSubHeader title="Holospeed settings" activeItem={$store.activeItem + 1} {itemCount} />
  <ul class="menu">
    <!-- this 0th item resets the counter on hot reload in dev mode -->
    <VItem isFirst isHidden />
    <slot />
  </ul>
</div>

<style lang="scss">
  .content {
    background-color: rgba(0, 0, 0, 0.4);
    // backdrop-filter: blur(0.4rem);
  }

  .menu {
    list-style-type: none;
    line-height: 1;
  }
</style>
