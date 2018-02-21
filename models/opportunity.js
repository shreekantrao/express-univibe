const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = global.Promise;

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

// Opportunities Schema
const OpportunitySchema = mongoose.Schema({

  title: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  slug: { type: String, slug: "title", slug_padding_size: 4, unique: true, index: true },
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
  application_count: { type: Number, default: 0 },
  like_count: { type: Number, default: 0 },
  comment_count: { type: Number, default: 0 },
  tag: { type: Array, "default": [] },
  publish: { type: Boolean, default: true }   // true , false
});

// const opportunity = module.exports = mongoose.model('opportunity', OpportunitySchema);

// To make db name dynamic
var establishedModels = {};
function createModelForName(name) {
  if (!(name in establishedModels)) {
    // var Any = new Schema({ any: Schema.Types.Mixed });
    establishedModels[name] = mongoose.model(name, OpportunitySchema);
  }
  return establishedModels[name];
}
const collection = 'opportunities';

module.exports.getOpportunityList = (pageSize, skip, sortby, orderby, query, db_slug) => {
  if (!db_slug) return ({ success: false });
  let db_name = db_slug + '-' + collection;
  let opportunities = createModelForName(db_name); // Create the db model.

  return Promise.all([
    opportunities.count().then(count => ({ total: count })),
    opportunities.count(query).then(count => ({ searched_total: count })),
    opportunities.find(query)
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
  let opportunities = createModelForName(db_name); // Create the db model.

  // return opportunities.update({ "slug": slug }, { $set: { "publish": state } })
  return new Promise((resolve, reject) => {
    opportunities.findOneAndUpdate({ "slug": slug }, { "publish": state }, { new: true }, function (err, opportunity) {
      if (err) return reject(err);
      if (!opportunity) return reject('Unable to find.');

      return resolve(opportunity);
    })
  }).then(item => ({ success: true, msg: 'Updated successfully' }))
    .catch(err => ({ success: false, msg: 'Unable to process' }));
}

module.exports.deleteOpportunity = (slug, db_slug) => {
  if (!db_slug) return ({ success: false });
  let db_name = db_slug + '-' + collection;
  let opportunities = createModelForName(db_name); // Create the db model.

  // return opportunities.find({ "slug": slug }).remove()
  return new Promise((resolve, reject) => {
    opportunities.findOneAndRemove({ "slug": slug }, function (err, opportunity) {
      if (err) return reject(err);
      if (!opportunity) return reject('Unable to find.');

      return resolve(opportunity);
    })
  }).then(item => ({ success: true, msg: 'Deleted successfully' }))
    .catch(err => ({ success: false, msg: 'Unable to process' }));
}

module.exports.saveOpportunity = (opportunityData, db_slug) => {
  if (!db_slug) return ({ success: false });
  let db_name = db_slug + '-' + collection;
  let opportunities = createModelForName(db_name); // Create the db model.

  let data = new opportunities(opportunityData);
  return data.save()
    .then(item => ({ success: true, msg: "item saved to database", data: data }))
    .catch(err => ({ success: false, msg: "unable to save to database" }));
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

