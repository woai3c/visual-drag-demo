<template>
    <div class="group">
        <div>
             <template v-for="item in propValue">
                <component
                    class="component"
                    :is="item.component"
                    :style="item.groupStyle"
                    :propValue="item.propValue"
                    :key="item.id"
                    :id="'component' + item.id"
                    :element="item"
                />
            </template>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        propValue: {
            type: Array,
            default: () => [],
        },
        element: {
            type: Object,
        },
    },
}
</script>

<style lang="scss" scoped>
.group {
    & > div {
        position: relative;
        width: 100%;
        height: 100%;

        .component {
            position: absolute;
        }
    }
}
</style>
