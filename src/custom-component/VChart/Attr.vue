<template>
    <div>
        <CommonAttr></CommonAttr>
        <el-form>
            <el-form-item label="标题">
                <el-switch
                    v-model="option.title.show"
                    active-text="显示标题">
                </el-switch>
                <el-input 
                    v-model="option.title.text"
                    placeholder="请输入内容">
                </el-input>
            </el-form-item>
            <el-form-item label="工具提示">
                <el-switch
                    v-model="option.tooltip.show"
                    active-text="显示提示">
                </el-switch>
            </el-form-item>
            <el-form-item label="图例">
                <el-switch
                    v-model="option.legend.show"
                    active-text="显示图例">
                </el-switch>
            </el-form-item>
            <el-form-item label="横坐标">
                <el-switch
                    v-model="option.xAxis.show"
                    active-text="显示横坐标">
                </el-switch>
            </el-form-item>
            <el-form-item label="静态数据源">
                <el-button @click="openStaticWinbox">修改数据</el-button>
            </el-form-item>
        </el-form>
        <div style="display: none">
            <div id="staticData">
                <div class="modal-form-item dark-theme">
                    <div ref="ace"></div>
                </div>
                <el-button class="btn" @click="updatedata">
                    更新数据
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/theme-chrome'
import 'ace-builds/src-min-noconflict/mode-json5'
import WinBox from 'winbox/src/js/winbox'
import CommonAttr from '@/custom-component/common/CommonAttr.vue'

export default {
    components: { CommonAttr },
    mounted() {
        ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/')
        this.editor = ace.edit(this.$refs.ace, {
            maxLines: 28,
            minLines: 28,
            fontSize: 14,
            theme: 'ace/theme/chrome',
            mode: 'ace/mode/json5',
            tabSize: 4,
            readOnly: false,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
        })
        this.editor.setValue(JSON.stringify(this.curComponent.propValue.option.series.data))
    },
    computed: {
        curComponent() {
            return this.$store.state.curComponent
        },
        option() {
            return this.$store.state.curComponent.propValue.option
        },
    },
    methods: {
        openStaticWinbox() {
            new WinBox('Static Data', {
                background: '#04A9F5',
                x: 'center',
                y: 'center',
                width: '75%',
                height: '75%',
                class: 'modern',
                mount: document.getElementById('staticData'),
            })
        },
        
        updatedata() {
            let str = this.editor.getValue()
            this.curComponent.propValue.option.series.data = JSON.parse(str)
        },
    },
}
</script>
<style lang="less">
@import '~winbox/src/css/themes/modern.less';
@import '~winbox/src/css/winbox.less';

.chart-data-option {
  .fullscreen {
    z-index: 99;
    cursor: pointer;
    position: absolute;
    bottom: 25px;
    right: 45px;
    font-size: 20px;
  }
}

.winbox.modern {
  z-index: 99 !important;
  animation: none !important;
  background: var(--color-primary);

  .wb-body {
    padding: 5px;
    background-color: #FFFFFF;
  }
}

.modal-form-item {
  display: flex;
  flex-direction: column;

  .label {
    margin: 15px 0 10px;
  }
}
.btn {
    float: right;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 5px;
}
</style>
