import express from 'express'
const app = express();
import cors from 'cors'
import {v4 as uuidv4} from 'uuid'
import multer from 'multer'
import path from 'path'
import fs from "fs"
import { exec } from 'child_process';// watchout

const port = 8000;

//multer middleware

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads")
    },
    filename:function(req,file,cb){
        
        cb(null,file.fieldname + "-" + uuidv4() + path.extname(file.originalname))
    }
})


//multer configuration

const upload = multer({storage:storage})


app.use(cors({
    origin:["http://localhost:3000","http://localhost:5173"],
    credentials:true,

}))

app.use((req,res,next)=>{
    
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With,Content-Type,Accept"
    );
    
    next();
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/uploads",express.static("uploads"))

app.get("/",(req,res)=>{
    res.json({
        message:"Hello Yash ! Get a Job"
    })
})

app.post("/upload", upload.single('file'),(req,res)=>{
    const lessonId = uuidv4();
    const videoPath = req.file.path;
    const outputPath = `./uploads/courses/${lessonId}`
    const hlsPath = `${outputPath}/index.m3u8`

    console.log("hlsPath: ",hlsPath);
    console.log("reqfilePath : ",req.file.path)

    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath,{recursive:true})
    }

    //ffmpeg command
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

    exec(ffmpegCommand,(error,stdout,stderr)=>{
        if(error){
            console.log(`error : ${error}`)
            process.exit()
        }
        console.log(`stdout : ${stdout}`)
        console.log(`stderror : ${stderr}`)
        
        
            
        

        const videoUrl = `http://localhost:${port}/uploads/courses/${lessonId}/index.m3u8`

        res.json({
            message:"Video converted to HLS format",
            videoUrl:videoUrl,
            lessonId:lessonId
        })
    })

})



app.listen(port,()=>console.log(`http://localhost:${port}`))