import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        const blogObject = {
            title: title,
            author: author,
            url: url,
        }
        createBlog(blogObject)

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div className='blogform'>
            <form onSubmit={addBlog}>
                <h1>create new</h1>
                <div>
                    title
                    <input
                        type="text"
                        id="title"
                        value={title}
                        name="title"
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author
                    <input
                        type="text"
                        id="author"
                        value={author}
                        name="author"
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    url
                    <input
                        type="text"
                        id="url"
                        value={url}
                        name="url"
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button id="submit-button" type="submit">create</button>
            </form>
        </div>
    )
}

BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default BlogForm