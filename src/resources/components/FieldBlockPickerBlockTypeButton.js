import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import BusContext from '../contexts/BusContext'
import icons from './Icons'
import uuid from 'uuid/v4'
import {useDraggable} from '../hooks/UseDraggable'

const FieldBlockPickerBlockTypeButton = props => {
    const getData = () => ({
        id: null,
        uid: uuid(),
        type: props.data,
    })

    const {events: draggableEvents} = useDraggable({
        type: 'block',
        key: 'picker',
        action: 'create',
        data: getData
    })

    const onClick = event => {
        event.preventDefault()
        if (props.onPick) {
            props.onPick(getData())
        }
    }

    return <button onClick={onClick} draggable="true" {...draggableEvents} className="clb-appearance-none clb-w-full clb-overflow-hidden clb-rounded-lg clb-cursor-move clb-border-none clb-transition-shadow clb-shadow-sm clb-hover:shadow-lg clb-bg-white clb-text-base clb-text-200 clb-flex clb-space-between clb-p-2 clb-pt-5">
        <span className="clb-truncate">{props.data.title}</span>
        {icons.withKey(props.data.icon, {className: 'clb-w-16 clb-fill-blue'})}
    </button>
}

FieldBlockPickerBlockTypeButton.propTypes = {
}

export default FieldBlockPickerBlockTypeButton