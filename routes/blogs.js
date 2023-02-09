const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const blogsModel = require('../models/blogs')
const userModel = require('../models/user')
var jwt = require('jsonwebtoken');
secret = "BLOGS"
const cors = require("cors")
router.use(bodyParser.json())
router.use(cors({
    origin: "*"
}))

router.use('/', (req, res, next) => {

    if (req.headers.authorization) {

        const token = req.headers.authorization.split("BLOGS ")[1];
        try {
            jwt.verify(token, secret, async function (err, decoded) {
                if (err) {
                    res.status(400).json(err.message)
                }
                console.log(decoded)
                const user = await userModel.findOne({ _id: decoded.data });
                // console.log(user)
                req.user = user.email;            // which user has posted data.  ..............
                // console.log(req.user)
                next();
            });
        }
        catch (e) {
            res.status(400).json(e.message)
        }
    }
    else {
        res.status(400).json({ message: "user invalid" })
    }

})



router.post('/', async (req, res) => {

    console.log(req.body)
    try {
        const blog = await blogsModel.create({
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            userid: req.user,
            category: req.body.category,
            likes: 0
        })
        res.status(200).json({
            message: "success",
            blog
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message

        })
    }
})
router.put("/like/:blogid/:userid", async (req, res) => {
    const blog = await blogsModel.findOne({ _id: req.params.blogid });
    if (req.body.operation) {
        if (blog.like.includes(req.user)) { }
        else {
            blog.like.push(req.user);
            blog.likes++
            await blog.save();
        }
    }
    else {
        const newlike = blog.like.filter(lik => lik != req.user)
        blog.like = newlike
        blog.likes--
        await blog.save();
    }
    res.send("success")
})

router.put("/addcomment/:userid/:blogid", async (req, res) => {
    try {
        const comment = {
            description: req.body.val,
            userids: req.user,
            userName: req.body.userName
        }
        const blog = await blogsModel.findOneAndUpdate({ _id: req.params.blogid },
            { $push: { comments: comment } })
        console.log(blog, comment)
        await blog.save()
        res.status(200).json({
            message: "success",
            comment
        })
    } catch (err) {
        console.log(err)
    }
})

router.put("/likecomment/:blogid/:commentid", async (req, res) => {
    try {
        const blog = await blogsModel.findOne({ _id: req.params.blogid });
        const comment = blog.comments.filter(obj=>obj._id==req.body.commentid)
        console.log(comment[0].like)
        if(req.body.operation){
            if(comment[0].like.includes(req.user)) {}
            else{
            comment[0].like.push(req.user);
            console.log(comment)
            blog.comments.map(comm=>{
                if(comm._id==req.body.commentid){
                    comm=comment
                }
                return comm
            })
            await blog.save();
            }
        }
        else{
           const newlike=  comment[0].like.filter(lik=>lik!=req.user)
           blog.comments.map(comm=>{
            if(comm._id==req.body.commentid){
                comm.like=newlike
            }
            return comm
        })
        //    console.log(newlike)
            await blog.save();
        }
        res.send("success")
    }
    catch (err) {
        console.log(err)
    }
})


router.get("/profile", async (req,res)=>{
    try{

        const user = await userModel.findOne({email:req.user})
        res.status(200).json({
            message:"success",
           user//Image: user//.image.data
        })
    }
    catch(err){
        console.log(err)
    }

})
module.exports = router