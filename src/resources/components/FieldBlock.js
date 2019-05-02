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
import DropPlaceholderContext from '../contexts/DropPlaceholderContext'

const FieldBlock = (props, ref) => {
    const bus = useContext(BusContext)
    const anchor = useRef(null)
    const [isSelected, setIsSelected] = useState(false)
    const placeholder = useContext(DropPlaceholderContext)

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

    useImperativeHandle(ref, () => ({
        focus: () => anchor.current.focus()
    }))

    const dragStartCallback = event => {
        const clonedBlock = Object.assign({}, props)

        // @TODO, I hate removing these. They shouldn't even be here, really, we need a better separation of block/model props and UI props
        delete clonedBlock.layoutIndex
        delete clonedBlock.cellIndex
        delete clonedBlock.cellUid
        delete clonedBlock.blockIndex

        event.dataTransfer.setData(`x-block-uid/${clonedBlock.uid}`, clonedBlock.uid)
        event.dataTransfer.setData(`x-block/key`, `${props.layoutIndex}.${props.cellIndex}.${props.blockIndex}`)
        event.dataTransfer.setData(`x-block-key/${props.layoutIndex}.${props.cellIndex}.${props.blockIndex}`, `${props.layoutIndex}.${props.cellIndex}.${props.blockIndex}`)
        event.dataTransfer.setData(`x-block/action`, 'move')
        event.dataTransfer.setData(`x-block/action.move`, 'move')
        event.dataTransfer.setData(`x-block/json`, JSON.stringify(clonedBlock))

        bus.emit('dragStart', event)
    }

    const dragEndCallback = event => {
        placeholder.hide()
        bus.emit('dragEnd', event)
    }

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

    return <li ref={anchor} tabIndex="0" className={`craft-layout-builder-block ${isSelected ? 'selected' : ''}`} draggable="true" onDragStart={dragStartCallback} onDragEnd={dragEndCallback} onKeyDown={onKeyDownCallback} onKeyUp={onKeyUpCallback} onClick={onClickCallback}>
        <input type="hidden" name={`fields[${props.fieldHandle}][${props.layoutIndex}][blocks][${props.cellUid}][]`} value={props.uid}/>
        <div className="clb-flex">
            {props.type.icon && <span className="craft-layout-builder-cell-icon clb-shrink-0">{icons.withKey(props.type.icon)}</span>}
            <a tabIndex="-1" className="craft-layout-builder-block-title clb-truncate" href={`/admin/blocks/${props.id}`} onClick={e => openBlockEditor(e, props)} draggable="false">
                {props.title || 'Untitled'}
            </a>
        </div>
    </li>
}

export default forwardRef(FieldBlock)