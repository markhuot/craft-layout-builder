import React, {
    useContext
} from 'react'
import DropPlaceholderContext from '../contexts/DropPlaceholderContext'

const getIndex = element => {
    let index = 0
    let el = event.target.previousSibling
    while (el) {
        index++
        el = el.previousSibling
    }
    return index
}

const KEY_UP = 38
const KEY_DOWN = 40
const KEY_DELETE = 8

export function useDraggable({type, key='default', action='move', data={}}) {
    const placeholder = useContext(DropPlaceholderContext)

    const events = {}

    events.onDragStart = event => {
        // we don't support nested draggables
        event.stopPropagation()

        // if data is a callback, run it to get unique data per drag
        let _data = {}
        if (data instanceof Function) {
            _data = data()
        }
        else {
            _data = data
        }

        // get where we're currently placed in the list
        const index = getIndex(event.target)

        event.dataTransfer.setData(`x-draggable/action`, action)
        event.dataTransfer.setData(`x-draggable/action:${action}`, action)
        event.dataTransfer.setData(`x-draggable/type`, type)
        event.dataTransfer.setData(`x-draggable/type:${type}`, type)
        event.dataTransfer.setData(`x-draggable/key`, key)
        event.dataTransfer.setData(`x-draggable/key:${key}`, key)
        event.dataTransfer.setData(`x-draggable/index`, `${index}`)
        event.dataTransfer.setData(`x-draggable/index:${index}`, `${index}`)
        event.dataTransfer.setData(`x-draggable/data`, JSON.stringify(_data))
    }

    events.onDragEnd = event => {
        placeholder.current.hide()
    }

    return {
        events
    }
}

const isNumeric = value => {
    return !isNaN(value)
}

const parseStringValueToNativeType = value => {
    if (value === 'null') { return null }
    if (value === 'false') { return false }
    if (isNumeric(value)) { return +value }

    return value
}

export function useDroppable({ref, accept=[], onMove, onDelete, key='default'}) {
    const placeholder = useContext(DropPlaceholderContext)

    // the events to be added to the element
    const events = {}

    // the placement is determined in the dragOver callback and then used later in
    // the dropCallback. Define it here so it's accessible in both callbacks.
    let placement = 0

    // @TODO do the below, but it causes issues with dragging in a new block from the picker
    // get the listItems in an effect so it only fires on re-render and we aren't
    // fetching them every time the dragOver callback is run
    // let listItems
    // useEffect(() => {
    //     listItems = blockList.current.querySelectorAll('li')
    // }, [blocks])

    events.onDragOver = event => {
        // check each of the accept types and see if any of them match the type of
        // the dragged element. If none of the accept types match the dragged type
        // then bail out early and let the browser default of denying drags continue
        if (accept.findIndex(type => event.dataTransfer.types.includes(`x-draggable/type:${type}`)) === -1) {
            return
        }

        const listItems = ref.current.childNodes

        // given the existing list items figure out which index the new element will
        // be dropped in to based on the mouse position relative to the existing
        // list tiems
        for (const index in [...listItems]) {
            const listItem = listItems[index]
            const top = listItem.getBoundingClientRect().top
            const height = listItem.getBoundingClientRect().height
            const mouse = event.pageY

            if (mouse < top + (height/2)) {
                placement = parseInt(index)
                break
            }

            if (top + (height/2) < mouse && mouse < top + height) {
                placement = parseInt(index)+1
                break
            }
        }

        // if we're hovering over ourselves then we'll bail out and let the
        // default browser action of assuming all drags are invalid continue
        //
        // Note: this is a weird behavior but makes sense in the wider web, it
        // just takes some time to wrap your head around the double negative,
        // because you're not preventing the drag you're preventing the failed
        // drag event… it's weird
        const isOverSameKey = event.dataTransfer.types.includes(`x-draggable/key:${key}`)
        const isSameIndex = event.dataTransfer.types.includes(`x-draggable/index:${placement}`) ||
                            event.dataTransfer.types.includes(`x-draggable/index:${placement-1}`)
        if (isOverSameKey && isSameIndex) {
            placeholder.current.hide()
            return
        }

        // if we're here then the drag is valid and we have to prevent the default
        // browser event of assuming all drafts are invalid
        event.preventDefault()

        // if the placement is at the top of the list insert it before the first item
        if (placement === 0) {
            placeholder.current.before(listItems[0])
        }

        // if the placement is between two items
        else if (listItems[placement-1] && listItems[placement]) {
            placeholder.current.between(listItems[placement-1], listItems[placement])
        }

        // if the placement is at the end of the list
        else {
            placeholder.current.after(listItems[placement-1])
        }
    }

    events.onDragLeave = event => {
        placeholder.current.hide()
    }

    events.onDrop = event => {
        // check each of the accept types and see if any of them match the type of
        // the dragged element. If none of the accept types match the dragged type
        // then bail out early and let the browser default of denying drags continue
        if (accept.findIndex(type => event.dataTransfer.types.includes(`x-draggable/type:${type}`)) === -1) {
            return
        }

        event.preventDefault()

        // there are some specific keywords we want to transform back in to their
        // native types.
        let oldKey = parseStringValueToNativeType(event.dataTransfer.getData('x-draggable/key'))
        let oldIndex = parseStringValueToNativeType(event.dataTransfer.getData('x-draggable/index'))

        const data = JSON.parse(event.dataTransfer.getData('x-draggable/data'))

        // if we're moving the element within a single block then we need to account for
        // the fact that we're double counting the current block in our placements
        if (oldKey === key && placement > oldIndex) {
            placement--
        }

        if (onMove) {
            onMove({event, oldKey, oldIndex, newKey:key, newIndex:placement, data})
        }

        placeholder.current.hide()
    }

    events.onDragEnd = event => {
        event.preventDefault()
    }

    events.onKeyDown = event => {
        const keyCode = event.keyCode
        switch (keyCode) {
            case KEY_UP:
            case KEY_DOWN:
                event.preventDefault()
                break
            case KEY_DELETE:
                event.preventDefault()
                break
        }
    }

    events.onKeyUp = event => {
        const keyCode = event.keyCode
        const oldIndex = getIndex(event.target)
        const newIndex = oldIndex + (keyCode === KEY_UP ? -1 : +1)
        switch (keyCode) {
            case KEY_UP:
            case KEY_DOWN:
                event.stopPropagation()
                if (onMove) {
                    onMove({event, oldKey: key, oldIndex, newKey: key, newIndex})
                }
                break
            case KEY_DELETE:
                // @TODO need to check event.target and make sure we're not typing
                // in a text field _inside_ the draggable
                event.stopPropagation()
                if (onDelete) {
                    onDelete({event, key, index: oldIndex})
                }
                break
        }
    }

    return {events}
}