var path = require("path");
const fs = require("fs");

let posts = [];
let categories = [];

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/posts.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                posts = JSON.parse(data);

                fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        categories = JSON.parse(data);
                        resolve();
                    }
                });
            }
        });
    });
}



module.exports.getAllPosts = function(){
    return new Promise((resolve,reject)=>{
        (posts.length > 0 ) ? resolve(posts) : reject("no results returned"); 
    });
}

module.exports.getPublishedPosts = function(){
    return new Promise((resolve,reject)=>{
        let filteredPosts = posts.filter(post => post.published);
        (filteredPosts.length > 0) ? resolve(filteredPosts) : reject("no results returned");
    });
}

module.exports.getCategories = function(){
    return new Promise((resolve,reject)=>{
        (categories.length > 0 ) ? resolve(categories) : reject("no results returned"); 
    });
}

// Add post
module.exports.addPost=function(postData){
    return new Promise((resolve, reject) => {
        if(postData.published === undefined) {
            postData.published = false;
        } else postData.published = true;
        

        postData.id = posts.length + 1;

        posts.push(postData);

        resolve(postData);
    })
}


module.exports.getPostsByCategory= function(category){
  return new Promise((resolve, reject) => {
      const categoryPosts = posts.filter((post) => {
          return post.category == category;
      })

      categoryPosts.length > 0 ? resolve(categoryPosts) : reject("no results returned");
  })
}


module.exports.getPostsByMinDate = function(minDateStr){
  return new Promise((resolve, reject) => {
      const minDatePosts = posts.filter((post) => {
          return new Date(post.postDate) >= new Date(minDateStr);
      })

      minDatePosts.length > 0 ? resolve(minDatePosts) : reject("no results returned");
  })
}

/*
module.exports.getPostById=function(id){
  return new Promise((resolve, reject) => {
      const idPosts = posts.filter((post) => {
          return post.id == id;
      })

      idPosts.length > 0 ? resolve(idPosts) : reject("no results returned");
  })
}
*/

module.exports.getPostById = function(id){
    return new Promise((resolve,reject)=>{
        let foundPost = posts.find(post => post.id == id);

        if(foundPost){
            resolve(foundPost);
        }else{
            reject("no result returned");
        }
    });
}

module.exports.getPublishedPostsByCategory = function (category) {
    return new Promise(function (resolve, reject) {
        var publishedPostsByCategory = [];
        for (let i = 0; i < posts.length; i++) {

            if (posts[i].published == true && posts[i].category == category) {
                publishedPostsByCategory.push(posts[i]);
            }
        }

        if (publishedPostsByCategory.length == 0) {
            reject("query returned 0 results");
            return;
        }
        resolve(publishedPostsByCategory);

        
    });
}
