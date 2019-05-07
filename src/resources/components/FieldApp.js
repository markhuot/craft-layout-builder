import React, {
    useRef,
    forwardRef,
    useReducer,
} from 'react'
import { createPortal } from 'react-dom'
import Field from './Field'
import DropPlaceholderContext from '../contexts/DropPlaceholderContext'
import DropPlaceholder from './DropPlaceholder'
import BusContext from '../contexts/BusContext'
import {EventEmitter2} from "eventemitter2";
import {addBlockReducer, moveBlockReducer, removeBlockReducer, updateBlockReducer} from "../reducers/block";
import {addLayoutReducer, moveLayoutReducer, removeLayoutReducer} from "../reducers/layout";
import ReducerContext from '../contexts/ReducerContext'

const reducer = (state, action) => {
    switch (action.type) {
        case 'addBlock': return addBlockReducer(state, action)
        case 'moveBlock': return moveBlockReducer(state, action)
        case 'removeBlock': return removeBlockReducer(state, action)
        case 'updateBlock': return updateBlockReducer(state, action)
        case 'addLayout': return addLayoutReducer(state, action)
        case 'moveLayout': return moveLayoutReducer(state, action)
        case 'removeLayout': return removeLayoutReducer(state, action)
    }
}

function App (props) {
    let fields = document.querySelectorAll('[data-layout-builder-field]')
    fields = [...fields]

    const initialReducerState = {blocks: {}}
    fields.forEach(field => {
        initialReducerState.blocks[field.dataset.handle] = JSON.parse(field.dataset.layouts || '[]')
    })
    const [state, dispatch] = useReducer(reducer, initialReducerState)

    const dropPlaceholder = useRef()
    const ForwardedDropPlaceholder = forwardRef(DropPlaceholder)

    const bus = new EventEmitter2
    window.layoutBuilderBus = bus

    return <ReducerContext.Provider value={dispatch}>
        <BusContext.Provider value={bus}>
            <ForwardedDropPlaceholder ref={dropPlaceholder}/>
            <DropPlaceholderContext.Provider value={dropPlaceholder}>
                {fields.map(field => createPortal(<Field handle={field.dataset.handle} layouts={state.blocks[field.dataset.handle]}/>, field))}
            </DropPlaceholderContext.Provider>
        </BusContext.Provider>
    </ReducerContext.Provider>
}

export default App