
const  express=require('express')
const app=express()
const fs=require('fs')
const multer=require('multer')
const  TesseractWorker =require('tesseract.js')
//const worker=new TesseractWorker();

// const { createWorker } = require("tesseract.js");
// const worker = new createWorker({
//   logger: m => console.log(m),
// });

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

app.get('/',(req,resp)=>{
    //res.render('index')
    TesseractWorker
                .recognize('./test.png','eng')
                
                .progress(progess=>{
                   
                    console.log(progess)
                    
                })
                .then(res=>{
                    resp.send(res.text)
                    console.log(res.text)
                })
})

app.post('/upload',(req,res)=>{
    upload(req,res,err=>{
        console.log(req.file)
        fs.readFile(`./uploads/${req.file.originalname}`,(err,data)=>{
            if(err) {return console.log(err)}

            TesseractWorker
                .recognize('./test.png','eng')
                .progress(progess=>{
                    console.log(progess)
                    res.send('Loading......')
                })
                .then(res=>{
                    res.send(res.text)
                })
                
        })
    })
})
const PORT=3000||Process.env.port
app.listen(PORT,()=>console.log(`Server runnning at ${PORT}`))



// Tesseract.recognize(filename)
//   .progress(function  (p) { console.log('progress', p)  })
//   .catch(err => console.error(err))
//   .then(function (result) {
//     console.log(result.text)
//     process.exit(0)
//   })
