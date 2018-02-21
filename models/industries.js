const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = global.Promise;

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

// Industries Schema
const IndustriesSchema = mongoose.Schema({

  name: { type: String, required: true, unique: true, index: true },
  slug: { type: String, slug: "name", slug_padding_size: 2, unique: true, index: true },
  description: { type: String, default: '' },
  image: { type: String, default: '/assets/build/images/industry.jpg' },
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

// const industries = module.exports = mongoose.model('Industries', IndustriesSchema);

// To make db name dynamic
var establishedModels = {};
function createModelForName(name) {
  if (!(name in establishedModels)) {
    // var Any = new Schema({ any: Schema.Types.Mixed });
    establishedModels[name] = mongoose.model(name, IndustriesSchema);
  }
  return establishedModels[name];
}
const collection = 'industries';


module.exports.getIndustryList = (pageSize, skip, sortby, orderby, query, db_slug) => {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let industries = createModelForName(db_name); // Create the db model.

  // console.log("limit- "+pageSize);
  // console.log("skip- "+skip);
  // console.log("sort- "+sortby);
  // console.log("order- "+orderby);
  // console.log("query- "+JSON.stringify(query));

  return Promise.all([
    industries.count().then(count => ({ total: count })),
    industries.count(query).then(count => ({ searched_total: count })),
    industries.find(query, { _id: 0 })
      .sort([[sortby, orderby]])
      .skip(skip)
      .limit(pageSize)
      .then(data => ({ rows: data }))
  ]).then(result => result.reduce((acc, curr) =>
    Object.assign(acc, curr), {})
  );
}

module.exports.checkIndustryNameExists = (name, slug, db_slug) => {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let industries = createModelForName(db_name); // Create the db model.
  // console.log('model -',name);
  // console.log('model -',slug);
  // industry_id = ObjectId(industry_id);

  let query = {};
  if (name) query['name'] = name;
  if (slug) query['slug'] = { $ne: slug };
  // console.log('query', query);
  return industries.count(query)
    .then(count => ({ success: true, name: count }))
    .catch(err => ({ success: false, error: err }));
}

module.exports.createNewIndustry = function (industryData, db_slug) {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let industries = createModelForName(db_name); // Create the db model.

  var data = new industries(industryData);
  return data.save()
    .then(item => ({ success: true, msg: "item saved to database", data: item }))
    .catch(err => ({ success: false, msg: "unable to save to database", data: err }));
}

module.exports.updateIndustry = (industryData, db_slug) => {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let industries = createModelForName(db_name); // Create the db model.

  // console.log('form data -',industryData);

  let query = { "slug": industryData.slug };
  let data = {
    name: industryData.name,
    description: industryData.description,
    status: industryData.status
  }
  return new Promise((resolve, reject) => {
    industries.findOneAndUpdate(query, data, { new: true }, function (err, industry) {
      // console.log('on error', err);
      if (err) return reject(err);
      // console.log('db data 1', industry);
      if (!industry) return reject('Unable to find.');

      return resolve(industry);
    })
  }).then(item => ({ success: true, msg: "Industry updated successfully.", data: item }))
    .catch(err => ({ success: false, msg: "Unable to update", data: err }));

}

module.exports.deleteIndustry = (slug, db_slug) => {
  if (!db_slug) return ({ success: false });
  let db_name = db_slug + '-' + collection;
  let industries = createModelForName(db_name);

  return new Promise((resolve, reject) => {
    industries.findOneAndRemove({ slug: slug }, (err, industry) => {
      // console.log('on error', err);
      if (err) return reject(err);
      // console.log('db data 1', industry);
      if (!industry) return reject('Unable to find.');

      return resolve(industry);
    })
  }).then(item => ({ success: true, msg: 'Industry deleted.' }))
    .catch(err => ({ success: false, msg: 'Unable to delete.', data: err }));
}
