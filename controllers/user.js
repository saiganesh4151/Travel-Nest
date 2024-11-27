const User = require("../models/user");

module.exports.renderSignup=(req, res) => {
    res.render('../views/users/signup.ejs');
};

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let regUser = await User.register(newUser, password);
        console.log(regUser);
        req.login(regUser,(err)=>{
            if(err)
            {
                return next(err);
            }
            req.flash("success", "User Registered Successfully");
            res.redirect("/listing");
        })
    }
    catch (e) {
        // console.log(e.message);
        req.flash("error", e.message)
        res.redirect('/signup');
    }
};

module.exports.renderLogin= (req, res) => {
    res.render('../views/users/login.ejs');
};


module.exports.login=async (req, res) => {
    req.flash("success","You are Logged in successfully !");
    if(!res.locals.redirectUrl)
    {
        return res.redirect('/listing');
    }
    res.redirect(res.locals.redirectUrl);
};

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","Logged Out Successfully!");
        res.redirect('/listing');
    })
};