import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LayoutBuilderCell = props => {
    const [cellTitle, setCellTitle] = useState(props.title || '')
    const [cellWidth, setCellWidthState] = useState(props.width || '1fr')

    const removeCell = event => {
        event.preventDefault()
        props.removeCell(props.uid)
    }

    const setCellWidth = event => {
        setCellWidthState(event.target.value)
        props.setCellWidth(props.uid, event.target.value)
    }

    return <div className="cell">
        <input type="hidden" name={`layout[cells][${props.rowIndex}][${props.cellIndex}][uid]`} value={props.uid} />
        <input type="text" name={`layout[cells][${props.rowIndex}][${props.cellIndex}][title]`} value={cellTitle} onChange={e => setCellTitle(e.target.value)} placeholder="Title"/>
        <input type="text" name={`layout[cells][${props.rowIndex}][${props.cellIndex}][width]`} value={cellWidth} onChange={setCellWidth} placeholder="Width (1fr)"/>
        <a href="#" onClick={removeCell}>-</a>
    </div>
}

LayoutBuilderCell.propTypes = {
    title: PropTypes.string,
    removeCell: PropTypes.func.isRequired,
    setCellWidth: PropTypes.func.isRequired,
    rowIndex: PropTypes.number.isRequired,
    cellIndex: PropTypes.number.isRequired,
    uid: PropTypes.any.isRequired
}

export default LayoutBuilderCell