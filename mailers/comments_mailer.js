const nodemailer = require('../config/nodemailer');
exports.newComment = (comment) =>{
    console.log("inside new comment mailer");
    console.log(comment);
    nodemailer.transporter.sendMail({
        from : 'nikhilrajbhar135@gmail.com',
        to : comment.user.email,
        subject : "new comment published",
        html : '<h1> yup, your comment has been published </h1>'
    },(err,info)=>{
        if(err){
            console.log("err in sending the mail" + err);
             return;
        }
        console.log('message sent' + info);
        return;
    });
}