import React, {
    useContext
} from 'react'
import PropTypes from 'prop-types'
import FieldCell from './FieldCell'
import BusContext from '../contexts/BusContext'
import {useDraggable} from '../hooks/UseDraggable'

const FieldLayout = props => {
    const computedCss = `grid-template-columns: ${props.data.cells.map(cell => cell.width).join(' ')};`
    const layoutCss = props.data.useCustomCss ? props.data.customCss : computedCss

    const {events: draggableEvents} = useDraggable({
        type: 'layout',
        key: props.fieldHandle,
        data: props.data,
    })

    return <div tabIndex="0" className="craft-layout-builder-layout" draggable="true" {...draggableEvents}>
        <style dangerouslySetInnerHTML={{__html:`.craft-layout-builder-grid[data-index="${props.index}"] {${layoutCss}}`}}/>
        <p className="craft-layout-builder-layout-title">{props.data.title}</p>
        <input type="hidden" name={`fields[${props.fieldHandle}][${props.index}][uid]`} value={props.data.uid}/>
        <div className="craft-layout-builder-grid" data-index={props.index} draggable="false">
            {props.data.cells.map((cell, index) => <FieldCell key={index} fieldHandle={props.fieldHandle} layoutIndex={props.index} cellIndex={index} {...cell}/>)}
        </div>
    </div>
}

FieldLayout.propTypes = {
}

export default FieldLayout