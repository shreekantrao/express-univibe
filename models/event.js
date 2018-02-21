const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
mongoose.Promise = global.Promise;

const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

// Events Schema
const EventSchema = mongoose.Schema({

  title: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  slug: { type: String, slug: "title", slug_padding_size: 4, unique: true, index: true },
  posted_on: { type: Date, default: Date.now },
  category: { type: Number, default: 0 },       // 0=normal, 1=Institute event, 2=Alumni meet
  tag_line: { type: String, default: '' },
  positions: { type: Number, default: 1 },
  fees: { type: Number, default: 0 },
  start_date: { type: Date, default: Date.now },
  start_time: { type: Date, default: '' },
  end_date: { type: Date, default: Date.now },
  end_time: { type: Date, default: '' },
  location: { type: String, default: '' },
  images: { type: Array, "default": [] },
  
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

// const event = module.exports = mongoose.model('event', EventSchema);

// To make db name dynamic
var establishedModels = {};
function createModelForName(name) {
  if (!(name in establishedModels)) {
    // var Any = new Schema({ any: Schema.Types.Mixed });
    establishedModels[name] = mongoose.model(name, EventSchema);
  }
  return establishedModels[name];
}
const collection = 'events';

module.exports.getEventList = (pageSize, skip, sortby, orderby, query, db_slug) => {
  if (!db_slug) return ({ success: false });
  let db_name = db_slug + '-' + collection;
  let events = createModelForName(db_name); // Create the db model.

  return Promise.all([
    events.count().then(count => ({ total: count })),
    events.count(query).then(count => ({ searched_total: count })),
    events.find(query)
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
  let events = createModelForName(db_name); // Create the db model.

  // return event.update({ "slug": slug }, { $set: { "publish": state } })
  return new Promise((resolve, reject) => {
    events.findOneAndUpdate({ "slug": slug }, { "publish": state }, { new: true }, function (err, event) {
      if (err) return reject(err);
      if (!event) return reject('Unable to find.');

      return resolve(event);
    })
  }).then(item => ({ success: true, msg: 'Updated successfully' }))
    .catch(err => ({ success: false, msg: 'Unable to process' }));
}

module.exports.deleteEvent = (slug, db_slug) => {
  if (!db_slug) return ({ success: false });
  let db_name = db_slug + '-' + collection;
  let events = createModelForName(db_name); // Create the db model.

  // return event.find({ "slug": slug }).remove()
  return new Promise((resolve, reject) => {
    events.findOneAndRemove({ "slug": slug }, function (err, event) {
      if (err) return reject(err);
      if (!event) return reject('Unable to find.');

      return resolve(event);
    })
  }).then(item => ({ success: true, msg: 'Deleted successfully' }))
    .catch(err => ({ success: false, msg: 'Unable to process' }));
}

module.exports.saveEvent = (eventData, db_slug) => {
  if (!db_slug) return ({ success: false });
  let db_name = db_slug + '-' + collection;
  let events = createModelForName(db_name); // Create the db model.

  var data = new events(eventData);
  return data.save()
    .then(item => ({ success: true, msg: "item saved to database", data: data }))
    .catch(err => ({ success: false, msg: "unable to save to database" }));
}

module.exports.editEvent = (eventData, db_slug) => {
  if (!db_slug) return ({ success: false });
  let db_name = db_slug + '-' + collection;
  let events = createModelForName(db_name); // Create the db model.
  
    console.log('model -',eventData);
    // return Promise.all([
      return event.findById(eventData._id)
      .then(event => {
        console.log('in then', event);
        event.name = eventData.name;
        event.slug = eventData.slug;
        event.description = (eventData.description==='')?'':eventData.description;
        event.image = (eventData.image==='')?event.image:eventData.image;
        event.event = eventData.event;

        return event.save()
        .then(item => ({ success: true, msg: "Item saved", data: event }))
        .catch(err => ({ success: false, msg: "Unable to save" }));

      }).catch(err => ({ success: false, msg: "Unable to find" }));
    // ]).then(result => result.reduce((acc,curr) =>
    //   Object.assign(acc,curr),{})
    // );
}
