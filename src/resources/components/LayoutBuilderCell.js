import React, {
    useState,
    useEffect,
    useRef,
    useImperativeHandle,
    forwardRef
} from 'react'
import PropTypes from 'prop-types'
import camelCase from 'camelcase'

const LayoutBuilderCell = (props, ref) => {
    const [cellTitle, _setCellTitle] = useState(props.title || '')
    const [cellHandle, setCellHandle] = useState(props.handle || '')
    const [cellWidth, setCellWidthState] = useState(props.width || '1fr')
    const [customCss, setCustomCss] = useState(props.customCss || '')
    const titleField = useRef( )

    const removeCell = event => {
        event.preventDefault()
        props.removeCell(props.uid)
    }

    const setCellTitle = title => {
        _setCellTitle(title)
        setCellHandle(camelCase(title))
    }

    const setCellWidth = event => {
        setCellWidthState(event.target.value)
        props.setCellWidth(props.uid, event.target.value)
    }

    useImperativeHandle(ref, () => ({
        focus: () => titleField.current.focus()
    }))

    return <div className="cell" data-id={props.uid}>
        <input type="hidden" name={`layout[cells][${props.index}][uid]`} value={props.uid} />

        <div className="field first">
            <div className="heading">
                <label>Title</label>
            </div>
            <div className="input ltr">
                <input ref={titleField} type="text" className="text fullwidth" name={`layout[cells][${props.index}][title]`} value={cellTitle} onChange={e => setCellTitle(e.target.value)} placeholder="Title"/>
            </div>
        </div>

        <div className="field">
            <div className="heading">
                <label>Handle</label>
            </div>
            <div className="input ltr">
                <input type="text" className="text code fullwidth" name={`layout[cells][${props.index}][handle]`} value={cellHandle} onChange={e => setCellHandle(e.target.value)} placeholder="Handle"/>
            </div>
        </div>

        <div className={`field ${props.useCustomCss ? 'hidden' : ''}`}>
            <div className="heading">
                <label>Width</label>
            </div>
            <div className="input ltr">
                <input type="text" className="text fullwidth" name={`layout[cells][${props.index}][width]`} value={cellWidth} onChange={setCellWidth} placeholder="Width (1fr)"/>
            </div>
        </div>

        <div className={props.useCustomCss ? '' : 'hidden'}>
            <textarea className="text nicetext fullwidth" name={`layout[cells][${props.index}][customCss]`} value={customCss} onChange={e => setCustomCss(e.target.value)} placeholder="grid-column-start: 3;"/>
            {props.useCustomCss && <style dangerouslySetInnerHTML={{__html:`.cell[data-id="${props.uid}"] {${customCss}}`}}/>}
        </div>

        <p><button className="error clb-appearance-none" onClick={removeCell}>Remove cell</button></p>
    </div>
}

// LayoutBuilderCell.propTypes = {
//     title: PropTypes.string,
//     index: PropTypes.number.isRequired,
//     removeCell: PropTypes.func.isRequired,
//     uid: PropTypes.any.isRequired
// }

export default forwardRef(LayoutBuilderCell)