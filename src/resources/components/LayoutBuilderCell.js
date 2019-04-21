import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LayoutBuilderCell = props => {
    const [cellTitle, setCellTitle] = useState(props.title || '')
    const [cellWidth, setCellWidthState] = useState(props.width || '1fr')
    const [customCss, setCustomCss] = useState(props.customCss || '')

    const removeCell = event => {
        event.preventDefault()
        props.removeCell(props.uid)
    }

    const setCellWidth = event => {
        setCellWidthState(event.target.value)
        props.setCellWidth(props.uid, event.target.value)
    }

    return <div className="cell" data-id={props.uid}>
        <input type="hidden" name={`layout[cells][${props.index}][uid]`} value={props.uid} />

        <div className="field first">
            <div className="heading">
                <label>Title</label>
            </div>
            <div className="input ltr">
                <input type="text" className="text fullwidth" name={`layout[cells][${props.index}][title]`} value={cellTitle} onChange={e => setCellTitle(e.target.value)} placeholder="Title"/>
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

        <p><a href="#" className="error" onClick={removeCell}>Remove cell</a></p>
    </div>
}

LayoutBuilderCell.propTypes = {
    title: PropTypes.string,
    index: PropTypes.number.isRequired,
    removeCell: PropTypes.func.isRequired,
    uid: PropTypes.any.isRequired
}

export default LayoutBuilderCell