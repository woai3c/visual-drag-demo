<template>
    <div class="group">
        <div>
             <template v-for="item in propValue">
                <component
                    class="component"
                    :is="item.component"
                    :style="item.groupStyle"
                    :propValue="item.propValue"
                    :key="item.id"
                    :id="'component' + item.id"
                    :element="item"
                />
            </template>
        </div>
    </div>
</template>

<script>
import { getStyle } from '@/utils/style'

export default {
    props: {
        propValue: {
            type: Array,
            default: () => [],
        },
        element: {
            type: Object,
        },
    },
    data() {
        return {
            groupStyle: {},
        }
    },
    created() {
        this.parentStyle = this.element.style
        this.propValue.forEach(component => {
            // component.groupStyle 的 top left 是相对于 group 组件的位置
            // 如果已存在 component.groupStyle，说明已经计算过一次了。不需要再次计算
            if (!Object.keys(component.groupStyle).length) {
                const style = { ...component.style }
                style.top -= this.parentStyle.top
                style.left -= this.parentStyle.left
                component.groupStyle = getStyle(style)
            }
        })
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