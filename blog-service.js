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
        (posts.length > 0) ? resolve(posts.filter(post => post.published)) : reject("no results returned");
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

/*
module.exports.getPostsByCategory= function(category){
  return new Promise((resolve, reject) => {
      const categoryPosts = posts.filter((post) => {
          return post.category == category;
      })

      categoryPosts.length > 0 ? resolve(categoryPosts) : reject("no results returned");
  })
}
*/


  module.exports.getPostsByCategory = (id) => {
    return new Promise((resolve, reject) => {
      var categoryPosts = []
      for(let i = 0; i < posts.length; i++) {
        if (posts[i].category == id) {
          categoryPosts.push(posts[i])
        }
      }
      if (categoryPosts) {
        resolve(categoryPosts)
      } else {
        reject("Posts not found for this category!")
      }
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

module.exports.getPostById = (id) => {
    return new Promise((resolve, reject) => {
      for(let i = 0; i < posts.length; i++) {
        var post;
        if (posts[i].id == id) {
          post = posts[i]
        }
      }
  
      if (post) {
        resolve(post)
      } else {
        reject("Post not found!")
      }
    })
  }

  module.exports.getPublishedPostsByCategory(category) = function(){
    return new Promise((resolve,reject) =>{
       
        if(post.published === true && post.category == category) {
            post.published = false;
        } else post.published = true;

        (posts.length > 0) ? resolve(posts.filter(post => post.published)) : reject("no results returned");

    });
  }
