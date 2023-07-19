// Create web server
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var mongoose = require('mongoose');
var passport = require('passport');
var auth = require('../config/auth');
var User = require('../models/user');

// GET comments
router.get('/', function(req, res, next) {
  Comment.find(function(err, comments) {
    if (err) {
      return next(err);
    }
    res.json(comments);
  });
});

// POST comments
router.post('/', auth.isAuthenticated, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.user = req.user;
  comment.save(function(err, comment) {
    if (err) {
      return next(err);
    }
    res.json(201, comment);
  });
});

// GET comments/:id
router.get('/:id', function(req, res, next) {
  Comment.findById(req.params.id, function(err, comment) {
    if (err) {
      return next(err);
    }
    res.json(comment);
  });
});

// PUT comments/:id
router.put('/:id', auth.isAuthenticated, function(req, res, next) {
  Comment.findById(req.params.id, function(err, comment) {
    if (err) {
      return next(err);
    }
    comment.body = req.body.body;
    comment.save(function(err, comment) {
      if (err) {
        return next(err);
      }
      res.json(comment);
    });
  });
});

// DELETE comments/:id
router.delete('/:id', auth.isAuthenticated, function(req, res, next) {
  Comment.findById(req.params.id, function(err, comment) {
    if (err) {
      return next(err);
    }
    comment.remove(function(err) {
      if (err) {
        return next(err);
      }
      res.send(204);
    });
  });
});

module.exports = router;