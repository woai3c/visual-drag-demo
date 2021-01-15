import { calculateRotatedPointCoordinate, getCenterPoint } from './translate'

const funcs = {
    lt: calculateLeftTop,
    t: calculateTop,
    rt: calculateRightTop,
    r: calculateRight,
    rb: calculateRightBottom,
    b: calculateBottom,
    lb: calculateLeftBottom,
    l: calculateLeft,
}

function calculateLeftTop(style, curPositon, pointInfo) {
    const { symmetricPoint } = pointInfo
    const newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
    const newTopLeftPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -style.rotate)
    const newBottomRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -style.rotate)
  
    const newWidth = newBottomRightPoint.x - newTopLeftPoint.x
    const newHeight = newBottomRightPoint.y - newTopLeftPoint.y
    if (newWidth > 0 && newHeight > 0) {
        style.width = Math.round(newWidth)
        style.height = Math.round(newHeight)
        style.left = Math.round(newTopLeftPoint.x)
        style.top = Math.round(newTopLeftPoint.y)
    }
}

function calculateTop(style, curPositon, pointInfo) {
    const { symmetricPoint, clickPoint } = pointInfo
    const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, clickPoint, -style.rotate)
    const rotatedTopMiddlePoint = calculateRotatedPointCoordinate({
        x: clickPoint.x,
        y: rotatedcurPositon.y,
    }, clickPoint, style.rotate)
  
    // 勾股定理
    const newHeight = Math.sqrt((rotatedTopMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedTopMiddlePoint.y - symmetricPoint.y) ** 2)
    
    if (newHeight > 0) {
        const newCenter = {
            x: rotatedTopMiddlePoint.x - (rotatedTopMiddlePoint.x - symmetricPoint.x) / 2,
            y: rotatedTopMiddlePoint.y + (symmetricPoint.y - rotatedTopMiddlePoint.y) / 2,
        }

        style.height = Math.round(newHeight)
        style.top = Math.round(newCenter.y - (newHeight / 2))
        style.left = Math.round(newCenter.x - (style.width / 2))
    }
}
  
function calculateRight(style, curPositon, pointInfo) {
    const { symmetricPoint, clickPoint } = pointInfo
    const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, clickPoint, -style.rotate)
    const rotatedRightMiddlePoint = calculateRotatedPointCoordinate({
        x: rotatedcurPositon.x,
        y: clickPoint.y,
    }, clickPoint, style.rotate)
  
    const newWidth = Math.sqrt((rotatedRightMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedRightMiddlePoint.y - symmetricPoint.y) ** 2)
    if (newWidth > 0) {
        const newCenter = {
            x: rotatedRightMiddlePoint.x - (rotatedRightMiddlePoint.x - symmetricPoint.x) / 2,
            y: rotatedRightMiddlePoint.y + (symmetricPoint.y - rotatedRightMiddlePoint.y) / 2,
        }

        style.width = Math.round(newWidth)
        style.top = Math.round(newCenter.y - (style.height / 2))
        style.left = Math.round(newCenter.x - (newWidth / 2))
    }
}
  
function calculateBottom(style, curPositon, pointInfo) {
    const { symmetricPoint, clickPoint } = pointInfo
    const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, clickPoint, -style.rotate)
    const rotatedBottomMiddlePoint = calculateRotatedPointCoordinate({
        x: clickPoint.x,
        y: rotatedcurPositon.y,
    }, clickPoint, style.rotate)
  
    const newHeight = Math.sqrt((rotatedBottomMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedBottomMiddlePoint.y - symmetricPoint.y) ** 2)
    if (newHeight > 0) {
        const newCenter = {
            x: rotatedBottomMiddlePoint.x - (rotatedBottomMiddlePoint.x - symmetricPoint.x) / 2,
            y: rotatedBottomMiddlePoint.y + (symmetricPoint.y - rotatedBottomMiddlePoint.y) / 2,
        }
        style.height = Math.round(newHeight)
        style.top = Math.round(newCenter.y - (newHeight / 2))
        style.left = Math.round(newCenter.x - (style.width / 2))
    }
}
  
function calculateLeft(style, curPositon, pointInfo) {
    const { symmetricPoint, clickPoint } = pointInfo
    const rotatedcurPositon = calculateRotatedPointCoordinate(curPositon, clickPoint, -style.rotate)
    const rotatedLeftMiddlePoint = calculateRotatedPointCoordinate({
        x: rotatedcurPositon.x,
        y: clickPoint.y,
    }, clickPoint, style.rotate)
  
    const newWidth = Math.sqrt((rotatedLeftMiddlePoint.x - symmetricPoint.x) ** 2 + (rotatedLeftMiddlePoint.y - symmetricPoint.y) ** 2)
    if (newWidth > 0) {
        const newCenter = {
            x: rotatedLeftMiddlePoint.x - (rotatedLeftMiddlePoint.x - symmetricPoint.x) / 2,
            y: rotatedLeftMiddlePoint.y + (symmetricPoint.y - rotatedLeftMiddlePoint.y) / 2,
        }
        
        style.width = Math.round(newWidth)
        style.top = Math.round(newCenter.y - (style.height / 2))
        style.left = Math.round(newCenter.x - (newWidth / 2))
    }
}

function calculateRightTop(style, curPositon, pointInfo) {
    const { symmetricPoint } = pointInfo
    const newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
    const newTopRightPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -style.rotate)
    const newBottomLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -style.rotate)
  
    const newWidth = newTopRightPoint.x - newBottomLeftPoint.x
    const newHeight = newBottomLeftPoint.y - newTopRightPoint.y
    if (newWidth > 0 && newHeight > 0) {
        style.width = Math.round(newWidth)
        style.height = Math.round(newHeight)
        style.left = Math.round(newBottomLeftPoint.x)
        style.top = Math.round(newTopRightPoint.y)
    }
}
  
function calculateRightBottom(style, curPositon, pointInfo) {
    const { symmetricPoint } = pointInfo
    const newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
    const newTopLeftPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -style.rotate)
    const newBottomRightPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -style.rotate)
  
    const newWidth = newBottomRightPoint.x - newTopLeftPoint.x
    const newHeight = newBottomRightPoint.y - newTopLeftPoint.y
    if (newWidth > 0 && newHeight > 0) {
        style.width = Math.round(newWidth)
        style.height = Math.round(newHeight)
        style.left = Math.round(newTopLeftPoint.x)
        style.top = Math.round(newTopLeftPoint.y)
    }
}
  
function calculateLeftBottom(style, curPositon, pointInfo) {
    const { symmetricPoint } = pointInfo
    const newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
    const newTopRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -style.rotate)
    const newBottomLeftPoint = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -style.rotate)

    const newWidth = newTopRightPoint.x - newBottomLeftPoint.x
    const newHeight = newBottomLeftPoint.y - newTopRightPoint.y
    if (newWidth > 0 && newHeight > 0) {
        style.width = Math.round(newWidth)
        style.height = Math.round(newHeight)
        style.left = Math.round(newBottomLeftPoint.x)
        style.top = Math.round(newTopRightPoint.y)
    }
}

export default function calculateComponentPositonAndSize(name, style, curPositon, pointInfo) {
    funcs[name](style, curPositon, pointInfo)
}