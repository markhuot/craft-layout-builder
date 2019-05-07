import get from "get-value";
import set from "set-value";
import update from "immutability-helper";

export const addLayout = (key, layout) => ({
    type: 'addLayout',
    key,
    data: layout,
})

export function addLayoutReducer(state, action) {
    let query = {}
    set(query, 'blocks.'+action.key, {$push: [action.data]})
    return update(state, query)
}

export const moveLayout = (oldKey, oldIndex, newKey, newIndex, data=false) => ({
    type: 'moveLayout',
    oldKey,
    oldIndex,
    newKey,
    newIndex,
    data,
})

export function moveLayoutReducer(state, action) {
    let layout = get(state, 'blocks.'+action.oldKey+'.'+action.oldIndex)

    if (typeof layout === 'undefined') {
        layout = action.data
    }

    if (!layout) {
        throw Error('Could not find a layout to move')
    }

    if (action.oldKey) {
        let removeQuery = {}
        set(removeQuery, 'blocks.' + action.oldKey, {$splice: [[action.oldIndex, 1]]})
        state = update(state, removeQuery)
    }

    const existing = get(state, 'blocks.'+action.newKey)
    if (typeof existing === 'undefined') {
        set(state, 'blocks.'+action.newKey, [])
    }

    let setQuery = {}
    set(setQuery, 'blocks.'+action.newKey, {$splice: [[action.newIndex, 0, layout]]})
    return update(state, setQuery)
}

export const removeLayout = (key, index) => ({
    type: 'removeLayout',
    key,
    index,
})

export function removeLayoutReducer(state, action) {
    let removeQuery = {}
    set(removeQuery, 'blocks.'+action.key, {$splice: [[action.index, 1]]})

    return update(state, removeQuery)
}