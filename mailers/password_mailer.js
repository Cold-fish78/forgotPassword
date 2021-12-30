const nodemailer = require('../config/nodemailer');
exports.newComment = (comment) =>{
    let htmlString = nodemailer.renderTemplate({user : user},'passwords/reset_password.ejs')
    console.log("inside new comment mailer");

    nodemailer.transporter.sendMail({
        from : 'coldfish68089@gmail.com',
        to : comment.user.email,
        subject : "new comment published",
        html : htmlString
    },(err,info)=>{
        if(err){
            console.log("err in sending the mail" + err);
             return;
        }
        // console.log('message sent' + info);
        return;
    });
}