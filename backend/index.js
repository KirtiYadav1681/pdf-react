const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use('/files',express.static("files"));

// mongodb connection
const mongoose = require('mongoose');
const mongoUrl = 'mongodb://localhost:27017/quantivepdf';
mongoose.connect(mongoUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database');
});

//multer
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './files')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() 
    cb(null, uniqueSuffix+file.originalname)
  }
})

const upload = multer({ storage: storage });

require("./pdfDetails");
const PdfSchema = mongoose.model('PdfDetails');

// Api
app.post('/upload-files',upload.single('file'), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const fileName = req.file.filename;
  try{
    await PdfSchema.create({title: title,pdf:fileName});
    res.send({status:'OK'});
  }
  catch(err){
    res.json({status:err})
  }
})

app.get('/get-files',async(req,res) =>{
  try {
    PdfSchema.find({}).then((data) =>{
      res.send({status:"OK", data:data})
    })
  } catch (error) {
    res.send({status:"ERROR", error})
  }
})

app.get('/', (req, res) => {
    res.send('Hi');
})

app.listen(5000,()=>{
    console.log("Server successfully running on port 5000");
})