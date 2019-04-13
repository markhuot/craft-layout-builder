import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import BusContext from '../contexts/BusContext'
import ActiveFieldPickerTargetContext from "../contexts/ActiveFieldPickerTargetContext";

const FieldPickerButton = props => {
    const bus = useContext(BusContext)
    const activeFieldPickerTarget = useContext(ActiveFieldPickerTargetContext)

    const onClick = event => {
        bus.emit('pickElement', {sender: props})
        bus.emit('hidePicker', {sender: props})
    }

    return <button onClick={onClick}>{props.title}</button>
}

FieldPickerButton.propTypes = {
    title: PropTypes.string.isRequired
}

export default FieldPickerButton