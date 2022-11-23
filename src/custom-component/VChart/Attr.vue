<template>
    <div class="attr">
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
            <el-form-item>
                <el-dropdown>
                    <span class="el-dropdown-link">
                        更换图表类型<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <span v-for="(chart, index) in charts" :key="index" @click="selectchart(chart.title)">
                            <el-dropdown-item>{{ chart.name }}</el-dropdown-item>
                        </span>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form-item>
            <el-form-item label="静态数据源">
                <el-button @click="openStaticWinbox">修改数据</el-button>
            </el-form-item>
        </el-form>
        <div style="display: none">
            <div id="staticData">
                <div class="ace" ref="ace"></div>
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
    data() {
        return {
            charts: [
                {
                    title: 'bar',
                    name: '柱状图',
                },
                {
                    title: 'scatter',
                    name: '散点图',
                },
                {
                    title: 'line',
                    name: '折线图',
                },
            ],
        }
    },
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
        // 初始化图表数据在editor中
        let data = JSON.stringify(this.curComponent.propValue.option.series.data)
        let xAxis = JSON.stringify(this.curComponent.propValue.option.xAxis.data)
        this.editor.setValue(data + '\n' + xAxis)
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
        // 打开一个Winbox弹出框
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
        
        // 寻找数组[]
        findstring(str, ch1, ch2) { 
            return str.substr(str.indexOf(ch1), str.indexOf(ch2) + 1)
        },

        // 更新数据editor中的数据修改
        updatedata() {
            let str = this.editor.getValue()
            let Arrdata = this.findstring(str, '[', ']')
            let ArrXAxis = this.findstring(str.substr(str.indexOf(']') + 1), '[', ']')
            this.curComponent.propValue.option.series.data = JSON.parse(Arrdata)
            this.curComponent.propValue.option.xAxis.data = JSON.parse(ArrXAxis)
        },

        // 更换表格类型
        selectchart(chart) {
            this.curComponent.propValue.option.series.type = chart
        },
    },
}
</script>
<style>
@import '@/styles/winbox.css';
.ace {
    margin: 5px;
}
.btn {
    float: right;
    margin-right: 10px;
    margin-top: 2px;
}
.attr {
    margin: 13px;
}
</style>