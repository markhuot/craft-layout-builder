import React from 'react'
import ReactDOM from 'react-dom'
import LayoutBuilder from './components/LayoutBuilder'

document.querySelectorAll('[data-layout-builder]').forEach(el => {
    const cells = JSON.parse(el.dataset.layoutBuilder || '[]')
    ReactDOM.render(React.createElement(LayoutBuilder, {cells}), el)
})