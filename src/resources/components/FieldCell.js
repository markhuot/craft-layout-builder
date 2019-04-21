import React, { useState, useEffect, useContext, useRef, forwardRef } from 'react'
import PropTypes from 'prop-types'
import BusContext from '../contexts/BusContext'
import useElementPicker from '../hooks/UseElementPicker'
import uuid from 'uuid/v4'
import FieldBlock from "./FieldBlock";
import DropPlaceholderContext from '../contexts/DropPlaceholderContext'

const FieldCell = props => {
    const bus = useContext(BusContext)
    const [blocks, setBlocks] = useState(props.blocks || [])
    const isEmpty = blocks.length === 0
    const blockList = useRef(null)
    const picker = useElementPicker()
    const placeholder = useContext(DropPlaceholderContext)

    const addBlock = newBlock => {
        const newBlocks = blocks.slice()
        newBlocks.push(newBlock)
        setBlocks(newBlocks)
        bus.emit('showBlockEditor', newBlock)
    }

    const removeBlock = uid => {
        let newBlocks = blocks.slice()
        newBlocks = newBlocks.filter(block => block.uid !== uid)
        setBlocks(newBlocks)
    }

    const moveBlock = (movedBlock, newPlacement) => {
        let updatingBlocks = blocks.slice()

        // We need to check if the block is being reordered in the current cell
        // because, if so, we need to move it from its old position to its new
        // position in one motion. Otherwise React may render the addition before
        // the removal (since UI updates are batched) and we'd end up with two of
        // the same blocks in a cell, which we don't want (right now)
        const existingIndex = blocks.findIndex(block => block.uid === movedBlock.uid)

        // If the block doesn't exist in the current cell, then we'll fire an event
        // and let the actual owner of the block remove it
        if (existingIndex === -1) {
            bus.emit('removeBlock', movedBlock.uid)
        }

        // If the block _does_ exist in the current cell, then we're moving it so
        // we'll reorder the existing blocks and fire a single call to `setBlocks`
        // so we don't end up with any race conditions
        else {
            updatingBlocks.splice(existingIndex, 1)
            if (existingIndex < newPlacement) {
                newPlacement--
            }
        }
        updatingBlocks.splice(newPlacement, 0, movedBlock)
        setBlocks(updatingBlocks)
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

    picker.on('update', element => {
        addBlock({
            uid: uuid(),
            type: element,
        })
    })

    // the placement is determined in the dragOver callback and then used later in
    // the dropCallback. Define it here so it's accessible in both callbacks.
    let placement = 0

    // @TODO do the below, but it causes issues with dragging in a new block from the picker
    // get the listItems in an effect so it only fires on re-render and we aren't
    // fetching them every time the dragOver callback is run
    // let listItems
    // useEffect(() => {
    //     listItems = blockList.current.querySelectorAll('li')
    // }, [blocks])

    const dragOverCallback = event => {
        const listItems = blockList.current.querySelectorAll('li')

        // given the existing list items figure out which index the new element will
        // be dropped in to based on the mouse position relative to the existing
        // list tiems
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
        //
        // Note: this is a weird behavior but makes sense in the wider web, it
        // just takes some time to wrap your head around the double negative,
        // because you're not preventing the drag you're preventing the failed
        // drag event… it's weird
        const index = blocks.findIndex(block => event.dataTransfer.types.includes(`x-block-uid/${block.uid}`))
        if (index >= 0 && (index === placement || index === placement-1)) {
            placeholder.hide()
            return
        }

        // if we're here then the drag is valid and we have to prevent the default
        // browser event of assuming all drafts are invalid
        event.preventDefault()

        // if the placement is at the top of the list insert it before the first item
        if (placement === 0) {
            placeholder.before(listItems[0])
        }

        // if the placement is between two items
        else if (listItems[placement-1] && listItems[placement]) {
            placeholder.between(listItems[placement-1], listItems[placement])
        }

        // if the placement is at the end of the list
        else {
            placeholder.after(listItems[placement-1])
        }
    }

    const dragLeaveCallback = event => {

    }

    const dropCallback = event => {
        event.preventDefault()

        const action = event.dataTransfer.getData('x-block/action')
        const block = JSON.parse(event.dataTransfer.getData('x-block/json'))

        if (action === 'move') {
            moveBlock(block, placement)
        }

        if (action === 'create') {
            addBlock(block)
        }

        placeholder.hide()
    }

    const dragEndCallback = event => {
        event.preventDefault()
        placeholder.hide()
    }

    return <div className={`craft-layout-builder-cell ${picker.active ? 'craft-layout-builder-active-picker' : ''}`} data-uid={props.uid} onDragOver={dragOverCallback} onDragLeave={dragLeaveCallback} onDragEnd={dragEndCallback} onDrop={dropCallback}>
        {props.customCss && <style dangerouslySetInnerHTML={{__html:`.craft-layout-builder-cell[data-uid="${props.uid}"] {${props.customCss}}`}}/>}
        <p className="craft-layout-builder-cell-title">{props.title}</p>
        <ul ref={blockList} className={`craft-layout-builder-spacing craft-layout-builder-blocks ${isEmpty && 'empty'}`}>
            {blocks.map(block => <FieldBlock key={block.uid} fieldHandle={props.fieldHandle} layoutIndex={props.layoutIndex} cellUid={props.uid} {...block}/>)}
            {blocks.length === 0 && <li className="craft-layout-builder-block-placeholder">Empty</li>}
        </ul>
        <p><button onClick={e => {e.preventDefault(); picker.toggle('blocks')}}>Add</button></p>
    </div>
}

FieldCell.propTypes = {
}

export default FieldCell