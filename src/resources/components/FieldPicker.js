import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import FieldPickerButton from './FieldPickerButton'
import BusContext from '../contexts/BusContext'
import SearchBox from "./SearchBox"
import FieldPickerBlockTypeButton from './FieldPickerBlockTypeButton'
import FieldPickerBlockButton from './FieldPickerBlockButton'
import FieldPickerLayoutButton from './FieldPickerLayoutButton'

const Section = props => {
    return <div>
        <h2 className="clb-text-600 clb-text-sm clb-text-gray">{props.label}</h2>
        <ul className={`clb-w-full ${props.wide ? 'clb-spacing' : 'clb-grid clb-grid-gap'} clb-justify-items-stretch`} style={{'--grid-template-columns': 'repeat('+(props.wide ? '1' : '2')+', 1fr)'}}>
            {props.elements.map(element => {
                if (props.type === 'layouts') return <li key={element.id}><FieldPickerLayoutButton type={props.type} data={element}/></li>
                if (props.type === 'blockTypes') return <li key={element.id}><FieldPickerBlockTypeButton type={props.type} data={element}/></li>
                if (props.type === 'blocks') return <li key={element.id}><FieldPickerBlockButton type={props.type} data={element}/></li>
            })}
        </ul>
    </div>
}

const FieldPicker = props => {
    const [isHidden, setIsHidden] = useState(true)
    const [elements, setElements] = useState({layouts: [], blockTypes: [], blocks: []})
    const [type, setType] = useState(false)
    const bus = useContext(BusContext)

    useEffect(() => {
        const listener = event => {
            if (isHidden) {
                return
            }

            let el = event.target
            while (el) {
                if (el.classList && el.classList.contains('craft-layout-builder-field-picker')) {
                    return
                }
                el = el.parentNode
            }

            bus.emit('willSetActivePickerTarget')
            bus.emit('hidePicker')
        }

        document.addEventListener('mousedown', listener)
        return () => document.removeEventListener('mousedown', listener)
    })

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

    const onChange = value => {
        // query for `value`
        axios.get('/admin/layoutbuilder/api/elements?q='+value)
            .then(result => setElements(result.data))
    }

    if (isHidden) {
        return null
    }

    return <div className="craft-layout-builder-field-picker clb-spacing-xl clb-overflow-auto">
        <SearchBox onChange={onChange}/>
        {type === 'layouts' && <Section type="layouts" label="Layouts" elements={elements.layouts}/>}
        {type === 'blocks' && <Section type="blockTypes" label="Block Types" elements={elements.blockTypes}/>}
        {type === 'blocks' && <Section type="blocks" wide={true} label="Recent Blocks" elements={elements.blocks}/>}
    </div>
}

export default FieldPicker