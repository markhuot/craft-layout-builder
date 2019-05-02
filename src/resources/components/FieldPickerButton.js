import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import BusContext from '../contexts/BusContext'
import icons from './Icons'
import uuid from 'uuid/v4'
import DropPlaceholderContext from '../contexts/DropPlaceholderContext'

const FieldPickerButton = props => {
    const bus = useContext(BusContext)
    const placeholder = useContext(DropPlaceholderContext)

    const onClick = event => {
        let uid = uuid()
        let json = {id: null, uid, type: props}
        if (props.__typename === 'Block') {
            json = props
        }

        bus.emit('pickElement', {sender: json})
        bus.emit('hidePicker', {sender: json})
    }

    const onDragStart = event => {
        let uid = uuid()
        let json = {id: null, uid, type: props}
        if (props.__typename === 'Block') {
            json = props
        }

        event.dataTransfer.setData('x-block/action', 'create')
        event.dataTransfer.setData('x-block/action.create', 'create')
        event.dataTransfer.setData(`x-block-uid/${uid}`, uid)
        event.dataTransfer.setData('x-block/json', JSON.stringify(json))
    }

    const onDragEnd = event => {
        // bus.emit('hidePicker', {sender: props})
        placeholder.hide()
    }

    if (props.__typename === 'Block') {
        return <button className="craft-layout-builder-block clb-w-full clb-text-left" draggable="true" onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onClick}>
            <div className="clb-flex">
                {props.type.icon && <span className="craft-layout-builder-cell-icon clb-shrink-0">{icons.withKey(props.type.icon)}</span>}
                <span className="clb-truncate">{props.title || 'Untitled'}</span>
            </div>
        </button>
    }

    return <button className="clb-appearance-none clb-w-full clb-overflow-hidden clb-rounded-lg clb-cursor-move clb-border-none clb-transition-shadow clb-shadow-sm clb-hover:shadow-lg clb-bg-white clb-text-base clb-text-200 clb-flex clb-space-between clb-p-2 clb-pt-5" draggable onClick={onClick}  onDragStart={onDragStart}>
        <span className="clb-truncate">{props.title}</span>
        {icons.withKey(props.icon, {className: 'clb-w-16 clb-fill-blue'})}
    </button>
}

FieldPickerButton.propTypes = {
    title: PropTypes.string.isRequired
}

export default FieldPickerButton