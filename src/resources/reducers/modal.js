import { useContext } from 'react'
import update from 'immutability-helper'
import ModalKeyContext from '../contexts/ModalKeyContext'

export const showModal = (key, index) => ({
    type: 'showModal',
    key,
    index
})

export const hideModal = () => ({
    type: 'showModal',
    key: null,
    index: undefined
})

export function showModalReducer(state, action) {
    return update(state, {
        activeModalKey: {$set: action.key},
        activeModalIndex: {$set: action.index},
    })
}

export const useModal = dispatch => {
    const {activeModalKey, activeModalIndex} =  useContext(ModalKeyContext)

    return {
        key: activeModalKey,
        index: activeModalIndex,
        show: (key, index) => dispatch(showModal(key, index)),
        hide: () => dispatch(hideModal()),
    }
}