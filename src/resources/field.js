import React, {
    useRef,
    forwardRef,
    useReducer,
} from 'react'
import ReactDOM from 'react-dom'
import Field from './components/Field'
import FieldPicker from './components/FieldPicker'
import {EventEmitter2} from "eventemitter2"
import BusContext from './contexts/BusContext'
import BlockEditor from './components/BlockEditor'
import DropPlaceholder from './components/DropPlaceholder'
import DropPlaceholderContext from './contexts/DropPlaceholderContext'
import App from './components/FieldApp'

const app = document.createElement('div')
document.body.appendChild(app)
ReactDOM.render(React.createElement(App), app)

// let dropPlaceholderRef
// const dropPlaceholder = React.createElement(forwardRef(DropPlaceholder), {ref: (placeholder) => {
//     dropPlaceholderRef = placeholder
// }})

// const bus = new EventEmitter2
// window.layoutBuilderBus = bus

// let modalContainer = document.querySelector('.craft-layout-builder-modals')
// if (!modalContainer) {
//     modalContainer = document.createElement('div')
//     modalContainer.className = 'craft-layout-builder-modals'
//     document.body.appendChild(modalContainer)
//     modalContainer.innerHTML = `
//         <div class="craft-layout-builder-modals-picker"></div>
//         <div class="craft-layout-builder-modals-block-editor"></div>
//         <div class="craft-layout-builder-modals-drop-placeholder"></div>
//     `
// }

// ReactDOM.render(React.createElement(BusContext.Provider, {value: bus},
//     React.createElement(BlockEditor)
// ), document.querySelector('.craft-layout-builder-modals-block-editor'))

// ReactDOM.render(React.createElement(BusContext.Provider, {value: bus},
//     dropPlaceholder
// ), document.querySelector('.craft-layout-builder-modals-drop-placeholder'))

// ReactDOM.render(React.createElement(BusContext.Provider, {value: bus},
//     React.createElement(DropPlaceholderContext.Provider, {value: dropPlaceholderRef},
//         React.createElement(FieldPicker)
//     )
// ), document.querySelector('.craft-layout-builder-modals-picker'))

// document.querySelectorAll('[data-layout-builder-field]').forEach(el => {
//     ReactDOM.render(React.createElement(BusContext.Provider, {value: bus},
//         React.createElement(DropPlaceholderContext.Provider, {value: dropPlaceholderRef},
//             React.createElement(Field, el.dataset)
//         )
//     ), el)
// })
