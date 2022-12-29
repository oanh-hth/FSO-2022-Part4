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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}