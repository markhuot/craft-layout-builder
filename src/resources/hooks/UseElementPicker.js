import React, { useState, useContext, useEffect } from 'react'
import BusContext from "../contexts/BusContext";
import {EventEmitter2} from "eventemitter2";
// import uuid from 'uuid/v4'

class Picker extends EventEmitter2 {

    // constructor() {
    //     super()
    //     this.uuid = uuid()
    // }

}

export default function useElementPicker() {
    const bus = useContext(BusContext)
    const [isActivePickerTarget, setIsActivePickerTarget] = useState(false)

    const show = (type) => {
        bus.emit('showPicker', type)
        bus.emit('willSetActivePickerTarget')
        setIsActivePickerTarget(true)
    }

    const hide = () => {
        bus.emit('hidePicker')
        setIsActivePickerTarget(false)
    }

    const toggle = (type) => {
        isActivePickerTarget ? hide() : show(type)
    }

    useEffect(() => {
        const willSetActivePickerTargetCallback = () => {
            setIsActivePickerTarget(false)
        }

        bus.on('willSetActivePickerTarget', willSetActivePickerTargetCallback)
        return () => bus.off('willSetActivePickerTarget', willSetActivePickerTargetCallback)
    })

    useEffect(() => {
        const pickerCallback = event => {
            if (!isActivePickerTarget) {
                return
            }

            picker.emit('update', event.sender)

            setIsActivePickerTarget(false)
            bus.emit('hidePicker')
        }
        bus.on('pickElement', pickerCallback)
        return () => bus.off('pickElement', pickerCallback)
    }, [isActivePickerTarget])

    const picker = new Picker
    picker.active = isActivePickerTarget
    picker.show = show
    picker.toggle = toggle

    return picker
}