import React, {
    useState,
    useEffect,
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
import FieldLayoutPickerButton from "./FieldLayoutPickerButton";

function FieldLayoutPicker (props) {
    const [layoutTypes, setLayoutTypes] = useState([])

    useEffect(() => {
        axios.get('/admin/layoutbuilder/api/elements')
            .then(result => result.data)
            .then(data => {
                setLayoutTypes(data.layoutTypes)
            })
    }, [])

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

    return createPortal(<div ref={props.animatedRef} className={`craft-layout-builder-field-picker ${props.className} clb-spacing-xl clb-overflow-auto`} onKeyUp={onKeyUp}>
        <SearchBox/>
        <h2 className="clb-text-600 clb-text-sm clb-text-gray">Block Types</h2>
        <ul className="clb-w-full clb-grid clb-grid-gap clb-justify-items-stretch" style={{'--grid-template-columns': 'repeat(2, 1fr)'}}>
            {layoutTypes.map(layoutType => <li key={layoutType.id}><FieldLayoutPickerButton data={layoutType} onPick={props.onPick}/></li>)}
        </ul>
    </div>, document.body)
}

export default FieldLayoutPicker