import React, {
    useContext
} from 'react'
import PropTypes from 'prop-types'
import FieldCell from './FieldCell'
import BusContext from '../contexts/BusContext'
import {useDraggable} from '../hooks/UseDraggable'

const FieldLayout = props => {
    const computedCss = `grid-template-columns: ${props.data.type.cells.map(cell => cell.width).join(' ')};`
    const layoutCss = props.data.type.useCustomCss ? props.data.type.customCss : computedCss

    const {events: draggableEvents} = useDraggable({
        type: 'layout',
        key: props.fieldHandle,
        data: props.data,
    })

    const aria = Object.keys(props)
        .filter(key => key.substring(0, 4) === 'aria')
        .map(key => [key, props[key]])
        .reduce((accumulator, current) => {
            accumulator[current[0]] = current[1]
            return accumulator
        }, {})

    return <div tabIndex="0" className="craft-layout-builder-layout" draggable="true" {...draggableEvents} {...aria}>
        <style dangerouslySetInnerHTML={{__html:`[data-layout-builder-field][data-handle="${props.fieldHandle}"] .craft-layout-builder-grid[data-index="${props.index}"] {${layoutCss}}`}}/>
        <p className="craft-layout-builder-layout-title">{props.data.type.title}</p>
        <input type="hidden" name={`fields[${props.fieldHandle}][${props.index}][uid]`} value={props.data.uid}/>
        <input type="hidden" name={`fields[${props.fieldHandle}][${props.index}][layoutTypeId]`} value={props.data.type.id}/>
        <div className="craft-layout-builder-cells craft-layout-builder-grid" data-index={props.index} draggable="false">
            {props.data.type.cells.map((cell, index) => <FieldCell key={index} fieldHandle={props.fieldHandle} layoutIndex={props.index} cellIndex={index} blocks={(props.data.blocks && props.data.blocks[cell.uid]) || []} data={cell}/>)}
        </div>
    </div>
}

FieldLayout.propTypes = {
}

export default FieldLayout