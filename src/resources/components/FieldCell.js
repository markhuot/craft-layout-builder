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
import FieldBlock from "./FieldBlock";
import {useDroppable} from '../hooks/UseDraggable'
import FieldBlockPicker from "./FieldBlockPicker";
import BlockEditorNew from "./BlockEditorNew";
import ReducerContext from "../contexts/ReducerContext";
import { addBlock, moveBlock, removeBlock, updateBlock } from '../reducers/block'
import useFocusIndex from '../hooks/UseFocusIndex'
import { useModal } from '../reducers/modal'
import useAnimatedBooleanState from "../hooks/UseAnimatedBooleanState";

const FieldCell = props => {
    const blocks = props.blocks
    const isEmpty = blocks.length === 0
    const blockList = useRef(null)
    const addButton = useRef(null)
    const setFocus = useFocusIndex(blockList, addButton)
    const cellKey = `${props.fieldHandle}.${props.layoutIndex}.blocks.${props.data.uid}`
    const dispatch = useContext(ReducerContext)
    const [isPickingBlock, setIsPickingBlock, isPickingBlockClasses, isPickingBlockRef] = useAnimatedBooleanState(false)
    const [isEditingBlock, setIsEditingBlock, isEditingBlockClasses, isEditingBlockRef] = useAnimatedBooleanState(false, 'block-editor')

    // useEffect(() => {
    //     if (isEditingBlockClasses.indexOf('entering') >= 0) {
    //         document.body.classList.add('entering')
    //     }
    //     else {
    //         document.body.classList.remove('entering')
    //     }
    //     if (isEditingBlockClasses.indexOf('active') >= 0) {
    //         document.body.classList.add('active')
    //     }
    //     else {
    //         document.body.classList.remove('active')
    //     }
    //     if (isEditingBlockClasses.indexOf('leaving') >= 0) {
    //         document.body.classList.add('leaving')
    //     }
    //     else {
    //         document.body.classList.remove('leaving')
    //     }
    // }, [isEditingBlockClasses])

    const onMove = ({oldKey, oldIndex, newKey, newIndex, data}) => {
        dispatch(moveBlock(oldKey, oldIndex, newKey, newIndex, data))
        setFocus(newIndex)
        setIsPickingBlock(false)

        if (!oldKey && data.id === null) {
            // showModal(cellKey, newIndex)
        }
    }

    const onDelete = ({index}) => {
        dispatch(removeBlock(cellKey, index))
        setFocus(index)
    }

    const {events: droppableEvents} = useDroppable({ref:blockList, key:cellKey, accept:['block'], onMove, onDelete})

    return <div className="craft-layout-builder-cell clb-spacing" data-uid={props.data.uid}>
        {props.data.customCss && <style dangerouslySetInnerHTML={{__html:`.craft-layout-builder-cell[data-uid="${props.data.uid}"] {${props.data.customCss}}`}}/>}
        {props.data.title && <p className="craft-layout-builder-cell-title">{props.data.title}</p>}
        <ul ref={blockList} {...droppableEvents} className={`craft-layout-builder-spacing craft-layout-builder-blocks ${isEmpty && 'empty'}`}>
            {blocks.map((block, index) => <FieldBlock key={`${props.data.uid}${index}`}
                                                      fieldHandle={props.fieldHandle}
                                                      layoutIndex={props.layoutIndex}
                                                      cellIndex={props.cellIndex}
                                                      cellUid={props.data.uid}
                                                      blockIndex={index}
                                                      onClick={event => {
                                                          setIsEditingBlock(index)
                                                      }}
                                                      data={block}
                                                      aria-label={`${block.type.title} block ${index+1} of ${blocks.length}: ${block.title}`}/>)}
            {blocks.length === 0 && <li className="craft-layout-builder-block-placeholder">Empty</li>}
        </ul>
        <p>
            <button ref={addButton}
                    className={`clb-appearance-none clb-rounded clb-border clb-border-solid  clb-p-1 ${isPickingBlock ? 'clb-border-blue' : ''}`}
                    onClick={e => {
                        e.preventDefault()
                        setIsPickingBlock(true)
                    }}
            >Add</button>
        </p>
        {isPickingBlock && <FieldBlockPicker
            className={isPickingBlockClasses}
            animatedRef={isPickingBlockRef}
            onPick={block => {
                const newIndex = blocks.length
                onMove({oldKey:null, oldIndex: null, newKey: cellKey, newIndex, data: block})
            }}
            onCancel={event => {
                setIsPickingBlock(false)
                addButton.current.focus()
            }}
        />}
        {isEditingBlock !== false && <BlockEditorNew
            // className={isEditingBlockClasses}
            animatedRef={isEditingBlockRef}
            block={blocks[isEditingBlock]}
            onClose={() => {
                if (blocks[isEditingBlock].id === null) {
                    onDelete({index: isEditingBlock})
                }
                setFocus(isEditingBlock)
                setIsEditingBlock(false)
            }}
            onSave={block => {
                dispatch(updateBlock(block))
                setFocus(isEditingBlock)
                setIsEditingBlock(false)
            }}
        />}
    </div>
}

FieldCell.propTypes = {
}

export default FieldCell