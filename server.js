const express=require("express");
const connectDB=require("./config/dbConnect");
const app=express();
const PORT=process.env.PORT || 5000
const shorturl=require("./models/shortUrls");

app.set("view engine","ejs");

app.use(express.urlencoded({extended:false}));
app.listen((PORT),async()=>{
    await(connectDB());
    console.log(`listening on ${PORT}`);
})


app.get("/",async(req,res)=>{
    const shortURLS= await shorturl.find();
   res.render("index",{shortURLS:shortURLS});
})

app.post("/shortUrls",async(req,res)=>{
    await shorturl.create({
        full:req.body.fullURL
    });
    res.redirect("/");
})

app.get("/:shortUri",async(req,res)=>{
   const short=await shorturl.findOne({short:req.params.shortUri});

   if(short==null){
    res.sendStatus(404);
   }
   else{
    let click=short.clicks+1;
    await short.updateOne({clicks:click});
    res.redirect(short.full);
   }
})

app.get("/editurl/:id",async(req,res)=>{
    const id=req.params.id;
    const oldurl= await shorturl.findOne({_id:id});

    res.render("editurl",{oldurl:oldurl.full,id:id});
    
})

app.post("/updateurl/:id",async(req,res)=>{
    const id=req.params.id;
    const newurl=req.body.fullURL;
    await shorturl.findByIdAndUpdate({_id:id},{full:newurl});
    res.redirect("/");
})

app.get("/deleteurl/:id",async(req,res)=>{
    const id=req.params.id;

    const result=await shorturl.deleteOne({_id:id});
    res.redirect("/");

})