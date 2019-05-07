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
import {addBlock, moveBlock, removeBlock, updateBlock} from '../reducers/block'

const FieldCell = props => {
    const blocks = props.blocks
    const isEmpty = blocks.length === 0
    const blockList = useRef(null)
    const addButton = useRef(null)
    const cellKey = `${props.fieldHandle}.${props.layoutIndex}.blocks.${props.data.uid}`
    const [isPickingNewBlock, setIsPickingNewBlock] = useState(false)
    const [isEditingBlockAtIndex, setIsEditingBlockAtIndex] = useState(false)
    const dispatch = useContext(ReducerContext)

    const focus = (index, count) => {
        if (typeof count === 'undefined') { count = blocks.length }
        if (index < 0) { index = 0 }
        if (index > count - 1) { index = count - 1 }

        if (count > 0) {
            blockList.current.childNodes[index].focus()
        }
        else{
            addButton.current.focus()
        }
    }

    const onMove = ({oldKey, oldIndex, newKey, newIndex, data}) => {
        focus(newIndex)
        dispatch(moveBlock(oldKey, oldIndex, newKey, newIndex, data))

        if (!oldKey && data.id === null) {
            setIsPickingNewBlock(false)
            setIsEditingBlockAtIndex(newIndex)
        }
    }

    const onDelete = ({index}) => {
        focus(index-1, blocks.length - 1)
        dispatch(removeBlock(cellKey, index))
    }

    const {events: droppableEvents} = useDroppable({ref:blockList, key:cellKey, accept:['block'], onMove, onDelete})

    return <div className="craft-layout-builder-cell" data-uid={props.data.uid}>
        {props.data.customCss && <style dangerouslySetInnerHTML={{__html:`.craft-layout-builder-cell[data-uid="${props.data.uid}"] {${props.data.customCss}}`}}/>}
        {props.data.title && <p className="craft-layout-builder-cell-title">{props.data.title}</p>}
        <ul ref={blockList} {...droppableEvents} className={`craft-layout-builder-spacing craft-layout-builder-blocks ${isEmpty && 'empty'}`}>
            {blocks.map((block, index) => <FieldBlock key={`${props.data.uid}${index}`}
                                                      fieldHandle={props.fieldHandle}
                                                      layoutIndex={props.layoutIndex}
                                                      cellUid={props.data.uid}
                                                      cellIndex={props.cellIndex}
                                                      blockIndex={index}
                                                      onClick={event => setIsEditingBlockAtIndex(index)}
                                                      data={block}/>)}
            {blocks.length === 0 && <li className="craft-layout-builder-block-placeholder">Empty</li>}
        </ul>
        <p>
            <button ref={addButton}
                    className={`clb-appearance-none clb-rounded clb-border clb-border-solid clb-p-1 ${isPickingNewBlock ? 'clb-border-blue' : ''}`}
                    onClick={e => {
                        e.preventDefault()
                        setIsPickingNewBlock(!isPickingNewBlock)
                    }}
            >Add</button>
        </p>
        {isPickingNewBlock && <FieldBlockPicker
            onPick={block => {
                const newIndex = blocks.length
                onMove({oldKey:null, oldIndex: null, newKey: cellKey, newIndex, data: block})
            }}
            onCancel={event => {
                setIsPickingNewBlock(false)
                addButton.current.focus()
            }}
        />}
        {isEditingBlockAtIndex !== false && <BlockEditorNew
            block={blocks[isEditingBlockAtIndex]}
            onClose={() => {
                if (blocks[isEditingBlockAtIndex].id === null) {
                    onDelete({index: isEditingBlockAtIndex})
                }
                setIsEditingBlockAtIndex(false)
            }}
            onSave={block => {
                focus(isEditingBlockAtIndex)
                dispatch(updateBlock(block))
                setIsEditingBlockAtIndex(false)
            }}
        />}
    </div>
}

FieldCell.propTypes = {
}

export default FieldCell