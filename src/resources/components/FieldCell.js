import React, { useState, useEffect, useContext, useRef, forwardRef, createRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import BusContext from '../contexts/BusContext'
import useElementPicker from '../hooks/UseElementPicker'
import FieldBlock from "./FieldBlock";
import DropPlaceholderContext from '../contexts/DropPlaceholderContext'

const FieldCell = props => {
    const bus = useContext(BusContext)
    const [blocks, setBlocks] = useState(props.blocks || [])
    const isEmpty = blocks.length === 0
    const blockList = useRef(null)
    const addButton = useRef(null)
    const picker = useElementPicker()
    const placeholder = useContext(DropPlaceholderContext)
    const cellKey = `${props.layoutIndex}.${props.cellIndex}`

    const addBlock = (newBlock, placement) => {
        if (!placement) {
            placement = blocks.length
        }

        const newBlocks = blocks.slice()
        newBlocks.splice(placement, 0, newBlock)
        setBlocks(newBlocks)

        if (newBlock.id === null) {
            bus.emit('showBlockEditor', newBlock)
        }
    }

    const removeBlock = uid => {
        // no need to mess with state if the block to be removed isn't
        // even a part of this cell
        if (!blocks.map(block => block.uid).includes(uid)) {
            return
        }

        let newBlocks = blocks.slice()
        newBlocks = newBlocks.filter(block => block.uid !== uid)
        setBlocks(newBlocks)
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

        bus.on(`removeBlockFromKey${cellKey}`, removeBlockFromKeyCallback)
        return () => bus.off(`removeBlockFromKey${cellKey}`, removeBlockFromKeyCallback)
    })

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
            if (blockToRemove.id === null) {
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

    picker.on('update', newBlock => {
        addBlock(newBlock)
        bus.emit('showBlockEditor', newBlock)
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
        const index = blocks.findIndex((block, blockIndex) => event.dataTransfer.types.includes(`x-block-key/${props.layoutIndex}.${props.cellIndex}.${blockIndex}`))
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
        const [previousLayout, previousCell, previousIndex] = event.dataTransfer.getData('x-block/key').split('.')
        const block = JSON.parse(event.dataTransfer.getData('x-block/json'))

        if (action === 'move') {
            if (`${previousLayout}.${previousCell}` === cellKey) {
                moveBlockByIndex(previousIndex, placement)
            }
            else {
                bus.emit(`removeBlockFromKey${previousLayout}.${previousCell}`, previousIndex)
                addBlock(block, placement)
            }
        }

        if (action === 'create') {
            addBlock(block, placement)
        }

        placeholder.hide()
    }

    const dragEndCallback = event => {
        event.preventDefault()
    }

    const getIndex = element => {
        let index = 0
        let el = event.target.previousSibling
        while (el) {
            index++
            el = el.previousSibling
        }
        return index
    }

    const keyDownCallback = event => {
        const keyCode = event.keyCode
        switch (keyCode) {
            case 38: /* up */
            case 40: /* down */
                event.preventDefault()
                break
            case 8: /* delete */
                event.preventDefault()
                break
        }
    }

    const keyUpCallback = event => {
        const keyCode = event.keyCode
        const currentIndex = getIndex(event.target)
        switch (keyCode) {
            case 38: /* up */
                moveBlockByIndex(currentIndex, currentIndex-1)
                break
            case 40: /* down */
                moveBlockByIndex(currentIndex, currentIndex+1)
                break
            case 8: /* delete */
                removeBlockByIndex(currentIndex)
                break
        }
    }

    return <div className="craft-layout-builder-cell" data-uid={props.uid} onDragOver={dragOverCallback} onDragLeave={dragLeaveCallback} onDragEnd={dragEndCallback} onDrop={dropCallback} onKeyDown={keyDownCallback} onKeyUp={keyUpCallback}>
        {props.customCss && <style dangerouslySetInnerHTML={{__html:`.craft-layout-builder-cell[data-uid="${props.uid}"] {${props.customCss}}`}}/>}
        <p className="craft-layout-builder-cell-title">{props.title}</p>
        <ul ref={blockList} className={`craft-layout-builder-spacing craft-layout-builder-blocks ${isEmpty && 'empty'}`}>
            {blocks.map((block, index) => <FieldBlock key={index}
                                                      fieldHandle={props.fieldHandle}
                                                      layoutIndex={props.layoutIndex}
                                                      cellUid={props.uid}
                                                      cellIndex={props.cellIndex}
                                                      blockIndex={index}
                                                      {...block}/>)}
            {blocks.length === 0 && <li className="craft-layout-builder-block-placeholder">Empty</li>}
        </ul>
        <p><button ref={addButton} className={`clb-appearance-none clb-rounded clb-border clb-border-solid clb-p-1 ${picker.active ? 'clb-border-blue' : ''}`} onClick={e => {e.preventDefault(); picker.toggle('blocks')}}>Add</button></p>
    </div>
}

FieldCell.propTypes = {
}

export default FieldCell