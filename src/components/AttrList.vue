<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
    <div class="attr-list">
        <el-form>
            <el-form-item v-for="(key, index) in styleKeys.filter(item => item != 'rotate')" :key="index" :label="map[key]">
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
                <el-input type="number" v-else v-model="curComponent.style[key]" />
            </el-form-item>
            <el-form-item label="内容" v-if="curComponent && !excludes.includes(curComponent.component)">
                <el-input type="textarea" v-model="curComponent.propValue" />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
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
            map: {
                left: 'x 坐标',
                top: 'y 坐标',
                height: '高',
                width: '宽',
                color: '颜色',
                backgroundColor: '背景色',
                borderStyle: '边框风格',
                borderWidth: '边框宽度',
                borderColor: '边框颜色',
                borderRadius: '边框半径',
                fontSize: '字体大小',
                fontWeight: '字体粗细',
                lineHeight: '行高',
                letterSpacing: '字间距',
                opacity: '透明度',
                textAlign: '左右对齐',
                verticalAlign: '上下对齐',
            },
        }
    },
    computed: {
        styleKeys() {
            console.log(this.$store.state.curComponent.style)
            return this.$store.state.curComponent? Object.keys(this.$store.state.curComponent.style) : []
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
