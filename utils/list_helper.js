const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let sum = blogs.reduce((sum, item) => sum + item.likes, 0)
    return sum
}


module.exports = {
    dummy,
    totalLikes
}