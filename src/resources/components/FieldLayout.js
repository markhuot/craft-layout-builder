import React from 'react'
import PropTypes from 'prop-types'
import FieldRow from './FieldRow'

const FieldLayout = props => {
    return <div className="craft-layout-builder-layout">
        <p className="craft-layout-builder-layout-title">{props.title}</p>
        <input type="hidden" name={`fields[layoutBuilder][${props.index}][uid]`} value={props.uid}/>
        <div className="craft-layout-builder-grid">
            {props.cells.map((row, index) => <FieldRow key={index} layoutIndex={props.index} cells={row}/>)}
        </div>
    </div>
}

FieldLayout.propTypes = {
}

export default FieldLayout