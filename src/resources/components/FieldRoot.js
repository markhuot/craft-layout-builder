import React, {
    useContext
} from 'react'
import PropTypes from 'prop-types'
import BusContext from '../contexts/BusContext'
import Field from "./Field";

const FieldRoot = props => {
    return <BusContext.Provider value={props.bus}>
        <Field {...props.fieldProps}/>
    </BusContext.Provider>
}

FieldRoot.propTypes = {
    bus: PropTypes.object.isRequired,
    dropPlaceholder: PropTypes.any.isRequired,
    fieldProps: PropTypes.object.isRequired,
}

export default FieldRoot