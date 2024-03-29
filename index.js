const express = require("express");
const mongoose = require('mongoose');
const bodyParser=require("body-parser")
const blogsModel =require("./models/blogs")
mongoose.connect("mongodb+srv://root:10xacademy@cluster0.kzvn5vw.mongodb.net/?retryWrites=true&w=majority", () => {
  console.log("successfully connected to db");
},
  (err) => {
    console.log(err);
  })
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blogs")

const cors = require("cors")
const app = express()
app.use(bodyParser.json())
app.use("/api/user", userRoutes)
app.use("/api/blogs", blogRoutes)
app.use(cors({
  origin: "*"
}))
app.get("/", async (req, res) => {
  res.json({
    message: "ok"
  })
})
app.get('/api/blog', async (req, res) => {
  try {
      const posts = await blogsModel.find();   
      res.status(200).json(posts);
  } catch (e) {
      console.log(e.message)
      res.status(400).json({
          message: e.message
      })
  }
})
app.get('/api/blog/:id', async (req, res) => {
  try {
      const post = await blogsModel.findOne({_id:req.params.id});   
      res.status(200).json(post);
      } catch (e) {
      console.log(e.message)
      res.status(400).json({
          message: e.message
      })
  }
})

app.listen(5000, () => console.log("The server is up at 5000 port"));

