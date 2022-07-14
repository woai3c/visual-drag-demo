<template>
    <div @click="handleClick">
        <component
            :is="config.component"
            v-if="config.component.startsWith('SVG')"
            ref="component"
            class="component"
            :style="getShapeStyle(config.style)"
            :prop-value="config.propValue"
            :element="config"
        />

        <component
            :is="config.component"
            v-else
            ref="component"
            class="component"
            :style="getStyle(config.style)"
            :prop-value="config.propValue"
            :element="config"
        />
    </div>
</template>

<script>
import { getStyle, getShapeStyle } from '@/utils/style'
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
        getShapeStyle,

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
