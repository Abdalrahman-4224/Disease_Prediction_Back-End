const express =require('express');
const path =require('path');
const pcrypt =require('pcrypt');

const app=express();
app.set('view engine','ejs');

app.get("/",(req,res)=>{
    res.render("login");
});
app.get("/signup",(req,res)=>{
    res.render("signup");
})






const port =3000;
app.listen(port,()=>{
    console.log(`server running on port: $(port}`);
})