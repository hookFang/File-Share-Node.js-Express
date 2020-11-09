'use strict';
import { Router } from 'express';
import passport from "passport";

const router = Router();

/*POST for login*/
//Try to login with passport
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login',
        failureMessage: 'Invalid Login'
    }));

    /*Logout*/
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

/*GET for login*/
router.get('/login', function (req, res) {
    res.render('login');
});

module.exports = router;