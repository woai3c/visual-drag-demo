<template>
    <div @click="handleClick">
        <component
            :is="config.component"
            ref="component"
            class="component"
            :style="getStyle(config.style)"
            :prop-value="config.propValue"
            :element="config"
        />
    </div>
</template>

<script>
import { getStyle } from '@/utils/style'
import runAnimation from '@/utils/runAnimation'
import { mixins } from '@/utils/events'

export default {
    mixins: [mixins],
    props: {
        config: {
            type: Object,
            require: true,
            default: () => {},
        },
    },
    mounted() {
        runAnimation(this.$refs.component.$el, this.config.animations)
    },
    methods: {
        getStyle,

        handleClick() {
            const events = this.config.events
            Object.keys(events).forEach(event => {
                this[event](events[event])
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.component {
    position: absolute;
}
</style>
