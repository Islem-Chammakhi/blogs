const express =require('express');
const router=express.Router();
//import Schema/Model
const Post=require('../models/Post');


//routes


// *GET
// *Home
router.get("",async (req,res)=>{
    const locals ={
        title:"nodejs blog",}
    try{
        let perPage=10;
        let page=req.query.page||1;//retouner le numéro de la page courante 

        const data=await Post.aggregate([{$sort:{createdAt:-1}}])
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();

        const count=await Post.countDocuments();
        const nextPage=parseInt(page)+1
        const hasNextPage=nextPage<=Math.ceil(count/perPage);


    //when you visit  this route he will render this page 
        res.render('index',{locals,data,current:page,nextPage:hasNextPage ? nextPage :null});
    }catch(err){
        console.log(err);
    }


})
// *GET
// *post

//add data
router.get('/post/:id',async (req,res)=>{

    
    try{//retrieve data

        //grab the id
        let slug=req.params.id;
        
        const data =await Post.findById({_id:slug});
                const locals ={title:data.title,}
        res.render('post',{locals,data});
    }catch(err){
        console.log(err);
    }
})

// *Post
// *post search
router.post('/search',async(req,res)=>{
    try{
    const locals ={title:"search"};
    let searchTerm=req.body.searchTerm;
    const searchNoSpecialChar=searchTerm.replace(/[^a-zA-Z0-9]/g,"")
    const data= await Post.find(
        {
            $or:[
                {title:{$regex:new RegExp(searchNoSpecialChar,'i')}},
                {body:{$regex:new RegExp(searchNoSpecialChar,'i')}}

            ]
        }
    )
    res.render('search',{locals,data});
    }catch(err){
        console.log(err);
    }
})

/*function insertPostData(){

    Post.insertMany([
    {
        title:"building a blog1",
        body:"body text1"
        },
        {
            title:"building a blog2",
            body:"body text2"
        },
                ])
}
insertPostData(); */

//retrieve data

/*
    router.get("",async (req,res)=>{
   
    //when you visit  this route he will render this page 

})
*/

module.exports =router ;