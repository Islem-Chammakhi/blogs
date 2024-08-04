const express =require('express');
const router=express.Router();
//import Schema/Model
const Post=require('../models/Post');
const User=require('../models/User');
const adminLayout='../views/layouts/admin';
const bcrypt=require('bcrypt');//encrypt and decrypt the password !!  hachage des mots de passe
const jwt=require('jsonwebtoken');//Utilisé pour créer et vérifier des JSON Web Tokens, souvent pour l'authentification et l'autorisation.
const jwtSecret=process.env.jwtSecret;
 

//Chek Login
/*

La fonction authMiddleware est un middleware Express utilisé pour protéger des routes en vérifiant 
l'authentification d'un utilisateur via un jeton JWT (JSON Web Token).
 Voici une explication détaillée de ce que fait cette fonction et de son utilité :
*/
const authMiddleware=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        res.status(401).json({message:'unauthorized '});
    }
    else{
        try{
            
            /*fonction prend le jeton et la clé secrète (jwtSecret) pour vérifier que le jeton est 
            valide et n'a pas été modifié. */
            const decoded=jwt.verify(token,jwtSecret);
            req.userId=decoded.userId;
            next();
        }catch(err){
            res.status(401).json({message:'unauthorized '});
        }
    }
}



//Get
//login Page
router.get('/',async(req,res)=>{
    try{
        const locals={title:"Admin"};

        res.render('admin/index',{locals,layout:adminLayout});
    }catch(err){
        console.log(err);
    }

})

//Post
//login check
router.post('/', async (req, res) => {
    try {
        // 1. Extraction des informations d'identification de la requête
        const { username, password } = req.body;

        // 2. Recherche d'un utilisateur dans la base de données
        const user = await User.findOne({ username });

        // 3. Vérification si l'utilisateur existe
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }

        // 4. Comparaison du mot de passe fourni avec le mot de passe haché stocké
        const isPasswordValid = await bcrypt.compare(password, user.hachedPassword);

        // 5. Vérification si le mot de passe est correct
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Wrong password!' });
        }
        console.log("tout va bien!");
        // 6. Création d'un jeton JWT (JSON Web Token)
        /*Le jeton JWT (JSON Web Token) est utilisé pour authentifier les utilisateurs dans les requêtes ultérieures. Une fois qu'un utilisateur est connecté et que le jeton est généré,
         il peut être utilisé pour prouver l'identité de l'utilisateur sur d'autres requêtes sans avoir à se reconnecter. */
        const token = jwt.sign({ userId: user._id }, jwtSecret);

        // 7. Enregistrement du jeton dans les cookies de la réponse
        /* En stockant le jeton dans un cookie, vous le rendez accessible aux requêtes HTTP envoyées par le navigateur. L'option { httpOnly: true } empêche les scripts côté client (comme JavaScript) d'accéder à ce cookie.
         Cela réduit le risque d'attaques XSS (Cross-Site Scripting) où un attaquant pourrait tenter de voler le jeton à partir du client. */
        res.cookie('token', token, { httpOnly: true });

        // 8. Redirection vers le tableau de bord après connexion réussie
        res.redirect('/admin/dashboard');
    } catch (err) {
        // 9. Gestion des erreurs
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//get
//admin-Dashboard
router.get('/dashboard',authMiddleware,async(req,res)=>{
    try{
        const data=await Post.find();
        res.render('admin/dashboard',{title:'dashboard',data,layout:adminLayout});
    }catch(err){
        console.log(err);
    }

})

//post register
router.post('/register', async (req, res) => {
    try {
        //recevz les données 
        const { username, password } = req.body;
        //hacher le mdp
        const hachedPassword = await bcrypt.hash(password, 10);
        // Création de l'utilisateur
        const user = await User.create({ username, hachedPassword });

        // Réponse en cas de succès
        res.status(201).json({ message: 'User created', user });

    } catch (err) {
        // Gestion des erreurs spécifiques et générales
        console.error('Error during user registration:', err);

        // Erreur de contrainte d'unicité
        if (err.code === 11000) {
            return res.status(409).json({ message: 'User already in use' });
        }

        // Erreur interne du serveur
        res.status(500).json({ message: 'Internal server error' });
    }
});
 //Get 
 //Add blog 
 router.get('/add-post',authMiddleware,(req,res)=>{
    res.render('admin/add-post',{title:"Add Post",layout:adminLayout});
 })

  //Post
 //Add blog 
 router.post('/add-post',authMiddleware,async(req,res)=>{
  
    try{
        const newPost=new Post(
            {
                title:req.body.title,
                body:req.body.title
            }
        )
        await Post.create(newPost);
        res.redirect('dashboard');
    }catch(err){
        console.log(err);
    }

 })



module.exports =router ;