import React from 'react'
import ReactDOM from 'react-dom'
import Field from './components/Field'
import FieldPicker from './components/FieldPicker'
import {EventEmitter2} from "eventemitter2"
import BusContext from './contexts/BusContext'
import BlockEditor from "./components/BlockEditor";

const bus = new EventEmitter2
window.layoutBuilderBus = bus

let modalContainer = document.querySelector('.craft-layout-builder-modals')
if (!modalContainer) {
    modalContainer = document.createElement('div')
    modalContainer.className = 'craft-layout-builder-modals'
    document.body.appendChild(modalContainer)
    modalContainer.innerHTML = '<div class="craft-layout-builder-modals-picker"></div><div class="craft-layout-builder-modals-block-editor"></div>';
}

ReactDOM.render(React.createElement(BusContext.Provider, {value: bus},
    React.createElement(FieldPicker)
), document.querySelector('.craft-layout-builder-modals-picker'))

ReactDOM.render(React.createElement(BusContext.Provider, {value: bus},
    React.createElement(BlockEditor)
), document.querySelector('.craft-layout-builder-modals-block-editor'))

document.querySelectorAll('[data-layout-builder-field]').forEach(el => {
    ReactDOM.render(React.createElement(BusContext.Provider, {value: bus},
        React.createElement(Field, el.dataset)
    ), el)
})