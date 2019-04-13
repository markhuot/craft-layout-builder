import React, { useState, useEffect, useContext, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import BusContext from '../contexts/BusContext'
import useElementPicker from '../hooks/UseElementPicker'
import uuid from 'uuid/v4'
import FieldBlock from "./FieldBlock";

const FieldCell = props => {
    const bus = useContext(BusContext)
    const [blocks, setBlocks] = useState(props.blocks || [])
    const isEmpty = blocks.length === 0
    const blockList = useRef(null)
    const picker = useElementPicker()

    const removeBlock = uid => {
        let newBlocks = blocks.slice()
        newBlocks = newBlocks.filter(block => block.uid !== uid)
        setBlocks(newBlocks)
    }

    useEffect(() => {
        const removeBlockCallback = uid => {
            if (blocks.map(block => block.uid).includes(uid)) {
                removeBlock(uid)
            }
        }

        bus.on('removeBlock', removeBlockCallback)
        return () => bus.off('removeBlock', removeBlockCallback)
    })

    useEffect(() => {
        const cancelBlockEditorCallback = blockToRemove => {
            if (typeof blockToRemove.id === 'undefined') {
                removeBlock(blockToRemove.uid)
            }
        }

        bus.on('cancelBlockEditor', cancelBlockEditorCallback)
        return () => bus.off('cancelBlockEditor', cancelBlockEditorCallback)
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

    // @TODO move this in to useElementPicker by passing setBlocks to the picker class
    picker.on('update', element => {
        const newBlocks = blocks.slice()
        const newBlock = {
            uid: uuid(),
            type: element,
        }
        newBlocks.push(newBlock)
        setBlocks(newBlocks)
        bus.emit('showBlockEditor', newBlock)
    })

    let placement = 0

    const removeDragDropPlaceholder = () => {
        const el = document.getElementById('craft-layout-builder-drop-target')
        if (el) el.parentNode.removeChild(el)
    }

    const dragDropPlaceholder = () => {
        const el = document.getElementById('craft-layout-builder-drop-target')
        if (el) return el

        const placeholder = document.createElement('div')
        placeholder.id = 'craft-layout-builder-drop-target'
        document.body.appendChild(placeholder)
        return placeholder
    }

    const dragOverCallback = event => {
        const listItems = blockList.current.querySelectorAll('li')
        for (const index in [...listItems]) {
            const listItem = listItems[index]
            const top = listItem.getBoundingClientRect().top
            const height = listItem.getBoundingClientRect().height
            const mouse = event.pageY

            if (mouse < top + (height/2)) {
                placement = parseInt(index)
                break
            }

            if (top + (height/2) < mouse && mouse < top + height) {
                placement = parseInt(index)+1
                break
            }
        }

        // if we're hovering over ourselves then we'll bail out and let the
        // default browser action of assuming all drags are invalid continue
        const index = blocks.findIndex(block => event.dataTransfer.types.includes(`x-block-uid/${block.uid}`))
        if (index >= 0 && (index === placement || index === placement-1)) {
            removeDragDropPlaceholder()
            return
        }

        // if we're here then the drag is valid and we have to prevent the default
        // browser function of assuming all drafts are invalid
        event.preventDefault()

        if (placement === 0) {
            const listItem = listItems[0]
            const top = listItem.getBoundingClientRect().top
            const left = listItem.getBoundingClientRect().left
            const width = listItem.getBoundingClientRect().width
            dragDropPlaceholder().style.top = (top - 5)+'px'
            dragDropPlaceholder().style.left = (left - 5)+'px'
            dragDropPlaceholder().style.width = (width + 10)+'px'
        }

        else if (listItems[placement-1] && listItems[placement]) {
            const previousListItem = listItems[placement-1]
            const previousTop = previousListItem.getBoundingClientRect().top
            const previousLeft = previousListItem.getBoundingClientRect().left
            const previousWidth = previousListItem.getBoundingClientRect().width
            const previousHeight = previousListItem.getBoundingClientRect().height
            const previousBottom = previousTop + previousHeight
            const nextListItem = listItems[placement]
            const nextTop = nextListItem.getBoundingClientRect().top
            const spacing = nextTop - previousBottom

            dragDropPlaceholder().style.top = (previousBottom + (spacing/2))+'px'
            dragDropPlaceholder().style.left = (previousLeft - 5)+'px'
            dragDropPlaceholder().style.width = (previousWidth + 10)+'px'
        }

        else {
            const listItem = listItems[placement-1]
            const top = listItem.getBoundingClientRect().top
            const left = listItem.getBoundingClientRect().left
            const width = listItem.getBoundingClientRect().width
            const height = listItem.getBoundingClientRect().height

            dragDropPlaceholder().style.top = (top + height + 5)+'px'
            dragDropPlaceholder().style.left = (left - 5)+'px'
            dragDropPlaceholder().style.width = (width + 10)+'px'
        }

        // TODO make the width increase (pulse) each time the placeholder moves
        // const listItem = listItems[0]
        // const width = listItem.getBoundingClientRect().width
        // dragDropPlaceholder().style.width = (width + 10)+'px'
    }

    const dragLeaveCallback = event => {
        // event.target.style.outline = ''
    }

    const dropCallback = event => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'reorder'

        // event.target.style.outline = ''

        let updatingBlocks = blocks.slice()
        const blockTypeHandle = event.dataTransfer.getData('x-block/__type')
        const newBlock = JSON.parse(event.dataTransfer.getData(`x-block/${blockTypeHandle}`))

        // We need to check if the block is being reordered in the current cell
        // because, if so, we need to move it from its old position to its new
        // position in one motion. Otherwise React may render the addition before
        // the removal (since UI updates are batched) and we'd end up with two of
        // the same blocks in a cell, which we don't want (right now)
        const existingIndex = blocks.findIndex(block => block.uid === newBlock.uid)
        if (existingIndex === -1) {
            bus.emit('removeBlock', newBlock.uid)
        }
        else {
            updatingBlocks.splice(existingIndex, 1)
            if (existingIndex < placement) {
                placement--
            }
        }
        updatingBlocks.splice(placement, 0, newBlock)
        setBlocks(updatingBlocks)

        removeDragDropPlaceholder()
    }

    const dragEndCallback = event => {
        event.preventDefault()

        removeDragDropPlaceholder()
    }

    return <div className={`craft-layout-builder-cell ${picker.active ? 'craft-layout-builder-active-picker' : ''}`} onDragOver={dragOverCallback} onDragLeave={dragLeaveCallback} onDragEnd={dragEndCallback} onDrop={dropCallback}>
        <p className="craft-layout-builder-cell-title">{props.title}</p>
        <ul ref={blockList} className={`craft-layout-builder-spacing craft-layout-builder-blocks ${isEmpty && 'empty'}`}>
            {blocks.map(block => <FieldBlock key={block.uid} layoutIndex={props.layoutIndex} cellUid={props.uid} {...block}/>)}
            {blocks.length === 0 && <li className="craft-layout-builder-block-placeholder">Empty</li>}
        </ul>
        <p><button onClick={e => {e.preventDefault(); picker.toggle()}}>Add</button></p>
    </div>
}

FieldCell.propTypes = {
}

export default FieldCell