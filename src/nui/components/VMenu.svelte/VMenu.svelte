<script lang="ts">
  import { Icon } from "svelte-awesome";
  import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
  import { createVMenuContext } from "./vMenuContext";
  import VItem from "./VItem.svelte";
  import api from "../../api";

  export let itemsPerPage = 9;

  const context = createVMenuContext(itemsPerPage);
  const store = context.vMenu;

  $: store.update({ itemsPerPage });

  const scroll = (delta: number) =>
    store.update({
      offset: Math.max(0, Math.min($store.selectableItemCount - itemsPerPage + 1, $store.offset + delta)),
    });

  const onWheel = (ev: WheelEvent) => scroll(Math.sign(ev.deltaY));

  $: ($store.activeItem || 1) && api.send("sound", { type: "updown" });
</script>

<div class="content" on:wheel={onWheel}>
  <div class="subheader">
    <div class="title">Holospeed settings</div>

    <div class="position">{$store.activeItem + 1}/{$store.selectableItemCount}</div>
  </div>

  <ul class="menu">
    <!-- this 0th item resets the counters on hot reload in dev mode -->
    <VItem isFirst isHidden />
    <slot />
  </ul>
</div>

{#if $store.itemCount > $store.itemsPerPage}
  <div class="footer">
    <Icon data={faAngleUp} scale={1.3} />
    <Icon data={faAngleDown} scale={1.3} />
  </div>
{/if}

<style lang="scss">
  .content {
    background-color: rgba(0, 0, 0, 0.4);
    // backdrop-filter: blur(0.4rem);
  }

  .footer {
    background-color: rgba(0, 0, 0, 0.7);
    margin-top: 0.4rem;
    padding: 0.3rem;
    line-height: 0;
    text-align: center;
  }

  .menu {
    list-style-type: none;
    line-height: 1;
  }

  .subheader {
    display: flex;
    justify-content: space-between;
    padding: 0.4rem;
    color: var(--accent);
    background-color: black;
    text-transform: uppercase;
  }
</style>
