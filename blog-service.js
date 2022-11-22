const Sequelize = require('sequelize');

var sequelize = new Sequelize('epbkhlvf', 'epbkhlvf', '7L_ajR0P-E4zk-Vx9HW1rQBhm8BfkQ3K', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

//post model
var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});

//category model
var Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: "category"});

module.exports.initialize = () => {
    return new Promise((resolve,reject) => {
        sequelize.sync()
        .then(resolve('database synced'))
        .catch(reject('unable to sync the database'));
    })
};


/*
var BlogEntry = sequelize.define('BlogEntry', {
    title: Sequelize.STRING,  // entry title
    author: Sequelize.STRING, // author of the entry
    entry: Sequelize.TEXT, // main text for the entry
    views: Sequelize.INTEGER, // number of views
    postDate: Sequelize.DATE // Date the entry was posted
});
*/


module.exports.getAllPosts = () => {
    return new Promise((resolve, reject) => {
        Post
          .findAll()
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject("no results returned");
          });
      });
};

module.exports.getPostsByCategory= function(category){
    return new Promise((resolve,reject) => {
        Post.findAll({
            where:{
                categoryNum: category
            }
        })
        .then(resolve(Post.findAll({ where: {category: category }})))
        .catch(reject('no results returned'))
    })

};

module.exports.getPostsByMinDate = function(minDateStr){
    const { gte } = Sequelize.Op;
    return new Promise((resolve, reject) => {
      Post
        .findAll({
          where: {
            postDate: {
              [gte]: new Date(minDateStr),
            },
          },
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject("no results returned");
        });
    });

};

module.exports.getPostById = function(id){
    return new Promise((resolve, reject) => {
        Post
          .findAll({
            where: {
              id: id,
            },
          })
          .then((data) => {
            resolve(data[0]);
          })
          .catch((err) => {
            reject("no results returned");
          });
      });
};

// Add post
module.exports.addPost=function(postData){
    return new Promise((resolve, reject) => {
        postData.published = postData.published ? true : false;
    
        for (var title in postData) {
          if (postData.title == "") postData.title = null;
        }
    
        postData.postDate = new Date();
    
        Post
          .create(postData)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject("unable to create post");
          });
      });
};

module.exports.getPublishedPosts = function(){
    return new Promise((resolve, reject) => {
        Post.findAll({
          where: { published: true },
        })
          .then((data) => {
            resolve(data);
          })
          .catch(() => {
            reject("no results returned");
          });
      });
};

module.exports.getPublishedPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
          where: { category: category, published: true },
        })
          .then((data) => {
            resolve(data);
          })
          .catch(() => {
            reject("no results returned");
          });
      });
};

//
module.exports.getCategories = () => {
    return new Promise((resolve, reject) => {
      Category.findAll()
        .then((data) => {
          resolve(data);
        })
        .catch(() => {
          reject("no results returned");
        });
    });
  };

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

module.exports.addCategory = function (categoryData) {
    return new Promise((resolve, reject) => {
      for (var prop in categoryData) {
        if (categoryData[prop] == "") categoryData[prop] = null;
      }
  
      Category.create(categoryData)
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject("unable to create category");
        });
    });
  };

module.exports.deletePostById = function (id) {
    return new Promise((resolve, reject) => {
      Post.destroy({
        where: {
          id: id,
        },
      })
        .then((data) => {
          resolve();
        })
        .catch(() => {
          reject("unable to delete post");
        });
    });
  };


module.exports.deleteCategoryById = function (id) {
    return new Promise((resolve, reject) => {
        Category.destroy({
            where: {
                id: id
            }
        }).then( data => {
            resolve();
        }).catch(() => {
            reject("unable to delete category");
        });
    });
}



