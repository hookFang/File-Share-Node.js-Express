'use strict';
import e, { Router } from 'express';
import userModel from "../models/user";


const router = Router();

/*GET for register*/
router.get('/register', function (req, res) {
    res.render('register');
});

/*POST for register*/
router.post('/register', function (req, res) {
    //compare password and confirm password
    if (req.body.password === req.body.confirmPassword)
    {
        //Insert user
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            var registerUser = {
                email: req.body.email,
                password: hash
            }
            //Check if user already exists
            userModel.find({ email: registerUser.email }, function (err, user) {
                if (err) console.log(err);
                if (user.length) console.log('Username already exists please login.');
                const newUser = new userModel(registerUser);
                newUser.save(function (err) {
                    console.log('Adding User');
                    if (err) console.log(err);
                    req.login(newUser, function (err) {
                        console.log('Trying to login');
                        if (err) console.log(err);
                        return res.redirect('/');
                    });
                });
            });
        })
    }
    else
    {
        console.log('Passwords do not match, pleas make sure they are the same.');
    }
});

module.exports = router;