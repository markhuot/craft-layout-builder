import React, {
    useState,
    useEffect,
    useRef,
} from 'react'
import {createPortal} from 'react-dom'
import uuid from 'uuid/v4'
import SearchBox from './SearchBox'
import FieldPickerLayoutButton from './FieldPickerLayoutButton'
import FieldPickerBlockTypeButton from './FieldPickerBlockTypeButton'
import FieldPickerBlockButton from './FieldPickerBlockButton'
import FieldBlockPickerBlockTypeButton from './FieldBlockPickerBlockTypeButton'
import axios from 'axios'
import FieldBlockPickerBlockButton from "./FieldBlockPickerBlockButton";

function FieldBlockPicker (props) {
    // const modal = useRef(null)
    const [blockTypes, setBlockTypes] = useState([])
    const [recentBlocks, setRecentBlocks] = useState([])

    useEffect(() => {
        axios.get('/admin/layoutbuilder/api/elements')
            .then(result => result.data)
            .then(data => {
                setBlockTypes(data.blockTypes)
                setRecentBlocks(data.blocks)
            })
    }, [])

    // useEffect(() => {
    //     const onClick = event => {
    //         // event.stopPropagation()
    //         console.log('clicked!!!')
    //     }
    //     modal.current.addEventListener('click', onClick)
    //     return () => modal.current.removeEventListener('click', onClick)
    // })

    const onKeyUp = event => {
        const keyCode = event.keyCode
        switch (keyCode) {
            case 27: /* escape */
                if (props.onCancel) {
                    props.onCancel(event)
                }
                break
        }
    }

    return createPortal(<div className={`craft-layout-builder-field-picker clb-spacing-xl clb-overflow-auto ${props.className}`} ref={props.animatedRef} onKeyUp={onKeyUp}>
        <SearchBox/>
        <h2 className="clb-text-600 clb-text-sm clb-text-gray">Block Types</h2>
        <ul className="clb-w-full clb-grid clb-grid-gap clb-justify-items-stretch" style={{'--grid-template-columns': 'repeat(2, 1fr)'}}>
            {blockTypes.map(blockType => <li key={blockType.id}><FieldBlockPickerBlockTypeButton data={blockType} onPick={props.onPick}/></li>)}
        </ul>
        <h2 className="clb-text-600 clb-text-sm clb-text-gray">Recent Blocks</h2>
        <ul className="clb-w-full clb-spacing">
            {recentBlocks.map(block => <li key={block.id}><FieldBlockPickerBlockButton data={block} onPick={props.onPick}/></li>)}
        </ul>
    </div>, document.body)
}

export default FieldBlockPicker