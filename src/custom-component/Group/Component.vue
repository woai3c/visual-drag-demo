<template>
  <div class="group">
    <div>
      <component
        :is="item.component"
        v-for="item in propValue"
        :id="'component' + item.id"
        :key="item.id"
        class="component"
        :style="item.groupStyle"
        :prop-value="item.propValue"
        :element="item"
        :request="item.request"
      />
    </div>
  </div>
</template>

<script>
import OnEvent from '../common/OnEvent'

export default {
  extends: OnEvent,
  props: {
    propValue: {
      type: Array,
      default: () => [],
    },
    element: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style lang="scss" scoped>
.group {
  & > div {
    position: relative;
    width: 100%;
    height: 100%;

    .component {
      position: absolute;
    }
  }
}
</style>
