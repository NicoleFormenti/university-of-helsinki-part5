import React from 'react'

const Error = ({ errorMessage }) => {
    const errorStyle = {
        color: 'red',
        backgroundColor: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
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