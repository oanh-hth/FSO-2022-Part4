// this file handle all routes of the application
// create a new router object, then export the router, this will be available for all consumers
const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})


blogsRouter.get('/:id', async (request, response, next) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
   
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const user = request.user
    if (!user) {
        response.status(401).json({
            error: 'token missing or invalid'
        })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
    
})

blogsRouter.delete('/:id', async (request, response, next) => {
    const user = request.user
    if (!user) {
        response.status(401).json({
            error: 'token missing or invalid'
        })
    }
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === user._id.toString()) {
        await Blog.deleteOne(blog)
        response.status(204).end()
    }  
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

    response.json(updatedBlog)
    
})

module.exports = blogsRouter