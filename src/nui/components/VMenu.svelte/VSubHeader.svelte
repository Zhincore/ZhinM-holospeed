<script lang="ts">
  export let title = "";
  export let activeItem: number;
  export let itemCount: number;
</script>

<div class="subheader">
  <div class="title">{title}</div>

  <div class="position">{activeItem}/{itemCount}</div>
</div>

<style lang="scss">
  .subheader {
    display: flex;
    justify-content: space-between;
    padding: 0.4rem;
    color: var(--accent);
    background-color: black;
    text-transform: uppercase;
  }
</style>
