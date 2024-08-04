const mongoose=require('mongoose');
const connectDb=async()=>{
    try{
        mongoose.set('strictQuery',false);
        const conn=await mongoose.connect(process.env.mongo_UrI);
        console.log(`DB connected : ${conn.connection.host}`);
    }catch(err){
        console.log(err);
    }
    
}
module.exports=connectDb;