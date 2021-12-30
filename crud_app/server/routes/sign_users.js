//api request


const express = require('express');
const router = express.Router();
const User = require('../model/sign_user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//for sign up
router.post('/signup', (req, res, next) => {

    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(200).json({
                    message: 'Mail Exists'
                })
            } else {

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json(err);
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })

                        user.save()
                            .then(result => res.status(201).json(result))
                            .catch(err => res.status(500).json(err));
                    }
                })
            }
        })
        .catch(err => res.status(500).json(err));
})



//for sign in
router.post('/signin', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user.length) {
                res.status(401).json({
                    message: "Not Found"
                })
            }
            else{
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        res.status(401).json({
                            message: "Password doesn't match."
                        })
                    }
                    else if (result) {
    
                        const token = jwt.sign({ userId: user[0]._id }, `${process.env.JWT_KEY}`, {
                            expiresIn: 3600
                        })
    
                        res.status(200).json({
                            message: "Sign-in Successful",
                            token: token
                        })
                    }
                    else {
                        res.status(401).json({
                            message: "Incorrect Pasword"
                        })
                    }
    
                })
            }
        })
        .catch(err => res.status(500).json(err));
})




module.exports = router;