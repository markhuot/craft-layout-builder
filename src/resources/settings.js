import React from 'react'
import ReactDOM from 'react-dom'
import LayoutBuilder from './components/LayoutBuilder'
import IconPicker from "./components/IconPicker";

document.querySelectorAll('[data-layout-builder]').forEach(el => {
    const data = {
        useCustomCss: el.dataset.useCustomCss,
        customCss: el.dataset.customCss,
        cells: JSON.parse(el.dataset.cells || '[]'),
    }
    ReactDOM.render(React.createElement(LayoutBuilder, data), el)
})

document.querySelectorAll('[data-icon-picker]').forEach(el => {
    ReactDOM.render(React.createElement(IconPicker, el.dataset), el)
})