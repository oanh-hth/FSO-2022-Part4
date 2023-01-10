const Blog = require('../models/blogs')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'First blog title',
        author: 'Alexander',
        url: 'alex.info',
        likes: 1000
    },
    {
        title: 'Second blog title',
        author: 'Janeeee',
        url: 'jane.com',
        likes: 500
    },
]


const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'Anne', url: 'thh.com', likes: 1 })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}