<script lang="ts">
  import { getVMenuContext } from "./vMenuContext";

  // These cannot be changed during runtime
  export let isFirst = false;
  export let isHidden = false;
  export let isTitle = false;
  export let action: (ev: MouseEvent) => void = () => null;
  export let isAttached = false;

  const isSelectable = !isTitle && !isHidden;

  const context = getVMenuContext();
  const { vMenu } = context;
  if (isFirst) context.itemCount = context.selectableItemCount = 0;
  const index = context.itemCount++;
  const selectIndex = isSelectable ? context.selectableItemCount++ : -1;

  $: if (isSelectable) vMenu.updateItem(selectIndex, { isAttached });
  $: isActive = $vMenu.activeItem === selectIndex;
</script>

{#if isAttached || (index <= $vMenu.offset + $vMenu.itemsPerPage && index > $vMenu.offset)}
  <li
    on:click={action}
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
    }
  }
</style>
