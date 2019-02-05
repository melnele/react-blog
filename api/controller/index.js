var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    Validations = require('../utils/Validations'),
    Encryption = require('../utils/Encryption'),
    User = mongoose.model('User'),
    Post = mongoose.model('Post');


module.exports.signup = function (req, res, next) {
    var valid = req.body.username && Validations.isString(req.body.username) && req.body.password && Validations.isString(req.body.password);
    if (!valid) {
        return res.status(422).json({
            err: null,
            msg: 'Not all required data is inserted or are in the wrong format.',
            data: null
        });
    } else {
        var password = req.body.password.trim();
        if (password.length < 6) {
            return res.status(422).json({
                err: null,
                msg: "Password has to be atleast 6 charachters.",
                data: null
            });
        } else {
            User.findOne({ username: req.body.username.trim().toLowerCase() }).exec(function (err, user) {
                if (err) {
                    return next(err);
                }
                else {
                    if (user) {
                        if (user.username == req.body.username.trim().toLowerCase()) {
                            return res.status(422).json({
                                err: null,
                                msg: 'Username taken.',
                                data: null
                            });
                        }
                    }
                    Encryption.hashPassword(req.body.password, function (err, hash) {
                        if (err) {
                            return next(err);
                        }
                        req.body.password = hash;

                        User.create(req.body, function (err, newUser) {
                            if (err) {
                                return next(err);
                            }
                            res.status(201).json({
                                err: null,
                                msg: 'Registration successful.',
                                data: newUser.toObject()
                            });
                        });
                    })
                }
            });
        }
    }
};

module.exports.signin = function (req, res, next) {
    // Check that the body keys are in the expected format and the required fields are there
    var valid =
        req.body.username &&
        Validations.isString(req.body.username) &&
        req.body.password &&
        Validations.isString(req.body.password);

    if (!valid) {
        return res.status(422).json({
            err: null,
            msg:
                'username(String) and password(String) are required fields.',
            data: null
        });
    }

    // Find the user with this email from the database
    User.findOne({
        username: req.body.username.trim().toLowerCase()
    }).exec(function (err, user) {
        if (err) {
            return next(err);
        }
        // If user not found then he/she is not registered
        if (!user) {
            return res
                .status(404)
                .json({ err: null, msg: 'User not found.', data: null });
        }

        // If user found then check that the password he entered matches the encrypted hash in the database
        Encryption.comparePasswordToHash(req.body.password, user.password, function (
            err,
            passwordMatches
        ) {
            if (err) {
                return next(err);
            }
            // If password doesn't match then its incorrect
            if (!passwordMatches) {
                return res
                    .status(401)
                    .json({ err: null, msg: 'Password is incorrect.', data: null });
            }
            // Create a JWT and put in it the user object from the database
            var token = jwt.sign(
                {
                    // user.toObject transorms the document to a json object without the password as we can't leak sensitive info to the frontend
                    user: user.toObject()
                },
                req.app.get('secret'),
                {
                    expiresIn: '12h'
                }
            );
            // Send the JWT to the frontend
            res.status(200).json({ err: null, msg: 'Welcome', data: token });
        });
    });
};

module.exports.create = function (req, res, next) {
    var valid = req.body.text && Validations.isString(req.body.text);
    if (!valid) {
        return res.status(422).json({
            err: null,
            msg: 'text(String) is a required field.',
            data: null
        });
    }

    User.findById(req.decodedToken.user._id).exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res
                .status(404)
                .json({ err: null, msg: 'User not found.', data: null });
        }
        req.body.user = req.decodedToken.user;
        Post.create(req.body, function (err, newPost) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.status(201).json({
                err: null,
                msg: 'Post created',
                data: newPost.toObject()
            });
        });
    });
};

module.exports.getall = function (req, res, next) {
    Post.find().exec(function (err, posts) {
        if (err) {
            return next(err);
        }
        if (!posts) {
            return res
                .status(404)
                .json({ err: null, msg: 'Posts not found.', data: null });
        }
        res.status(200).json({
            err: null,
            msg: 'Posts retrieved successfully.',
            data: posts
        });
    });
};