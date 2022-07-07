import { Router } from 'express';
import * as Posts from './controllers/blog_controller';
import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';

const assert = require('assert');

const router = Router();

/// your routes will go here
// example!
// on routes ending in /someroute/:someID
// ----------------------------------------------------
const handleGetAll = async (req, res) => {
  try {
    // use req.body etc to await some contoller function
    const result = await Posts.getPosts();
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(500).json({ error });
  }
};

const handleGet = async (req, res) => {
  try {
    // use req.body etc to await some contoller function
    const result = await Posts.getPost(req.params.postid);
    // send back the result
    assert.notEqual(result, null);
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(404).json({ error });
  }
};

const handlePost = async (req, res) => {
  const { user } = req;
  const postFields = req.body;
  try {
    // use req.body etc to await some controller function
    const result = await Posts.createPost(user, postFields);
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(500).json({ error });
  }
};

const handlePut = async (req, res) => {
  const { user } = req;
  const postFields = req.body;
  try {
    // use req.body etc to await some controller function
    const result = await Posts.updatePost(user, req.params.postid, postFields);
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(404).json({ error });
  }
};

const handleDelete = async (req, res) => {
  const { user } = req;
  try {
    // use req.body etc to await some contoller function
    const result = await Posts.deletePost(user, req.params.postid);
    // send back the result
    res.json(result);
  } catch (error) {
    // or catch the error and send back an error
    res.status(404).json({ error });
  }
};

router.route('/posts/:postid')
  .get(handleGet)
  .put(requireAuth, handlePut)
  .delete(requireAuth, handleDelete);

router.route('/posts')
  .post(requireAuth, handlePost)
  .get(handleGetAll);

router.get('/', requireAuth, async (req, res) => {
  // res.json({ message: 'welcome to our blog api!' });
  const { user } = req;
  // console.log(user);
  try {
    // use req.body etc to await some controller function
    // send back the result
    res.json({ authorName: user.authorName, email: user.email });
  } catch (error) {
    // or catch the error and send back an error
    res.status(500).json({ error });
  }
});

router.post('/signin', requireSignin, async (req, res) => {
  try {
    const token = UserController.signin(req.user);
    console.log(req.user);
    res.json({ token, email: req.user.email, authorName: req.user.authorName });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const token = await UserController.signup(req.body);
    console.log(req.body);
    res.json({ token, email: req.body.email, authorName: req.body.authorName });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

export default router;
