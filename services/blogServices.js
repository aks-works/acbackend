const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const { createError } = require("../middlewares/errors");

// all blogs
exports.showAllBlogs = async () => {
  const posts = await Blog.find().populate(["user"]);
  if (!posts) {
    throw createError(404, "no post found");
  }
  return posts;
};

// all blogs by a particular author
exports.showBlogByauthor = async (query) => {
  const post = await Blog.find(query).populate(["user"]);
  if (!post) {
    throw createError(404, "No post found");
  }
  return post;
};

// single blog posgt
exports.singleBlog = async (id) => {
  const post = await Blog.findById(id).populate(["user"]);

  if (!post) {
    throw createError(404, "", "no post found");
  }

  return post;
};

//create blog
exports.createBlog = async (title, body, user) => {
  const post = await Blog.create({
    title,
    body,
    user,
  });
  const theUser = await User.findById(user);
  theUser.posts.push(post.id);
  await theUser.save();
};

//edit blog
exports.editBlog = async (id, title, body, user) => {
  const post = await Blog.findById(id);
  if (!post) {
    throw createError(404, "", "post not found");
  }
  if (post.user.toString() === user.toString()) {
    post.title = title;
    post.updatedAt = Date.now();
    post.body = body;
    await post.save();
  } else {
    throw createError(401, "", "don't have the permission to edit");
  }
};

//delete blog
exports.deleteBlog = async (id, userId) => {
  const post = await Blog.findById(id);
  if (!post) {
    throw createError(404, "", "post not found");
  }
  const user = await User.findById(userId);
  if (post.user.toString() === user.id.toString()) {
    const post = await Blog.findByIdAndDelete(id);

    const startIndexOfUserPost = user.posts.findIndex(
      (s) => s.toString() == post.id.toString()
    );
    user.posts.splice(startIndexOfUserPost, 1);
    await user.save();
  } else {
    throw createError(401, "", "don't have the permission to delete");
  }
};
