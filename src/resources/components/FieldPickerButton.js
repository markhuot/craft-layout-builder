import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import BusContext from '../contexts/BusContext'
import icons from './Icons'
import uuid from 'uuid/v4'
import {useDraggable} from '../hooks/UseDraggable'

const FieldPickerButton = props => {
    const bus = useContext(BusContext)
    const {events: draggableEvents} = useDraggable({
        type: 'block',
        key: 'picker',
        action: 'create',
        data: props.data
    })

    const onClick = event => {
        let uid = uuid()
        let json = {id: null, uid, type: props.data}
        if (props.data.__typename === 'Block') {
            json = props.data
        }

        bus.emit('pickElement', {sender: json})
        bus.emit('hidePicker', {sender: json})
    }

    if (props.data.__typename === 'Block') {
        return <button draggable="true" {...draggableEvents} className="craft-layout-builder-block clb-w-full clb-text-left" onClick={onClick}>
            <div className="clb-flex">
                {props.data.type.icon && <span className="craft-layout-builder-cell-icon clb-shrink-0">{icons.withKey(props.data.type.icon)}</span>}
                <span className="clb-truncate">{props.data.title || 'Untitled'}</span>
            </div>
        </button>
    }

    return <button draggable="true" {...draggableEvents} className="clb-appearance-none clb-w-full clb-overflow-hidden clb-rounded-lg clb-cursor-move clb-border-none clb-transition-shadow clb-shadow-sm clb-hover:shadow-lg clb-bg-white clb-text-base clb-text-200 clb-flex clb-space-between clb-p-2 clb-pt-5" onClick={onClick}>
        <span className="clb-truncate">{props.data.title}</span>
        {icons.withKey(props.data.icon, {className: 'clb-w-16 clb-fill-blue'})}
    </button>
}

FieldPickerButton.propTypes = {
}

export default FieldPickerButton