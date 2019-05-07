import React, {
    useState,
    useContext,
    useEffect,
    useRef,
    useImperativeHandle
} from 'react'

const DropPlaceholder = (props, ref) => {
    const placeholder = useRef(null)
    let hideTimeout = false

    useImperativeHandle(ref, () => ({
        hide: () => {
            clearTimeout(hideTimeout)
            hideTimeout = setTimeout(() => {
                if (placeholder.current) {
                    placeholder.current.style.display = 'none'
                }
            }, 100)
        },
        before: el => {
            clearTimeout(hideTimeout)
            placeholder.current.style.display = 'block'
            const top = el.getBoundingClientRect().top
            const left = el.getBoundingClientRect().left
            const width = el.getBoundingClientRect().width
            placeholder.current.style.top = (top - 5)+'px'
            placeholder.current.style.left = (left)+'px'
            placeholder.current.style.width = (width)+'px'
            placeholder.current.style.setProperty('--scaleX', (width + 20) / width)
        },
        between: (a, b) => {
            clearTimeout(hideTimeout)
            placeholder.current.style.display = 'block'
            const aTop = a.getBoundingClientRect().top
            const aLeft = a.getBoundingClientRect().left
            const aWidth = a.getBoundingClientRect().width
            const aHeight = a.getBoundingClientRect().height
            const aBottom = aTop + aHeight
            const bTop = b.getBoundingClientRect().top
            const spacing = bTop - aBottom
            placeholder.current.style.top = (aBottom + (spacing/2))+'px'
            placeholder.current.style.left = (aLeft)+'px'
            placeholder.current.style.width = (aWidth)+'px'
            placeholder.current.style.setProperty('--scaleX', (aWidth + 20) / aWidth)
        },
        after: el => {
            clearTimeout(hideTimeout)
            placeholder.current.style.display = 'block'
            const top = el.getBoundingClientRect().top
            const left = el.getBoundingClientRect().left
            const width = el.getBoundingClientRect().width
            const height = el.getBoundingClientRect().height
            placeholder.current.style.top = (top + height + 5)+'px'
            placeholder.current.style.left = (left)+'px'
            placeholder.current.style.width = (width)+'px'
            placeholder.current.style.setProperty('--scaleX', (width + 20) / width)
        }
    }))

    return <div ref={placeholder} className="craft-layout-builder-drop-target clb-bg-blue"/>
}

export default DropPlaceholder