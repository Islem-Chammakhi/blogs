const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const UserSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        hachedPassword:{
            type:String,
            required:true
        },

    }
);
module.exports=mongoose.model('User',UserSchema);
// the schema create automatically the table in the database !