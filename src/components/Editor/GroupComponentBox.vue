<template>
    <div
        :style="{
            left: left + 'px',
            top: top + 'px',
            width: width + 'px',
            height: height + 'px',
        }"
        class="area"
    ></div>
</template>

<script>
export default {
    props: {
        width: {
            type: Number,
            default: 0,
        },
        height: {
            type: Number,
            default: 0,
        },
        left: {
            type: Number,
            default: 0,
        },
        top: {
            type: Number,
            default: 0,
        },
    },
}
</script>

<style lang="scss" scoped>
.area {
    border: 1px solid #70c0ff;
    position: absolute;
}
</style>