<template>
    <div class="editor" id="editor" 
        :class="{ edit: isEdit }" :style="{ width: canvasStyleData.width + 'px', height: canvasStyleData.height + 'px' }"
        @contextmenu="handleContextMenu"
    >
        <!--页面组件列表展示-->
        <Shape v-for="(item, index) in componentData"
            :defaultStyle="item.style"
            :style="getShapeStyle(item.style)"
            :key="item.id"
            :active="item === curComponent"
            :element="item"
            :index="index"
        >
            <component
                v-if="item.component != 'v-text'"
                class="component"
                :is="item.component"
                :style="getComponentStyle(item.style)"
                :propValue="item.propValue"
            />

            <component
                v-else
                class="component"
                :is="item.component"
                :style="getComponentStyle(item.style)"
                :propValue="item.propValue"
                @input="handleInput"
                :element="item"
            />
        </Shape>
        <!-- 右击菜单 -->
        <ContextMenu />
        <!-- 标线 -->
        <MarkLine />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Shape from './Shape'
import getStyle from '@/utils/style'
import ContextMenu from './ContextMenu'
import MarkLine from './MarkLine'

export default {
    props: {
        isEdit: {
            type: Boolean,
            default: true,
        },
    },
    components: { Shape, ContextMenu, MarkLine },
    computed: mapState([
        'componentData',
        'curComponent',
        'canvasStyleData',
    ]),
    methods: {
        handleContextMenu(e) {
            e.stopPropagation()
            e.preventDefault()

            // 计算菜单相对于编辑器的位移
            let target = e.target
            let top = e.offsetY
            let left = e.offsetX
            while (!target.className.includes('editor')) {
                left += target.offsetLeft
                top += target.offsetTop
                target = target.parentNode
            }

            this.$store.commit('showContexeMenu', { top, left })
        },

        getShapeStyle(style) {
            const result = {};
            ['width', 'height', 'top', 'left', 'rotate'].forEach(attr => {
                if (attr != 'rotate') {
                    result[attr] = style[attr] + 'px'
                } else {
                    result.transform = 'rotate(' + style[attr] + 'deg)'
                }
            })

            return result
        },

        getComponentStyle(style) {
            return getStyle(style, ['top', 'left', 'width', 'height', 'rotate'])
        },

        handleInput(element, value) {
            element.propValue = value
            // 根据文本组件高度调整 shape 高度
            this.$store.commit('setShapeStyle', { height: this.getTextareaHeight(element, value) })
        },

        getTextareaHeight(element, text) {
            let { lineHeight, fontSize, height } = element.style
            if (lineHeight === '') {
                lineHeight = 1.5
            }

            const newHeight = text.split('\n').length * lineHeight * fontSize
            return height > newHeight? height : newHeight
        },
    },
}
</script>

<style lang="scss" scoped>
.editor {
    position: relative;
    background: #fff;
    flex-shrink: 0;
}
.edit {
    .component {
        outline: none;
        width: 100%;
        height: 100%;
    }
}
</style>