<template>
    <div class="animation-list">
        <div class="div-animation">
            <el-button @click="isShowAnimation = true">添加动画</el-button>
            <el-button @click="previewAnimate">预览动画</el-button>
            <div>
                <el-tag
                    v-for="(tag, index) in curComponent.animations"
                    :key="index"
                    closable
                    @close="removeAnimation(index)"
                >
                    {{ tag.label }}
                </el-tag>
            </div>
        </div>

        <!-- 选择动画 -->
        <Modal v-model="isShowAnimation">
            <el-tabs v-model="animationActiveName">
                <el-tab-pane v-for="item in animationClassData" :key="item.label" :label="item.label" :name="item.label">
                    <el-scrollbar class="animate-container">
                        <div
                            :ref="animate.value"
                            class="animate"
                            v-for="animate in item.children"
                            :key="animate.value"
                            @mouseenter="runAnimation(animate)"
                            @click="addAnimation(animate)"
                        >
                            <div>
                                {{ animate.label }}
                            </div>
                        </div>
                    </el-scrollbar>
                </el-tab-pane>
            </el-tabs>
        </Modal>
    </div>
</template>

<script>
import Modal from '@/components/Modal'
import eventBus from '@/utils/eventBus'
import animationClassData from '@/utils/animationClassData'
import { mapState } from 'vuex'
import runAnimation from '@/utils/runAnimation'

export default {
    components: { Modal },
    data() {
        return {
            isShowAnimation: false,
            hoverPreviewAnimate: '',
            animationActiveName: '进入',
            animationClassData,
            showAnimatePanel: false,
            timer: null,
        }
    },
    computed: mapState([
        'curComponent',
    ]),
    methods: {
        addAnimation(animate) {
            this.$store.commit('addAnimation', animate)
            this.isShowAnimation = false
        },

        previewAnimate() {
            eventBus.$emit('runAnimation')
        },

        removeAnimation(index) {
            this.$store.commit('removeAnimation', index)
        },

        async runAnimation(animate) {
            if (animate.pending) return

            animate.pending = true
            await runAnimation(this.$refs[animate.value][0], [animate])
            animate.pending = false
        },
    },
}
</script>

<style lang="scss">
.animation-list {
    .div-animation {
        text-align: center;

        & > div {
            margin-top: 20px;
        }

        .el-tag {
            display: block;
            width: 50%;
            margin: auto;
            margin-bottom: 10px;
        }
    }

    .el-scrollbar__view {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding-left: 10px;

        .animate {
            cursor: pointer;
        }
        
        .animate > div {
            width: 100px;
            height: 60px;
            background: #f5f8fb;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 12px;
            margin-bottom: 10px;
            font-size: 12px;
            color: #333;
            border-radius: 3px;
            user-select: none;
            cursor: pointer;
        }
    }
}
</style>