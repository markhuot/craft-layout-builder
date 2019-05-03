import React, { useState, useEffect, useContext, useRef } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import BusContext from "../contexts/BusContext";

const BlockEditor = props => {
    const bus = useContext(BusContext)
    const [block, setBlock] = useState(false)

    useEffect(() => {
        const showBlockEditorCallback = block => setBlock(block)
        bus.on('showBlockEditor', showBlockEditorCallback)

        const hideBlockEditorCallback = event => setBlock(false)
        bus.on('hideBlockEditor', hideBlockEditorCallback)

        return () => {
            bus.off('showBlockEditor', showBlockEditorCallback)
            bus.off('hideBlockEditor', hideBlockEditorCallback)
        }
    })

    useEffect(() => {
        if (block === false) {
            return
        }

        const el = document.querySelector('#global-container')
        el.style.transition = 'transform 0.4s'
        el.style.transform = 'translateX(-225px)'

        return () => el.style.transform = ''
    }, [block])

    if (block === false) {
        return null
    }

    const hideBlockEditor = event => {
        event.preventDefault()
        // @TODO, need a better way to do this, the block could be on the page several times and
        // focusing on the UID would select the first one, not the one we're actually editing
        bus.emit('focusBlock', block)
        bus.emit('hideBlockEditor', block)
    }

    let url
    if (block.id) {
        url = '/admin/blocks/'+block.id+'?withFrame=0'
    }
    else {
        url = '/admin/blocks/'+block.type.handle+'/new?uid='+block.uid+'&withFrame=0'
    }

    return <div className="craft-layout-builder-block-editor">
        <div className="craft-layout-builder-block-editor-shade" onClick={hideBlockEditor}/>
        <iframe className="craft-layout-builder-block-editor-screen" src={url}/>
    </div>
}

BlockEditor.propTypes = {
}

export default BlockEditor