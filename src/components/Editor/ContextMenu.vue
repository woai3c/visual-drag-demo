<template>
    <div class="contextmenu" v-show="menuShow" :style="{ top: menuTop + 'px', left: menuLeft + 'px' }">
        <ul>
            <li @click="copy" v-show="curComponent">复制</li>
            <li @click="paste">粘贴</li>
            <li @click="cut" v-show="curComponent">剪切</li>
            <li @click="deleteComponent" v-show="curComponent">删除</li>
            <li @click="topComponent" v-show="curComponent">置顶</li>
            <li @click="bottomComponent" v-show="curComponent">置底</li>
            <li @click="upComponent" v-show="curComponent">上移</li>
            <li @click="downComponent" v-show="curComponent">下移</li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data() {
        return {
            copyData: null,
        }
    },
    computed: mapState([
        'menuTop',
        'menuLeft',
        'menuShow',
        'curComponent',
    ]),
    methods: {
        cut() {
            this.$store.commit('cut')
        },

        copy() {
            this.$store.commit('copy')
        },

        paste() {
            this.$store.commit('paste', true)
        },

        deleteComponent() {
            this.$store.commit('deleteComponent')
            this.$store.commit('recordSnapshot')
        },

        upComponent() {
            this.$store.commit('upComponent')
            this.$store.commit('recordSnapshot')
        },

        downComponent() {
            this.$store.commit('downComponent')
            this.$store.commit('recordSnapshot')
        },

        topComponent() {
            this.$store.commit('topComponent')
            this.$store.commit('recordSnapshot')
        },

        bottomComponent() {
            this.$store.commit('bottomComponent')
            this.$store.commit('recordSnapshot')
        },
    },
}
</script>

<style lang="scss" scoped>
.contextmenu {
    position: absolute;
    z-index: 1000;

    ul {
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-sizing: border-box;
        margin: 5px 0;
        padding: 6px 0;

        li {
            font-size: 14px;
            padding: 0 20px;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #606266;
            height: 34px;
            line-height: 34px;
            box-sizing: border-box;
            cursor: pointer;

            &:hover {
                background-color: #f5f7fa;
            }
        }
    }
}
</style>