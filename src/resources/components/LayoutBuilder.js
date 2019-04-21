import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Row from './LayoutBuilderRow'
import uuid from 'uuid'
import Cell from "./LayoutBuilderCell";

const newCell = () => {
    return {
        uid: uuid(),
        width: '1fr',
    }
}

const LayoutBuilder = props => {
    const [cells, setCells] = useState(props.cells || [newCell()])
    const [useCustomCss, setUseCustomCss] = useState(!!props.useCustomCss || false)
    const [customCss, setCustomCss] = useState(props.customCss || '')
    const computedCss = `grid-template-columns: ${cells.map(cell => cell.width).join(' ')};`
    const layoutCss = (useCustomCss) ? customCss : computedCss

    const addCell = event => {
        event.preventDefault()
        const newCells = cells.slice()
        newCells.push(newCell())
        setCells(newCells)
    }

    const removeCell = uid => {
        let newCells = cells.slice()
        newCells = newCells.filter(cell => cell.uid !== uid)
        setCells(newCells)
    }

    return <div>
        <div className="field checkboxfield">
            <input type="hidden" name="layout[useCustomCss]" value=""/>
            <input type="checkbox" name="layout[useCustomCss]" value="1" defaultChecked={useCustomCss} onChange={e => setUseCustomCss(!useCustomCss)} className="fieldtoggle checkbox" id="layout-use-custom-css"/>
            <label htmlFor="layout-use-custom-css">Use Custom CSS</label>
            <div className="heading">
                <p className="instructions">Use custom css to create a unique grid that goes beyond columns. Using <a href="https://css-tricks.com/snippets/css/complete-guide-grid/">CSS Grid</a> you can create rows, columns, and cells that span across any combination of regions.</p>
            </div>
        </div>
        <div className={useCustomCss ? '' : 'hidden'}>
            <textarea className="text nicetext fullwidth" name="layout[customCss]" rows="10" onChange={e => setCustomCss(e.target.value)} value={customCss} placeholder="grid-template-columns: 1fr 3fr 1fr"/>
            <style dangerouslySetInnerHTML={{__html:`.cells {${layoutCss}}`}}/>
        </div>
        <hr/>
        <div className="cells">
            {cells.map((cell, index) => <Cell key={cell.uid} index={index} useCustomCss={useCustomCss} removeCell={removeCell} {...cell}/>)}
        </div>
        <p><button className="btn layout-builder-button" href="#" onClick={addCell}>Add cell</button></p>
    </div>
}

LayoutBuilder.propTypes = {
    cells: PropTypes.array
}

export default LayoutBuilder