import React, { useState } from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'
import Cell from './LayoutBuilderCell'
import LayoutBuilder from "./LayoutBuilder";

const LayoutBuilderRow = props => {
    let initialState

    if (props.cells && props.cells.length) {
        initialState = props.cells.map((cell, cellIndex) => {
            cell.cellIndex = cellIndex
            return cell
        })
    }
    else {
        initialState = [{uid: uuid(), width: '1fr', cellIndex: 0}]
    }

    const [cells, setCells] = useState(initialState)

    const addCell = event => {
        event.preventDefault()
        const newCells = cells.slice()
        newCells.push({
            uid: uuid(),
            width: '1fr',
            cellIndex: cells.length
        })
        setCells(newCells)
    }

    const removeCell = uid => {
        const newCells = cells
            .filter(cell => cell.uid !== uid)
            .map((cell, index) => {
                const newCell = Object.assign({}, cell)
                newCell.cellIndex = index
                return newCell
            })

        if (newCells.length === 0) {
            props.removeRow(props.uid)
        }

        setCells(newCells)
    }

    const setCellWidth = (uid, width) => {
        const newCells = cells.map(cell => {
            if (cell.uid === uid) {
                cell.width = width
            }
            return cell
        })
        setCells(newCells)
    }

    return <div className="row">
        <div className="cells" style={{gridTemplateColumns: cells.map(cell => cell.width || 'auto').join(' ')}}>
            {cells.map(cell => <Cell key={cell.uid} removeCell={removeCell} setCellWidth={setCellWidth} rowIndex={props.rowIndex} {...cell}/>)}
        </div>
        <a className="add" href="#" onClick={addCell}>+</a>
    </div>
}

LayoutBuilderRow.propTypes = {
    uid: PropTypes.any.isRequired,
    rowIndex: PropTypes.number.isRequired,
    removeRow: PropTypes.func.isRequired
}

export default LayoutBuilderRow