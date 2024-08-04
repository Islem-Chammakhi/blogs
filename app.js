require('dotenv').config();//to import our envire variables
//creating express app
const express=require("express");
const app=express();

//to create ejs layouts we make this import 
const expressLayout=require('express-ejs-layouts');
//template Engine using middleware
app.use(expressLayout);
//set the view engine
app.set('view engine','ejs');
//par default the views are in the views folder 
app.set('layout','./layouts/main');

//hold the css and images etc
app.use(express.static('public'));

//connection to the db
connectDb=require('./server/config/db');

//coockes
const cookieParser=require('cookie-parser');//grab cookie and save etc.... store our session and ligin 
const session = require('express-session');
const MongoStore = require('connect-mongo');//stocke les données de session dans MongoDB pour persister les sessions entre les redémarrages du serveur et les différents serveurs.

const PORT=5000||procces.env.PORT //default port number when publish the application

connectDb();

//to read data from views 
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//add cookie parser as middleware
app.use(cookieParser());// Ce middleware est ajouté à votre application Express. Il analyse les cookies présents dans les requêtes entrantes et les rend accessibles via req.cookies.
//for sessions
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    store:MongoStore.create({
        mongoUrl:process.env.mongo_UrI
    })
}))
const mainRoutes = require('./server/routes/main');
const adminRoutes = require('./server/routes/admin');

//routes
app.use('/admin',adminRoutes);
app.use('/',mainRoutes);

//app.use('/register',require('./server/routes/Register'));


//listen request
app.listen(PORT,()=>{
    console.log(` app listening on port ${PORT}`);
    
})