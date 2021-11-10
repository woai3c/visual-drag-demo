import Vue from 'vue'

export function deepCopy(target) {
    if (typeof target == 'object') {
        const result = Array.isArray(target) ? [] : {}
        for (const key in target) {
            if (typeof target[key] == 'object') {
                result[key] = deepCopy(target[key])
            } else {
                result[key] = target[key]
            }
        }

        return result
    }

    return target
}

export function swap(arr, i, j) {
    const temp = arr[i]
    Vue.set(arr, i, arr[j])
    Vue.set(arr, j, temp)
}

export function $(selector) {
    return document.querySelector(selector)
}
