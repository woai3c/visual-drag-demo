<template>
    <div class="editor" id="editor" 
        :class="{ edit: isEdit }"
        :style="{
            width: canvasStyleData.width + 'px',
            height: canvasStyleData.height + 'px',
            transform: 'scale(' + parseInt(canvasStyleData.scale) / 100 + ')'
        }"
        @contextmenu="handleContextMenu"
        @mousedown="handleMouseDown"
    >
        <!-- 网格线 -->
        <Grid />
        
        <!--页面组件列表展示-->
        <Shape v-for="(item, index) in componentData"
            :defaultStyle="item.style"
            :style="getShapeStyle(item.style)"
            :key="item.id"
            :active="item === curComponent"
            :element="item"
            :index="index"
            :class="{ lock: item.isLock }"
        >
            <component
                v-if="item.component != 'v-text'"
                class="component"
                :is="item.component"
                :style="getComponentStyle(item.style)"
                :propValue="item.propValue"
                :element="item"
                :id="'component' + item.id"
            />

            <component
                v-else
                class="component"
                :is="item.component"
                :style="getComponentStyle(item.style)"
                :propValue="item.propValue"
                @input="handleInput"
                :element="item"
                :id="'component' + item.id"
            />
        </Shape>
        <!-- 右击菜单 -->
        <ContextMenu />
        <!-- 标线 -->
        <MarkLine />
        <!-- 选中区域 -->
        <Area :start="start" :width="width" :height="height" v-show="isShowArea" />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Shape from './Shape'
import { getStyle, getComponentRotatedStyle } from '@/utils/style'
import { $ } from '@/utils/utils'
import ContextMenu from './ContextMenu'
import MarkLine from './MarkLine'
import Area from './Area'
import eventBus from '@/utils/eventBus'
import Grid from './Grid'

export default {
    props: {
        isEdit: {
            type: Boolean,
            default: true,
        },
    },
    components: { Shape, ContextMenu, MarkLine, Area, Grid },
    data() {
        return {
            editorX: 0,
            editorY: 0,
            start: { // 选中区域的起点
                x: 0,
                y: 0,
            },
            width: 0,
            height: 0,
            isShowArea: false,
        }
    },
    computed: mapState([
        'componentData',
        'curComponent',
        'canvasStyleData',
        'editor',
    ]),
    mounted() {
        // 获取编辑器元素
        this.$store.commit('getEditor')
        
        eventBus.$on('hideArea', () => {
            this.hideArea()
        })
    },
    methods: {
        handleMouseDown(e) {
            // 如果没有选中组件 在画布上点击时需要调用 e.preventDefault() 防止触发 drop 事件
            if (!this.curComponent || (this.curComponent.component != 'v-text' && this.curComponent.component != 'rect-shape')) {
                e.preventDefault()
            }
            
            this.hideArea()

            // 获取编辑器的位移信息
            const rectInfo = this.editor.getBoundingClientRect()
            this.editorX = rectInfo.x
            this.editorY = rectInfo.y
        
            const startX = e.clientX
            const startY = e.clientY
            this.start.x = startX - this.editorX
            this.start.y = startY - this.editorY
            this.isShowArea = true
            
            const move = (moveEvent) => {
                this.width = Math.abs(moveEvent.clientX - startX)
                this.height = Math.abs(moveEvent.clientY - startY)
                if (moveEvent.clientX < startX) {
                    this.start.x = moveEvent.clientX - this.editorX
                }

                if (moveEvent.clientY < startY) {
                    this.start.y = moveEvent.clientY - this.editorY
                }
            }

            const up = (e) => {
                document.removeEventListener('mousemove', move)
                document.removeEventListener('mouseup', up)

                if (e.clientX == startX && e.clientY == startY) {
                    this.hideArea()
                    return
                }

                this.createGroup()
            }

            document.addEventListener('mousemove', move)
            document.addEventListener('mouseup', up)
        },

        hideArea() {
            this.isShowArea = 0
            this.width = 0
            this.height = 0
        },

        createGroup() {
            // 获取选中区域的组件
            const areaData = this.getSelectArea()
            if (areaData.length <= 1) {
                this.hideArea()
                return
            }
            
            // 根据选中区域和区域中每个组件的位移信息来创建 Group 组件
            // 要遍历选择区域的每个组件，获取它们的 left top right bottom 信息来进行比较
            let top = Infinity, left = Infinity
            let right = -Infinity, bottom = -Infinity
            areaData.forEach(component => {
                let style = {}
                if (component.component == 'Group') {
                    component.propValue.forEach(item => {
                        const rectInfo = $(`#component${item.id}`).getBoundingClientRect()
                        style.left = rectInfo.left - this.editorX
                        style.top = rectInfo.top - this.editorY
                        style.right = rectInfo.right - this.editorX
                        style.bottom = rectInfo.bottom - this.editorY

                        if (style.left < left) left = style.left
                        if (style.top < top) top = style.top
                        if (style.right > right) right = style.right
                        if (style.bottom > bottom) bottom = style.bottom
                    })
                } else {
                    style = getComponentRotatedStyle(component.style)
                }

                if (style.left < left) left = style.left
                if (style.top < top) top = style.top
                if (style.right > right) right = style.right
                if (style.bottom > bottom) bottom = style.bottom
            })

            this.start.x = left
            this.start.y = top
            this.width = right - left
            this.height = bottom - top

            this.$store.commit('setAreaData', {
                style: {
                    left,
                    top,
                    width: this.width,
                    height: this.height,
                },
                components: areaData,
            })
        },

        getSelectArea() {
            const result = []
            const { x, y } = this.start
            this.componentData.forEach(component => {
                if (component.isLock) return

                const { left, top, width, height } = component.style
                if (x <= left && y <= top && (left + width <= x + this.width) && (top + height <= y + this.height)) {
                    result.push(component)
                }
            })

            return result
        },

        handleContextMenu(e) {
            e.stopPropagation()
            e.preventDefault()

            // 计算菜单相对于编辑器的位移
            let target = e.target
            let top = e.offsetY
            let left = e.offsetX
            while (target instanceof SVGElement) {
                target = target.parentNode
            }

            while (!target.className.includes('editor')) {
                left += target.offsetLeft
                top += target.offsetTop
                target = target.parentNode
            }

            this.$store.commit('showContextMenu', { top, left })
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
            // 根据文本组件高度调整 shape 高度
            this.$store.commit('setShapeStyle', { height: this.getTextareaHeight(element, value) })
        },

        getTextareaHeight(element, text) {
            let { lineHeight, fontSize, height } = element.style
            if (lineHeight === '') {
                lineHeight = 1.5
            }

            const newHeight = (text.split('<br>').length - 1) * lineHeight * fontSize
            return height > newHeight? height : newHeight
        },
    },
}
</script>

<style lang="scss" scoped>
.editor {
    position: relative;
    background: #fff;
    margin: auto;

    .lock {
        opacity: .5;
    }
}
.edit {
    .component {
        outline: none;
        width: 100%;
        height: 100%;
    }
}
</style>