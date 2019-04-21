import React from 'react'
import PropTypes from 'prop-types'
import FieldCell from "./FieldCell";

const FieldLayout = props => {
    const computedCss = `grid-template-columns: ${props.cells.map(cell => cell.width).join(' ')};`
    const layoutCss = props.useCustomCss ? props.customCss : computedCss

    return <div className="craft-layout-builder-layout">
        <style dangerouslySetInnerHTML={{__html:`.craft-layout-builder-grid[data-index="${props.index}"] {${layoutCss}}`}}/>
        <p className="craft-layout-builder-layout-title">{props.title}</p>
        <input type="hidden" name={`fields[${props.fieldHandle}][${props.index}][uid]`} value={props.uid}/>
        <div className="craft-layout-builder-grid" data-index={props.index}>
            {props.cells.map((cell, index) => <FieldCell key={index} fieldHandle={props.fieldHandle} layoutIndex={props.index} {...cell}/>)}
        </div>
    </div>
}

FieldLayout.propTypes = {
}

export default FieldLayout