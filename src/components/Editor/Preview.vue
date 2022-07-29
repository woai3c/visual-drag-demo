<template>
    <div v-if="show" ref="container" class="bg">
        <el-button v-if="!isScreenshot" class="close" @click="close">关闭</el-button>
        <el-button v-else class="close" @click="htmlToImage">确定</el-button>
        <div class="canvas-container">
            <div
                class="canvas"
                :style="{
                    ...getCanvasStyle(canvasStyleData),
                    width: changeStyleWithScale(canvasStyleData.width) + 'px',
                    height: changeStyleWithScale(canvasStyleData.height) + 'px',
                }"
            >
                <ComponentWrapper
                    v-for="(item, index) in componentData"
                    :key="index"
                    :config="item"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { getStyle, getCanvasStyle } from '@/utils/style'
import { mapState } from 'vuex'
import ComponentWrapper from './ComponentWrapper'
import { changeStyleWithScale } from '@/utils/translate'
import { toPng } from 'html-to-image'

export default {
    components: { ComponentWrapper },
    model: {
        prop: 'show',
        event: 'change',
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        isScreenshot: {
            type: Boolean,
            default: false,
        },
    },
    computed: mapState([
        'componentData',
        'canvasStyleData',
    ]),
    methods: {
        getStyle,
        getCanvasStyle,
        changeStyleWithScale,

        close() {
            this.$emit('change', false)
        },

        htmlToImage() {
            toPng(this.$refs.container.querySelector('.canvas'))
            .then(dataUrl => {
                const a = document.createElement('a')
                a.setAttribute('download', 'screenshot')
                a.href = dataUrl
                a.click()
            })
            .catch(error => {
                console.error('oops, something went wrong!', error)
            })
            .finally(this.close)
        },
    },
}
</script>

<style lang="scss" scoped>
.bg {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: fixed;
    background: rgb(0, 0, 0, .5);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    padding: 20px;

    .canvas-container {
        width: calc(100% - 40px);
        height: calc(100% - 120px);
        overflow: auto;

        .canvas {
            background: #fff;
            position: relative;
            margin: auto;
        }
    }

    .close {
        position: absolute;
        right: 20px;
        top: 20px;
    }
}
</style>
