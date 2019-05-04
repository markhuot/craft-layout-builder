import React, {
    useContext,
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from 'react'
import icons from './Icons'
import {useDraggable} from '../hooks/UseDraggable'

const FieldBlock = props => {
    const anchor = useRef(null)

    const onClickCallback = event => {
        event.preventDefault()
        if (props.onClick) {
            props.onClick(event)
        }
    }

    const {events: draggableEvents} = useDraggable({
        type: 'block',
        key: `${props.fieldHandle}[${props.layoutIndex}][${props.cellIndex}]`,
        data: props.data,
    })

    return <li ref={anchor} tabIndex="0" className="craft-layout-builder-block" draggable="true" {...draggableEvents}>
        <input type="hidden" name={`fields[${props.fieldHandle}][${props.layoutIndex}][blocks][${props.cellUid}][]`} value={props.data.uid}/>
        <div className="clb-flex">
            {props.data.type.icon && <span className="craft-layout-builder-cell-icon clb-shrink-0">{icons.withKey(props.data.type.icon)}</span>}
            <a tabIndex="-1" className="craft-layout-builder-block-title clb-truncate" href={`/admin/blocks/${props.data.id}`} onClick={onClickCallback} draggable="false">
                {props.data.title || 'Untitled'}
            </a>
        </div>
    </li>
}

export default FieldBlock