const dummy = (blogs) => {
  if (blogs) {
    return 1
  }
}

const totalLikes = (blogs) => {
  const reducer = (sumOfLikes, { likes }) => {
    return sumOfLikes + likes
  }

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (temp, current) => {
    return temp.likes < current.likes ? current : temp
  }

  return blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return 0
  let blogCounter = {}

  for (let blog of blogs) {
    blogCounter[blog.author] = (blogCounter[blog.author] || 0) + 1
  }

  let mostBlog = {}
  let tempHighestNb = 0

  for (let blog in blogCounter) {
    if (blogCounter[blog] > tempHighestNb) {
      mostBlog.author = blog
      mostBlog.blogs = blogCounter[blog]
      tempHighestNb = mostBlog.blogs
    }
  }

  return mostBlog
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return 0
  let blogCounter = {}

  for (let blog of blogs) {
    blogCounter[blog.author] = (blogCounter[blog.author] || 0) + blog.likes
  }

  let mostLikes = {}
  let tempHighestNb = 0

  for (let blog in blogCounter) {
    if (blogCounter[blog] > tempHighestNb) {
      mostLikes.author = blog
      mostLikes.likes = blogCounter[blog]
      tempHighestNb = mostLikes.likes 
    }
  }
  return mostLikes
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }