import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import FieldLayout from './FieldLayout'
import BusContext from '../contexts/BusContext'
import useElementPicker from "../hooks/UseElementPicker";

const Field = props => {
    const [layouts, setLayouts] = useState(JSON.parse(props.layouts || '[]'))
    const bus = useContext(BusContext)
    const picker = useElementPicker()

    const toggleElementPicker = event => {
        event.preventDefault()
        picker.toggle('layouts')
    }

    // TODO, this should probably be inside a useEffect because it hangs around in memory after the Field re-renders
    picker.on('update', element => {
        const newLayouts = layouts.slice()
        newLayouts.push(element.type)
        setLayouts(newLayouts)
    })

    return <div className={`craft-layout-builder-grid ${picker.active ? 'craft-layout-builder-active-picker' : ''}`}>
        {layouts.length === 0 && <div className="craft-layout-builder-cell empty"><a href="#" onClick={toggleElementPicker}>Pick a layout</a> to get started.</div>}
        {layouts.map((layout, index) => <FieldLayout key={layout.id} index={index} fieldHandle={props.handle} {...layout}/>)}
        {layouts.length > 0 && <div className="btngroup">
            <button className="btn add icon" onClick={toggleElementPicker}>Add a Layout</button>
        </div>}
    </div>
}

Field.propTypes = {
    handle: PropTypes.string.isRequired
}

export default Field