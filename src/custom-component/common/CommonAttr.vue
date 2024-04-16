<template>
    <div class="v-common-attr" @mousedown="setInitial(curComponent.style)">
        <el-collapse v-model="activeName" accordion @change="onChange">
            <el-collapse-item title="通用样式" name="style">
                <el-form>
                    <el-form-item v-for="({ key, label }, index) in styleKeys" :key="index" :label="label">
                        <el-color-picker v-if="isIncludesColor(key)" v-model="curComponent.style[key]" show-alpha></el-color-picker>
                        <el-select v-else-if="selectKey.includes(key)" v-model="curComponent.style[key]">
                            <el-option
                                v-for="item in optionMap[key]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                        <el-input 
                            v-else
                            v-model.number="curComponent.style[key]"
                            type="number"
                            @input="setFontSize"
                        />
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <Request v-if="curComponent.request"></Request>
            <Linkage v-if="curComponent.linkage"></Linkage>
        </el-collapse>
    </div>
</template>

<script>
import { styleData, textAlignOptions, borderStyleOptions, verticalAlignOptions, selectKey, optionMap } from '@/utils/attr'
import Request from './Request'
import Linkage from './Linkage'

export default {
    components: { Request, Linkage },
    data() {
        return {
            optionMap,
            styleData,
            textAlignOptions,
            borderStyleOptions,
            verticalAlignOptions,
            selectKey,
            activeName: '',
        }
    },
    computed: {
        styleKeys() {
            if (this.curComponent) {
                const curComponentStyleKeys = Object.keys(this.curComponent.style)
                return this.styleData.filter(item => curComponentStyleKeys.includes(item.key))
            }

            return []
        },
        curComponent() {
            return this.$store.state.curComponent
        },
    },
    watch: {
        curComponent() {
            this.activeName = this.curComponent.collapseName
        },
    },
    created() {
        this.activeName = this.curComponent.collapseName
    },
    methods: {
        setInitial(style) {
            this.initialStyle = JSON.parse(JSON.stringify(style))
        },
        setFontSize() {
            const proportion = this.curComponent.style.fontSize / this.initialStyle.fontSize
            const updatedStyle = {
                width: (proportion * this.initialStyle.width).toFixed(4),
                height: (proportion * this.initialStyle.height).toFixed(4),
                padding: (proportion * this.initialStyle.padding).toFixed(4),
            }
            this.curComponent.style = { ...this.curComponent.style, ...updatedStyle }
            this.$store.commit('setShapeStyle', this.curComponent.style)
            this.$store.commit('recordSnapshot')
        },
        onChange() {
            this.curComponent.collapseName = this.activeName
        },
    
        isIncludesColor(str) {
            return str.toLowerCase().includes('color')
        },
    },
}
</script>

<style lang="scss">
.v-common-attr {
    .el-input-group__prepend {
        padding: 0 10px;
    }
}
</style>
