<template>
  <el-collapse-item title="数据来源（预览生效）" name="request" class="request-container">
    <el-form>
      <el-form-item label="请求地址">
        <el-input v-model.trim="request.url" @blur="validateURL">
          <template slot="prepend">HTTPS://</template>
        </el-input>
      </el-form-item>
      <el-form-item label="请求方法">
        <el-select v-model="request.method">
          <el-option v-for="item in methodOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求参数">
        <el-select v-model="request.paramType" placeholder="参数类型" @change="onChnage">
          <el-option v-for="item in dataOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
        <div v-if="request.paramType === 'array'" class="param-container">
          <p>数据项</p>
          <div v-for="(item, index) in request.data" :key="index" class="div-delete">
            <el-input v-model="request.data[index]" placeholder="请输入参数值"></el-input>
            <span class="iconfont icon-shanchu" @click="deleteData(index)"></span>
          </div>

          <el-button @click="addArrayData">添加</el-button>
        </div>
        <div v-else-if="request.paramType === 'string' || request.paramType === 'object'" class="param-container">
          <p>数据项</p>
          <div v-for="(item, index) in request.data" :key="index" class="param-object-container">
            <el-input v-model="item[0]" placeholder="参数名"></el-input>
            <el-input v-model="item[1]" placeholder="参数值"></el-input>
            <span class="iconfont icon-shanchu" @click="deleteData(index)"></span>
          </div>
          <el-button @click="addData">添加</el-button>
        </div>
      </el-form-item>
      <el-form-item label="定时触发">
        <el-switch v-model="request.series"></el-switch>
        <template v-if="request.series">
          <p>触发间隔（毫秒）</p>
          <el-input v-model="request.time" type="number"></el-input>
          <p>触发次数（0 为无限）</p>
          <el-input v-model="request.requestCount" type="number"></el-input>
        </template>
      </el-form-item>
    </el-form>
  </el-collapse-item>
</template>

<script>
import { urlRE, getURL } from '@/utils/request'

export default {
  data() {
    return {
      methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
      dataOptions: ['object', 'array', 'string'],
    }
  },
  computed: {
    request() {
      return this.$store.state.curComponent.request
    },
  },
  methods: {
    addArrayData() {
      this.request.data.push('')
    },

    addData() {
      this.request.data.push(['', ''])
    },

    deleteData(index) {
      this.request.data.splice(index, 1)
    },

    onChnage() {
      if (this.request.paramType === 'array') {
        this.request.data = ['']
      } else {
        this.request.data = [['', '']]
      }
    },

    validateURL() {
      const url = this.request.url
      if ((url && /^\d+$/.test(url)) || !urlRE.test(getURL(url))) {
        this.$message.error('请输入正确的 URL')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.request-container {
  .param-container {
    margin-top: 10px;

    .el-button {
      margin-top: 10px;
    }

    .param-object-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;

      .el-input {
        width: 98px;
      }

      .el-button {
        margin: 0;
        margin-left: 8px;
      }
    }

    .div-delete {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;

      .el-button {
        margin: 0;
        margin-left: 8px;
      }
    }
  }

  .icon-shanchu {
    cursor: pointer;
    margin-left: 10px;
  }
}
</style>
