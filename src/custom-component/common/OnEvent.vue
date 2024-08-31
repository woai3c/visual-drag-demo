<script>
import eventBus from '@/utils/eventBus'

export default {
  props: {
    linkage: {
      type: Object,
      default: () => {},
    },
    element: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    if (this.linkage?.data?.length) {
      eventBus.$on('v-click', this.onClick)
      eventBus.$on('v-hover', this.onHover)
    }
  },
  mounted() {
    const { data, duration } = this.linkage || {}
    if (data?.length) {
      this.$el.style.transition = `all ${duration}s`
    }
  },
  beforeDestroy() {
    if (this.linkage?.data?.length) {
      eventBus.$off('v-click', this.onClick)
      eventBus.$off('v-hover', this.onHover)
    }
  },
  methods: {
    changeStyle(data = []) {
      data.forEach((item) => {
        item.style.forEach((e) => {
          if (e.key) {
            this.element.style[e.key] = e.value
          }
        })
      })
    },

    onClick(componentId) {
      const data = this.linkage.data.filter((item) => item.id === componentId && item.event === 'v-click')
      this.changeStyle(data)
    },

    onHover(componentId) {
      const data = this.linkage.data.filter((item) => item.id === componentId && item.event === 'v-hover')
      this.changeStyle(data)
    },
  },
}
</script>
