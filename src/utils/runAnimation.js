export default async function runAnimation($el, animations = []) {
    const play = (animation) => new Promise(resolve => {
        const { animationTime = 1, value = '', isLoop } = animation
        $el.style.setProperty('--time', animationTime + 's')
        $el.classList.add(value, 'animated', utilsHandle(isLoop))
        const removeAnimation = () => {
            $el.removeEventListener('animationend', removeAnimation)
            $el.removeEventListener('animationcancel', removeAnimation)
            $el.classList.remove(value, 'animated', utilsHandle(isLoop))
            resolve()
        }
            
        $el.addEventListener('animationend', removeAnimation)
        $el.addEventListener('animationcancel', removeAnimation)
    })

    for (let i = 0, len = animations.length; i < len; i++) {
        await play(animations[i])
    }
}

function utilsHandle(isLoop) {
    return isLoop ? 'infinite' : 'no-infinite'
}
