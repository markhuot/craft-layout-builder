import React, {
    useRef,
    useEffect,
} from 'react'

export default function useFocusIndex(list, button) {
    const focusIndex = useRef(null)

    useEffect(() => {
        let index = focusIndex.current
        if (index !== null) {
            const elements = [...list.current.childNodes].filter(el => !el.classList.contains('craft-layout-builder-block-placeholder'))
            if (index < 0) { index = 0 }
            if (index > elements.length - 1) { index = elements.length - 1 }
            if (elements.length === 0) {
                button.current.focus()
            }
            else {
                elements[index].focus()
            }
        }
        focusIndex.current = null
    })

    return index => {
        focusIndex.current = index
    }
}