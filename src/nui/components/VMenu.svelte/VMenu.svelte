<script lang="ts">
</script>

<div class="content">
  <ul class="menu">
    <slot />
  </ul>
</div>

<style lang="scss">
  .content {
    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(0.4rem);
  }

  .menu {
    list-style-type: none;
    line-height: 1;
  }
</style>
