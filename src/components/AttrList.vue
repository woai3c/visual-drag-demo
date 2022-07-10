<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
    <div class="attr-list">
        <el-form>
            <el-form-item v-for="({key,label}, index) in styleKeys" :key="index" :label="label">
                <el-color-picker v-if="key == 'borderColor'" v-model="curComponent.style[key]"></el-color-picker>
                <el-color-picker v-else-if="key == 'color'" v-model="curComponent.style[key]"></el-color-picker>
                <el-color-picker v-else-if="key == 'backgroundColor'" v-model="curComponent.style[key]"></el-color-picker>
                <el-select v-else-if="selectKey.includes(key)" v-model="curComponent.style[key]">
                    <template v-if="key == 'textAlign'">
                        <el-option
                            v-for="item in textAlignOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </template>
                    <template v-else-if="key == 'borderStyle'">
                        <el-option
                            v-for="item in borderStyleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </template>
                    <template v-else>
                        <el-option
                            v-for="item in verticalAlignOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </template>
                </el-select>
                <el-input v-else v-model.number="curComponent.style[key]" type="number" />
            </el-form-item>
            <el-form-item v-if="curComponent && !excludes.includes(curComponent.component)" label="内容">
                <el-input v-model="curComponent.propValue" type="textarea" />
            </el-form-item>
            <el-form-item v-if="curComponent && curComponent.component === 'Picture'" label="镜像翻转">
                <div style="clear: both;">
                    <el-checkbox v-model="curComponent.propValue.flip.horizontal" label="horizontal">水平翻转</el-checkbox>
                    <el-checkbox v-model="curComponent.propValue.flip.vertical" label="vertical">垂直翻转</el-checkbox>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { styleData } from '@/utils/style'

export default {
    data() {
        return {
            excludes: ['Picture', 'Group'], // 这些组件不显示内容
            textAlignOptions: [
                {
                    label: '左对齐',
                    value: 'left',
                },
                {
                    label: '居中',
                    value: 'center',
                },
                {
                    label: '右对齐',
                    value: 'right',
                },
            ],
            borderStyleOptions: [
                {
                    label: '实线',
                    value: 'solid',
                },
                {
                    label: '虚线',
                    value: 'dashed',
                },
            ],
            verticalAlignOptions: [
                {
                    label: '上对齐',
                    value: 'top',
                },
                {
                    label: '居中对齐',
                    value: 'middle',
                },
                {
                    label: '下对齐',
                    value: 'bottom',
                },
            ],
            selectKey: ['textAlign', 'borderStyle', 'verticalAlign'],
            styleData,
        }
    },
    computed: {
        styleKeys() {
            if (this.$store.state.curComponent) {
                const curComponentStyleKeys = Object.keys(this.$store.state.curComponent.style)
                return this.styleData.filter(item => curComponentStyleKeys.includes(item.key))
            }
            return []
        },
        curComponent() {
            return this.$store.state.curComponent
        },
    },
}
</script>

<style lang="scss" scoped>
.attr-list {
    overflow: auto;
    padding: 20px;
    padding-top: 0;
    height: 100%;
}
</style>
