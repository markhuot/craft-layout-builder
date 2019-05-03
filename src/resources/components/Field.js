import React, {
    useState,
    useEffect,
    useContext,
    useRef
} from 'react'
import PropTypes from 'prop-types'
import FieldLayout from './FieldLayout'
import BusContext from '../contexts/BusContext'
import useElementPicker from '../hooks/UseElementPicker'
import {useDroppable} from "../hooks/UseDraggable";

const Field = props => {
    const [layouts, setLayouts] = useState(JSON.parse(props.layouts || '[]'))
    const bus = useContext(BusContext)
    const picker = useElementPicker()
    const layoutList = useRef(null)
    const addButton = useRef(null)

    const toggleElementPicker = event => {
        event.preventDefault()
        picker.toggle('layouts')
    }

    const addLayout = (layout, index) => {
        if (!index) {
            index = layouts.length
        }

        const newLayouts = layouts.slice()
        newLayouts.splice(index, 0, layout)
        setLayouts(newLayouts)
    }

    const moveLayoutByIndex = (oldIndex, newIndex) => {
        const newLayouts = layouts.slice()
        if (newIndex < 0) { newIndex = 0 }
        if (newIndex > layouts.length - 1) { newIndex = layouts.length - 1 }
        newLayouts.splice(newIndex, 0, newLayouts.splice(oldIndex, 1)[0])
        setLayouts(newLayouts)
        layoutList.current.childNodes[newIndex].focus()
    }

    const removeLayoutByIndex = index => {
        const newLayouts = layouts.slice()
        newLayouts.splice(index, 1)
        setLayouts(newLayouts)
    }

    // TODO, this should probably be inside a useEffect because it hangs around in memory after the Field re-renders
    picker.on('update', element => {
        addLayout(element)
    })

    const onMove = ({event, oldKey, oldIndex, newKey, newIndex, data}) => {
        if (oldKey && oldKey === newKey) {
            moveLayoutByIndex(oldIndex, newIndex)
        }
        else {
            if (oldKey) {
                bus.emit(`removeLayoutFromField(${oldKey})`, oldIndex)
            }

            addLayout(data, newIndex)
        }
    }

    const onDelete = ({index}) => {
        removeLayoutByIndex(index)
    }

    const {events: droppableEvents} = useDroppable({ref: layoutList, key: props.handle, accept: ['layout'], onMove, onDelete})

    return <div className={`craft-layout-builder-grid`}>
        {layouts.length === 0 && <div className="craft-layout-builder-cell empty"><a href="#" onClick={toggleElementPicker}>Pick a layout</a> to get started.</div>}
        <div ref={layoutList} className="clb-spacing-xl" {...droppableEvents}>
            {layouts.map((layout, index) => <FieldLayout key={index} index={index} fieldHandle={props.handle} data={layout}/>)}
        </div>
        {layouts.length > 0 && <div className={`btngroup`}>
            <button className={`btn add icon ${picker.active ? 'clb-border clb-border-blue' : ''}`} onClick={toggleElementPicker}>Add a Layout</button>
        </div>}
    </div>
}

Field.propTypes = {
    handle: PropTypes.string.isRequired
}

export default Field