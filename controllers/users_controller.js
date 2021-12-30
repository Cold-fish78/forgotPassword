const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const sendEmail = require("../views/mailers/sendEmail");
const passwordChangeMail = require('../views/mailers/passwordChangeMail');

const nodemailer = require("nodemailer");
// let's keep it same as before
module.exports.profile = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });

}


module.exports.update = async function (req, res) {
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //     });
    // }else{
    //     req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    // }
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) {
                    console.log("multer error" + err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                if (req.file) {
                    //  this is saving the path of dthe uplaoded file into the avatar field in the user
                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })
        } catch (err) {
            req.flash('error', err)
            return res.redirect('back');
        }

    } else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


// render the sign up page
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { req.flash('error', err); return }

        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) { req.flash('error', err); return }

                return res.redirect('/users/sign-in');
            })
        } else {
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'You have logged out!');


    return res.redirect('/');
}
module.exports.recover = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' });

            //Generate and set password reset token
            user.generatePasswordReset();
            console.log("generated token");
            console.log(user);
            console.log(user.email);
            // Save the updated user object
            user.save()
                .then(user => {
                    let link = "http://" + req.headers.host + "/users/reset/" + user.resetPasswordToken;
                    sendEmail(user.email, "Password reset", link);
                    return res.render('checkInbox',{title : 'check inbox'});
                        

                })
                .catch(err => res.status(500).json({ message: err.message }));
        })
        .catch(err => res.status(500).json({ message: err.message }));
};
module.exports.reset = (req, res) => {
    
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
        .then((user) => {
            if (!user) return res.status(401).json({ message: 'Password reset token is invalid or has expired.' });
                    
            //Redirect user to form with the email address'
          
            console.log(user.resetPasswordToken);
            res.render('reset', { title : 'reset password', user});
        })
        .catch(err => res.status(500).json({ message: err.message }));
};

exports.resetPassword = (req, res) => {
    console.log("inside reset password module");
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
        .then((user) => {
            if (!user) return res.status(401).json({ message: 'Password reset token is invalid or has expired.' });

            //Set the new password
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            let text = "your password has been changed"
            // Save
            user.save((err) => {
                if (err) return res.status(500).json({ message: err.message });
                passwordChangeMail(user.email, "Password reset",text);
                return res.redirect('/');
            });
        });
};
module.exports.forgotPassword = function (req, res) {

    return res.render('forgotPassword', { title: "reset your password" });

}