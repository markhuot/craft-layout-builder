import React, {
    useState,
    useEffect,
    useRef,
    createRef,
} from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid'
import Cell from "./LayoutBuilderCell";

const newCell = () => {
    return {
        uid: uuid(),
        width: '1fr',
    }
}

const LayoutBuilder = props => {
    const [cells, setCells] = useState(props.cells && props.cells.length ? props.cells : [newCell()])
    const previousCellsRef = useRef([])
    const [useCustomCss, setUseCustomCss] = useState(!!props.useCustomCss || false)
    const [customCss, setCustomCss] = useState(props.customCss || '')
    const computedCss = `grid-template-columns: ${cells.map(cell => cell.width).join(' ')};`
    const layoutCss = (useCustomCss) ? customCss : computedCss
    const refs = cells.map(cell => createRef(null))
    const [initialRender, setInitialRender] = useState(true)

    useEffect(() => {
        if (initialRender) {
            previousCellsRef.current = cells
            setInitialRender(false)
            return
        }

        const previousCells = previousCellsRef.current.map(cell => cell.uid)
        const nextCells = cells.map(cell => cell.uid)
        const addedCells = nextCells.filter(cell => !previousCells.includes(cell))
        const removedCells = previousCells.filter(cell => !nextCells.includes(cell))
        if (addedCells.length) {
            const addedIndex = nextCells.indexOf(addedCells[0])
            refs[addedIndex].current.focus()
        }
        else if (removedCells.length) {
            let removedIndex = previousCells.indexOf(removedCells[0])
            if (removedIndex >= nextCells.length) {
                removedIndex = nextCells.length - 1
            }
            if (refs[removedIndex]) {
                refs[removedIndex].current.focus()
            }
        }
        previousCellsRef.current = cells
    }, [cells])

    // @TODO replace the above with the below
    // @TODO need to figure out a way for the below to incorporate the initialRender logic
    // useBlah(cells.map(cell => cell.uid), index => refs[index] && refs[index].current.focus())

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
            {cells.map((cell, index) => <Cell ref={refs[index]} key={cell.uid} index={index} useCustomCss={useCustomCss} removeCell={removeCell} {...cell}/>)}
        </div>
        <p><button className="btn layout-builder-button" href="#" onClick={addCell}>Add cell</button></p>
    </div>
}

LayoutBuilder.propTypes = {
    cells: PropTypes.array
}

export default LayoutBuilder