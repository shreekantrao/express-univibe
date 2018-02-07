const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = global.Promise;
// const bcrypt = require('bcryptjs');
// const config = require('../config/keys');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

// User Schema
const CompaniesSchema = mongoose.Schema({

  name: { type: String, required: true, unique: true, index: true },
  slug: { type: String, slug: "name", slug_padding_size: 2, unique: true, index: true   },
  description: { type: String, default: '' },
  image: { type: String, default: '/assets/build/images/company.jpg' },
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

// const companies = module.exports = mongoose.model('Companies', CompaniesSchema);

// This will be called only when FIND is fired
/* CompaniesSchema.post('find', function (doc, next) {
  delete doc._id;

  console.log( doc ); // true
  next();
  // console.log(this instanceof mongoose.Query); // true
}); */

// To make db name dynamic
var establishedModels = {};
function createModelForName(name) {
  if (!(name in establishedModels)) {
    // var Any = new Schema({ any: Schema.Types.Mixed });
    establishedModels[name] = mongoose.model(name, CompaniesSchema);
  }
  return establishedModels[name];
}
const collection = 'companies';

// module.exports.getUserById = function(id, callback){
//   User.findById(id, callback);
// }

module.exports.getCompanyList = (pageSize, skip, sortby, orderby, query, db_slug) => {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let companies = createModelForName(db_name); // Create the db model.

  // console.log("limit- "+pageSize);
  // console.log("skip- "+skip);
  // console.log("sort- "+sortby);
  // console.log("order- "+orderby);
  // console.log("query- "+JSON.stringify(query));

  return Promise.all([
    companies.count().then(count => ({ total: count })),
    companies.count(query).then(count => ({ searched_total: count })),
    companies.find(query, {_id:0})
      .sort([[sortby, orderby]])
      .skip(skip)
      .limit(pageSize)
      .then(data => ({ rows: data }))
  ]).then(result => result.reduce((acc, curr) =>
    Object.assign(acc, curr), {})
    );
}

module.exports.checkCompanyNameExists = (name, slug, db_slug)=>{
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let companies = createModelForName(db_name); // Create the db model.
  // console.log('model -',name);
  // console.log('model -',slug);
  // company_id = ObjectId(company_id);

  let query = {};
  if(name) query['name'] = name;
  if(slug) query['slug'] = { $ne: slug };
  // console.log('query', query);
  return companies.count( query )
    .then(count => ({ success: true, name: count }))
    .catch(err => ({ success: false, error: err }));
  
  // return Promise.all([
  //   companies.count({"name": name, "_id": {$ne: company_id}}).then(count => ({ name: count })),
  //   companies.count({"slug": slug, "_id": {$ne: company_id}}).then(count => ({ slug: count }))
  // ]).then(result => result.reduce((acc,curr) =>
  //   Object.assign(acc,curr),{})
  // );
}

module.exports.createNewCompany = function (companyData, db_slug) {
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let companies = createModelForName(db_name); // Create the db model.

  var data = new companies(companyData);
  return data.save()
    .then(item => ({ success: true, msg: "item saved to database", data: data }))
    .catch(err => ({ success: false, msg: "unable to save to database", error: err }));
}

module.exports.savecompany = (companyData, db_slug)=>{
  if (!db_slug) return false;
  let db_name = db_slug + '-' + collection;
  let companies = createModelForName(db_name); // Create the db model.

  // console.log('form data -',companyData);
    
/*   return new Promise((resolve, reject) => {
    companies.findOne({ "slug": companyData.slug }, (err, company)=>{
      // console.log('on error', err);
      if(err) return reject(err);
      if(!company) return reject();
      
      // console.log('db data 1', company);
      company.name = companyData.name;
      company.description = (companyData.description==='')?'':companyData.description;
      company.image = (companyData.image==='')?company.image:companyData.image;
      company.status = companyData.status;
      // console.log('db data 2', company);
      return company.save();      
    })
  }).then(item => item?({ success: true, msg: "Company updated successfully.", data: item }):({ success: false, msg: "Unable to find."}))
    .catch(err => ({ success: false, msg: "Unable to save", error: err }));
  */

  let query = { "slug": companyData.slug };
  let data = {
    name: companyData.name,
    description: companyData.description,
    status: companyData.status
  }
  return new Promise((resolve, reject) => {
    companies.findOneAndUpdate(query, data, { new: true }, function (err, company) {
      // console.log('on error', err);
      if(err) return reject(err);
      // console.log('db data 1', company);
      if (!company) return reject('Unable to find.');

      return resolve(company);
    })  
  }).then(item => ({ success: true, msg: "Company updated successfully.", data: item }))
    .catch(err => ({ success: false, msg: "Unable to save", error: err }));

}

module.exports.deleteCompany = (slug, db_slug)=>{
  if(!db_slug) return ({success: false});
  let db_name = db_slug + '-' + collection;
  let companies = createModelForName(db_name);

  return new Promise((resolve, reject) => {
    companies.findOneAndRemove({ slug: slug }, (err, company)=>{
      // console.log('on error', err);
      if(err) return reject(err);
      // console.log('db data 1', company);
      if (!company) return reject('Unable to find.');
      
      return resolve(company);
    })
  }).then(item => ({ success: true, msg: 'Company deleted.' }))
    .catch(err => ({ success: false, msg: 'Unable to delete.', error: err }));
}
