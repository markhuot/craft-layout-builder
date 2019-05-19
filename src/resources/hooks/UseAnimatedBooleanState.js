import React, {
    useState,
    useRef,
    useEffect,
} from 'react'

const setClassesOnEl = (el, classString, prefix) => {
    const classNames = classString.split(/\s+/)
        .filter(className => className)

    el.classList.remove((prefix ? prefix + '-' : '')+'entering')
    el.classList.remove((prefix ? prefix + '-' : '')+'leaving')
    el.classList.remove((prefix ? prefix + '-' : '')+'active')
    classNames.map(className => el.classList.add((prefix ? prefix + '-' : '')+className))
}

const useAnimatedBooleanState = (initialState, classKey) => {
    const ref = useRef(null)
    const [rawState, setRawState] = useState(initialState)
    const [classes, setClasses] = useState('')

    useEffect(() => {
        if (!ref.current) {
            return
        }

        setClassesOnEl(ref.current, classes)

        if (classKey) {
            setClassesOnEl(document.body, classes, classKey)
        }

        const listener = () => {
            const classList = classes.split(/\s+/)

            if (classList.includes('entering')) {
                setClasses('active')
            }
            if (classList.includes('leaving')) {
                setClasses('')
                setRawState(false)
            }
        }

        ref.current.addEventListener('transitionend', listener)

        return () => {
            if (!ref.current) {
                return
            }

            ref.current.removeEventListener('transitionend', listener)
        }
    })

    const set = value => {
        if (value === true || (typeof value === 'number' && value >= 0)) {
            setRawState(value)
            setTimeout(() => { setClasses('entering') }, 1)
        }
        if (value === false || (typeof value === 'number' && value < 0)) {
            setClasses('leaving')
        }
    }

    return [rawState, set, classes, ref]
}

export default useAnimatedBooleanState