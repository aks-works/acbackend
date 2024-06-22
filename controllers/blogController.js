const service=require("../services/blogServices")

exports.showAllBlogs=async(req,res,next)=>{
    try{
        const posts=await service.showAllBlogs();
        res.status(200).json({posts});
    }
    catch(err){
        next(err);
    }
};

exports.showBlogByauthor=async(req,res,next)=>{
    try{
       
        const query={user:req.query.authorId}
        const post=await service.showBlogByauthor(query);
        res.status(200).json({post});
    }catch(err){
        next(err)
    }
}
exports.singleBlog=async(req,res,next)=>{
    try {
        const id = req.params.id;
        const post = await service.singleBlog(id);
        res.status(200).json({ post });
      } catch (err) {
        next(err);
      }
}

exports.createBlog=async(req,res,next)=>{
    try{
        const user=req.userId;
        const{title,body}=req.body
        await service.createBlog(
            title,
            body,
            user
        )
        res.status(201).json({message:"Done"})
    }catch(err){
        next(err)
    }
}
exports.editBlog=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const user=req.userId
        const{title,body}=req.body
        await service.editBlog(
            id,title,body,user
        );
        res.status(201).json({message:"Done"})
    }catch(err){
        next(err)
    }
}
exports.deleteBlog=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const user=req.userId
        await service.deleteBlog(id,user)
        res.status(201).json({message:"Done"})
    }catch(err){
        next(err)
    }
}