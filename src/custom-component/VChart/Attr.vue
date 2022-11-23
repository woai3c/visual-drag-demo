<template>
    <div class="attr-list">
        <CommonAttr></CommonAttr>
    </div>
</template>

<script>
import CommonAttr from '@/custom-component/common/CommonAttr.vue'

export default {
    components: { CommonAttr },
    computed: {
        curComponent() {
            return this.$store.state.curComponent
        },
    },
}
</script>
