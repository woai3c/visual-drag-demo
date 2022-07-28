<template>
    <el-form>
        <el-form-item v-for="({ key,label }, index) in styleKeys" :key="index" :label="label">
            <el-color-picker v-if="isIncludesColor(key)" v-model="curComponent.style[key]" show-alpha></el-color-picker>
            <el-select v-else-if="selectKey.includes(key)" v-model="curComponent.style[key]">
                <el-option
                    v-for="item in optionMap[key]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-input v-else v-model.number="curComponent.style[key]" type="number" />
        </el-form-item>
    </el-form>
</template>

<script>
import { styleData, textAlignOptions, borderStyleOptions, verticalAlignOptions, selectKey, optionMap } from '@/utils/attr'

export default {
    data() {
        return {
            optionMap,
            styleData,
            textAlignOptions,
            borderStyleOptions,
            verticalAlignOptions,
            selectKey,
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
    methods: {
        isIncludesColor(str) {
            return str.toLowerCase().includes('color')
        },
    },
}
</script>
