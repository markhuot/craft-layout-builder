import React, { useContext } from 'react'
import BusContext from '../contexts/BusContext'
import icons from './Icons'

const FieldBlock = (props) => {
    const bus = useContext(BusContext)

    const openBlockEditor = (event, block) => {
        event.preventDefault()
        bus.emit('showBlockEditor', block)
    }

    const dragStartCallback = event => {
        const clonedBlock = Object.assign({}, props)
        delete clonedBlock.layoutIndex
        delete clonedBlock.cellUid

        // @TODO remove unused data transfer
        // event.dataTransfer.setData(`x-block/__uid`, clonedBlock.uid)
        // event.dataTransfer.setData(`x-block/__type`, clonedBlock.type.handle)
        // event.dataTransfer.setData(`x-block/${clonedBlock.type.handle}`, JSON.stringify(clonedBlock))

        event.dataTransfer.setData(`x-block-uid/${clonedBlock.uid}`, clonedBlock.uid)
        event.dataTransfer.setData(`x-block/action`, 'move')
        event.dataTransfer.setData(`x-block/action.move`, 'move')
        event.dataTransfer.setData(`x-block/json`, JSON.stringify(clonedBlock))

        bus.emit('dragStart', event)
    }

    const dragEndCallback = event => {
        bus.emit('dragEnd', event)
    }

    return <li className="craft-layout-builder-block" draggable="true" onDragStart={dragStartCallback} onDragEnd={dragEndCallback}>
        <input type="hidden" name={`fields[${props.fieldHandle}][${props.layoutIndex}][blocks][${props.cellUid}][]`} value={props.uid}/>
        {props.type.icon && <span className="craft-layout-builder-cell-icon">{icons.withKey(props.type.icon)}</span>}
        <a className="craft-layout-builder-block-title" href="#" onClick={e => openBlockEditor(e, props)} draggable="false">
            {props.title || 'Untitled'}
        </a>
    </li>
}

export default FieldBlock