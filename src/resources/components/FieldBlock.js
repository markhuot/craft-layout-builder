import React, { useContext, forwardRef, useImperativeHandle } from 'react'
import BusContext from '../contexts/BusContext';

const FieldBlock = (props, ref) => {
    const bus = useContext(BusContext)

    const openBlockEditor = (event, block) => {
        event.preventDefault()
        bus.emit('showBlockEditor', block)
    }

    useImperativeHandle(ref, () => ({
        foo: () => 'bar'
    }))

    const dragStartCallback = event => {
        const clonedBlock = Object.assign({}, props)
        delete clonedBlock.layoutIndex
        delete clonedBlock.cellUid
        event.dataTransfer.setData(`x-block-uid/${clonedBlock.uid}`, clonedBlock.uid)
        event.dataTransfer.setData(`x-block/__uid`, clonedBlock.uid)
        event.dataTransfer.setData(`x-block/__type`, clonedBlock.type.handle)
        event.dataTransfer.setData(`x-block/${clonedBlock.type.handle}`, JSON.stringify(clonedBlock))
    }

    return <li className="craft-layout-builder-block" draggable="true" onDragStart={dragStartCallback}>
        <a className="craft-layout-builder-block-title" href="#" onClick={e => openBlockEditor(e, props)} draggable="false">
            <input type="hidden" name={`fields[layoutBuilder][${props.layoutIndex}][blocks][${props.cellUid}][]`} value={props.uid}/>
            {props.type.id == 1 && <img width="16" src={`//image.flaticon.com/icons/svg/149/149197.svg`}/>}
            {props.type.id == 2 && <img width="16" src={`//image.flaticon.com/icons/svg/149/149444.svg`}/>}
            {props.type.id == 3 && <img width="16" src={`//image.flaticon.com/icons/svg/149/149441.svg`}/>}
            {props.title || 'Untitled'}
        </a>
    </li>
}

export default forwardRef(FieldBlock)