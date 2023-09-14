import React from 'react'

const Error = ({ errorMessage }) => {
    const errorStyle = {
        color: 'red',
        backgroundColor: 'yellow',
        fontSize: 22,
        borderStyle: 'solid',
        padding: 10,
        marginBottom: 20
    }

    if (errorMessage === null) {
        return null
    }

    return (
        <div id="error" style={errorStyle}>
            {errorMessage}
        </div>
    )
}

export default Error