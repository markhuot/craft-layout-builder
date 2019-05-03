import React, {
    useState,
    useEffect,
    useContext,
    useRef,
    forwardRef,
    createRef,
    useCallback
} from 'react'
import PropTypes from 'prop-types'
import BusContext from '../contexts/BusContext'
import useElementPicker from '../hooks/UseElementPicker'
import FieldBlock from "./FieldBlock";
import DropPlaceholderContext from '../contexts/DropPlaceholderContext'
import {useDroppable} from '../hooks/UseDraggable'

const FieldCell = props => {
    const bus = useContext(BusContext)
    const [blocks, setBlocks] = useState(props.blocks || [])
    const isEmpty = blocks.length === 0
    const blockList = useRef(null)
    const addButton = useRef(null)
    const picker = useElementPicker()
    const cellKey = `${props.fieldHandle}[${props.layoutIndex}][${props.cellIndex}]`

    const addBlock = (newBlock, placement) => {
        if (!placement) {
            placement = blocks.length
        }

        const newBlocks = blocks.slice()
        newBlocks.splice(placement, 0, newBlock)
        setBlocks(newBlocks)
        blockList.current.childNodes[placement].focus()

        if (newBlock.id === null) {
            bus.emit('showBlockEditor', newBlock)
        }
    }

    const removeBlockByIndex = index => {
        let newBlocks = blocks.slice()
        newBlocks.splice(index, 1)
        setBlocks(newBlocks)
        if (newBlocks.length) {
            const focusIndex = index > newBlocks.length - 1 ? newBlocks.length - 1 : index
            blockList.current.childNodes[focusIndex].focus()
        }
        else {
            addButton.current.focus()
        }
    }

    const moveBlockByIndex = (oldIndex, newIndex) => {
        const newBlocks = blocks.slice()
        if (newIndex < 0) { newIndex = 0 }
        if (newIndex > blocks.length - 1) { newIndex = blocks.length - 1 }
        newBlocks.splice(newIndex, 0, newBlocks.splice(oldIndex, 1)[0])
        setBlocks(newBlocks)
        blockList.current.childNodes[newIndex].focus()
    }

    useEffect(() => {
        const removeBlockFromKeyCallback = index => {
            removeBlockByIndex(index)
        }

        bus.on(`removeBlockFromKey(${cellKey})`, removeBlockFromKeyCallback)
        return () => bus.off(`removeBlockFromKey(${cellKey})`, removeBlockFromKeyCallback)
    })

    useEffect(() => {
        const hideBlockEditorCallback = () => {
            const newBlocks = blocks.filter(block => block.id)
            setBlocks(newBlocks)
        }

        bus.on('hideBlockEditor', hideBlockEditorCallback)
        return () => bus.off('hideBlockEditor', hideBlockEditorCallback)
    })

    useEffect(() => {
        const updateBlockCallback = updatedBlock => {
            let blockFound = false
            let newBlocks = blocks.slice()
            newBlocks = newBlocks.map(block => {
                if (block.uid === updatedBlock.uid) {
                    blockFound = true
                    return updatedBlock
                }

                return block
            })
            if (blockFound) {
                setBlocks(newBlocks)
            }
        }

        bus.on('updateBlock', updateBlockCallback)
        return () => bus.off('updateBlock', updateBlockCallback)
    })

    picker.on('update', newBlock => {
        addBlock(newBlock)
        if (newBlock.id === null) {
            bus.emit('showBlockEditor', newBlock)
        }
    })

    const onMove = ({event, oldKey, oldIndex, newKey, newIndex, data}) => {
        if (oldKey && oldKey === newKey) {
            moveBlockByIndex(oldIndex, newIndex)
        }
        else {
            if (oldKey) {
                bus.emit(`removeBlockFromKey(${oldKey})`, oldIndex)
            }

            addBlock(data, newIndex)

            if (data.id === null) {
                bus.emit('showBlockEditor', data)
            }
        }
    }

    const onDelete = ({index}) => {
        removeBlockByIndex(index)
    }

    const {events: droppableEvents} = useDroppable({ref:blockList, key:cellKey, accept:['block'], onMove, onDelete})

    return <div className="craft-layout-builder-cell" data-uid={props.uid}>
        {props.customCss && <style dangerouslySetInnerHTML={{__html:`.craft-layout-builder-cell[data-uid="${props.uid}"] {${props.customCss}}`}}/>}
        <p className="craft-layout-builder-cell-title">{props.title}</p>
        <ul ref={blockList} {...droppableEvents} className={`craft-layout-builder-spacing craft-layout-builder-blocks ${isEmpty && 'empty'}`}>
            {blocks.map((block, index) => <FieldBlock key={`${props.uid}${index}`}
                                                      fieldHandle={props.fieldHandle}
                                                      layoutIndex={props.layoutIndex}
                                                      cellUid={props.uid}
                                                      cellIndex={props.cellIndex}
                                                      blockIndex={index}
                                                      data={block}/>)}
            {blocks.length === 0 && <li className="craft-layout-builder-block-placeholder">Empty</li>}
        </ul>
        <p><button ref={addButton} className={`clb-appearance-none clb-rounded clb-border clb-border-solid clb-p-1 ${picker.active ? 'clb-border-blue' : ''}`} onClick={e => {e.preventDefault(); picker.toggle('blocks')}}>Add</button></p>
    </div>
}

FieldCell.propTypes = {
}

export default FieldCell