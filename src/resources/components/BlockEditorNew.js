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

    // const modal = useRef(null)
    // useEffect(() => {
    //     const onClick = event => event.stopPropagation()
    //     modal.current.addEventListener('click', onClick)
    //     return () => modal.current.removeEventListener('click', onClick)
    // })

    // useEffect(() => {
    //     if (props.block === false) {
    //         return
    //     }
    //
    //     const el = document.querySelector('#global-container')
    //     el.style.transition = 'transform 0.4s'
    //     el.style.transform = 'translateX(-225px)'
    //
    //     return () => {
    //         el.style.transition = 'transform 2s'
    //         el.style.transform = ''
    //     }
    // })

    useEffect(() => {
        const iFrameActionCallback = event => {
            if (event.action === 'save' && props.onSave) {
                props.onSave(event.data)
            }
            if (event.action === 'close' && props.onClose) {
                props.onClose()
            }
        }

        bus.on('iframeAction', iFrameActionCallback)
        return () => bus.off('iframeAction', iFrameActionCallback)
    })

    let url
    if (props.block.id) {
        url = '/admin/blocks/'+props.block.id+'?withFrame=0'
    }
    else {
        url = '/admin/blocks/'+props.block.type.handle+'/new?uid='+props.block.uid+'&withFrame=0'
    }

    // const shadeClick = event => {
    //     event.preventDefault()
    //     if (props.onClose) {
    //         props.onClose()
    //     }
    // }

    return createPortal(<div className={`craft-layout-builder-block-editor ${props.className}`} ref={props.animatedRef}>
        {/*<div tabIndex="0" onClick={shadeClick} className="craft-layout-builder-block-editor-shade"/>*/}
        <div className="craft-layout-builder-block-editor-placeholder"/>
        <iframe className="craft-layout-builder-block-editor-screen" src={url}/>
    </div>, document.body)
}

BlockEditorNew.propTypes = {
}

export default BlockEditorNew