<template>
    <div class="attr-list v-talbe-attr">
        <CommonAttr></CommonAttr>
        <EditTable></EditTable>
        <el-form>
            <el-form-item label="斑马纹">
                <el-switch v-model="propValue.stripe"></el-switch>
            </el-form-item>
            <el-form-item label="表头加粗">
                <el-switch v-model="propValue.thBold"></el-switch>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import CommonAttr from '@/custom-component/common/CommonAttr'
import EditTable from './EditTable'

export default {
    components: { EditTable, CommonAttr },
    computed: {
        propValue() {
            return this.$store.state.curComponent.propValue
        },
    },
}
</script>
