const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
module.exports.createSession =async function(req,res){
    try{

        let user =await User.findOne({email : req.body.email});
        if(!user || user.password !=req.body.password){
            return res.json(422,{
                message : "invalid username or password"

            });
        }
        return res.json(200,{
            message : "sign in successfull , here is your tocken .. please keep it safe",
            data : {
                token : jwt.sign(user.toJSON(),process.env.JWT_KEY,{expiresIn : '100000'})
            }
        })
    } catch(err){
        return res.json(200,{
            message : "internal server error"
        });
    }
    
}