<script lang="ts">
  export let isLabel = false;
  export let action: () => void = () => null;
</script>

<li on:click={action} class:label={isLabel}><slot /> <slot name="icon" /></li>

<style lang="scss">
  li:not(.label) {
    display: flex;
    justify-content: space-between;

    cursor: pointer;
    padding: 0.7rem 1rem;
    transition: color 0.3s, background-color 0.3s;

    &:focus,
    &:hover {
      background-color: #eee;
      color: black;
    }
  }

  li.label {
    padding: 0.3rem 0.5rem;
    font-weight: bold;
  }
</style>
