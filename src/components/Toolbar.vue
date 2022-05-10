<template>
    <div>
        <div class="toolbar">
            <el-button @click="undo">撤消</el-button>
            <el-button @click="redo">重做</el-button>
            <label for="input" class="insert">插入图片</label>
            <input
                id="input"
                type="file"
                hidden
                @change="handleFileChange"
            />
            <el-button style="margin-left: 10px;" @click="preview">预览</el-button>
            <el-button @click="save">保存</el-button>
            <el-button @click="clearCanvas">清空画布</el-button>
            <el-button :disabled="!areaData.components.length" @click="compose">组合</el-button>
            <el-button
                :disabled="!curComponent || curComponent.isLock || curComponent.component != 'Group'"
                @click="decompose"
            >
                拆分
            </el-button>

            <el-button :disabled="!curComponent || curComponent.isLock" @click="lock">锁定</el-button>
            <el-button :disabled="!curComponent || !curComponent.isLock" @click="unlock">解锁</el-button>
            <div class="canvas-config">
                <span>画布大小</span>
                <input v-model="canvasStyleData.width">
                <span>*</span>
                <input v-model="canvasStyleData.height">
            </div>
            <div class="canvas-config">
                <span>画布比例</span>
                <input v-model="scale" @input="handleScaleChange"> %
            </div>
        </div>

        <!-- 预览 -->
        <Preview v-model="isShowPreview" @change="handlePreviewChange" />
    </div>
</template>

<script>
import generateID from '@/utils/generateID'
import toast from '@/utils/toast'
import { mapState } from 'vuex'
import Preview from '@/components/Editor/Preview'
import { commonStyle, commonAttr } from '@/custom-component/component-list'
import eventBus from '@/utils/eventBus'
import { deepCopy } from '@/utils/utils'

export default {
    components: { Preview },
    data() {
        return {
            isShowPreview: false,
            needToChange: [
                'top',
                'left',
                'width',
                'height',
                'fontSize',
            ],
            scale: '100%',
            timer: null,
        }
    },
    computed: mapState([
        'componentData',
        'canvasStyleData',
        'areaData',
        'curComponent',
        'curComponentIndex',
    ]),
    created() {
        eventBus.$on('preview', this.preview)
        eventBus.$on('save', this.save)
        eventBus.$on('clearCanvas', this.clearCanvas)

        this.scale = this.canvasStyleData.scale
    },
    methods: {
        format(value) {
            const scale = this.scale
            return value * parseInt(scale) / 100
        },

        getOriginStyle(value) {
            const scale = this.canvasStyleData.scale
            const result = value / (parseInt(scale) / 100)
            return result
        },

        handleScaleChange() {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                // 画布比例设一个最小值，不能为 0
                // eslint-disable-next-line no-bitwise
                this.scale = (~~this.scale) || 1
                const componentData = deepCopy(this.componentData)
                componentData.forEach(component => {
                    Object.keys(component.style).forEach(key => {
                        if (this.needToChange.includes(key)) {
                            // 根据原来的比例获取样式原来的尺寸
                            // 再用原来的尺寸 * 现在的比例得出新的尺寸
                            // 不能用 Math.round 防止 1 px 的边框变 0
                            component.style[key] = Math.ceil(this.format(this.getOriginStyle(component.style[key])))
                        }
                    })
                })

                this.$store.commit('setComponentData', componentData)
                // 更新画布数组后，需要重新设置当前组件，否则在改变比例后，直接拖动圆点改变组件大小不会生效 https://github.com/woai3c/visual-drag-demo/issues/74
                this.$store.commit('setCurComponent', { component: componentData[this.curComponentIndex], index: this.curComponentIndex })
                this.$store.commit('setCanvasStyle', {
                    ...this.canvasStyleData,
                    scale: this.scale,
                })
            }, 1000)
        },

        lock() {
            this.$store.commit('lock')
        },

        unlock() {
            this.$store.commit('unlock')
        },

        compose() {
            this.$store.commit('compose')
            this.$store.commit('recordSnapshot')
        },

        decompose() {
            this.$store.commit('decompose')
            this.$store.commit('recordSnapshot')
        },

        undo() {
            this.$store.commit('undo')
        },

        redo() {
            this.$store.commit('redo')
        },

        handleFileChange(e) {
            const file = e.target.files[0]
            if (!file.type.includes('image')) {
                toast('只能插入图片')
                return
            }

            const reader = new FileReader()
            reader.onload = (res) => {
                const fileResult = res.target.result
                const img = new Image()
                img.onload = () => {
                    this.$store.commit('addComponent', {
                        component: {
                            ...commonAttr,
                            id: generateID(),
                            component: 'Picture',
                            label: '图片',
                            icon: '',
                            propValue: fileResult,
                            style: {
                                ...commonStyle,
                                top: 0,
                                left: 0,
                                width: img.width,
                                height: img.height,
                            },
                        },
                    })

                    this.$store.commit('recordSnapshot')

                    // 修复重复上传同一文件，@change 不触发的问题
                    document.querySelector('#input').setAttribute('type', 'text')
                    document.querySelector('#input').setAttribute('type', 'file')
                }

                img.src = fileResult
            }

            reader.readAsDataURL(file)
        },

        preview() {
            this.isShowPreview = true
            this.$store.commit('setEditMode', 'preview')
        },

        save() {
            localStorage.setItem('canvasData', JSON.stringify(this.componentData))
            localStorage.setItem('canvasStyle', JSON.stringify(this.canvasStyleData))
            this.$message.success('保存成功')
        },

        clearCanvas() {
            this.$store.commit('setCurComponent', { component: null, index: null })
            this.$store.commit('setComponentData', [])
            this.$store.commit('recordSnapshot')
        },

        handlePreviewChange() {
            this.$store.commit('setEditMode', 'edit')
        },
    },
}
</script>

<style lang="scss" scoped>
.toolbar {
    padding: 15px 10px;
    white-space: nowrap;
    overflow-x: auto;
    background: #fff;
    border-bottom: 1px solid #ddd;

    .canvas-config {
        display: inline-block;
        margin-left: 10px;
        font-size: 14px;
        color: #606266;

        input {
            width: 50px;
            margin-left: 10px;
            outline: none;
            padding: 0 5px;
            border: 1px solid #ddd;
            color: #606266;
        }

        span {
            margin-left: 10px;
        }
    }

    .insert {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        transition: .1s;
        font-weight: 500;
        padding: 9px 15px;
        font-size: 12px;
        border-radius: 3px;
        margin-left: 10px;

        &:active {
            color: #3a8ee6;
            border-color: #3a8ee6;
            outline: 0;
        }

        &:hover {
            background-color: #ecf5ff;
            color: #3a8ee6;
        }
    }
}
</style>
