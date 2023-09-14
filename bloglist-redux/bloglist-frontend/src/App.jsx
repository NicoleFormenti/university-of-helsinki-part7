import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import {
    Switch,
    Route,
    Link,
    useHistory
} from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Error from './components/Error'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import User from './components/User'
import UserDetails from './components/UserDetails'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'


const Wrapper = styled.div`
        background: blue;
        padding: 10px;
        width: 500px;
    `

const Menu = styled.div`
    font-size: 1.2em;
    display: flex;
    justify-content: space-evenly;
`

const H2Welcome = styled.h2`
    text-align: center;
`

const App = () => {
    const dispatch = useDispatch()
    const blogs = useSelector(state => state.blogs)
    const user = useSelector(state => state.user)
    const userProfile = useSelector(state => state.userProfile)

    const history = useHistory()

    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        const fetchAllUsers = async () => {
            const users = await userService.getUsers()
            setAllUsers(users)
        }

        fetchAllUsers()
    }, [ blogs ])

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [errorMessage, setErrorMessage] = useState(null)

    const noteFormRef = useRef()

    useEffect(() => {
        async function fetchData() {
            dispatch(initializeBlogs())
        }
        fetchData()
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch(setUser(user))
            blogService.setToken(user.token)
        }
    }, [])

    const sortBlogs = () => {
        function compare(a, b) {
            if (a.likes < b.likes){
                return 1
            }
            if (a.likes > b.likes) {
                return -1
            }
            return 0
        }

        blogs.sort( compare )
    }

    if (blogs.length !== 0) {
        sortBlogs()
    }

    const addBlog = async (blogObject) => {
        noteFormRef.current.toggleVisibility()
        const returnedBlog = await blogService.create(blogObject)

        dispatch(initializeBlogs())

        dispatch(setNotification(`a new blog named ${returnedBlog.title} has been added`, 3))

        setTimeout(() => {
            dispatch(setNotification(null, 3))
        }, 3000)
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username, password,
            })

            if (user !== null) {
                window.localStorage.setItem(
                    'loggedBlogappUser', JSON.stringify(user)
                )

                blogService.setToken(user.token)
                dispatch(setUser(user))
            }

            setUsername('')
            setPassword('')
        } catch (exception) {
            setErrorMessage('Wrong credentials')
            setUsername('')
            setPassword('')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const handleLogout = async () => {
        window.localStorage.removeItem('loggedBlogappUser')
        dispatch(setUser(null))

        history.push('/')
    }

    const blogForm = () => (
        <Togglable ref={noteFormRef}>
            <BlogForm
                createBlog={addBlog}
            />
        </Togglable>
    )

    const increaseLikes = async (blog, likes) => {
        const blogObject = blogs.find(b => b.id === blog.id)
        const changedBlog = { ...blogObject, likes: likes + 1 }

        try {
            await blogService.update(changedBlog.id, changedBlog)
            dispatch(initializeBlogs())
        } catch (exception) {
            setErrorMessage(exception)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const menuStyle = {
        backgroundColor: 'silver',
        padding: 5,
    }

    if (user === null) {
        return (
            <Wrapper>
                <H2Welcome>Log in to my app</H2Welcome>
                <Error errorMessage={errorMessage} />
                <form id="login-form" onSubmit={handleLogin}>
                    <div>
                    Username:&nbsp;
                        <input
                            id="username"
                            type="text"
                            value={username}
                            name="Username"
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </div>
                    <div>
                    Password:&nbsp;&nbsp;
                        <input
                            id="password"
                            type="password"
                            value={password}
                            name="Password"
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </div>
                    <button id="login-button" type="submit">Log in</button>
                </form>
            </Wrapper>
        )
    }

    if (!allUsers) {
        return null
    }

    return (
        <Wrapper>
            <Menu style={ menuStyle }>
                Hi, { user.name }!
                <Route path='/blogs/:id'>
                    {
                        userProfile &&
                        <Link to={ `/users/${userProfile.id}` }>Blogs</Link>
                    }
                    &nbsp;<Link to={ '/' }>Users</Link>&nbsp;
                </Route>
                <Route path='/users/:id'>
                    <Link to={ '/' }>Users</Link>&nbsp;
                </Route>
                <button id="logout-button" onClick={handleLogout}>Log out</button>
            </Menu>
            <H2Welcome>Welcome</H2Welcome>
            <Notification />

            <Switch>
                <Route path='/users/:id'>
                    { blogForm() }
                    <User allUsers={ allUsers } />
                </Route>
                <Route path='/blogs/:id'>
                    <Blog increaseLikes={ increaseLikes } />
                </Route>
                <Route path='/'>
                    <UserDetails blogs={ blogs } allUsers={ allUsers } />
                </Route>
            </Switch>
        </Wrapper>
    )
}

export default App