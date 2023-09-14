import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
    const notification = useSelector(state => state.notification)

    const messageStyle = {
        color: 'green',
        backgroundColor: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    if (notification === null) {
        return null
    }

    return (
        <div style={ messageStyle }>
            { notification }
        </div>
    )
}

export default Notification