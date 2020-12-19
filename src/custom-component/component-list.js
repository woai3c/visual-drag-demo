// 公共样式
const commonStyle = {
    rotate: '', 
    opacity: 1,
}

// 编辑器左侧组件列表
const list = [
    {
        component: 'v-text',
        label: '文字',
        propValue: '文字',
        icon: 'el-icon-edit',
        animations: [],
        events: {},
        style: {
            width: 200,
            height: 33,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '',
            letterSpacing: 0,
            textAlign: '',
            color: '',
        },
    },
    {
        component: 'v-button', 
        label: '按钮', 
        propValue: '按钮',
        icon: 'el-icon-thumb',
        animations: [],
        events: {},
        style: {
            width: 100,
            height: 34,
            borderWidth: '',
            borderColor: '',
            borderRadius: '',
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '',
            letterSpacing: 0,
            textAlign: '',
            color: '',
            backgroundColor: '',
        },
    },
    {
        component: 'Picture', 
        label: '图片', 
        icon: 'el-icon-picture',
        propValue: require('@/assets/title.jpg'),
        animations: [],
        events: {},
        style: {
            width: 300,
            height: 200,
            borderRadius: '',
        },
    },
]

list.forEach(item => {
    item.style = { ...item.style, ...commonStyle }
})

export default list