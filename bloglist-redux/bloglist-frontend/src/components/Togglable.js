import React, { useState, useImperativeHandle } from 'react'

const Togglable = React.forwardRef((props, ref) => {
    const [blogCreationVisible, setBlogCreationVisible] = useState(false)

    const hideWhenVisible = { display: blogCreationVisible ? 'none' : '' }
    const showWhenVisible = { display: blogCreationVisible ? '' : 'none' }

    const toggleVisibility = () => {
        setBlogCreationVisible(!blogCreationVisible)
    }

    useImperativeHandle(ref, () => {
        return {
            toggleVisibility
        }
    })

    return (
        <div>
            <div style={hideWhenVisible}>
                <button id='create-new-blog-button' onClick={toggleVisibility}>create new blog</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    )
})

Togglable.displayName = 'Togglable'

export default Togglable