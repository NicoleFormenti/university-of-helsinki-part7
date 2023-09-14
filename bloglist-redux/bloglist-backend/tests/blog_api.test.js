const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

describe('blog-related tests:', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        const savedUser = await user.save()

        await Blog.deleteMany({})

        const blogObjects = helper.initialBlogs
            .map(blog => new Blog(blog))

        blogObjects.map(blog => blog.user = savedUser)

        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)
    })

    test('all blogs are returned, and they are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('the unique identifier property of the blog posts is named "id"', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body[0].id).toBeDefined()
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Example',
            author: 'Nicole Formenti',
            url: 'example.com',
            likes: 2
        }

        const rootUser = {
            username: 'root',
            password: 'sekret'
        }

        const result = await api
            .post('/api/login')
            .send(rootUser)
            .expect('Content-Type', /application\/json/)

        await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + result.body.token)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain(
            'Example'
        )

        const authors = blogsAtEnd.map(b => b.author)
        expect(authors).toContain(
            'Nicole Formenti'
        )

        const urls = blogsAtEnd.map(b => b.url)
        expect(urls).toContain(
            'example.com'
        )

        const likes = blogsAtEnd.map(b => b.likes)
        expect(likes).toContain(2)
    })

    test('the "likes" property defaults to 0 if it is omitted from the POST request', async () => {
        const newBlog = {
            title: 'Example',
            author: 'Nicole Formenti',
            url: 'example.com',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBeDefined()
    })

    test('400 error if title and url properties are both missing from the POST request', async () => {
        const newBlog = {
            author: 'Nicole Formenti',
            likes: 2
        }

        const rootUser = {
            username: 'root',
            password: 'sekret'
        }

        const result = await api
            .post('/api/login')
            .send(rootUser)
            .expect('Content-Type', /application\/json/)

        await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + result.body.token)
            .send(newBlog)
            .expect(400)
    })

    test('deleting a blog succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        const rootUser = {
            username: 'root',
            password: 'sekret'
        }

        const result = await api
            .post('/api/login')
            .send(rootUser)
            .expect('Content-Type', /application\/json/)

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', 'bearer ' + result.body.token)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const titles = blogsAtEnd.map(b => b.title)

        expect(titles).not.toContain(blogToDelete.title)
    })

    test('updating an existing note\'s "likes" property works as expected', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const newBlog = {
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 15
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(newBlog)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[0].likes).toBe(newBlog.likes)
    })

    test('adding a blog fails with 401 status code if no token provided', async () => {
        const newBlog = {
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 15
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'TestingAway',
            name: 'Nicole Formenti',
            password: 'sekret',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('users without username are not created', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'Nicole Formenti',
            password: 'sekret',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Path `username` is required')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('users without password are not created', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'TestAway',
            name: 'Nicole Formenti',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password missing')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('usernames with less than 3 characters are not created', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'NA',
            name: 'Nicole Formenti',
            password: 'sekret',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Path `username` (`Fl`) is shorter than the minimum allowed length (3)')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('passwords with less than 3 characters are not created', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'Ninininini',
            name: 'Nicole Formenti',
            password: 'ah',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password should be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('username must be unique', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Nicole Formenti',
            password: 'sekret',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})