<template>
  <div class="real-time-component-list">
    <div
      v-for="(item, index) in componentData"
      :key="index"
      class="list"
      :class="{ actived: transformIndex(index) === curComponentIndex }"
      @click="onClick(transformIndex(index))"
    >
      <span class="iconfont" :class="'icon-' + getComponent(index).icon"></span>
      <span>{{ getComponent(index).label }}</span>
      <div class="icon-container">
        <span class="iconfont icon-shangyi" @click="upComponent(transformIndex(index))"></span>
        <span class="iconfont icon-xiayi" @click="downComponent(transformIndex(index))"></span>
        <span class="iconfont icon-shanchu" @click="deleteComponent(transformIndex(index))"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(['componentData', 'curComponent', 'curComponentIndex']),
  methods: {
    getComponent(index) {
      return this.componentData[this.componentData.length - 1 - index]
    },

    transformIndex(index) {
      return this.componentData.length - 1 - index
    },

    onClick(index) {
      if (!this.$store.state.rightList) {
        this.$store.commit('isShowRightList')
      }
      this.setCurComponent(index)
    },

    deleteComponent() {
      setTimeout(() => {
        this.$store.commit('deleteComponent')
        this.$store.commit('recordSnapshot')
      })
    },

    upComponent() {
      setTimeout(() => {
        this.$store.commit('upComponent')
        this.$store.commit('recordSnapshot')
      })
    },

    downComponent() {
      setTimeout(() => {
        this.$store.commit('downComponent')
        this.$store.commit('recordSnapshot')
      })
    },

    setCurComponent(index) {
      this.$store.commit('setCurComponent', { component: this.componentData[index], index })
    },
  },
}
</script>

<style lang="scss" scoped>
.real-time-component-list {
  height: 35%;

  .list {
    height: 30px;
    cursor: grab;
    text-align: center;
    color: #333;
    display: flex;
    align-items: center;
    font-size: 12px;
    padding: 0 10px;
    position: relative;
    user-select: none;
    opacity: 1;

    &:active {
      cursor: grabbing;
    }

    &:hover {
      background-color: rgba(200, 200, 200, 0.2);

      .icon-container {
        display: block;
      }
    }

    .iconfont {
      margin-right: 4px;
      font-size: 16px;
    }

    .icon-wenben,
    .icon-tupian {
      font-size: 14px;
    }

    .icon-container {
      position: absolute;
      right: 10px;
      display: none;

      .iconfont {
        cursor: pointer;
      }
    }
  }

  .actived {
    background: #ecf5ff;
    color: #409eff;
  }
}
</style>
