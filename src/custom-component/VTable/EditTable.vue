<template>
    <div class="edit-table">
        <table @dblclick="onDblclick">
            <tbody>
                <tr v-for="(item, row) in tableData" :key="row">
                    <td
                        v-for="(e, col) in item"
                        :key="col"
                        :class="{ selected: curTd === row + ',' + col }"
                        @click="onClick(row, col)"
                    >
                        <el-input
                            v-if="canEdit && curTd === row + ',' + col"
                            v-model="tableData[row][col]"
                            v-focus
                            @blur="onBlur"
                        ></el-input>
                        <span v-else>{{ e }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div>
            <button @click="addRow">添加新行</button>
            <button @click="addCol">添加新列</button>
            <button @click="deleteRow">删除行</button>
            <button @click="deleteCol">删除列</button>
        </div>
    </div>
</template>

<script>
export default {
    directives: {
        focus: {
            // 指令的定义
            inserted(el) {
                // 聚焦元素
                el.querySelector('input').focus()
            },
        },
    },
    data() {
        return {
            curProperty: '',
            curTd: '',
            canEdit: false,
            preCurTd: '', // 失焦时 curTd 值为空，这时删除会读不到值，因此用这个变量来代替，用于删除行列
        }
    },
    computed: {
        tableData() {
            return this.$store.state.curComponent.propValue.data
        },
    },
    methods: {
        onDblclick() {
            this.canEdit = true
        },

        onClick(row, col) {
            this.curTd = row + ',' + col
            this.preCurTd = this.curTd
        },

        onBlur() {
            this.canEdit = false
            this.curTd = ''
        },

        deleteRow() {
            if (!this.preCurTd) {
                this.$message.error('请先选择要删除的行')
                return
            }

            const row = this.preCurTd.split(',')[0]
            this.tableData.splice(row, 1)
        },

        addRow() {
            this.tableData.push(new Array(this.tableData[0].length).fill(' '))
        },

        addCol() {
            this.tableData.forEach(item => item.push(' '))
        },

        deleteCol() {
            if (!this.preCurTd) {
                this.$message.error('请先选择要删除的列')
                return
            }

            const col = this.preCurTd.split(',')[1]
            this.tableData.forEach(item => {
                item.splice(col, 1)
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.edit-table {
    overflow: auto;
    margin-bottom: 8px;

    & > div {
        margin-top: 18px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        button {
            cursor: pointer;
            background: #fff;
            border: 1px solid #dcdfe6;
            color: #606266;
            text-align: center;
            box-sizing: border-box;
            outline: 0;
            margin: 0;
            font-weight: 500;
            padding: 4px 10px;
            font-size: 14px;
            border-radius: 4px;
            margin-bottom: 10px;

            &:hover {
                background: #ecf5ff;
                color: #409eff;
            }
        }
    }

    table {
        border-collapse: collapse;
        word-break: break-all;
        word-wrap: break-word;
        text-align: center;
        font-size: 12px;

        td {
            border: 1px solid #ebeef5;
            height: 40px;
            min-width: 60px;
            max-width: 80px;
            padding: 10px;
        }
    }

    .selected {
        background: #ecf5ff;
        color: #409eff;
    }
}

</style>
