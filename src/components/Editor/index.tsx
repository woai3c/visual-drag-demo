import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { mapState } from 'vuex'
import Shape from './Shape.vue'
import { getStyle, getComponentRotatedStyle } from '@/utils/style'
import { $ } from '@/utils/utils'
import ContextMenu from './ContextMenu.vue'
import MarkLine from './MarkLine.vue'
import Area from './Area'
import eventBus from '@/utils/eventBus'
import Grid from './Grid.vue'
import { changeStyleWithScale } from '@/utils/translate'
import s from './index.module.scss'

@Component({
    computed: mapState([
        'componentData',
        'curComponent',
        'canvasStyleData',
        'editor',
    ])
})
export default class Editor extends Vue {
    @Prop({ type: Boolean, default: true}) isEdit;
    
    componentData
    curComponent
    canvasStyleData
    editor

    editorX = 0
    editorY = 0
    start = { // 选中区域的起点
        x: 0,
        y: 0,
    }
    width = 0
    height = 0
    isShowArea = false

    mounted() {
        // 获取编辑器元素
        this.$store.commit('getEditor')

        eventBus.$on('hideArea', () => {
            this.hideArea()
        })
    }

    changeStyleWithScale(){
        changeStyleWithScale();
    }

    handleMouseDown(e) {
        // 如果没有选中组件 在画布上点击时需要调用 e.preventDefault() 防止触发 drop 事件
        if (!this.curComponent || (this.curComponent.component != 'v-text' && this.curComponent.component != 'rect-shape')) {
            e.preventDefault()
        }

        this.hideArea()

        // 获取编辑器的位移信息，每次点击时都需要获取一次。主要是为了方便开发时调试用。
        const rectInfo = this.editor.getBoundingClientRect()
        this.editorX = rectInfo.x
        this.editorY = rectInfo.y

        const startX = e.clientX
        const startY = e.clientY
        this.start.x = startX - this.editorX
        this.start.y = startY - this.editorY
        // 展示选中区域
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
    }

    hideArea() {
        this.isShowArea = !!0
        this.width = 0
        this.height = 0

        this.$store.commit('setAreaData', {
            style: {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
            },
            components: [],
        })
    }

    createGroup() {
        // 获取选中区域的组件数据
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
            let style: any = {}
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

        // 设置选中区域位移大小信息和区域内的组件数据
        this.$store.commit('setAreaData', {
            style: {
                left,
                top,
                width: this.width,
                height: this.height,
            },
            components: areaData,
        })
    }

    getSelectArea() {
        const result = []
        // 区域起点坐标
        const { x, y } = this.start
        // 计算所有的组件数据，判断是否在选中区域内
        this.componentData.forEach(component => {
            if (component.isLock) return

            const { left, top, width, height } = getComponentRotatedStyle(component.style)
            if (x <= left && y <= top && (left + width <= x + this.width) && (top + height <= y + this.height)) {
                result.push(component)
            }
        })

        // 返回在选中区域内的所有组件
        return result
    }

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
    }

    getShapeStyle(style) {
        const result: any = {};
        ['width', 'height', 'top', 'left', 'rotate', 'zIndex'].forEach(attr => {
            if (attr === 'zIndex') {
                result[attr] = style[attr]
            } else if (attr != 'rotate') {
                result[attr] = style[attr] + 'px'
            } else {
                result.transform = 'rotate(' + style[attr] + 'deg)'
            }
        })

        return result
    }

    getComponentStyle(style) {
        return getStyle(style, ['top', 'left', 'width', 'height', 'rotate'])
    }

    handleInput(element, value) {
        // 根据文本组件高度调整 shape 高度
        this.$store.commit('setShapeStyle', { height: this.getTextareaHeight(element, value) })
    }

    getTextareaHeight(element, text) {
        let { lineHeight, fontSize, height } = element.style
        if (lineHeight === '') {
            lineHeight = 1.5
        }

        const newHeight = (text.split('<br>').length - 1) * lineHeight * fontSize
        return height > newHeight ? height : newHeight
    }

    render(h) {
        return <div
            id="editor"
            class={[s.editor, this.isEdit ? s.edit : '']}
            style={{
                width: changeStyleWithScale(this.canvasStyleData.width) + 'px',
                height: changeStyleWithScale(this.canvasStyleData.height) + 'px',
            }}
            onContextmenu={this.handleContextMenu}
            onMousedown={this.handleMouseDown}
    >
        {/* <!-- 网格线 --> */}
        <Grid />

        {/* <!--页面组件列表展示--> */}
        {this.componentData.map((item, index) => <Shape
            key={item.id}
            default-style={item.style}
            style={this.getShapeStyle(item.style)}
            active={item.id === (this.curComponent || {}).id}
            element={item}
            index={index}
            class={[item.isLock ? s.lock : '' ]}
        >
            {item.component != 'v-text' && h(item.component, {
                props: {
                    id: 'component' + item.id,
                    propValue: item.propValue,
                    element: item
                },
                style: this.getComponentStyle(item.style),
                class: s.component,
            })}
            {item.component == 'v-text' && h(item.component, {
                props: {
                    id: 'component' + item.id,
                    propValue: item.propValue,
                    element: item,
                },
                class: s.component,
                style: this.getComponentStyle(item.style),
                events: {
                    input: this.handleInput,
                }
            })}
        </Shape>)}
        {/* <!-- 右击菜单 --> */}
        <ContextMenu />
        {/* <!-- 标线 --> */}
        <MarkLine />
        {/* <!-- 选中区域 --> */}
        <Area
            v-show={this.isShowArea}
            start={this.start}
            width={this.width}
            height={this.height}
        />
    </div>
    }
}
