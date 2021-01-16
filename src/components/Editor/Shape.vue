<template>
    <div class="shape" :class="{ active: this.active }" @click="selectCurComponent" @mousedown="handleMouseDownOnShape">
        <i class="el-icon-refresh-right" v-show="active" @mousedown="handleRotate"></i>
        <div
            class="shape-point"
            v-for="(item, index) in (active? pointList : [])"
            @mousedown="handleMouseDownOnPoint(item)"
            :key="index"
            :style="getPointStyle(item, index)">
        </div>
        <slot></slot>
    </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import runAnimation from '@/utils/runAnimation'
import { mapState } from 'vuex'
import { getRotatedPointCoordinate } from '@/utils/translate'
import calculateComponentPositonAndSize from '@/utils/calculateComponentPositonAndSize'

export default {
    props: {
        active: {
            type: Boolean,
            default: false,
        },
        element: {
            require: true,
            type: Object,
        },
        defaultStyle: {
            require: true,
            type: Object,
        },
        index: {
            require: true,
            type: [Number, String],
        },
    },
    data() {
        return {
            pointList: ['lt', 't', 'rt', 'r', 'lb', 'b', 'rb', 'l'], // 八个方向
            directions: ['nw', 'n', 'ne', 'e', 'sw', 's', 'se', 'w'], // 光标
            cursors: [],
        }
    },
    computed: mapState([
        'curComponent',
    ]),
    mounted() {
        eventBus.$on('runAnimation', () => {
            if (this.element == this.curComponent) {
                console.log(this.curComponent)
                runAnimation(this.$el, this.curComponent.animations)
            }
        })
    },
    methods: {
        // 处理旋转
        handleRotate(e) {
            e.stopPropagation()
            // 初始坐标和初始角度
            const pos = { ...this.defaultStyle }
            const startY = e.clientY
            const startX = e.clientX
            const startRotate = pos.rotate

            // 获取元素中心点位置
            const rect = this.$el.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            // 旋转前的角度
            const rotateDegreeBefore = Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180)

            // 如果元素没有移动，则不保存快照
            let hasMove = false
            const move = (moveEvent) => {
                hasMove = true
                const currX = moveEvent.clientX
                const currY = moveEvent.clientY
                // 旋转后的角度
                const rotateDegreeAfter = Math.atan2(currY - centerY, currX - centerX) / (Math.PI / 180)
                // 获取旋转的角度值
                pos.rotate = startRotate + rotateDegreeAfter - rotateDegreeBefore
                // 修改当前组件样式
                this.$store.commit('setShapeStyle', pos)
            }

            const up = () => {
                hasMove && this.$store.commit('recordSnapshot')
                document.removeEventListener('mousemove', move)
                document.removeEventListener('mouseup', up)
                this.cursors = this.getCursor() // 根据旋转角度获取光标位置
            }

            document.addEventListener('mousemove', move)
            document.addEventListener('mouseup', up)
        },

        getPointStyle(point, index) {
            const { width, height } = this.defaultStyle
            const hasT = /t/.test(point)
            const hasB = /b/.test(point)
            const hasL = /l/.test(point)
            const hasR = /r/.test(point)
            let newLeft = 0
            let newTop = 0
            
            // 四个角的点
            if (point.length === 2) {
                newLeft = hasL? 0 : width
                newTop = hasT? 0 : height
            } else {
                // 上下两点的点，宽度居中
                if (hasT || hasB) {
                    newLeft = width / 2
                    newTop = hasT? 0 : height
                }

                // 左右两边的点，高度居中
                if (hasL || hasR) {
                    newLeft = hasL? 0 : width
                    newTop = Math.floor(height / 2)
                }
            }
            
            const style = {
                marginLeft: hasR? '-4px' : '-4px',
                marginTop: '-4px',
                left: `${newLeft}px`,
                top: `${newTop}px`,
                cursor: this.cursors[index],
            }
            
            return style
        },

        getCursor() {
            // 防止角度有负数，所以 + 360
            const offsetNum = Math.floor(((this.curComponent.style.rotate + 360) % 360) / 45) % 8
            const { directions } = this
            const newDirections = [
                ...directions.slice(offsetNum),
                ...directions.slice(0, offsetNum),
            ]

            return newDirections.map(direction => direction + '-resize')
        },

        handleMouseDownOnShape(e) {
            if (this.element.component != 'v-text') {
                e.preventDefault()
            }

            e.stopPropagation()
            this.$store.commit('setCurComponent', { component: this.element, index: this.index })
            this.cursors = this.getCursor() // 根据旋转角度获取光标位置

            const pos = { ...this.defaultStyle }
            const startY = e.clientY
            const startX = e.clientX
            // 如果直接修改属性，值的类型会变为字符串，所以要转为数值型
            const startTop = Number(pos.top)
            const startLeft = Number(pos.left)

            // 如果元素没有移动，则不保存快照
            let hasMove = false
            const move = (moveEvent) => {
                hasMove = true
                const currX = moveEvent.clientX
                const currY = moveEvent.clientY
                pos.top = currY - startY + startTop
                pos.left = currX - startX + startLeft

                // 修改当前组件样式
                this.$store.commit('setShapeStyle', pos)
                // 等更新完当前组件的样式并绘制到屏幕后再判断是否需要吸附
                // 如果不使用 $nextTick，吸附后将无法移动
                this.$nextTick(() => {
                    // 触发元素移动事件，用于显示标线、吸附功能
                    // 后面两个参数代表鼠标移动方向
                    // currY - startY > 0 true 表示向下移动 false 表示向上移动
                    // currX - startX > 0 true 表示向右移动 false 表示向左移动
                    eventBus.$emit('move', currY - startY > 0, currX - startX > 0)
                })
            }

            const up = () => {
                hasMove && this.$store.commit('recordSnapshot')
                // 触发元素停止移动事件，用于隐藏标线
                eventBus.$emit('unmove')
                document.removeEventListener('mousemove', move)
                document.removeEventListener('mouseup', up)
            }

            document.addEventListener('mousemove', move)
            document.addEventListener('mouseup', up)
        },

        selectCurComponent(e) {
            // 阻止向父组件冒泡
            e.stopPropagation()
            e.preventDefault()
            this.$store.commit('hideContexeMenu')
        },

        handleMouseDownOnPoint(point) {
            const downEvent = window.event
            downEvent.stopPropagation()
            downEvent.preventDefault()
 
            const style = { ...this.defaultStyle }

            const center = {
                x: style.left + style.width / 2,
                y: style.top + style.height / 2,
            }

            // 获取点击的点坐标
            const clickPoint = getRotatedPointCoordinate(style, center, point)

            // 获取对称点的坐标
            const symmetricPoint = {
                x: center.x - (clickPoint.x - center.x),
                y: center.y - (clickPoint.y - center.y),
            }

            // 获取画布位移信息
            const editorRectInfo = document.querySelector('#editor').getBoundingClientRect()

            // 是否需要保存快照
            let needSave = false
            const move = (moveEvent) => {
                needSave = true
                const curPositon = {
                    x: moveEvent.clientX - editorRectInfo.left,
                    y: moveEvent.clientY - editorRectInfo.top,
                }
                
                calculateComponentPositonAndSize(point, style, curPositon, {
                    center,
                    clickPoint,
                    symmetricPoint,
                })

                this.$store.commit('setShapeStyle', style)
            }

            const up = () => {
                document.removeEventListener('mousemove', move)
                document.removeEventListener('mouseup', up)
                needSave && this.$store.commit('recordSnapshot')
            }

            document.addEventListener('mousemove', move)
            document.addEventListener('mouseup', up)
        },
    },
}
</script>

<style lang="scss" scoped>
.shape {
    position: absolute;

    &:hover {
        cursor: move;
    }
}
.active {
    outline: 1px solid #70c0ff;
    user-select: none;
}
.shape-point {
    position: absolute;
    background: #fff;
    border: 1px solid #59c7f9;
    width: 8px;
    height: 8px;
    border-radius: 50%;
}
.el-icon-refresh-right {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    font-weight: 600;
    cursor: grab;
    color: #59c7f9;
    font-size: 22px;
    font-weight: normal;

    &:active {
        cursor: grabbing;
    }
}
</style>