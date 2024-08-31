<template>
  <el-collapse-item title="组件联动（预览生效）" name="linkage" class="linkage-container">
    <el-form>
      <div v-for="(item, index) in linkage.data" :key="index" class="linkage-component">
        <div class="div-guanbi" @click="deleteLinkageData(index)">
          <span class="iconfont icon-guanbi"></span>
        </div>
        <el-select v-model="item.id" placeholder="请选择联动组件" class="testtest">
          <el-option
            v-for="(component, i) in componentData"
            :key="component.id"
            :value="component.id"
            :label="component.label"
          >
            <div @mouseenter="onEnter(i)" @mouseout="onOut(i)">{{ component.label }}</div>
          </el-option>
        </el-select>
        <el-select v-model="item.event" placeholder="请选择监听事件">
          <el-option v-for="e in eventOptions" :key="e.value" :value="e.value" :label="e.label"></el-option>
        </el-select>
        <p>事件触发时，当前组件要修改的属性</p>
        <div v-for="(e, i) in item.style" :key="i" class="attr-container">
          <el-select v-model="e.key" @change="e.value = ''">
            <el-option
              v-for="attr in Object.keys(curComponent.style)"
              :key="attr"
              :value="attr"
              :label="styleMap[attr]"
            ></el-option>
          </el-select>
          <el-color-picker v-if="isIncludesColor(e.key)" v-model="e.value" show-alpha></el-color-picker>
          <el-select v-else-if="selectKey.includes(e.key)" v-model="e.value">
            <el-option
              v-for="option in optionMap[e.key]"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
          <el-input v-else v-model.number="e.value" type="number" placeholder="请输入" />
          <span class="iconfont icon-shanchu" @click="deleteData(item.style, i)"></span>
        </div>
        <el-button @click="addAttr(item.style)">添加属性</el-button>
      </div>
      <el-button style="margin-bottom: 10px" @click="addComponent">添加组件</el-button>
      <p>过渡时间（秒）</p>
      <el-input v-model="linkage.duration" class="input-duration" placeholder="请输入"></el-input>
    </el-form>
  </el-collapse-item>
</template>

<script>
import { styleMap, optionMap, selectKey } from '@/utils/attr'

export default {
  data() {
    return {
      optionMap,
      selectKey,
      styleMap,
      eventOptions: [
        { label: '点击', value: 'v-click' },
        { label: '悬浮', value: 'v-hover' },
      ],
      oldOpacity: '',
      oldBackgroundColor: '',
    }
  },
  computed: {
    linkage() {
      return this.$store.state.curComponent.linkage
    },
    componentData() {
      return this.$store.state.componentData
    },
    curComponent() {
      return this.$store.state.curComponent
    },
  },
  methods: {
    onEnter(index) {
      this.oldOpacity = this.componentData[index].style.opacity
      this.oldBackgroundColor = this.componentData[index].style.backgroundColor
      this.componentData[index].style.opacity = '.3'
      this.componentData[index].style.backgroundColor = '#409EFF'
    },

    onOut(index) {
      this.componentData[index].style.opacity = this.oldOpacity
      this.componentData[index].style.backgroundColor = this.oldBackgroundColor
    },

    isIncludesColor(str) {
      return str.toLowerCase().includes('color')
    },

    addAttr(style) {
      style.push({ key: '', value: '' })
    },

    addComponent() {
      this.linkage.data.push({
        id: '',
        event: '',
        style: [{ key: '', value: '' }],
      })
    },

    deleteData(style, index) {
      style.splice(index, 1)
    },

    deleteLinkageData(index) {
      this.linkage.data.splice(index, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
.linkage-container {
  .linkage-component {
    margin: 10px 0;
    border: 1px solid #ddd;
    padding: 10px;
    position: relative;
    padding-top: 24px;

    .div-guanbi {
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 3px;
      color: #888;
      border: 1px solid #ddd;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;

      .iconfont {
        font-size: 12px;
      }
    }
  }

  .el-select {
    margin-bottom: 10px;
  }

  .attr-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;

    .el-select {
      margin-bottom: 0;
    }

    & > div {
      width: 97px;
    }

    .icon-shanchu {
      cursor: pointer;
    }
  }
}
</style>
