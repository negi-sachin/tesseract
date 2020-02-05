const  express=require('express')
const app=express()
const fs=require('fs')
const multer=require('multer')
// const { TesseractWorker }=require('tesseract.js')
// const worker=new TesseractWorker();

const { createWorker } = require("tesseract.js");
const worker = new createWorker();

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const upload=multer({storage:storage}).single('avatar')
app.set('view engine','ejs')

app.get('/',(req,res)=>{
    res.render('index')
})

app.post('/upload',(req,res)=>{
    upload(req,res,err=>{
        console.log(req.file)
        fs.readfile(`./uploads/${req.file.originalname}`,(err,data)=>{
            if(err) {return console.log(err)}

            worker
                .recognize(data,'eng')
                .progress(progess=>{
                    console.log(progess)
                    res.send('Loading......')
                })
                .then(res=>{
                    res.send(res.text)
                })
                .finally(worker.terminate())
        })
    })
})
const PORT=3000||Process.env.port
app.listen(PORT,()=>console.log(`Server runnning at ${PORT}`))