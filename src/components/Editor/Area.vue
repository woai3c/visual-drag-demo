<template>
  <div
    :style="{
      left: start.x + 'px',
      top: start.y + 'px',
      width: width + 'px',
      height: height + 'px',
    }"
    class="area"
  ></div>
</template>

<script>
export default {
  props: {
    start: {
      type: Object,
      default: () => {},
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style lang="scss" scoped>
.area {
  border: 1px solid #70c0ff;
  position: absolute;
}
</style>
