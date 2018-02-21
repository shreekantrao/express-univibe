const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = global.Promise;

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

// Course Schema
const CoursesSchema = mongoose.Schema({

  name: { type: String, required: true, unique: true, index: true },
  slug: { type: String, slug: "name", slug_padding_size: 2, unique: true, index: true },
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

// const courses = module.exports = mongoose.model('Courses', CoursesSchema);

// To make db name dynamic
var establishedModels = {};
function createModelForName(name) {
  if (!(name in establishedModels)) {
    // var Any = new Schema({ any: Schema.Types.Mixed });
    establishedModels[name] = mongoose.model(name, CoursesSchema);
  }
  return establishedModels[name];
}
const collection = 'courses';

module.exports.getCourseList = (pageSize, skip, sortby, orderby, query, db_slug) => {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let courses = createModelForName(db_name); // Create the db model.

  // console.log("limit- "+pageSize);
  // console.log("skip- "+skip);
  // console.log("sort- "+sortby);
  // console.log("order- "+orderby);
  // console.log("query- "+JSON.stringify(query));

  return Promise.all([
    courses.count().then(count => ({ total: count })),
    courses.count(query).then(count => ({ searched_total: count })),
    courses.find(query, { _id: 0 })
      .sort([[sortby, orderby]])
      .skip(skip)
      .limit(pageSize)
      .then(data => ({ rows: data }))
  ]).then(result => result.reduce((acc, curr) =>
    Object.assign(acc, curr), {})
  );
}

module.exports.checkCourseNameExists = (name, slug, db_slug) => {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let courses = createModelForName(db_name); // Create the db model.
  // console.log('model -',name);
  // console.log('model -',slug);
  // course_id = ObjectId(course_id);

  let query = {};
  if (name) query['name'] = name;
  if (slug) query['slug'] = { $ne: slug };
  // console.log('query', query);
  return courses.count(query)
    .then(count => ({ success: true, name: count }))
    .catch(err => ({ success: false, error: err }));

  // return Promise.all([
  //   courses.count({"name": name, "_id": {$ne: course_id}}).then(count => ({ name: count })),
  //   courses.count({"slug": slug, "_id": {$ne: course_id}}).then(count => ({ slug: count }))
  // ]).then(result => result.reduce((acc,curr) =>
  //   Object.assign(acc,curr),{})
  // );
}

module.exports.createNewCourse = function (courseData, db_slug) {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let courses = createModelForName(db_name); // Create the db model.

  var data = new courses(courseData);
  return data.save()
    .then(item => ({ success: true, msg: "item saved to database", data: item }))
    .catch(err => ({ success: false, msg: "unable to save to database", data: err }));
}

module.exports.updateCourse = (courseData, db_slug) => {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let courses = createModelForName(db_name); // Create the db model.

  // console.log('form data -',courseData);

  let query = { "slug": courseData.slug };
  let data = {
    name: courseData.name,
    description: courseData.description,
    status: courseData.status
  }
  return new Promise((resolve, reject) => {
    courses.findOneAndUpdate(query, data, { new: true }, function (err, course) {
      // console.log('on error', err);
      if (err) return reject(err);
      // console.log('db data 1', course);
      if (!course) return reject('Unable to find.');

      return resolve(course);
    })
  }).then(item => ({ success: true, msg: "Course updated successfully.", data: item }))
    .catch(err => ({ success: false, msg: "Unable to update", data: err }));

}

module.exports.deleteCourse = (slug, db_slug) => {
  if (!db_slug) return ({ success: false });
  let db_name = db_slug + '-' + collection;
  let courses = createModelForName(db_name);

  return new Promise((resolve, reject) => {
    courses.findOneAndRemove({ slug: slug }, (err, course) => {
      // console.log('on error', err);
      if (err) return reject(err);
      // console.log('db data 1', course);
      if (!course) return reject('Unable to find.');

      return resolve(course);
    })
  }).then(item => ({ success: true, msg: 'Course deleted.' }))
    .catch(err => ({ success: false, msg: 'Unable to delete.', data: err }));
}

module.exports.getDropDownCourseList = function (db_slug) {
  // console.log('course model', db_slug);
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let courses = createModelForName(db_name); // Create the db model.
  
  // var data = new colleges(collegeData);
  return courses.find({"status": true}, { "_id": 0, "name": 1, "slug": 1 })
    .then(courses => ({ success: true, msg: "Success", courses: courses }))
    .catch(err => ({ success: false, msg: "unable to get year", error: err }));
}

