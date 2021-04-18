const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  // const blogObjects = helper.initialBlogs
  //   .map(blog => new Blog(blog))
  // const promiseArray = blogObjects.map(blog => blog.save())
  // await Promise.all(promiseArray)

  await Blog.insertMany(helper.initialBlogs)
})

describe('when there are initially blogs saved', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identitifier property is named id', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)

    const body = response.body

    body.forEach(blog => {
      expect(blog._id).toBeUndefined()
      expect(blog.id).toBeDefined()
    })
  })
})


describe('adding a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('Type wars')
  })

  test('if likes is missing when adding a blog, return the value of 0', async () => {
    const newBlog = {
      title: 'Super Type Wars 2',
      author: 'John Doe',
      url: 'http://google.ca',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toEqual(0)
  })

  test('if title and url are missing, respond with 400', async () => {
    const newBlog = {
      author: 'John Doe',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)

    expect(response.status).toEqual(400)
  })
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blog =  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 22,
  }

  const response = await api
    .put(`/api/blogs/${blogsAtStart[0].id}`)
    .send(blog)

  expect(response.body.likes).toEqual(22)  
})


afterAll(() => {
  mongoose.connection.close()
})