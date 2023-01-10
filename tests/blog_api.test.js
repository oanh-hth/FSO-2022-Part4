const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blogs')
const User = require('../models/user')


beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

describe('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
      
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        
        const author = response.body.map(r => r.author)
        expect(author).toContain(
            'Janeeee'
        )
    })
})

describe('viewing a specific blog', () => {
    test('each blog has existed id', async () => {
        const response = await api.get('/api/blogs')
        const id = response.body.map(r => r.id)
        expect(id).toBeDefined()
    })

})

describe('addition of a new blog', () => {
    let headers
    beforeEach(async () => {
        let user = {
            username: "root",
            password: "sekret"
       }
        
        const loginUser = await api
            .post('/api/login')
            .send(user)

        headers = {
        'Authorization': `bearer ${loginUser.body.token}`
        }
    })
    test('added a blog without likes', async () => {
        const newBlog = {
            title: 'A blog with no likes',
            author: 'Anonymous',
            url: 'butter.com'
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set(headers)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        const likes = response.body.map(r => r.likes)
    
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
        expect(likes).toContain(0)
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Second blog title',
            author: 'Gilbert',
            url: 'annewithane.com',
            likes: 10000
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set(headers)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await helper.blogsInDb()
    
        const author = response.map(r => r.author)
    
        expect(response).toHaveLength(helper.initialBlogs.length + 1)
        expect(author).toContain(
            'Gilbert'
        )
    })
    
    test('blog without title added', async () => {
          const newBlog = {
            author: 'Hippo',
            url: 'acnn.net',
            likes: 1
        }
      
        await api
          .post('/api/blogs')
          .send(newBlog)
          .set(headers)
          .expect(400)
      
        const response = await helper.blogsInDb()
        expect(response).toHaveLength(helper.initialBlogs.length)
    })
})

describe('deletion of a blog', () => {
    let headers
    beforeEach(async () => {
        let user = {
            username: "root",
            password: "sekret"
       }
        
        const loginUser = await api
            .post('/api/login')
            .send(user)

        headers = {
        'Authorization': `bearer ${loginUser.body.token}`
        }
    })
    test('delete a single blog post', async () => {
        const data = await helper.blogsInDb()
        const deleteBlog = data[0].id
        
      await api
        .delete(`/api/blogs/${deleteBlog}`)
        .set(headers)  
        .expect(204)
    
      const response = await helper.blogsInDb()
      expect(response).toHaveLength(helper.initialBlogs.length - 1)
    })
})
  
describe('updating of an existed blog', () => {
    test('update an existing blogpost', async () => {
        const data = await helper.blogsInDb()
        const updatedBlog = data[0]
        updatedBlog.likes = 2
    
        let result = await api
            .put(`/api/blogs/${updatedBlog.id}`)
            .send(updatedBlog)
            .expect('Content-Type', /application\/json/)
    
        const response = await helper.blogsInDb()
        const likes = response.map( b => b.likes)
        expect(response).toHaveLength(helper.initialBlogs.length)
        expect(likes).toContain(2)
    })
})

afterAll(() => {
  mongoose.connection.close()
})