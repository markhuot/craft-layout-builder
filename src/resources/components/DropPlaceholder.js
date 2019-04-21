import React, {
    useState,
    useContext,
    useEffect,
    useRef,
    useImperativeHandle
} from 'react'
import BusContext from "../contexts/BusContext";

const DropPlaceholder = (props, ref) => {
    const placeholder = useRef(null)

    useImperativeHandle(ref, () => ({
        hide: () => {
            placeholder.current.style.display = 'none'
        },
        before: el => {
            placeholder.current.style.display = 'block'
            const top = el.getBoundingClientRect().top
            const left = el.getBoundingClientRect().left
            const width = el.getBoundingClientRect().width
            placeholder.current.style.top = (top - 5)+'px'
            placeholder.current.style.left = (left - 5)+'px'
            placeholder.current.style.width = (width + 10)+'px'
        },
        between: (a, b) => {
            placeholder.current.style.display = 'block'
            const aTop = a.getBoundingClientRect().top
            const aLeft = a.getBoundingClientRect().left
            const aWidth = a.getBoundingClientRect().width
            const aHeight = a.getBoundingClientRect().height
            const aBottom = aTop + aHeight
            const bTop = b.getBoundingClientRect().top
            const spacing = bTop - aBottom
            placeholder.current.style.top = (aBottom + (spacing/2))+'px'
            placeholder.current.style.left = (aLeft - 5)+'px'
            placeholder.current.style.width = (aWidth + 10)+'px'
        },
        after: el => {
            placeholder.current.style.display = 'block'
            const top = el.getBoundingClientRect().top
            const left = el.getBoundingClientRect().left
            const width = el.getBoundingClientRect().width
            const height = el.getBoundingClientRect().height
            placeholder.current.style.top = (top + height + 5)+'px'
            placeholder.current.style.left = (left - 5)+'px'
            placeholder.current.style.width = (width + 10)+'px'
        }
    }))

    return <div ref={placeholder} className="craft-layout-builder-drop-target clb-bg-blue" style={{top: '100px', left: '100px'}}/>
}

export default DropPlaceholder