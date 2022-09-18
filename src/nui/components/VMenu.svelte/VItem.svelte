<script lang="ts">
  import { getVMenuContext } from "./vMenuContext";
  import api from "../../api";

  // These cannot be changed during runtime
  export let isFirst = false;
  export let isHidden = false;
  export let isTitle = false;
  export let onAction: (() => void) | undefined = undefined;

  const isSelectable = !isTitle && !isHidden;

  const { vMenu } = getVMenuContext();
  if (isFirst) vMenu.resetIds();
  const index = vMenu.getItemId();
  const selectIndex = isSelectable ? vMenu.getSelectableItemId() : -1;

  const doAction = () => {
    if (!onAction) return;
    api.send("sound", { type: "select" });
    return onAction();
  };

  $: isActive = $vMenu.activeItem === selectIndex;
</script>

{#if index > $vMenu.offset && index <= $vMenu.offset + $vMenu.itemsPerPage + 1}
  <li
    on:click={doAction}
    class:active={isActive}
    class:hidden={isHidden}
    class:title={isTitle}
    on:mouseenter={() => isSelectable && vMenu.setActive(selectIndex)}
  >
    <div class="label"><slot /></div>
    <slot name="icon" />
  </li>
{/if}

<style lang="scss">
  li {
    display: flex;
    align-items: center;
    height: 2.5rem;

    &:not(.title) {
      cursor: pointer;
      padding: 0.7rem 1rem;
      transition: color 0.2s, background-color 0.2s;

      &.active {
        background-color: rgba(250, 250, 250, 0.8);
        color: black;
      }
    }

    &.title {
      padding: 0.7rem 0.5rem 0.3rem;
      font-weight: bold;
    }

    &.hidden {
      display: none;
    }

    .label {
      margin-right: auto;
      padding-right: 1rem;
    }
  }
</style>
