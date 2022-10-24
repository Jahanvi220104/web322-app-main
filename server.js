 /*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name:Jahanvi Jitendra Randhejiya Student ID:159298215 Date: 23rd october, 2022
*
*  Cyclic Web App URL: https://helpful-pear-school-uniform.cyclic.app/
*
*  GitHub Repository URL: https://github.com/Jahanvi220104/web322-app-main.git
* 
********************************************************************************/ 
const express = require('express');
const blogData = require("./blog-service");
const path = require("path");
const app = express();


const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

//libraries
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
   cloud_name: 'dgbjmbkxr',
   api_key: '764431573664668',
   api_secret: 'iKg_pblVfzbodEHRFHfZQOwSl1w',
   secure: true
});
//upload variable
const upload = multer();

// GET ABOUT
app.get('/', (req, res) => {
  res.redirect("/about");
});

//about
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"))
});

app.get('/blog-service', (req, res) => {
  service.getPublishedPosts().then(data => res.json(data)).catch(err => res.json(err));
})

app.get('/post/:id', (req, res) => {
  blogData.getPostById(req.params.value).then(data => res.send(data)).catch(err => res.json(`message: ${err}`));
})


app.get('/posts', (req, res) => {
  if (req.query.category) {
      blogData.getPostsByCategory(req.query.category).then(data => res.send(data)).catch(err => res.json(`message: ${err}`));
  } else if (req.query.minDate) {
      blogData.getPostsByMinDate(req.query.minDate).then(data => res.send(data)).catch(err => res.json(`message: ${err}`));
  } else {
      blogData.getAllPosts().then(data => res.send(data)).catch(err => res.json(`message: ${err}`));
  }
})

//GET CATEGORIES
app.get('/categories', (req,res)=>{
  blogData.getCategories().then((data=>{
      res.json(data);
  })).catch(err=>{
      res.json({message: err});
  });
});

 
app.get('/posts/add', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/addPost.html'));
})



// Adding POST routes
app.post('/posts/add', upload.single("featureImage"), (req, res) => {
  if(req.file){
      let streamUpload = (req) => {
          return new Promise((resolve, reject) => {
              let stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                      if (result) {
                          resolve(result);
                      } else {
                          reject(error);
                      }
                  }
              );
  
              streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
      };
  
      async function upload(req) {
          let result = await streamUpload(req);
          console.log(result);
          return result;
      }
  
      upload(req).then((uploaded)=>{
          processPost(uploaded.url);
      });
  } else {
      processPost("");
  }

  function processPost(imageUrl){
      req.body.featureImage = imageUrl;

      const postData = {
          "body": req.body.body,
          "title": req.body.title,
          "postDate": new Date().toISOString().split('T')[0],
          "category": req.body.category,
          "featureImage": imageUrl,
          "published": req.body.published,
      }

      blogData.addPost(postData).then(data => res.redirect('/posts')).catch(err => res.json(`message: ${err}`));
  }

})

blogData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { 
      console.log('server listening on: ' + HTTP_PORT); 
  });
}).catch((err)=>{
  console.log(err);
})
