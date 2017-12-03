const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = global.Promise;
// const bcrypt = require('bcryptjs');
// const config = require('../config/keys');

// User Schema
const StatusSchema = mongoose.Schema({

  description: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String, default: '' },
  posted_on: { type: Date, default: Date.now },
  posted_by: {
    user_id:      { type: String, required: true },
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
});

const companies = module.exports = mongoose.model('status', StatusSchema);

// module.exports.getUserById = function(id, callback){
//   User.findById(id, callback);
// }

module.exports.createNewCompany = function(companyData){
  var data = new companies(companyData);
  return data.save()
    .then(item => ({ success: true, msg: "item saved to database", data: data }))
    .catch(err => ({ success: false, msg: "unable to save to database" }));
}

module.exports.checkCompanyNameExists = (name, slug, company_id)=>{
  // console.log('model -',name);
  // console.log('model -',slug);
  company_id = ObjectId(company_id);
  return Promise.all([
    companies.count({"name": name, "_id": {$ne: company_id}}).then(count => ({ name: count })),
    companies.count({"slug": slug, "_id": {$ne: company_id}}).then(count => ({ slug: count }))
  ]).then(result => result.reduce((acc,curr) =>
    Object.assign(acc,curr),{})
  );
}

module.exports.savecompany = (companyData)=>{
    console.log('model -',companyData);
    // return Promise.all([
      return companies.findById(companyData._id)
      .then(company => {
        console.log('in then', company);
        company.name = companyData.name;
        company.slug = companyData.slug;
        company.description = (companyData.description==='')?'':companyData.description;
        company.image = (companyData.image==='')?company.image:companyData.image;
        company.status = companyData.status;

        return company.save()
        .then(item => ({ success: true, msg: "Item saved", data: company }))
        .catch(err => ({ success: false, msg: "Unable to save" }));

      }).catch(err => ({ success: false, msg: "Unable to find" }));
    // ]).then(result => result.reduce((acc,curr) =>
    //   Object.assign(acc,curr),{})
    // );
}

module.exports.getStatusList = (pageSize, skip, sortby, orderby, query)=>{
  
    // console.log("limit- "+pageSize);
    // console.log("skip- "+skip);
    // console.log("sort- "+sortby);
    // console.log("order- "+orderby);
    // console.log("query- "+JSON.stringify(query));

    return Promise.all([
      companies.count().then(count => ({ total: count })),
      companies.count(query).then(count => ({ searched_total: count })),
      companies.find(query)
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
