import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import icons from './Icons'
import SearchBox from "./SearchBox";

const IconModal = props => {
    const [filteredIcons, setFilteredIcons] = useState(icons)
    const [focusedIndex, setFocusedIndex] = useState(0)
    const attr = {}

    if (props.offset) {
        attr.style = {
            top: props.offset.top,
            left: props.offset.left,
            transform: 'initial'
        }
    }

    const onChange = event => {
        const q = event.target.value
        setFilteredIcons(icons.matching(q))
        setFocusedIndex(0)
    }

    const onKeyUp = event => {
        if (event.keyCode === 13) {
            const [key, Icon] = filteredIcons[focusedIndex]
            props.selectIcon(key)
            return
        }

        let newFocusedIndex = focusedIndex

        switch (event.keyCode) {
            case 37: /* left */ newFocusedIndex = newFocusedIndex - 1; break;
            case 38: /* up */ newFocusedIndex = newFocusedIndex - 7; break;
            case 39: /* right */ newFocusedIndex = newFocusedIndex + 1; break;
            case 40: /* down */ newFocusedIndex = newFocusedIndex + 7; break;
        }

        if (newFocusedIndex < 0) {
            newFocusedIndex = filteredIcons.length + newFocusedIndex
        }
        if (newFocusedIndex > filteredIcons.length - 1) {
            const overflow = newFocusedIndex - filteredIcons.length
            console.log(focusedIndex, filteredIcons.length, newFocusedIndex, overflow)
            newFocusedIndex = overflow
        }

        setFocusedIndex(newFocusedIndex)
    }

    let timeout

    const onFocus = event => {
        if (timeout) {
            clearTimeout(timeout)
        }
    }

    const onBlur = event => {
        timeout = setTimeout(() => props.cancelSelection(), 100)
    }

    const onClick = event => {
        event.preventDefault()
        props.selectIcon(event.currentTarget.dataset.key)
    }

    return createPortal(<div className="icon-modal" {...attr}>
        <div className="clb-p-5">
            <SearchBox onChange={onChange} onKeyUp={onKeyUp} onFocus={onFocus} onBlur={onBlur}/>
        </div>
        <div className="clb-px-5 icon-modal__icons">
            <div className="clb-pb-5">
                {filteredIcons.map(([key, Icon], index) => <a key={key} className={`icon-modal__icons__link ${index === focusedIndex && 'active'}`} data-key={key} onClick={onClick} href="#"><Icon width="24"/></a> )}
            </div>
        </div>
    </div>, document.body)
}

export default IconModal