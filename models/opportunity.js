const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = global.Promise;
// const bcrypt = require('bcryptjs');
// const config = require('../config/keys');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
// User Schema
const OpportunitySchema = mongoose.Schema({

  title: { type: String, required: true },
  description: { type: String, required: true },
  slug: { type: String, slug: "title", slug_padding_size: 4, unique: true },
  posted_on: { type: Date, default: Date.now },
  category: { type: Number, default: 1 },       // 1=Jobs, 2=Leads, 3=Interns
  ref_link: { type: String, default: '' },
  last_date_to_apply: { type: Date, default: +new Date() + 30 * 24 * 60 * 60 * 1000 },
  attachement: { type: Array, "default": [] },
  company: { type: String, required: true },
  industry: { type: String, default: '' },
  skills: { type: Array, "default": [] },
  contact_email: { type: String, required: true },
  contact_phone: { type: String, default: '' },
  location: { type: String, default: '' },
  salary: { 
    min: { type: Number },
    max: { type: Number }
  },
  experience: { 
    min: { type: Number },
    max: { type: Number }
  },
  positions: {type: Number, default: 1},
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
  tag: { type: Array, "default": [] },
  publish: { type: Boolean, default: true }   // true , false
});

OpportunitySchema.index({ title: 'text' });
const opportunity = module.exports = mongoose.model('opportunity', OpportunitySchema);

// module.exports.getUserById = function(id, callback){
//   User.findById(id, callback);
// }

module.exports.saveOpportunity = function(opportunityData){
  var data = new opportunity(opportunityData);
  return data.save()
    .then(item => ({ success: true, msg: "item saved to database", data: data }))
    .catch(err => ({ success: false, msg: "unable to save to database" }));
}

module.exports.changeState = (slug, state)=>{
  return opportunity.update({"slug": slug}, { $set: {"publish": state }})
      .then(item => ({ success: true, msg: 'Updated successfully' }))
      .catch(err => ({ success: false, msg: 'Unable to process'}));
}

module.exports.deleteOpportunity = (slug)=>{
  return opportunity.find({"slug": slug}).remove()
      .then(item => ({ success: true, msg: 'Deleted successfully' }))
      .catch(err => ({ success: false, msg: 'Unable to process'}));
}

module.exports.editOpportunity = (opportunityData)=>{
    console.log('model -',opportunityData);
    // return Promise.all([
      return opportunity.findById(opportunityData._id)
      .then(opportunity => {
        console.log('in then', opportunity);
        opportunity.name = opportunityData.name;
        opportunity.slug = opportunityData.slug;
        opportunity.description = (opportunityData.description==='')?'':opportunityData.description;
        opportunity.image = (opportunityData.image==='')?opportunity.image:opportunityData.image;
        opportunity.opportunity = opportunityData.opportunity;

        return opportunity.save()
        .then(item => ({ success: true, msg: "Item saved", data: opportunity }))
        .catch(err => ({ success: false, msg: "Unable to save" }));

      }).catch(err => ({ success: false, msg: "Unable to find" }));
    // ]).then(result => result.reduce((acc,curr) =>
    //   Object.assign(acc,curr),{})
    // );
}

module.exports.getOpportunityList = (pageSize, skip, sortby, orderby, query)=>{
  
    // console.log("limit- "+pageSize);
    // console.log("skip- "+skip);
    // console.log("sort- "+sortby);
    // console.log("order- "+orderby);
    // console.log("query- "+JSON.stringify(query));

    return Promise.all([
      opportunity.count().then(count => ({ total: count })),
      opportunity.count(query).then(count => ({ searched_total: count })),
      opportunity.find(query)
        .sort([[sortby, orderby]])
        .skip(skip)
        .limit(pageSize)
        .then( data => ({ rows: data }))
    ]).then(result => result.reduce((acc,curr) =>
      Object.assign(acc,curr),{})
    );    
}
