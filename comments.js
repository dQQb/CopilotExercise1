// Create web serer
// Import Express
import { Router } from 'express';
const router = Router();
// Import model
import { create, findById } from '../models/comment';
// Import middleware
import { isLoggedIn, checkCommentOwnership } from '../middleware';
//==================================
// COMMENT ROUTES
//==================================
// New comment form
router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    // Find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            // Render new comment form
            res.render('comments/new', { campground: campground });
        }
    });
});
// Create comment
router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    // Find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            // Redirect to campgrounds
            res.redirect('/campgrounds');
        } else {
            // Create comment
            create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    // Connect new comment to campground
                    campground.comments.push(comment);
                    // Save campground
                    campground.save();
                    // Redirect to campground show page
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});
// Edit comment form
router.get('/campgrounds/:id/comments/:comment_id/edit', checkCommentOwnership, (req, res) => {
    // Find campground by id
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash('error', 'Campground not found');
            return res.redirect('back');
        }
        // Find comment by id
        findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect('back');
            } else {
                // Render edit comment form
                res.render('comments/edit', { campground_id: req.params.id, comment: foundComment });
            }
        });
    });
});
// Update comment
router.put