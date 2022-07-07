import Post from '../models/post_model';

const assert = require('assert');

export async function createPost(user, postFields) {
  // await creating a post
  // return post
  const post = new Post();
  post.title = postFields.title;
  post.tags = postFields.tags;
  post.coverUrl = postFields.coverUrl;
  post.content = postFields.content;
  post.author = user;
  try {
    const savedpost = await post.save();
    return savedpost;
  } catch (error) {
    throw new Error(`create post error: ${error}`);
  }
}

export async function getPosts() {
  // await finding posts
  // return posts
  try {
    const posts = await Post.find({}).populate('author');
    return posts;
  } catch (error) {
    throw new Error(`get all posts error: ${error}`);
  }
}
export async function getPost(id) {
  // await finding one post
  // return post
  try {
    const post = await Post.findById(id).populate('author');
    return post;
  } catch (error) {
    throw new Error(`get all posts error: ${error}`);
  }
}
export async function deletePost(user, id) {
  // await deleting a post
  // return confirmation
  try {
    const post = await Post.findById(id);
    assert.equal(user.id, post.author);
    const deletedPost = await Post.findByIdAndDelete(id);
    assert.notEqual(deletedPost, null);
    return deletedPost;
  } catch (error) {
    throw new Error(`get all posts error: ${error}`);
  }
}
export async function updatePost(user, id, postFields) {
  // await updating a post by id
  // return *updated* post
  try {
    const post = await Post.findById(id);
    assert.equal(user.id, post.author);
    const updatedPost = await Post.findByIdAndUpdate(id, postFields, { new: true });
    return updatedPost;
  } catch (error) {
    throw new Error(`get all posts error: ${error}`);
  }
}
