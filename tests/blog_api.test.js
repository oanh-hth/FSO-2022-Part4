const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')

const api = supertest(app)

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
  
  beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
  })
beforeEach(async () => {
await Blog.deleteMany({})

for (let blog of initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
}
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(initialBlogs.length)
})
  
test('a specific blog is within the returned blogs', async () => {
const response = await api.get('/api/blogs')

const author = response.body.map(r => r.author)
expect(author).toContain(
    'Janeeee'
)
})

test('each blog has existed id', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body.map(r => r.id)
    expect(id).toBeDefined()
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
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const likes = response.body.map(r => r.likes)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
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
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const author = response.body.map(r => r.author)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
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
      .expect(400)
  
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  }, 100000)

afterAll(() => {
  mongoose.connection.close()
})