import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import FieldPickerButton from './FieldPickerButton'
import BusContext from '../contexts/BusContext'

const Layouts = props => {
    return <React.Fragment>
        <h2>Layouts</h2>
        <ul>
            {props.layouts.map(layout => <li key={layout.id}><FieldPickerButton type="layout" {...layout}/></li>)}
        </ul>
    </React.Fragment>
}

const Blocks = props => {
    return <React.Fragment>
        <h2>Blocks</h2>
        <ul>
            {props.blockTypes.map(blockType => <li key={blockType.id}><FieldPickerButton type="block" {...blockType}/></li>)}
        </ul>
    </React.Fragment>
}

const FieldPicker = props => {
    // const [sender, setSender] = useState({})
    const [isHidden, setIsHidden] = useState(true)
    const [elements, setElements] = useState({layouts: [], blockTypes: []})
    const bus = useContext(BusContext)

    useEffect(() => {
        const showPickerCallback = event => setIsHidden(false)
        bus.on('showPicker', showPickerCallback)

        const hidePickerCallback = event => setIsHidden(true)
        bus.on('hidePicker', hidePickerCallback)

        const togglePickerCallback = event => setIsHidden(!isHidden)
        bus.on('togglePicker', togglePickerCallback)

        return () => {
            bus.off('showPicker', showPickerCallback)
            bus.off('hidePicker', hidePickerCallback)
            bus.off('togglePicker', togglePickerCallback)
        }
    })

    useEffect(() => {
        axios.get('/admin/layoutbuilder/api/elements')
            .then(result => setElements(result.data))
    }, [])

    if (isHidden) {
        return null
    }

    return <div className="craft-layout-builder-field-picker">
        <h2>Pick an Element</h2>
        {!props.hideLayouts && <Layouts layouts={elements.layouts}/>}
        {!props.hideBlocks && <Blocks blockTypes={elements.blockTypes}/>}
    </div>
}

FieldPicker.propTypes = {
    hideLayouts: PropTypes.bool,
    hideBlocks: PropTypes.bool
}

export default FieldPicker