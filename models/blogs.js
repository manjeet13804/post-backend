const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const addBlogsSchema = new Schema({
  category: {type:String},
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: {type:String},
  userid: { type: String },
  likes : {type :Number},
  like : { type: Array },
  comments :[{
         description:String,
          userids:String,
          userName:String,
          likes:Number,
          like:Array
  }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" } 
},{timestamps:true})       
const addBlogModel = mongoose.model("Blogs", addBlogsSchema);
module.exports = addBlogModel;