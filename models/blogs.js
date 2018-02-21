const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = global.Promise;

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

// Blog Schema
const BlogsSchema = mongoose.Schema({

  title: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  slug: { type: String, slug: "title", slug_padding_size: 4, unique: true, index: true },
  image: { type: String, default: '' },
  posted_on: { type: Date, default: Date.now },
  posted_by: {
    user_id:      { type: String, required: true, index: true },
    name:         { type: String, required: true },
    profile_line: { type: String, default: '' },
    profile_pic:  { type: String, default: '' },
    batch:        { type: Number, default: '' },
    course:       { type: String, default: '' },
    gender:       { type: Number, default: 3 }   // 1= Male, 2= Femail, 3= Other
  },
  like_count: { type: Number, default: 0 },
  comment_count: { type: Number, default: 0 },
  tag: { type: String, default: '' },
  publish: { type: Boolean, default: true }   // true , false
});

// const blogs = module.exports = mongoose.model('blogs', BlogsSchema);

// To make db name dynamic
var establishedModels = {};
function createModelForName(name) {
  if (!(name in establishedModels)) {
    // var Any = new Schema({ any: Schema.Types.Mixed });
    establishedModels[name] = mongoose.model(name, BlogsSchema);
  }
  return establishedModels[name];
}
const collection = 'blogs';


module.exports.getBlogsList = (pageSize, skip, sortby, orderby, query, db_slug) => {
  if (!db_slug) return ({ success: false });
  let db_name = db_slug + '-' + collection;
  let blogs = createModelForName(db_name); // Create the db model.

  // console.log("limit- "+pageSize);
  // console.log("skip- "+skip);
  // console.log("sort- "+sortby);
  // console.log("order- "+orderby);
  // console.log("query- "+JSON.stringify(query));

  return Promise.all([
    blogs.count().then(count => ({ total: count })),
    blogs.count(query).then(count => ({ searched_total: count })),
    blogs.find(query)
      .sort([[sortby, orderby]])
      .skip(skip)
      .limit(pageSize)
      .then(data => ({ rows: data }))
  ]).then(result => result.reduce((acc, curr) =>
    Object.assign(acc, curr), {})
  );
}

module.exports.changeState = (slug, state, db_slug) => {
  if (!db_slug) return ({ success: false });
  let db_name = db_slug + '-' + collection;
  let blogs = createModelForName(db_name); // Create the db model.

  // return blogs.update({ "slugg": slug }, { $set: { "publish": state } })
  return new Promise((resolve, reject) => {
    blogs.findOneAndUpdate({ "slug": slug }, { "publish": state }, { new: true }, function (err, blog) {
      if (err) return reject(err);
      if (!blog) return reject('Unable to find.');

      return resolve(blog);
    })
  }).then(item => ({ success: true, msg: 'Updated successfully' }))
    .catch(err => ({ success: false, msg: 'Unable to process' }));
}

module.exports.deleteBlogs = (slug, db_slug) => {
  if (!db_slug) return ({ success: false });
  let db_name = db_slug + '-' + collection;
  let blogs = createModelForName(db_name); // Create the db model.

  // return blogs.find({ "slug": slug }).remove()
  return new Promise((resolve, reject) => {
    blogs.findOneAndRemove({ "slug": slug }, function (err, blog) {
      if (err) return reject(err);
      if (!blog) return reject('Unable to find.');

      return resolve(blog);
    })
  }).then(item => ({ success: true, msg: 'Deleted successfully' }))
    .catch(err => ({ success: false, msg: 'Unable to process' }));
}

module.exports.createNewBlogs = function(blogsData){
  var data = new blogs(blogsData);
  return data.save()
    .then(item => ({ success: true, msg: "item saved to database", data: data }))
    .catch(err => ({ success: false, msg: "unable to save to database" }));
}



module.exports.saveblogs = (blogsData)=>{
    console.log('model -',blogsData);
    // return Promise.all([
      return blogs.findById(blogsData._id)
      .then(blogs => {
        console.log('in then', blogs);
        blogs.name = blogsData.name;
        blogs.slug = blogsData.slug;
        blogs.description = (blogsData.description==='')?'':blogsData.description;
        blogs.image = (blogsData.image==='')?blogs.image:blogsData.image;
        blogs.blogs = blogsData.blogs;

        return blogs.save()
        .then(item => ({ success: true, msg: "Item saved", data: blogs }))
        .catch(err => ({ success: false, msg: "Unable to save" }));

      }).catch(err => ({ success: false, msg: "Unable to find" }));
}

