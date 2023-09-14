const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    let sumOfLikes = 0
    blogs.forEach(blog => {
        sumOfLikes += blog['likes']
    })
    return sumOfLikes
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    const result = blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })

    const convertedResult = {
        title: result.title,
        author: result.author,
        likes: result.likes
    }

    return convertedResult
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    let bloggerArray = []

    blogs.forEach(blog => {
        if (Object.prototype.hasOwnProperty.call(bloggerArray, blog.author)) {
            bloggerArray[blog.author] += 1
        } else {
            bloggerArray[blog.author] = 1
        }
    })

    const arrayValues = Object.values(bloggerArray)
    const max = Math.max(...arrayValues)

    const author = Object.keys(bloggerArray).find(key => bloggerArray[key] === max)

    const returnedObject = {
        author: author,
        blogs: max
    }

    return returnedObject
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    let bloggerArray = []

    blogs.forEach(blog => {
        if (Object.prototype.hasOwnProperty.call(bloggerArray, blog.author)) {
            bloggerArray[blog.author] += blog.likes
        } else {
            bloggerArray[blog.author] = blog.likes
        }
    })

    const arrayValues = Object.values(bloggerArray)
    const max = Math.max(...arrayValues)

    const author = Object.keys(bloggerArray).find(key => bloggerArray[key] === max)

    const returnedObject = {
        author: author,
        likes: max
    }

    return returnedObject
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}