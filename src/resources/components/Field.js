import React, {
    useState,
    useEffect,
    useContext,
    useRef,
    useReducer,
} from 'react'
import PropTypes from 'prop-types'
import FieldLayout from './FieldLayout'
import {useDroppable} from '../hooks/UseDraggable'
import ReducerContext from '../contexts/ReducerContext'
import {
    addBlockReducer,
    moveBlockReducer,
    removeBlockReducer,
    updateBlockReducer,
} from '../reducers/block'
import {
    addLayout,
    addLayoutReducer,
    moveLayout,
    moveLayoutReducer,
    removeLayout,
    removeLayoutReducer
} from '../reducers/layout'
import FieldLayoutPicker from './FieldLayoutPicker'
import useFocusIndex from '../hooks/UseFocusIndex'
import useAnimatedBooleanState from "../hooks/UseAnimatedBooleanState";

const Field = props => {
    const [isPickingNewLayout, setIsPickingNewLayout, isPickingNewLayoutClasses, isPickingNewLayoutRef] = useAnimatedBooleanState(false)
    const addButton = useRef(null)
    const layoutList = useRef(null)
    const focusIndex = useRef(null)
    const dispatch = useContext(ReducerContext)
    const setFocus = useFocusIndex(layoutList, addButton)

    const toggleElementPicker = event => {
        event.preventDefault()
        setIsPickingNewLayout(!isPickingNewLayout)
    }

    const onMove = ({event, oldKey, oldIndex, newKey, newIndex, data}) => {
        dispatch(moveLayout(oldKey, oldIndex, newKey, newIndex, data))
        setFocus(newIndex)
        setIsPickingNewLayout(false)
    }

    const onDelete = ({index}) => {
        dispatch(removeLayout(props.handle, index))
        setFocus(index)
    }

    const {events: droppableEvents} = useDroppable({ref: layoutList, key: props.handle, accept: ['layout'], onMove, onDelete})

    return <React.Fragment>
        <div className="clb-spacing-xl">
            <div ref={layoutList} className="clb-spacing-xl" {...droppableEvents}>
                {props.layouts.map((layout, index) => <FieldLayout key={layout.uid}
                                                                   index={index}
                                                                   fieldHandle={props.handle}
                                                                   data={layout}
                                                                   aria-label={`${layout.type.title} layout ${index+1} of ${props.layouts.length}`}/>)}
            </div>
            {props.layouts.length === 0 && <div className="craft-layout-builder-cell empty"><a href="#" onClick={toggleElementPicker} ref={addButton}>Pick a layout</a> to get started.</div>}
            {props.layouts.length > 0 && <div className={`btngroup`}>
                <button className={`btn add icon ${isPickingNewLayout ? 'clb-border clb-border-blue' : ''}`} onClick={toggleElementPicker} ref={addButton}>Add a Layout</button>
            </div>}
        </div>
        {isPickingNewLayout && <FieldLayoutPicker
            className={isPickingNewLayoutClasses}
            animatedRef={isPickingNewLayoutRef}
            onPick={data => {
                const newIndex = props.layouts.length
                onMove({oldKey: null, oldIndex: null, newKey: props.handle, newIndex, data})
            }}
            onCancel={() => {
                setIsPickingNewLayout(false)
                addButton.current.focus()
            }} />}
    </React.Fragment>
}

Field.propTypes = {
    handle: PropTypes.string.isRequired
}

export default Field