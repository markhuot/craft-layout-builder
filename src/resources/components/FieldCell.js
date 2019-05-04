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
import FieldBlockPicker from "./FieldBlockPicker";
import BlockEditorNew from "./BlockEditorNew";

const FieldCell = props => {
    const bus = useContext(BusContext)
    const [blocks, setBlocks] = useState(props.blocks || [])
    const isEmpty = blocks.length === 0
    const blockList = useRef(null)
    const addButton = useRef(null)
    const picker = useElementPicker()
    const cellKey = `${props.fieldHandle}[${props.layoutIndex}][${props.cellIndex}]`
    const [showBlockPicker, setShowBlockPicker] = useState(false)
    const [showBlockEditor, setShowBlockEditor] = useState(false)

    const addBlockAtIndex = (newBlock, placement) => {
        if (!placement) {
            placement = blocks.length
        }

        const newBlocks = blocks.slice()
        newBlocks.splice(placement, 0, newBlock)
        setBlocks(newBlocks)

        // can't call focus here because childNodes[placement] won't exist
        // until React can re-render the component. setBlocks isn't synchronous
        // so we need to find a way to call this after the re-render
        // blockList.current.childNodes[placement].focus()
    }

    const removeBlockAtIndex = index => {
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

    const moveBlockToIndex = (oldIndex, newIndex) => {
        const newBlocks = blocks.slice()
        if (newIndex < 0) { newIndex = 0 }
        if (newIndex > blocks.length - 1) { newIndex = blocks.length - 1 }
        newBlocks.splice(newIndex, 0, newBlocks.splice(oldIndex, 1)[0])
        setBlocks(newBlocks)
        blockList.current.childNodes[newIndex].focus()
    }

    useEffect(() => {
        const removeBlockFromKeyCallback = index => {
            removeBlockAtIndex(index)
        }

        bus.on(`removeBlockFromKey(${cellKey})`, removeBlockFromKeyCallback)
        return () => bus.off(`removeBlockFromKey(${cellKey})`, removeBlockFromKeyCallback)
    })

    useEffect(() => {

        const updateBlockCallback = updatedBlock => {
            let blockFound = false
            let newBlocks = blocks.map(block => Object.assign({}, block))
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

        const hideBlockEditorCallback = () => {
            // const newBlocks = blocks.filter(block => block.id)
            // setBlocks(newBlocks)
            setBlocks(oldBlocks => oldBlocks.filter(block => block.id))
        }

        bus.on('hideBlockEditor', hideBlockEditorCallback)
        bus.on('updateBlock', updateBlockCallback)
        return () => {
            bus.off('updateBlock', updateBlockCallback)
            bus.off('hideBlockEditor', hideBlockEditorCallback)
        }
    })

    picker.on('update', newBlock => {
        addBlockAtIndex(newBlock)
        if (newBlock.id === null) {
            bus.emit('showBlockEditor', newBlock)
        }
    })

    const onMove = ({oldKey, oldIndex, newKey, newIndex, data}) => {
        if (oldKey && oldKey === newKey) {
            moveBlockToIndex(oldIndex, newIndex)
        }
        else {
            if (oldKey) {
                bus.emit(`removeBlockFromKey(${oldKey})`, oldIndex)
            }

            addBlockAtIndex(data, newIndex)

            if (data.id === null) {
                bus.emit('showBlockEditor', data)
            }
        }
    }

    const onDelete = ({index}) => {
        removeBlockAtIndex(index)
    }

    const {events: droppableEvents} = useDroppable({ref:blockList, key:cellKey, accept:['block'], onMove, onDelete})

    return <div className="craft-layout-builder-cell" data-uid={props.data.uid}>
        {props.data.customCss && <style dangerouslySetInnerHTML={{__html:`.craft-layout-builder-cell[data-uid="${props.data.uid}"] {${props.data.customCss}}`}}/>}
        <p className="craft-layout-builder-cell-title">{props.data.title}</p>
        <ul ref={blockList} {...droppableEvents} className={`craft-layout-builder-spacing craft-layout-builder-blocks ${isEmpty && 'empty'}`}>
            {blocks.map((block, index) => <FieldBlock key={`${props.data.uid}${index}`}
                                                      fieldHandle={props.fieldHandle}
                                                      layoutIndex={props.layoutIndex}
                                                      cellUid={props.data.uid}
                                                      cellIndex={props.cellIndex}
                                                      blockIndex={index}
                                                      onClick={event => setShowBlockEditor(index)}
                                                      data={block}/>)}
            {blocks.length === 0 && <li className="craft-layout-builder-block-placeholder">Empty</li>}
        </ul>
        <p>
            <button ref={addButton}
                    className={`clb-appearance-none clb-rounded clb-border clb-border-solid clb-p-1 ${showBlockPicker ? 'clb-border-blue' : ''}`}
                    onClick={e => {
                        e.preventDefault()
                        setShowBlockPicker(!showBlockPicker)
                    }}
            >Add</button>
        </p>
        {showBlockPicker && <FieldBlockPicker
            onPick={block => {
                const newIndex = blocks.length
                addBlockAtIndex(block, newIndex)
                setShowBlockPicker(false)
                setShowBlockEditor(newIndex)
            }}
        />}
        {showBlockEditor !== false && <BlockEditorNew
            block={blocks[showBlockEditor]}
            onClose={() => {
                if (blocks[showBlockEditor].id === null) {
                    removeBlockAtIndex(showBlockEditor)
                }
                setShowBlockEditor(false)
            }}
            onSave={block => {
                const newBlocks = blocks.slice()
                newBlocks[showBlockEditor] = block
                setBlocks(newBlocks)
                setShowBlockEditor(false)
            }}
        />}
    </div>
}

FieldCell.propTypes = {
}

export default FieldCell