import React, { useState, useRef } from 'react'
import IconModal from "./IconModal";
import icons from './Icons'

const IconPicker = props => {
    const [showModal, setShowModal] = useState(false)
    const [iconKey, setIconKey] = useState(props.value || './media/image.svg')
    const [offset, setOffset] = useState({})
    const el = useRef(null)

    const label = iconKey
        .replace(/^.*\//, '') // replace leading directories
        .replace(/\..*?$/, '') // trailing filename
        .replace(/[^a-z0-9]/, ' ') // space out words
    const icon = icons.withKey(iconKey)

    const onClick = event => {
        event.preventDefault()
        setOffset({
            top: el.current.getBoundingClientRect().top + el.current.getBoundingClientRect().height + 10,
            left: el.current.getBoundingClientRect().left,
        })
        setShowModal(!showModal)
    }

    const selectIcon = iconKey => {
        setIconKey(iconKey)
        setShowModal(false)

        if (el) {
            el.current.focus()
        }
    }

    const cancelSelection = () => {
        setShowModal(false)
    }

    return <div>
        <input type="hidden" name={props.name} value={iconKey}/>
        <button ref={el} className="icon-button" onClick={onClick}>
            {icon}
            <span className="icon-button-title">{label}</span>
        </button>
        {showModal && <IconModal offset={offset} selectIcon={selectIcon} cancelSelection={cancelSelection}/>}
    </div>
}

export default IconPicker