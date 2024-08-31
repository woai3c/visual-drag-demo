<template>
  <div class="rect-shape">
    <v-text :prop-value="element.propValue" :element="element" />
  </div>
</template>

<script>
import OnEvent from '../common/OnEvent'

export default {
  extends: OnEvent,
  props: {
    propValue: {
      type: String,
      required: true,
      default: '',
    },
    element: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss" scoped>
.rect-shape {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
