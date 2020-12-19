<template>
    <div class="mark-line">
        <div 
            v-for="line in lines"
            :key="line"
            class="line"
            :class="line.includes('x')? 'xline' : 'yline'"
            :ref="line"
            v-show="lineStatus[line] || false"
        ></div>
    </div>
</template>

<script>
import eventBus from '@/utils/eventBus'

export default {
    data() {
        return {
            lines: ['xt', 'xc', 'xb', 'yl', 'yc', 'yr'], // 分别对应三条横线和三条竖线
            diff: 3, // 相距 dff 像素将自动吸附
            lineStatus: {
                xt: false,
                xc: false,
                xb: false,
                yl: false,
                yc: false,
                yr: false,
            },
            editor: null,
        }
    },
    mounted() {
        this.editor = document.querySelector('#editor')
        // 监听元素移动和不移动的事件
        eventBus.$on('move', (dragNode, isDownward, isRightward) => {
            this.showLine(dragNode, isDownward, isRightward)
        })

        eventBus.$on('unmove', () => {
            this.hideLine()
        })
    },
    methods: {
        hideLine() {
            Object.keys(this.lineStatus).forEach(line => {
                this.lineStatus[line] = false
            })
        },

        showLine(dragNode, isDownward, isRightward) {
            const lines = this.$refs
            const components = document.querySelectorAll('.shape')
            const dragNodeRectInfo = this.getNodeRelativePosition(dragNode)
            const dragNodeHalfwidth = dragNodeRectInfo.width / 2
            const dragNodeHalfHeight = dragNodeRectInfo.height / 2
            
            this.hideLine()
            components.forEach(node => {
                if (node == dragNode) return
                const { top, height, bottom, left, width, right } = this.getNodeRelativePosition(node)
                const nodeHalfwidth = width / 2
                const nodeHalfHeight = height / 2

                const conditions = {
                    top: [
                        {
                            isNearly: this.isNearly(dragNodeRectInfo.top, top),
                            lineNode: lines.xt[0], // xt
                            line: 'xt',
                            dragShift: top,
                            lineShift: top,
                        },
                        {
                            isNearly: this.isNearly(dragNodeRectInfo.bottom, top),
                            lineNode: lines.xt[0], // xt
                            line: 'xt',
                            dragShift: top - dragNodeRectInfo.height,
                            lineShift: top,
                        },
                        {
                            // 组件与拖拽节点的中间是否对齐
                            isNearly: this.isNearly(dragNodeRectInfo.top + dragNodeHalfHeight, top + nodeHalfHeight),
                            lineNode: lines.xc[0], // xc
                            line: 'xc',
                            dragShift: top + nodeHalfHeight - dragNodeHalfHeight,
                            lineShift: top + nodeHalfHeight,
                        },
                        {
                            isNearly: this.isNearly(dragNodeRectInfo.top, bottom),
                            lineNode: lines.xb[0], // xb
                            line: 'xb',
                            dragShift: bottom,
                            lineShift: bottom,
                        },
                        {
                            isNearly: this.isNearly(dragNodeRectInfo.bottom, bottom),
                            lineNode: lines.xb[0], // xb
                            line: 'xb',
                            dragShift: bottom - dragNodeRectInfo.height,
                            lineShift: bottom,
                        },
                    ],
                    left: [
                        {
                            isNearly: this.isNearly(dragNodeRectInfo.left, left),
                            lineNode: lines.yl[0], // yl
                            line: 'yl',
                            dragShift: left,
                            lineShift: left,
                        },
                        {
                            isNearly: this.isNearly(dragNodeRectInfo.right, left),
                            lineNode: lines.yl[0], // yl
                            line: 'yl',
                            dragShift: left - dragNodeRectInfo.width,
                            lineShift: left,
                        },
                        {
                            // 组件与拖拽节点的中间是否对齐
                            isNearly: this.isNearly(dragNodeRectInfo.left + dragNodeHalfwidth, left + nodeHalfwidth),
                            lineNode: lines.yc[0], // yc
                            line: 'yc',
                            dragShift: left + nodeHalfwidth - dragNodeHalfwidth,
                            lineShift: left + nodeHalfwidth,
                        },
                        {
                            isNearly: this.isNearly(dragNodeRectInfo.left, right),
                            lineNode: lines.yr[0], // yr
                            line: 'yr',
                            dragShift: right,
                            lineShift: right,
                        },
                        {
                            isNearly: this.isNearly(dragNodeRectInfo.right, right),
                            lineNode: lines.yr[0], // yr
                            line: 'yr',
                            dragShift: right - dragNodeRectInfo.width,
                            lineShift: right,
                        },
                    ],
                }
                
                const needToShow = []
                Object.keys(conditions).forEach(key => {
                    // 遍历符合的条件并处理
                    conditions[key].forEach((condition) => {
                        if (!condition.isNearly) return
                        // 修改当前组件位移
                        this.$store.commit('setShapePosStyle', { key, value: condition.dragShift })
                        condition.lineNode.style[key] = `${condition.lineShift}px`
                        needToShow.push(condition.line)
                    })
                })

                // 同一方向上同时显示三条线可能不太美观，因此才有了这个解决方案
                // 同一方向上的线只显示一条，例如多条横条只显示一条横线
                if (needToShow.length) { 
                    this.chooseTheTureLine(needToShow, isDownward, isRightward)
                }
            })
        },

        chooseTheTureLine(needToShow, isDownward, isRightward) {
            // 如果鼠标向右移动 则按从右到左的顺序显示竖线 否则按相反顺序显示
            // 如果鼠标向下移动 则按从下到上的顺序显示横线 否则按相反顺序显示
            if (isRightward) {
                if (needToShow.includes('yr')) {
                    this.lineStatus.yr = true
                } else if (needToShow.includes('yc')) {
                    this.lineStatus.yc = true
                } else if (needToShow.includes('yl')) {
                    this.lineStatus.yl = true
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (needToShow.includes('yl')) {
                    this.lineStatus.yl = true
                } else if (needToShow.includes('yc')) {
                    this.lineStatus.yc = true
                } else if (needToShow.includes('yr')) {
                    this.lineStatus.yr = true
                }
            }

            if (isDownward) {
                if (needToShow.includes('xb')) {
                    this.lineStatus.xb = true
                } else if (needToShow.includes('xc')) {
                    this.lineStatus.xc = true
                } else if (needToShow.includes('xt')) {
                    this.lineStatus.xt = true
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (needToShow.includes('xt')) {
                    this.lineStatus.xt = true
                } else if (needToShow.includes('xc')) {
                    this.lineStatus.xc = true
                } else if (needToShow.includes('xb')) {
                    this.lineStatus.xb = true
                }
            }
        },

        isNearly(dragValue, targetValue) {
            return Math.abs(dragValue - targetValue) <= this.diff
        },

        // 获取节点相对编辑器的位置
        getNodeRelativePosition(node) {
            let { top, height, bottom, left, width, right } = node.getBoundingClientRect() 
            const editorRectInfo = this.editor.getBoundingClientRect()

            left -= editorRectInfo.left
            top -= editorRectInfo.top
            right -= editorRectInfo.left
            bottom -= editorRectInfo.top

            return { top, height, bottom, left, width, right }
        },
    },
}
</script>

<style lang="scss" scoped>
.mark-line {
    height: 100%;
}
.line {
    background: #59c7f9;
    position: absolute;
    z-index: 1000;
}
.xline {
    width: 100%;
    height: 1px;
}
.yline {
    width: 1px;
    height: 100%;
}
</style>