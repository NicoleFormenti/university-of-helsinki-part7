import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

import blogService from '../services/blogs'

const Blog = ({ increaseLikes }) => {
    const blogs = useSelector(state => state.blogs)
    const [comments, setComments] = useState([])
    const [commentField, setCommentField] = useState('')

    useEffect(() => {
        const fetchComments = async () => {
            if (blog) {
                const newComments = await blogService.getComments(blog.id)
                setComments(newComments)
            }
        }

        fetchComments()
    }, [])

    const id = useParams().id
    const blog = blogs.find(blog => blog.id === id)

    if (!blog) {
        return null
    }

    const submitComment = async (event) => {
        event.preventDefault()
        const newCommentObject = { comment: commentField }
        await blogService.postComment(blog.id, newCommentObject)

        const newComments = await blogService.getComments(blog.id)
        setComments(newComments)

        setCommentField('')
    }

    return (
        <div>
            <div>
                <h2>{blog.title} {blog.author}</h2>
            </div>
            <div><a href={blog.url}>{blog.url}</a></div>
            <div>
                <span className='like-span'>
                    {blog.likes} likes
                </span>
                <button id='like-button' onClick={() => increaseLikes(blog, blog.likes)}>
                    like
                </button>
            </div>
            <div>added by {blog.user.name}</div><br />

            <h2>comments</h2>
            <input
                value={ commentField }
                onChange={ ({ target }) => setCommentField(target.value) }
            />
            <button onClick={ (event) =>  submitComment(event)}>add comment</button>
            <ul>
                {comments.map(comment =>
                    <li key={ comment.id }>{ comment.comment }</li>
                )}
            </ul>
        </div>
    )
}

export default Blog