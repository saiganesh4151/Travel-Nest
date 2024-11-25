const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");

const setsession={
    secret : "pheonix",
    resave : false,
    saveUninitialized : true
};
app.use(session(setsession));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.errmsg=req.flash('error');
    res.locals.msg=req.flash('success');
    next();
})


app.get("/register",(req,res)=>{
    let {name ="anonymos"}=req.query;
    req.session.names=name;
    // console.log(req.session.names);
    // res.send(name);
    if(req.session.names=="anonymos")
        {
            req.flash("error","user not regitered");
        }
        else
        {
            req.flash("success","user registered succesfully");

        }
    res.redirect('/hello');
})

// app.get("/hello",(req,res)=>{
//     // console.log(req.flash("success"));
//     res.render("hello.ejs",{ name : req.session.names , msg : req.flash('success')});
// })

app.get("/hello",(req,res)=>{
    // console.log(req.flash("success"));
    res.render("hello.ejs",{ name : req.session.names});
})

// app.get("/groot",(req,res)=>{
//     if(req.session.count)
//     {
//         req.session.count++;
//     }
//     else
//     { 
//         req.session.count =1;
//     }
//     res.send(`request is ${req.session.count}`);
// })

app.listen(3000,()=>{
    console.log("listening to port 3000 -> http://localhost:3000/");
})