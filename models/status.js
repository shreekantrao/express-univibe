const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = global.Promise;
// const bcrypt = require('bcryptjs');
// const config = require('../config/keys');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
// User Schema
const StatusSchema = mongoose.Schema({

  title: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, slug: "posted_by.name", slug_padding_size: 4, unique: true },
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
  publish: { type: Boolean, default: true }   // true , false
});

const status = module.exports = mongoose.model('status', StatusSchema);

// module.exports.getUserById = function(id, callback){
//   User.findById(id, callback);
// }

module.exports.createNewStatus = function(statusData){
  var data = new status(statusData);
  return data.save()
    .then(item => ({ success: true, msg: "item saved to database", data: data }))
    .catch(err => ({ success: false, msg: "unable to save to database" }));
}

module.exports.changeState = (slug, state)=>{
  return status.update({"slug": slug}, { $set: {"publish": state }})
      .then(item => ({ success: true, msg: 'Updated successfully' }))
      .catch(err => ({ success: false, msg: 'Unable to process'}));
}

module.exports.deleteStatus = (slug)=>{
  return status.find({"slug": slug}).remove()
      .then(item => ({ success: true, msg: 'Deleted successfully' }))
      .catch(err => ({ success: false, msg: 'Unable to process'}));
}

module.exports.savestatus = (statusData)=>{
    console.log('model -',statusData);
    // return Promise.all([
      return status.findById(statusData._id)
      .then(status => {
        console.log('in then', status);
        status.name = statusData.name;
        status.slug = statusData.slug;
        status.description = (statusData.description==='')?'':statusData.description;
        status.image = (statusData.image==='')?status.image:statusData.image;
        status.status = statusData.status;

        return status.save()
        .then(item => ({ success: true, msg: "Item saved", data: status }))
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
      status.count().then(count => ({ total: count })),
      status.count(query).then(count => ({ searched_total: count })),
      status.find(query)
        .sort([[sortby, orderby]])
        .skip(skip)
        .limit(pageSize)
        .then( data => ({ rows: data }))
    ]).then(result => result.reduce((acc,curr) =>
      Object.assign(acc,curr),{})
    );    
}
