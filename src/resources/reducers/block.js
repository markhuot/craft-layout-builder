import update from 'immutability-helper'
import set from 'set-value'
import get from 'get-value'

export const addBlock = (key, block) => ({
    type: 'addBlock',
    key,
    block,
})

export function addBlockReducer(state, action) {
    let query = {}
    set(query, 'blocks.'+action.key, {$push: [action.block]})
    return update(state, query)
}

export const moveBlock = (oldKey, oldIndex, newKey, newIndex, data=false) => ({
    type: 'moveBlock',
    oldKey,
    oldIndex,
    newKey,
    newIndex,
    data,
})

export function moveBlockReducer(state, action) {
    let block = get(state, 'blocks.'+action.oldKey+'.'+action.oldIndex)

    if (typeof block === 'undefined') {
        block = action.data
    }

    if (!block) {
        throw Error('Unable to move unknown block.')
    }

    if (action.oldKey) {
        let removeQuery = {}
        set(removeQuery, 'blocks.'+action.oldKey, {$splice: [[action.oldIndex, 1]]})
        state = update(state, removeQuery)
    }

    const existing = get(state, 'blocks.'+action.newKey)
    if (typeof existing === 'undefined') {
        set(state, 'blocks.'+action.newKey, [])
    }

    let setQuery = {}
    set(setQuery, 'blocks.'+action.newKey, {$splice: [[action.newIndex, 0, block]]})
    return update(state, setQuery)
}

export const removeBlock = (key, index)  => ({
    type: 'removeBlock',
    key,
    index,
})

export function removeBlockReducer (state, action) {
    let removeQuery = {}
    set(removeQuery, 'blocks.'+action.key, {$splice: [[action.index, 1]]})

    return update(state, removeQuery)
}

export const updateBlock = data => ({
    type: 'updateBlock',
    data,
})

export function updateBlockReducer(state, action) {
    let paths = []

    Object.keys(state.blocks).forEach(fieldHandle => {
        state.blocks[fieldHandle].forEach((layout, layoutIndex) => {
            Object.keys(layout.blocks).forEach(cellUid => {
                layout.blocks[cellUid].forEach((block, blockIndex) => {
                    if (block.uid === action.data.uid) {
                        paths.push(`blocks.${fieldHandle}.${layoutIndex}.blocks.${cellUid}.${blockIndex}`)
                    }
                })
            })
        })
    })

    paths.forEach(path => {
        let updateQuery = {}
        set(updateQuery, path, {$set: action.data})
        state = update(state, updateQuery)
    })

    return state
}