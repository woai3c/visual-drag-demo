export default function getStyle(style, filter = []) {
    const noNeedUnit = ['color', 'backgroundColor', 'textAlign', 'opacity', 'lineHeight', 'fontWeight', 'borderColor']
    const result = {}
    Object.keys(style).forEach(key => {
        if (!filter.includes(key)) {
            if (key != 'rotate') {
                result[key] = style[key]

                if (!noNeedUnit.includes(key)) {
                    result[key] += 'px'
                }
            } else {
                result.transform = key + '(' + style[key] + 'deg)'
            }
        }
    })

    return result
}