import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setUserProfile } from '../reducers/userProfileReducer'

const User = ({ allUsers }) => {
    const dispatch = useDispatch()

    const id = useParams().id
    const user = allUsers.find(u => u.id === id)

    useEffect(() => {
        if (user) {
            dispatch(setUserProfile(user))
        }
    }, [])

    if (!user) {
        return null
    }

    const userBlogs = user.blogs

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5,
        fontSize: 20,
    }

    return (
        <div>
            {userBlogs.map(blog =>
                <div style={ blogStyle } key={ blog.id }>
                    <Link to={ `../blogs/${blog.id}` }>{ blog.title }</Link>
                </div>
            )}
        </div>
    )
}

export default User