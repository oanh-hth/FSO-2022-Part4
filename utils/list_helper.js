const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let sum = blogs.reduce((sum, item) => sum + item.likes, 0)
    return sum
}

const favoriteBlog = (blogs) => {
    let maxLikesNumber = Math.max(...blogs.map( blog => blog.likes))
    let favoriteBlog = blogs.find(blog => blog.likes === maxLikesNumber)
    return favoriteBlog
}

const mostBlogs = (blogs) => {
    let countBlogs = _.map(_.countBy(blogs, 'author'), (key, value ) => {
        return {
            author: value,
            blogs: key
        }
    })
    let chosenAuthor = _.maxBy(countBlogs, 'blogs')
    return chosenAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}