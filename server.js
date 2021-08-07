const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors')
app.use(cors());
const port = process.env.port || 4000;
const multer  = require('multer')
const fileUpload = require('express-fileupload');
app.use(fileUpload({
    useTempFiles : true,
    limits: { fileSize: 50 * 1024 * 1024 },
}));


// //destination
// const storage =  multer.diskStorage({
//     //destination for file
//     destination:(req,file,cb)=>{
//         cb(null,'./public/files/upload')
//     },
//     //filename
//     filename: (req,file,cb)=>{
//         cb(null,Date.now()+file.originalname)
//     }
// });
// const upload = multer({
//     storage:storage,
   
// });

app.get('/',(req,res)=>{
    res.send('server working...')
});



const { MongoClient, ObjectId } = require('mongodb');
const uri ="mongodb+srv://creative:bkhfJk7lNiaYtupr@cluster0.okztc.mongodb.net/creative-agency?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
     const orderCollection =client.db("creative-agency").collection("orders");
     const reviewCollection =client.db("creative-agency").collection("review");
     const serviceCollection =client.db("creative-agency").collection("service");
     const massageCollection =client.db("creative-agency").collection("massage");
     
    app.post('/order',(req,res)=>{
        const file = req.files.file;
        const fileName = file.name;
        const img =  new Date().getTime() +'_'+fileName;

            const name = req.body.name;
            const email = req.body.email;
            const details = req.body.details;
            const category = req.body.category;
            const link = req.body.link;
            const status = "pending";
            const newImg = file.data;
            const encImg = newImg.toString('base64');
            const userId = new Date().getTime();
        const image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        }
    const allData = {name,email,details,category,img,userId,link,status}

    orderCollection.insertOne(allData)
    .then(result => {
        res.send(result.insertedCount > 0);
        console.log('added')
    })

});
// addservice
    app.post('/addservice',(req,res)=>{
        const file = req.files.file;
        const fileName = file.name;
        const img =  new Date().getTime() +'_'+fileName;

            const name = req.body.name;
            const details = req.body.details;
            const link = req.body.link;
            const newImg = file.data;
            const encImg = newImg.toString('base64');
            const userId = new Date().getTime();
        const image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        }
    const service = {name,details,link,img,userId}

    serviceCollection.insertOne(service)
    .then(result => {
        res.send(result.insertedCount > 0);
        console.log(' service added ')
    })

});
    app.get('/orders',(req,res)=>{
        orderCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    });
    app.get('/service',(req,res)=>{
        serviceCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    });
//make review post api
    app.post("/review",(req,res)=>{
        const reviews = req.body;
        reviewCollection.insertOne(reviews)
        .then(result => {
            res.send(result.insertedCount > 0);
            console.log('review added')
        })
    });
    //make admin post api
    app.post("/makeadmin",(req,res)=>{
        const reviews = req.body;
        reviewCollection.insertOne(reviews)
        .then(result => {
            res.send(result.insertedCount > 0);
            console.log('admin added')
        })
    });
    //massage post api
    app.post("/massage",(req,res)=>{
        const massage = req.body;
        reviewCollection.insertOne(massage)
        .then(result => {
            res.send(result.insertedCount > 0);
            console.log('send  massage')
        })
    });
    //get revie
    app.get('/reviews',(req,res)=>{
        reviewCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    });
//get admin
    app.get('/admins',(req,res)=>{
        reviewCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    });
    app.patch('/update',(req,res)=>{
       const status=(req.body.info.ok)
        const id=(req.body.id)
        orderCollection.updateOne({_id:ObjectId(id)},{
            $set:{status:status}
        })
        .then(result => {
            console.log(result)
        })
    })     
     console.log('database connected')
});







app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })