import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import FieldPickerButton from './FieldPickerButton'
import BusContext from '../contexts/BusContext'
import SearchBox from "./SearchBox"

const Section = props => {
    return <div>
        <h2 className="clb-text-600 clb-text-sm clb-text-gray">{props.label}</h2>
        <ul className="clb-grid clb-grid-gap clb-justify-items-stretch" style={{'--grid-template-columns': 'repeat(2, 1fr)'}}>
            {props.elements.map(element => <li key={element.id}><FieldPickerButton type={props.type} {...element}/></li>)}
        </ul>
    </div>
}

const FieldPicker = props => {
    const [isHidden, setIsHidden] = useState(true)
    const [elements, setElements] = useState({layouts: [], blockTypes: []})
    const [type, setType] = useState(false)
    const bus = useContext(BusContext)

    useEffect(() => {
        const showPickerCallback = type => {
            setType(type)
            setIsHidden(false)
        }
        bus.on('showPicker', showPickerCallback)

        const hidePickerCallback = () => setIsHidden(true)
        bus.on('hidePicker', hidePickerCallback)

        const togglePickerCallback = type => setIsHidden(!isHidden)
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

    return <div className="craft-layout-builder-field-picker clb-spacing-xl">
        <SearchBox/>
        <Section type="layouts" label="Layouts" elements={elements.layouts}/>
        <Section type="blocks" label="Block Types" elements={elements.blockTypes}/>
    </div>
}

export default FieldPicker