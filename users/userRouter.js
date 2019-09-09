const express = require('express');
const userDb = require('./userDb');
const postDb = require('../posts/postDb');

const router = express.Router();
router.use('/:id', validateUserId);
router.post('/', validateUser);
router.put('/:id', validateUser);
router.post('/:id/posts', validatePost);

router.post('/', (req, res) => {
    userDb.insert({name: req.query.name})
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json({error:"The user could not be created."}));
});

router.post('/:id/posts', (req, res) => {
    postDb.insert({text: req.query.text, user_id:req.params.id})
    .then(post => res.status(201).json(post))
    .catch(err => res.status(500).json({error:"The post could not be created."}))
});

router.get('/', (req, res) => {
    userDb.get()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({error:"The users information could not be retrieved."}));
});

router.get('/:id', (req, res) => {
    userDb.getById(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({error:"The user information could not be retrieved."}));
});

router.get('/:id/posts', (req, res) => {
    userDb.getUserPosts(req.params.id)
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({error:"The posts information could not be retrieved."}));
});

router.delete('/:id', (req, res) => {
    userDb.remove(req.params.id)
    .then(num=> res.sendStatus(200))
    .catch(err => res.status(500).json({error:"The user could not be deleted from the database."}));
});

router.put('/:id', (req, res) => {
    userDb.update(req.params.id,{name:req.query.name})
    .then(count => {
        userDb.getById(req.params.id)
        .then(user => res.status(200).json(user))
    })
    .catch(err => res.status(500).json({error:"The user could not be updated."}));
});

//custom middleware

function validateUserId(req, res, next) {
    userDb.getById(req.params.id)
    .then(user => {
        if (user==undefined) {
            res.status(400).json({message:"invalid user id"});
        } else {
            req.user = user;
            next();
        }
    })
};

function validateUser(req, res, next) {
    if(Object.keys(req.query).length === 0) {
        res.status(400).json({message:"missing user data"});
    } else if (req.query.name == undefined) {
        res.status(400).json({message:"missing required name field"});
    } else {
        next();
    }
};

function validatePost(req, res, next) {
    if(Object.keys(req.query).length === 0) {
        res.status(400).json({message:"missing user data"});
    } else if (req.query.text == undefined) {
        res.status(400).json({message:"missing required text field"});
    } else {
        next();
    }
};

module.exports = router;
