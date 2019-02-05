var express = require('express'),
    jwt = require('jsonwebtoken'),
    router = express.Router();

controller = require('../controller');

var isAuthenticated = function (req, res, next) {
    // Check that the request has the JWT in the authorization header
    var token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({
            error: null,
            msg: 'You have to login first before you can access your lists.',
            data: null
        });
    }
    // Verify that the JWT is created using our server secret and that it hasn't expired yet
    jwt.verify(token, req.app.get('secret'), function (err, decodedToken) {
        if (err) {
            return res.status(401).json({
                error: err,
                msg: 'Login timed out, please login again.',
                data: null
            });
        }
        req.decodedToken = decodedToken;
        next();
    });
};

var isNotAuthenticated = function (req, res, next) {
    var token = req.headers.authorization;
    if (!token) {
        next();
    } else {
        jwt.verify(token, req.app.get('secret'), (err, decodedToken) => {
            if (!err) {
                return res.status(401).json({
                    error: err,
                    msg: 'You are already logged in.',
                    data: null
                });
            }
            next();
        });
    }
};

router.post('/user/signup', isNotAuthenticated, controller.signup);
router.post('/user/signin', isNotAuthenticated, controller.signin);
router.post('/blog/create', isAuthenticated, controller.create);
router.get('/blog/getall', isAuthenticated, controller.getall);
module.exports = router;