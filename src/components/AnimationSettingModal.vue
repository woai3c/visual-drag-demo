<template>
  <el-dialog
    :title="`${config.label} 动画配置`"
    :visible="centerDialogVisible"
    width="30%"
    center
    @close="handleCloseModal"
  >
    <div class="time">
      动画时长：<el-input-number
        v-model="config.animationTime"
        controls-position="right"
        :min="0.1"
        :precision="2"
        :step="0.01"
      />
    </div>
    <div class="loop">
      是否循环：<el-switch v-model="config.isLoop" active-text="是" inactive-text="否" :disabled="isDisabled">
      </el-switch>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCloseModal">取 消</el-button>
      <el-button type="primary" @click="handleSaveSetting">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import eventBus from '@/utils/eventBus'

export default {
  name: 'AnimationSettingModal',
  props: {
    curIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      centerDialogVisible: true,
      config: {},
    }
  },
  computed: {
    ...mapState(['curComponent']),
    isDisabled() {
      return this.curComponent.animations.length > 1
    },
  },
  created() {
    const { label, animationTime, isLoop = false, value } = this.curComponent.animations[this.curIndex] || {}
    this.config = {
      animationTime,
      label,
      isLoop,
      value,
    }
  },
  methods: {
    handleCloseModal() {
      this.$emit('close')
    },
    handleSaveSetting() {
      const { isLoop } = this.config
      this.$store.commit('alterAnimation', {
        index: this.curIndex,
        data: {
          animationTime: this.config.animationTime,
          isLoop,
        },
      })
      eventBus.$emit('stopAnimation')
      this.handleCloseModal()
    },
  },
}
</script>

<style scoped lang="scss">
.loop {
  margin-top: 10px;
}
</style>
