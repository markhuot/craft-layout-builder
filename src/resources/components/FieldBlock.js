import React, {
    useContext,
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from 'react'
import BusContext from '../contexts/BusContext'
import icons from './Icons'
import {useDraggable} from '../hooks/UseDraggable'

const FieldBlock = props => {
    const bus = useContext(BusContext)
    const anchor = useRef(null)
    const [isSelected, setIsSelected] = useState(false)

    const openBlockEditor = (event, block) => {
        event.preventDefault()
        bus.emit('showBlockEditor', block)
    }

    useEffect(() => {
        const focusBlockCallback = block => {
            if (block.uid === props.uid) {
                anchor.current.focus()
            }
        }

        bus.on('focusBlock', focusBlockCallback)
        return () => bus.off('focusBlock', focusBlockCallback)
    })

    useEffect(() => {
        if (props.focused) {
            console.log('set to focused')
            anchor.current.focus()
        }
    })

    const onKeyDownCallback = event => {
        const keyCode = event.keyCode
        switch (keyCode) {
            case 32: /* space */
                event.preventDefault()
                break
            // case 8: /* delete */
            //     event.preventDefault()
            //     break
        }
    }

    const onKeyUpCallback = event => {
        const keyCode = event.keyCode
        switch (keyCode) {
            case 13: /* return */
                bus.emit('showBlockEditor', props)
                break
            case 32: /* space */
                // setIsSelected(!isSelected)
                break
        }
    }

    const onClickCallback = event => {
        event.preventDefault()
        // setIsSelected(!isSelected)
    }

    const {events: draggableEvents} = useDraggable({
        type: 'block',
        key: `${props.fieldHandle}[${props.layoutIndex}][${props.cellIndex}]`,
        data: props.data,
    })

    return <li ref={anchor} tabIndex="0" className={`craft-layout-builder-block ${isSelected ? 'selected' : ''}`} draggable="true" {...draggableEvents} onKeyDown={onKeyDownCallback} onKeyUp={onKeyUpCallback} onClick={onClickCallback}>
        <input type="hidden" name={`fields[${props.fieldHandle}][${props.layoutIndex}][blocks][${props.cellUid}][]`} value={props.data.uid}/>
        <div className="clb-flex">
            {props.data.type.icon && <span className="craft-layout-builder-cell-icon clb-shrink-0">{icons.withKey(props.data.type.icon)}</span>}
            <a tabIndex="-1" className="craft-layout-builder-block-title clb-truncate" href={`/admin/blocks/${props.data.id}`} onClick={e => openBlockEditor(e, props.data)} draggable="false">
                {props.data.title || 'Untitled'}
            </a>
        </div>
    </li>
}

export default FieldBlock