import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import BusContext from '../contexts/BusContext'
import icons from './Icons'
import uuid from 'uuid/v4'
import {useDraggable} from '../hooks/UseDraggable'

const FieldPickerBlockButton = props => {
    const bus = useContext(BusContext)

    const {events: draggableEvents} = useDraggable({
        type: 'block',
        key: 'picker',
        action: 'create',
        data: props.data,
    })

    const onClick = event => {
        bus.emit('pickElement', {sender: props.data})
        bus.emit('hidePicker', {sender: props.data})
    }

    return <button draggable="true" {...draggableEvents} className="craft-layout-builder-block clb-w-full clb-text-left" onClick={onClick}>
        <div className="clb-flex">
            {props.data.type.icon && <span className="craft-layout-builder-cell-icon clb-shrink-0">{icons.withKey(props.data.type.icon)}</span>}
            <span className="clb-truncate">{props.data.title || 'Untitled'}</span>
        </div>
    </button>
}

FieldPickerBlockButton.propTypes = {
}

export default FieldPickerBlockButton