const express = require('express');
const router = express.Router();
const passport = require('passport');
const {check} = require('express-validator');


const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);


router.post('/create', usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/users/sign-in' },
), usersController.createSession);


router.get('/sign-out', usersController.destroySession);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureFlash: 'users/sign-in' }), usersController.createSession);
router.post('/recover', [
    check('email').isEmail().withMessage('Enter a valid email address'),
],usersController.recover);

router.get('/reset/:token', usersController.reset);

router.post('/reset/:token', [
    check('password').not().isEmpty().isLength({ min: 6 }).withMessage('Must be at least 6 chars long'),
    check('confirmPassword', 'Passwords do not match').custom((value, { req }) => (value === req.body.password)),
],usersController.resetPassword);
router.get('/forgotPassword',usersController.forgotPassword);


module.exports = router;