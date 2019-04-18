const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');

// Bring Image Model
const Image = require('./models/Image');

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));



// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    const imagename= file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, imagename);
  }
}); 

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'))

app.get('/', (req, res) => res.render('index'));


app.get('/images', (req, res) => {
  Image.find()
    .then(
      (images) => {
        res.render('images', {images:images});
      }
    )
    .catch(err => res.status(404).json({ noimagesfound: 'No images found'}));
});

app.post('/upload', (req, res) => {

  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {

        const newImage = new Image({
          title: req.body.title,
          description: req.body.description,
          path: req.file.filename
          });
        
          newImage.save();

        res.render('index', {
          filename: `${req.file.filename}`,
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });

  
  

});

app.get('/all', (req, res) => 
  res.render('index', {

  })
);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));