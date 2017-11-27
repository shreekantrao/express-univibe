const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = global.Promise;
// const bcrypt = require('bcryptjs');
// const config = require('../config/keys');

// User Schema
const CoursesSchema = mongoose.Schema({

  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '/assets/build/images/course.jpg' },
  connections_total: { type: Number, default: 0 },
  connections: [{
    user_id:      { type: String, default: '' },
    name:         { type: String, default: '' },
    profile_line: { type: String, default: '' },
    profile_pic:  { type: String, default: '' },
    batch:        { type: Number, default: '' },
    course:       { type: String, default: '' },
    gender:       { type: Number }
  }],
  status: { type: Boolean, default: true },
  created: { type: Date, default: Date.now }

});

const courses = module.exports = mongoose.model('Courses', CoursesSchema);

// module.exports.getUserById = function(id, callback){
//   User.findById(id, callback);
// }

module.exports.createNewCourse = function(courseData){
  var data = new courses(courseData);
  return data.save()
    .then(item => ({ success: true, msg: "item saved to database", data: data }))
    .catch(err => ({ success: false, msg: "unable to save to database" }));
}

module.exports.checkCourseNameExists = (name, slug, course_id)=>{
  // console.log('model -',name);
  // console.log('model -',slug);
  course_id = ObjectId(course_id);
  return Promise.all([
    courses.count({"name": name, "_id": {$ne: course_id}}).then(count => ({ name: count })),
    courses.count({"slug": slug, "_id": {$ne: course_id}}).then(count => ({ slug: count }))
  ]).then(result => result.reduce((acc,curr) =>
    Object.assign(acc,curr),{})
  );
}

module.exports.savecourse = (courseData)=>{
    console.log('model -',courseData);
    // return Promise.all([
      return courses.findById(courseData._id)
      .then(course => {
        console.log('in then', course);
        course.name = courseData.name;
        course.slug = courseData.slug;
        course.description = (courseData.description==='')?'':courseData.description;
        course.image = (courseData.image==='')?course.image:courseData.image;
        course.status = courseData.status;

        return course.save()
        .then(item => ({ success: true, msg: "Item saved", data: course }))
        .catch(err => ({ success: false, msg: "Unable to save" }));

      }).catch(err => ({ success: false, msg: "Unable to find" }));
    // ]).then(result => result.reduce((acc,curr) =>
    //   Object.assign(acc,curr),{})
    // );
}

module.exports.getCourseList = (pageSize, skip, sortby, orderby, query)=>{
  
    // console.log("limit- "+pageSize);
    // console.log("skip- "+skip);
    // console.log("sort- "+sortby);
    // console.log("order- "+orderby);
    // console.log("query- "+JSON.stringify(query));

    return Promise.all([
      courses.count().then(count => ({ total: count })),
      courses.count(query).then(count => ({ searched_total: count })),
      courses.find(query)
        .sort([[sortby, orderby]])
        .skip(skip)
        .limit(pageSize)
        .then( data => ({ rows: data }))
    ]).then(result => result.reduce((acc,curr) =>
      Object.assign(acc,curr),{})
    );    
}

// module.exports.deleteUserById = (req)=>{
//   id = req.query.userID;
//   User.findByIdAndRemove(id, function (err, res){
//     if(err) { throw err; }
//     if( res.result.n === 0 ) { console.log("Record not found"); }
//     console.log("Deleted successfully.");
//   });
// }

// module.exports.addUser = function(newUser, callback){
//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(newUser.password, salt, (err, hash) => {
//       if(err) throw err;
//       newUser.password = hash;
//       newUser.save(callback);
//     });
//   });
// }

// module.exports.comparePassword = function(candidatePassword, hash, callback){
//   bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
//     if(err) throw err;
//     callback(null, isMatch);
//   });
// }
