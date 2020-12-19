import { Message } from 'element-ui'

export default function toast(msg = '', type, duration) {
    const data = {
        message: msg,
    }

    if (type) data.type = type
    if (duration) data.duration = duration
    Message(data)
}