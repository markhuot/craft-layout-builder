import React, { useRef, forwardRef } from 'react'
import ReactDOM from 'react-dom'
import Field from './components/Field'
import FieldPicker from './components/FieldPicker'
import {EventEmitter2} from "eventemitter2"
import BusContext from './contexts/BusContext'
import BlockEditor from './components/BlockEditor'
import DropPlaceholder from './components/DropPlaceholder'
import DropPlaceholderContext from './contexts/DropPlaceholderContext'

let dropPlaceholderRef
const dropPlaceholder = React.createElement(forwardRef(DropPlaceholder), {ref: (placeholder) => {
        dropPlaceholderRef = placeholder
}})

const bus = new EventEmitter2
window.layoutBuilderBus = bus

let modalContainer = document.querySelector('.craft-layout-builder-modals')
if (!modalContainer) {
    modalContainer = document.createElement('div')
    modalContainer.className = 'craft-layout-builder-modals'
    document.body.appendChild(modalContainer)
    modalContainer.innerHTML = `
        <div class="craft-layout-builder-modals-picker"></div>
        <div class="craft-layout-builder-modals-block-editor"></div>
        <div class="craft-layout-builder-modals-drop-placeholder"></div>
    `
}

ReactDOM.render(React.createElement(BusContext.Provider, {value: bus},
    React.createElement(FieldPicker)
), document.querySelector('.craft-layout-builder-modals-picker'))

ReactDOM.render(React.createElement(BusContext.Provider, {value: bus},
    React.createElement(BlockEditor)
), document.querySelector('.craft-layout-builder-modals-block-editor'))

ReactDOM.render(React.createElement(BusContext.Provider, {value: bus},
    dropPlaceholder
), document.querySelector('.craft-layout-builder-modals-drop-placeholder'))

document.querySelectorAll('[data-layout-builder-field]').forEach(el => {
    ReactDOM.render(React.createElement(BusContext.Provider, {value: bus},
        React.createElement(DropPlaceholderContext.Provider, {value: dropPlaceholderRef},
            React.createElement(Field, el.dataset)
        )
    ), el)
})
