import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import BusContext from '../contexts/BusContext'
import ActiveFieldPickerTargetContext from "../contexts/ActiveFieldPickerTargetContext"
import icons from './Icons'
import uuid from 'uuid/v4'

const FieldPickerButton = props => {
    const bus = useContext(BusContext)

    const onClick = event => {
        bus.emit('pickElement', {sender: props})
        bus.emit('hidePicker', {sender: props})
    }

    const onDragStart = event => {
        const uid = uuid()

        event.dataTransfer.setData('x-block/action', 'create')
        event.dataTransfer.setData('x-block/action.create', 'create')
        event.dataTransfer.setData(`x-block-uid/${uid}`, uid)
        event.dataTransfer.setData('x-block/json', JSON.stringify({uid, type: props}))
    }

    return <button className="clb-appearance-none clb-w-full clb-rounded-lg clb-cursor-move clb-border-none clb-transition-shadow clb-shadow-sm clb-hover:shadow-lg clb-bg-white clb-text-base clb-text-200 clb-flex clb-space-between clb-p-2 clb-pt-5" draggable onClick={onClick}  onDragStart={onDragStart}>
        {props.title}
        {icons.withKey(props.icon, {className: 'clb-w-16 clb-fill-blue'})}
    </button>
}

FieldPickerButton.propTypes = {
    title: PropTypes.string.isRequired
}

export default FieldPickerButton