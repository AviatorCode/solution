const express = require('express');
const knex = require('../db/client'); // This allows us to interact with the database

const router = express.Router();

//const clucksRouter = require('.routes/clucksRouter');
//app.use('/clucks', clucksRouter);


// This postsRouter does not mean that all routes using the HTTP VERB: POST
// need to be within this router
// The name of this router comes from the table name within our database called
// "posts".

// this route is automatically prepended with "/posts"
// meaning that it is the path: "/posts/new", NOT just "/new"
// NAME: posts#new, METHOD: GET, PATH: '/posts/new'
router.get('/new', (req, res) => {
    // This will render the new.ejs file located within the posts
    // directory of the views directory
    res.render('clucks/new');
});

// NAME: posts#create, METHOD: POST, PATH: /posts
router.post('/', (req, res) => {
    const formData = req.body;
    knex('clucks')
        .insert({
            title: formData.title,
            content: formData.content,
            imageUrl: formData.image_url,
        })
        .returning('*')
        .then(clucks => {
            // This is called "destructuring" the array
            const [cluck /*, post2 */] = clucks;
            // const post = posts[0];
            // const post2 = posts[1];

            // If we want to use a terminating method like
            // res.send, res.render, or res.redirect
            // And we want to do this after inserting something,
            // updating something, reading something, etc from our db
            // We need to use that terminating method
            // within the callback to `.then`
            res.redirect(`/clucks/${cluck.id}`);
        });
});

// NAME: posts#index, METHOD: GET, PATH: /posts
router.get('/', (req, res) => {
    // knex.select('*').from('posts').then(...) <- this works too, or we can just use the line below
    knex('clucks')
        .orderBy('created_at', 'desc')
        .then(clucks => {
            // notice the res.render is within the callback to `.then`
            res.render('clucks/index', { clucks: clucks });
        });
});

// NAME: posts#show, METHOD: GET, PATH: /posts/:id
router.get('/:id', (req, res) => {
    // In the URL above, all the words prefixed with  `:`
    // are called URL params. You can view the values of URL params
    // with the `req.params` object property. It contains an object
    // where the property name corresponds to the name of the url param
    // and its associated value.

    // `req.params` is an object with key value pairs created by
    // pattern-matching against "variables" named in the URL/path
    // route /posts/:id/:name/:job the route then accessed was: /posts/100/Bob/developer
    // req.params === { id: "100", name: "Bob", job: "developer" }
    const id = req.params.id;
    knex('clucks')
        .where('id', id)
        .first()
        // first is a Knex method that works with SELECT queries
        // It will return the first result from the array of results
        // that matched the where clause
        // Without `first` the result returned from the query will always be an
        // array of values, even if we know that it is returning only a single value
        .then(cluck => {
            // res.send(post);
            // If there is a post with that id, we will show it, otherwise
            // we will redirect the user to the list of all posts
            if (cluck) {
                res.render('clucks/show', { cluck: cluck });
            } else {
                res.redirect('/clucks');
            }
        });
});

// NAME: posts#destroy, METHOD: DELETE, PATH: /posts/:id
router.delete('/:id', (req, res) => {
    knex('clucks')
        .where('id', req.params.id)
        .del()
        .then(() => {
            res.redirect('/clucks');
        });
});

// NAME: posts#edit, METHOD: GET, PATH: /posts/:id/edit
router.get('/:id/edit', (req, res) => {
    knex('clucks')
        .where('id', req.params.id)
        .first()
        .then(clucks => {
            res.render('clucks/edit', { cluck: cluck });
        });
});

// Name: posts#update, METHOD: PATCH, PATH: /posts/:id
router.patch('/:id', (req, res) => {
    const updatedcluck = {
        title: req.body.title,
        content: req.body.content,
        image_url: req.body.image_url,
    };
    knex('clucks')
        .where('id', req.params.id)
        .update(updatedcluck)
        .then(() => {
            res.redirect(`/posts/${req.params.id}`);
        });
});

module.exports = router;
