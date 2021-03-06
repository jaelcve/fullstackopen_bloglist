const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'A nice book',
    author: 'John Doe',
    url: 'http://www.google.ca',
    likes: 4,
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = { initialBlogs, blogsInDb, nonExistingId, usersInDb}