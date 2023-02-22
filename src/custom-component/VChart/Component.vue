<template>
    <div>
        <div ref="EChart"></div>
    </div>
</template>

<script>
import OnEvent from '../common/OnEvent'

export default {
    extends: OnEvent,
    props: {
        propValue: {
            type: Object,
            require: true,
            default: () => {},
        },
        element: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        curComponent() {
            return this.$store.state.curComponent
        },
    },
    watch: {
        // 监听组件修改的内容，响应式修改数据
        element: {
            deep: true,
            handler() {
                this.render()
            },
        },
    },
    mounted() {
        // 初始化echarts，渲染大小
        this.echart = this.$echarts.init(this.$refs.EChart, null, {
            width: this.element.style.width,
            height: this.element.style.height,
        })
        this.render()
    },
    methods: {
        render() {
            let EChart = this.echart
            let option = this.propValue.option
            // 设置参数
            let config = {
                ...option,
            }
            // 更新大小
            this.echart.resize({
                width: this.element.style.width, 
                height: this.element.style.height,
            })
            // 配置参数
            EChart.setOption(config)
        },
    },
}
</script>

<style lang="scss" scoped>
</style>
