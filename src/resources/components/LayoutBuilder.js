import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Row from './LayoutBuilderRow'
import uuid from 'uuid'

const LayoutBuilder = props => {
    const initialState = []
    if (props.cells) {
        props.cells.forEach(cells => initialState.push(
            {
                uid: uuid(),
                rowIndex: initialState.length,
                cells
            }
        ))
    }

    const [rows, setRows] = useState(initialState)

    const addRow = event => {
        event.preventDefault()
        const newRows = rows.slice()
        newRows.push({
            uid: uuid(),
            rowIndex: rows.length
        })
        setRows(newRows)
    }

    const removeRow = uid => {
        const newRows = rows.slice()
            .filter(row => row.uid !== uid)
            .map((row, rowIndex) => {
                const newRow = Object.assign({}, row)
                newRow.rowIndex = rowIndex
                return newRow
            })
        setRows(newRows)
    }

    return <div>
        <div className="rows">
            {rows.map(row => <Row removeRow={removeRow} key={row.uid} {...row}/>)}
        </div>
        <a className="add" href="#" onClick={addRow}>+</a>
    </div>
}

LayoutBuilder.propTypes = {
    cells: PropTypes.array
}

export default LayoutBuilder