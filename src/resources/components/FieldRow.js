import React from 'react'
import PropTypes from 'prop-types'
import FieldCell from "./FieldCell";

const FieldRow = props => {
    return <div className="craft-layout-builder-grid" style={{gridTemplateColumns: props.cells.map(cell => cell.width).join(' ')}}>
        {props.cells.map(cell => <FieldCell key={cell.uid} layoutIndex={props.layoutIndex} {...cell}/>)}
    </div>
}

FieldRow.propTypes = {
}

export default FieldRow