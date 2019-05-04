import React, {
    useState,
    useEffect,
    useContext,
    useRef,
} from 'react'
import ReactDOM, { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import BusContext from "../contexts/BusContext";

const BlockEditorNew = props => {
    const bus = useContext(BusContext)

    useEffect(() => {
        if (props.block === false) {
            return
        }

        const el = document.querySelector('#global-container')
        el.style.transition = 'transform 0.4s'
        el.style.transform = 'translateX(-225px)'

        return () => el.style.transform = ''
    })

    useEffect(() => {
        const iFrameActionCallback = event => {
            if (props.onSave) {
                props.onSave(event.data)
            }
        }

        bus.on('iframeAction', iFrameActionCallback)
        return () => bus.off('iframeAction', iFrameActionCallback)
    })

    if (props.block === false) {
        return null
    }

    let url
    if (props.block.id) {
        url = '/admin/blocks/'+props.block.id+'?withFrame=0'
    }
    else {
        url = '/admin/blocks/'+props.block.type.handle+'/new?uid='+props.block.uid+'&withFrame=0'
    }

    const shadeClick = event => {
        event.preventDefault()
        if (props.onClose) {
            props.onClose()
        }
    }

    return createPortal(<div className="craft-layout-builder-block-editor">
        <div onClick={shadeClick} className="craft-layout-builder-block-editor-shade"/>
        <iframe className="craft-layout-builder-block-editor-screen" src={url}/>
    </div>, document.body)
}

BlockEditorNew.propTypes = {
}

export default BlockEditorNew